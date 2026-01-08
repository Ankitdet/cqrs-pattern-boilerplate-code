import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DBModule } from "./database/database.module";
import { HttpModule } from "./http/http.module";

@Module({})
export class CommonInfraModule {
  static forRoot(): DynamicModule {
    return {
      module: CommonInfraModule,
      imports: [
        ConfigModule,
        HttpModule.forRoot(),
        DBModule,
      ],
      exports: [
        HttpModule.forRoot(),
        DBModule,
        ConfigModule],
    };
  }
}
