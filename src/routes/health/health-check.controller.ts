import { GenericError } from "@core-common/error";
import { Result } from "@core-common/result-model/result";
import { Body, Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { HealthCheckError } from "./error/health-check.error";
import { HealthRequest } from "./health.request";

@Controller("health")
export class HealthController {
  @Get()
  public checkHealth(): Result<string> {
    return Result.success("OK");
  }

  @Get("/test")
  public errorHandling(): Result<string> {
    return Result.failed(new HealthCheckError());
  }

  @Get("/throw-exception")
  public throwException() {
    Result.throwError(
      new GenericError(
        "HEALTH_CHECK_ERROR",
        "Health check failed",
        HttpStatus.BAD_REQUEST,
      ),
      "ERROR",
    );
  }

  @Post("/test-body")
  public testBody(@Body() body: HealthRequest): Result<string> {
    console.log(body);
    return Result.success("Body test successful");
  }
}
