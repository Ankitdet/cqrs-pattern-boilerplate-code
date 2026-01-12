// src/logger/logger.module.ts
import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoggerModuleOptions } from "./logger.interface";
import { LoggerService } from "./logger.service";
import { LOGGER_OPTIONS } from "./logger.constants";

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions = {}): DynamicModule {
    return {
      module: LoggerModule,
      global: true,
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

  static forRootAsync(options: {
    useConfigService?: boolean;
    useFactory?: (
      configService?: ConfigService
    ) => Promise<LoggerModuleOptions> | LoggerModuleOptions;
    inject?: any[];
    imports?: any[];
  }): DynamicModule {
    const {
      useConfigService = true,
      useFactory,
      inject = [],
      imports = [],
    } = options;

    return {
      module: LoggerModule,
      global: true,
      imports: useConfigService ? [ConfigModule, ...imports] : imports,
      providers: [
        {
          provide: LOGGER_OPTIONS,
          inject: useConfigService ? [ConfigService, ...inject] : inject,
          useFactory: async (configService?: ConfigService) => {
            if (useFactory) {
              return useFactory(configService);
            }

            return {
              level: configService?.get("LOG_LEVEL"),
              prettyPrint: configService?.get("LOG_PRETTY"),
              serviceName: configService?.get("SERVICE_NAME"),
            };
          },
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}
