import { InternalServerError } from "../../../core-common/error/custom-error/internal-server.error";

export class HealthCheckError extends InternalServerError {
  constructor() {
    super("HEALTH_CHECK_ERROR", "Health check failed");
  }
}
