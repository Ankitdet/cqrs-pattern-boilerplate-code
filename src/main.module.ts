import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from "@nestjs/common";
import { modules } from "./module.index";

@Global()
@Module({
  imports: [...modules],
  providers: [],
  exports: [],
})
export class MainModule implements OnModuleInit, NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes("*");
  }
  onModuleInit() {}
}
