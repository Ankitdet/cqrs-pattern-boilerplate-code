import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { HttpResponseFormatter } from "./http-response.formatter";

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
    constructor(
        private readonly formatter: HttpResponseFormatter,
    ) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const res = context.switchToHttp().getResponse();
        return next.handle().pipe(
            map((data) =>
                this.formatter.getStandardApiResponse(
                    res.statusCode,
                    data,
                ),
            ),
        );
    }
}
