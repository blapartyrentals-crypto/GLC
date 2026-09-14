import { Module } from "@nestjs/common";
import { AppConfig } from "../config/app.config";
import { HealthController } from "./health.controller";

@Module({
  controllers: [HealthController],
  providers: [AppConfig]
})
export class HealthModule {}