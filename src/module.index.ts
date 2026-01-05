import { CqrsModule } from "@nestjs/cqrs";
import { RequestContextModule } from "nestjs-request-context";
import { HealthCheckModule } from "./routes/health/health-check.module";
import { MulterModule } from "@nestjs/platform-express";
import { LoggerModule } from "./core-common/logger/logger.module";

export const coreModules = [
  MulterModule.register({
    dest: "./uploads",
  }),
  CqrsModule,
  RequestContextModule,
  LoggerModule
];
export const RouterModules = [HealthCheckModule];

export const modules = [...coreModules, ...RouterModules];