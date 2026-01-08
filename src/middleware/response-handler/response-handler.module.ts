import { Module } from "@nestjs/common";
import { HttpResponseFormatter } from "../utils/http-response.formatter";
import { ResponseHandlerInterceptor } from "./response-handler.interceptor";

@Module({
    providers: [HttpResponseFormatter, ResponseHandlerInterceptor],
    exports: [HttpResponseFormatter, ResponseHandlerInterceptor],
})
export class ResponseHandlerModule { }
