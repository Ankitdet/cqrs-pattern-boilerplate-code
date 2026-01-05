import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { AsyncStorageMiddleware } from "./middleware/async-storage.middleware";
import { AuthMiddleware } from "./middleware/platform-auth.middleware";
import { coreModules, modules } from "./module.index";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MulterModule.register({
      dest: "./uploads",
    }),
    ...modules,
  ],
  providers: [],
  exports: [...coreModules],
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
