import { Module } from "@nestjs/common";
import { HealthController } from "./health-check.controller";

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [],
})
export class HealthCheckModule {}
