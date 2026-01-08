import { Injectable, NestMiddleware } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class AsyncStorageMiddleware implements NestMiddleware {
    private static readonly storage =
        new AsyncLocalStorage<Map<string, unknown>>();

    static get<T = unknown>(key: string): T | undefined {
        return this.storage.getStore()?.get(key) as T | undefined;
    }

    static set(key: string, value: unknown): void {
        this.storage.getStore()?.set(key, value);
    }

    use(req: Request, _res: Response, next: NextFunction): void {
        const store = new Map<string, unknown>();
        store.set("request", req);

        AsyncStorageMiddleware.storage.run(store, next);
    }
}
