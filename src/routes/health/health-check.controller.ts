import { Body, Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { Result } from "@core-common/result-model/result";
import { HealthRequest } from "./health.request";
import { GenericError } from "@core-common/error";

@Controller("health")
export class HealthController {
  @Get()
  public checkHealth(): Result<string> {
    return Result.success("OK");
  }

  @Get("/test")
  public errorHandling(): Result<string> {
    return Result.failed(
      new GenericError(
        "HEALTH_CHECK_ERROR",
        "Health check failed",
        HttpStatus.BAD_REQUEST,
      ),
      "ERROR",
    );
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
