// src/core-common.module.ts
import { DynamicModule, Global, Module } from "@nestjs/common";
import { LoggerModule } from "./logger/logger.module";

@Global()
@Module({})
export class CoreCommonModule {
  static forRoot(): DynamicModule {
    return {
      module: CoreCommonModule,
      imports: [
        LoggerModule.forRoot(),
      ],
      exports: [
        LoggerModule,
      ],
    };
  }
}
