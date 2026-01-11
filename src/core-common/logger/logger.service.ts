import winston, { Logger } from "winston";
import stripAnsi from "strip-ansi";
/* ---------------------------------- Types --------------------------------- */

enum SeverityText {
  INFO = "Information",
  DEBUG = "Debug",
  WARNING = "Warning",
  ERROR = "Error",
}

type LogMetadata = {
  ClassName?: string;
  MethodName?: string;
};

export type OrgContext = {
  orgId?: string;
  orgFid?: string;
  userId?: string;
};

/* --------------------------------- Service -------------------------------- */

export class LoggerService {
  private readonly logger: Logger;
  private readonly deploymentEnv: string;
  private readonly hostImageVersion: string;
  private readonly otelAgentHost: string;

  constructor(logLevel: string = "debug") {
    this.deploymentEnv = "rls-dev";
    this.hostImageVersion = process.env.SERVICE_VERSION ?? "202501.1";
    this.otelAgentHost = process.env.OTEL_AGENT_HOST ?? "10.0.0.1";
    this.logger = this.createLogger(logLevel);
    this.overrideConsole();
  }

  /* ------------------------------- Public API ------------------------------- */

  log(message: string, metadata?: LogMetadata) {
    this.write("info", SeverityText.INFO, message, metadata);
  }

  debug(message: string, metadata?: LogMetadata) {
    this.write("debug", SeverityText.DEBUG, message, metadata);
  }

  warn(message: string, metadata?: LogMetadata) {
    this.write("warn", SeverityText.WARNING, message, metadata);
  }

  error(message: string, metadata?: LogMetadata, error?: Error) {
    this.write("error", SeverityText.ERROR, message, metadata, error);
  }

  /* ------------------------------ Logger Core ------------------------------ */

  private write(
    level: keyof Logger,
    severity: SeverityText,
    message: string,
    metadata: LogMetadata = {},
    error?: Error,
  ) {
    const body = {
      SeverityText: severity,
      ...metadata,
      ...(error && {
        ErrorMessage: error.message,
        StackTrace: error.stack,
      }),
    };

    this.logger[level](this.redactSecrets(message), body);
  }

  private createLogger(level: string): Logger {
    return winston.createLogger({
      level,
      levels: winston.config.npm.levels,
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json(),
        winston.format.printf(({ level, message, timestamp, ...meta }) =>
          JSON.stringify({
            message: stripAnsi(this.safeStringify(message)),
            attributes: this.buildAttributes(level),
            timestamp: timestamp,
            ...this.cleanMeta(meta),
          })
        )
      ),
      transports: [new winston.transports.Console()],
    });
  }

  /* ------------------------------- Context -------------------------------- */

  private buildAttributes(level: string) {
    return {
      "service.image.version": this.hostImageVersion,
      "deployment.environment": this.deploymentEnv,
      "otel.agent.host": this.otelAgentHost,
      "service.log.level": level,
    };
  }

  /* ------------------------------- Helpers -------------------------------- */

  private cleanMeta(meta: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(meta).filter(
        ([_, value]) => value !== undefined && value !== "None",
      ),
    );
  }

  private safeStringify(input: unknown): string {
    try {
      return typeof input === "string"
        ? input
        : JSON.stringify(input, this.circularReplacer());
    } catch {
      return "[Unserializable Object]";
    }
  }

  private circularReplacer() {
    const seen = new WeakSet();
    return (_: string, value: any) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "[Circular]";
        seen.add(value);
      }
      return value;
    };
  }

  /* ----------------------------- Redaction -------------------------------- */

  private redactSecrets(message: string): string {
    const patterns = [
      {
        name: "JWT",
        regex: /eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+/g,
        visible: 10,
      },
      {
        name: "BEARER",
        regex: /Bearer\s+eyJ[A-Za-z0-9\-._~+/]+=*/gi,
        visible: 15,
      },
      { name: "API_KEY", regex: /\b[A-Za-z0-9]{32,}\b/g, visible: 8 },
      { name: "AWS_SECRET", regex: /AKIA[0-9A-Z]{16}/g, visible: 8 },
    ];

    return patterns.reduce((msg, { regex, visible, name }) => {
      return msg.replace(
        regex,
        (m) => `${m.slice(0, visible)}...[REDACTED_${name}]`,
      );
    }, message);
  }

  /* --------------------------- Console Override ---------------------------- */

  private overrideConsole() {
    const blocked = ["NodeSDK", "AuthToken"];
    console.log = (...args: unknown[]) => {
      const msg = args.map(String).join(" ");
      if (blocked.some((k) => msg.includes(k))) return;
      this.log(msg);
    };
  }
}
