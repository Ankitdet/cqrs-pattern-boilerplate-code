import { Provider } from "@nestjs/common";
import { LoggerService } from ".";

export const LoggerProvider: Provider = {
  provide: LoggerService,
  useClass: LoggerService,
};
