import { Module } from "@nestjs/common";
import { DBModule } from "./database/database.module";

@Module({
  imports: [DBModule],
  providers: [],
  exports: [],
})
export class CommonInfraModule {}
