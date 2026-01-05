import { HttpStatus } from "@nestjs/common";
import { AlreadyExistsError } from "../../core-common/error/custom-error/already-exists.error";
import { GenericError } from "../../core-common/error/generic.error";
import { GenericErrorResponse } from "../../core-common/response-model/generic-error-response.model";
import { GenericSuccessResponse } from "../../core-common/response-model/generic-success-response.model";
import { Result } from "../../core-common/result-model/result";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError, ServiceUnavailableError, UnauthorizedError, UnprocessableEntityError, ValidationError } from "../../core-common/error";
import { InternalServerError } from "../../core-common/error/custom-error/internal-server.error";

/**
 * Helps in returning a appropriate and standard Response format  based on success or error scenario
 */
export class HttpResponseFormatter {
  constructor() {}
  /**
   * Returns a standard formatted  ApiSuccesReponse or ApiErrorResponse depending on the response data
   * @param statusCode - Http Status code
   * @param responseData - Response value from the api controller method
   */
  public getStandardApiResponse(
    statusCode: number,
    responseData: any,
  ): GenericSuccessResponse<any> | GenericErrorResponse {
    if (this.isSuccessfulResult(responseData)) {
      return this.getSuccessResponse(responseData, statusCode);
    }

    if (this.isFailedResult(responseData)) {
      return this.getFailureResponse(responseData);
    }

    return responseData;
  }

  /**
   *
   * @param responseData Initializes and returns  the success api response
   * @param statusCode - Http Status code
   * @returns - instance of ApiSuccessResponse object
   */
  private getSuccessResponse(
    responseData: any,
    statusCode: number,
  ): GenericSuccessResponse<any> {
    const apiSuccessResponse = new GenericSuccessResponse();
    apiSuccessResponse.initialize(responseData, statusCode);
    return apiSuccessResponse;
  }

  /**
   * Checks if the the data is of type Result and is successful
   * @param responseData - response data
   * @returns - boolean
   */
  private isSuccessfulResult(responseData: any): boolean {
    return responseData instanceof Result && responseData.success;
  }

  /**
   * Checks if the the data is of type Result and is successful
   * @param responseData - response data
   * @returns - boolean
   */
  private isFailedResult(responseData: any): boolean {
    return responseData instanceof Result && !responseData.success;
  }

  /**
   * Gets the failure response based on the result contents
   * @param result - Result object returned from the controller method
   */
  private getFailureResponse(result: Result<any>) {
    const statusCode = this.getStatusCode(result.error);
    const apiErrorResponse = new GenericErrorResponse();
    apiErrorResponse.initialize(result, statusCode);
    return apiErrorResponse;
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

    if (error instanceof AlreadyExistsError) {
      return HttpStatus.CONFLICT;
    }

    if (error instanceof ConflictError) {
      return HttpStatus.CONFLICT;
    }

    if (error instanceof ValidationError) {
      return HttpStatus.UNPROCESSABLE_ENTITY;
    }

    if (error instanceof UnprocessableEntityError) {
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
