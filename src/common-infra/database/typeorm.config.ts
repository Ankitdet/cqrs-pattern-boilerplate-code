import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: "postgres",
  host: configService.get<string>("DB_HOST"),
  port: configService.get<number>("DB_PORT"),
  username: configService.get<string>("DB_USERNAME"),
  password: configService.get<string>("DB_PASSWORD"),
  database: configService.get<string>("DB_NAME"),
  autoLoadEntities: true,
  synchronize: configService.get<string>("NODE_ENV") !== "production",
  migrations: ["dist/migrations/*.js"],
  migrationsRun: true,
  logging: configService.get<string>("NODE_ENV") !== "production",
});
