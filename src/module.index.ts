import { CqrsModule } from "@nestjs/cqrs";
import { RequestContextModule } from "nestjs-request-context";
import { CommonInfraModule } from "./common-infra/common-infra.module";
import { LoggerModule } from "./core-common/logger/logger.module";
import { HealthCheckModule } from "./routes/health/health-check.module";

export const coreModules = [
  CommonInfraModule,
  CqrsModule,
  RequestContextModule,
  LoggerModule,
];

export const RouterModules = [HealthCheckModule];

export const modules = [...coreModules, ...RouterModules];
