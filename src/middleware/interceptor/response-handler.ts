import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { ServerResponse } from "http";
import { Observable } from "rxjs";
import { GenericErrorResponse } from "../../core-common/response-model/generic-error-response.model";
import { GenericSuccessResponse } from "../../core-common/response-model/generic-success-response.model";
import { Result } from "../../core-common/result-model/result";
import { HttpResponseFormatter } from "../utils/http-response.formatter";
import { LoggerService } from "@core-common/logger";
/**
 * Intercepts the response and returns a standard ApiReponse object
 */
@Injectable()
export class ResponseHandler implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService
  ) {}

  intercept(exContext: ExecutionContext, next: CallHandler): Observable<any> {
    return new Observable((subscriber) => {
      next.handle().subscribe({
        next: (data) => {
          const mapped = this.handleResponse(exContext, data);
          subscriber.next(mapped);
        },
        error: (err) => {
          this.logger.error('Error in ResponseHandler Interceptor', err);
          subscriber.error(err);
        },
        complete: () => {
          subscriber.complete();
        },
      });
    });
  }

  /**
   * Checks the response content and appropriately sets the status code and wraps the return value in a ApiErroReponse or a
   * ApiSuccessReponse
   * @param excecutionContext  - Instance of the executionContext object
   * @param result  Data returned by the controller method
   * @returns - Instance of ApiSuccessReponse or ApiErrorReponse
   */
  private handleResponse(
    excecutionContext: ExecutionContext,
    result: Result<any>,
  ): GenericSuccessResponse<any> | GenericErrorResponse {
    let serverResponse = excecutionContext
      .switchToHttp()
      .getResponse<ServerResponse>();

    const apiReponse: any = new HttpResponseFormatter().getStandardApiResponse(
      serverResponse.statusCode,
      result,
    );
    serverResponse.statusCode = apiReponse.statusCode
      ? apiReponse.statusCode
      : apiReponse?.error?.statusCode;
    serverResponse[`statusCode`] = serverResponse.statusCode;
    if (apiReponse?.statusCode) {
      delete apiReponse?.error?.statusCode;
    }
    return apiReponse;
  }
}
