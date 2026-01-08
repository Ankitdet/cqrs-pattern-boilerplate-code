import { HttpStatus, Injectable } from "@nestjs/common";
import { GenericSuccessResponse } from "../../core-common/response-model/generic-success-response.model";
import { GenericErrorResponse } from "../../core-common/response-model/generic-error-response.model";
import { Result } from "../../core-common/result-model/result";
import { GenericError } from "../../core-common/error/generic.error";
import { BadRequestError } from "../../core-common/error/custom-error/bad-request.error";
import { UnauthorizedError } from "../../core-common/error/custom-error/unauthorized.error";
import { ForbiddenError } from "../../core-common/error/custom-error/forbidden.error";
import { NotFoundError } from "../../core-common/error/custom-error/not-found.error";
import { AlreadyExistsError } from "../../core-common/error/custom-error/already-exists.error";
import { ConflictError } from "../../core-common/error/custom-error/conflict.error";
import { ValidationError } from "../../core-common/error/custom-error/validation.error";
import { UnprocessableEntityError } from "../../core-common/error/custom-error/unprocess-entity.error";
import { ServiceUnavailableError } from "../../core-common/error/custom-error/service-unavailable.error";
import { InternalServerError } from "../../core-common/error/custom-error/internal-server.error";

@Injectable()
export class HttpResponseFormatter {
  /**
   * Returns a standard formatted ApiSuccessResponse or ApiErrorResponse
   */
  public getStandardApiResponse(
    statusCode: number,
    responseData: any,
  ): GenericSuccessResponse<any> | GenericErrorResponse | any {
    if (this.isSuccessfulResult(responseData)) {
      return this.getSuccessResponse(responseData, statusCode);
    }

    if (this.isFailedResult(responseData)) {
      return this.getFailureResponse(responseData);
    }

    return responseData;
  }

  private getSuccessResponse(
    responseData: Result<any>,
    statusCode: number,
  ): GenericSuccessResponse<any> {
    const response = new GenericSuccessResponse();
    response.initialize(responseData, statusCode);
    return response;
  }

  private isSuccessfulResult(responseData: any): boolean {
    return responseData instanceof Result && responseData.success === true;
  }

  private isFailedResult(responseData: any): boolean {
    return responseData instanceof Result && responseData.success === false;
  }

  private getFailureResponse(result: Result<any>): GenericErrorResponse {
    const statusCode = this.getStatusCode(result.error);
    const response = new GenericErrorResponse();
    response.initialize(result, statusCode);
    return response;
  }

  private getStatusCode(error: GenericError): number {
    if (error instanceof BadRequestError) {
      return HttpStatus.BAD_REQUEST;
    }

    if (error instanceof UnauthorizedError) {
      return HttpStatus.UNAUTHORIZED;
    }

    if (error instanceof ForbiddenError) {
      return HttpStatus.FORBIDDEN;
    }

    if (error instanceof NotFoundError) {
      return HttpStatus.NOT_FOUND;
    }

    if (
      error instanceof AlreadyExistsError ||
      error instanceof ConflictError
    ) {
      return HttpStatus.CONFLICT;
    }

    if (
      error instanceof ValidationError ||
      error instanceof UnprocessableEntityError
    ) {
      return HttpStatus.UNPROCESSABLE_ENTITY;
    }

    if (error instanceof ServiceUnavailableError) {
      return HttpStatus.SERVICE_UNAVAILABLE;
    }

    if (error instanceof InternalServerError) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    if (error instanceof GenericError) {
      return error.statusCode;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
