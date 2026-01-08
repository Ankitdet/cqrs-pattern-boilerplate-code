// src/logger/logger.module.ts
import { DynamicModule, Module } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { LoggerModuleOptions } from "./logger.interface";

export const LOGGER_OPTIONS = Symbol("LOGGER_OPTIONS");

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions = {}): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        LoggerService,
        {
          provide: LOGGER_OPTIONS,
          useValue: options,
        },
      ],
      exports: [LoggerService],
    };
  }
}
