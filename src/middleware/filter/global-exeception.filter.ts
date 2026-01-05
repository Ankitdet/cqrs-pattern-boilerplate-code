import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import { GenericError } from "../../core-common/error";
import { CustomValidationError } from "../../core-common/error/custom-error/custom-validation-error";
import { Result } from "../../core-common/result-model/result";

/**
 * Handles and processes  exceptions, providing standardized error responses.
 * This global exception handler can be used to catch and respond to exceptions thrown
 * during HTTP requests and format responses accordingly.
 */

@Catch()
export class GlobalExceptionHandler implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    /* 1️⃣ Domain Result (highest priority) */
    if (exception instanceof Result) {
      const statusCode =
        exception.error?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;

      const payload: any = {
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

      return response.status(statusCode).json(payload);
    }

    /* 2️⃣ Custom domain errors */
    if (exception instanceof GenericError) {
      return response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        success: false,
        error: {
          code: exception.code,
          message: exception.message,
        },
        timestamp: new Date().toISOString(),
      });
    }

    /* 3️⃣ NestJS HTTP exceptions */
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      const isValidationPipeError = exception.stack?.includes("ValidationPipe");

      if (isValidationPipeError) {
        const validationErrors = new CustomValidationError(res);
        return response.status(validationErrors.statusCode).json({
          success: false,
          error: {
            code: validationErrors.code,
            message: validationErrors.message,
            validationError: validationErrors.validationErrors,
          },
          timestamp: new Date().toISOString(),
        });
      }

      return response.status(status).json({
        statusCode: status,
        success: false,
        error: {
          code: "HTTP_EXCEPTION",
          message:
            typeof res === "string"
              ? res
              : ((res as any).message ?? exception.message),
        },
        timestamp: new Date().toISOString(),
      });
    }

    /* 4️⃣ Native JS errors (TypeError, Error, etc.) */
    if (exception instanceof Error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        error: {
          code: exception.name,
          message: exception.message,
        },
        timestamp: new Date().toISOString(),
      });
    }

    /* 5️⃣ Truly unknown (non-Error throwables) */
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
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
