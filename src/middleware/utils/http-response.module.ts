import { Module } from "@nestjs/common";
import { HttpResponseFormatter } from "./http-response.formatter";
import { HttpResponseInterceptor } from "./http-response.interceptor";

@Module({
    providers: [HttpResponseFormatter, HttpResponseInterceptor],
    exports: [HttpResponseFormatter, HttpResponseInterceptor],
})
export class HttpResponseModule { }
