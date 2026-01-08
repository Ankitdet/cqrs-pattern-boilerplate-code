import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { Result } from "../../core-common/result-model/result";
import { GenericError } from "../../core-common/error/generic.error";
import { ValidationError } from "../../core-common/error/custom-error/validation.error";


/**
 * Global exception filter for NestJS applications.
 * Provides standardized error responses across the application.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    /* 1️⃣ Domain Result errors */
    if (exception instanceof Result) {
      const statusCode =
        exception.error?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;

      const payload: Record<string, any> = {
        statusCode,
        success: false,
        error: {
          code: exception.error?.code ?? "ERROR",
          message: exception.error?.message ?? "An error occurred",
        },
        timestamp: exception.timestamp ?? new Date().toISOString(),
      };

      if (exception.data !== undefined && exception.data !== null) {
        payload.data = exception.data;
      }

      response.status(statusCode).json(payload);
      return;
    }

    /* 2️⃣ Custom domain errors */
    if (exception instanceof GenericError) {
      response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        success: false,
        error: {
          code: exception.code,
          message: exception.message,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    /* 3️⃣ NestJS HttpExceptions */
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      const isValidationPipeError =
        typeof exception.stack === "string" &&
        exception.stack.includes("ValidationPipe");

      if (isValidationPipeError) {
        const validationError = new ValidationError(
          "validation_error",
          "Validation failed",
        );

        response.status(validationError.statusCode).json({
          success: false,
          error: {
            code: validationError.code,
            message: validationError.message,
            validationError,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      response.status(status).json({
        statusCode: status,
        success: false,
        error: {
          code: "HTTP_EXCEPTION",
          message:
            typeof res === "string"
              ? res
              : (res as any)?.message ?? exception.message,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    /* 4️⃣ Native JS Errors */
    if (exception instanceof Error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        error: {
          code: exception.name,
          message: exception.message,
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    /* 5️⃣ Unknown throwables */
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: "Internal server error",
      },
      timestamp: new Date().toISOString(),
    });
  }
}
