import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import {
    GenericErrorResponse,
    GenericSuccessResponse,
    Result
} from "cqrs-boilerplate-code";
import { ServerResponse } from "http";
import { Observable, map } from "rxjs";
import { HttpResponseFormatter } from "../utils/http-response.formatter";

@Injectable()
export class ResponseHandlerInterceptor implements NestInterceptor {
    constructor(
        private readonly formatter: HttpResponseFormatter,
    ) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<GenericSuccessResponse<any> | GenericErrorResponse> {
        const res = context.switchToHttp().getResponse<ServerResponse>();

        return next.handle().pipe(
            map((data: Result<any>) => {
                const apiResponse =
                    this.formatter.getStandardApiResponse(res.statusCode, data);

                if (apiResponse?.statusCode) {
                    res.statusCode = apiResponse.statusCode;
                    delete apiResponse?.error?.statusCode;
                }

                return apiResponse;
            }),
        );
    }
}
