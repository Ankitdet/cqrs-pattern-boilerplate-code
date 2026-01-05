import { CqrsModule } from "@nestjs/cqrs";
import { RequestContextModule } from "nestjs-request-context";
import { HealthCheckModule } from "./routes/health/health-check.module";
import { MulterModule } from "@nestjs/platform-express";

export const coreModules = [
  MulterModule.register({
    dest: "./uploads",
  }),
  CqrsModule,
  RequestContextModule,
];
export const RouterModules = [HealthCheckModule];

export const modules = [...coreModules, ...RouterModules];