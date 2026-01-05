import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { MulterModule } from "@nestjs/platform-express";
import { RequestContextModule } from "nestjs-request-context";
import { LoggerModule } from "./core-common/logger/logger.module";
import { HealthCheckModule } from "./routes/health/health-check.module";
import { CommonInfraModule } from "./common-infra/common-infra.module";

export const coreModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ".env",
  }),
  CommonInfraModule,
  MulterModule.register({
    dest: "./uploads",
  }),
  CqrsModule,
  RequestContextModule,
  LoggerModule,
];

export const RouterModules = [HealthCheckModule];

export const modules = [...coreModules, ...RouterModules];
