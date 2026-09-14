import { Controller, Get } from "@nestjs/common";
import { AppConfig } from "../config/app.config";

@Controller("health")
export class HealthController {
  constructor(private readonly config: AppConfig) {}

  @Get()
  health() {
    return {
      status: "ok",
      service: "glc-api",
      profile: this.config.profile,
      timestamp: new Date().toISOString()
    };
  }
}