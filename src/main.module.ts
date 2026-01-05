import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from "@nestjs/common";
import { modules } from "./module.index";
import { AuthMiddleware } from "./middleware/platform-auth.middleware";
import { AsyncStorageMiddleware } from "./middleware/async-storage.middleware";

@Global()
@Module({
  imports: [...modules],
  providers: [],
  exports: [],
})
export class MainModule implements OnModuleInit, NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes("*")
      .apply(AsyncStorageMiddleware)
      .forRoutes("*");
  }
  onModuleInit() {}
}
