// src/logger/logger.options.ts
export interface LoggerModuleOptions {
  level?: string;
  deploymentEnv?: string;
  serviceVersion?: string;
  otelAgentHost?: string;
  overrideConsole?: boolean;
}