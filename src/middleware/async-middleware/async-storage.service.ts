import { Injectable } from "@nestjs/common";
import { AsyncStorageMiddleware } from "./async-storage.middleware";

@Injectable()
export class AsyncStorageService {
    get<T = unknown>(key: string): T | undefined {
        return AsyncStorageMiddleware.get<T>(key);
    }

    set(key: string, value: unknown): void {
        AsyncStorageMiddleware.set(key, value);
    }
}
