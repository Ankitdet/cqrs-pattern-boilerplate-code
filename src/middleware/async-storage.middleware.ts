// async-storage.middleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AsyncStorageMiddleware implements NestMiddleware {
  private static storage = new AsyncLocalStorage<Map<string, any>>();

  static get(key: string): any {
    const store = AsyncStorageMiddleware.storage.getStore();
    return store?.get(key);
  }

  static set(key: string, value: any): void {
    const store = AsyncStorageMiddleware.storage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  use(req: Request, _res: Response, next: NextFunction) {
    const store = new Map<string, any>();
    store.set("request", req);
    AsyncStorageMiddleware.storage.run(store, () => {
      next();
    });
  }
}
