import { DynamicModule, FactoryProvider, Module } from "@nestjs/common";
import { createAxiosProvider } from "./axios.provider";
import { HttpModuleOptions } from "./http-module.options";
import { AXIOS_INSTANCE_TOKEN } from "./http.constant";
import { HttpService } from "./https.service";

@Module({})
export class HttpModule {
    static forRoot(options: HttpModuleOptions = {}): DynamicModule {
        return {
            module: HttpModule,
            providers: [
                createAxiosProvider(options),
                HttpService,
            ],
            exports: [HttpService],
        };
    }

    static forRootAsync(options: {
        useFactory: (...args: any[]) => HttpModuleOptions;
        inject?: any[];
        imports?: any[];
    }): DynamicModule {
        return {
            module: HttpModule,
            imports: options.imports,
            providers: [
                {
                    provide: AXIOS_INSTANCE_TOKEN,
                    inject: options.inject,
                    useFactory: (...args: any[]) =>
                        (createAxiosProvider(options.useFactory(...args)) as FactoryProvider).useFactory(),
                },
                HttpService,
            ],
            exports: [HttpService],
        };
    }
}