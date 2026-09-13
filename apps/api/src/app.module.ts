import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "./health/health.module";
import { TenantsModule } from "./modules/tenants/tenants.module";
import { AppConfig } from "./config/app.config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    HealthModule,
    TenantsModule
  ],
  providers: [AppConfig],
  exports: [AppConfig]
})
export class AppModule {}