import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DBModuleOptions } from "./abstraction/db-module.options";
import { typeOrmConfig } from "./typeorm.config";

@Module({})
export class DBModule {
  static forRoot(options: DBModuleOptions = {}): DynamicModule {
    const {
      useConfigService = true,
      typeOrmOptions = {},
    } = options;

    return {
      module: DBModule,
      imports: [
        TypeOrmModule.forRootAsync({
          inject: useConfigService ? [ConfigService] : [],
          imports: useConfigService ? [ConfigModule] : [],
          useFactory: async (configService?: ConfigService) => ({
            ...(useConfigService
              ? typeOrmConfig(configService!)
              : {}),
            ...typeOrmOptions,
          }) as TypeOrmModuleOptions,
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
