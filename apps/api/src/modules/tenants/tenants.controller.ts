import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentTenantId } from "../../common/tenant/tenant.decorator";
import { TenantGuard } from "../../common/guards/tenant.guard";
import { TenantsService } from "./tenants.service";

@Controller("tenants")
export class TenantsController {
  constructor(private readonly tenants: TenantsService) {}

  @Get("me")
  @UseGuards(TenantGuard)
  currentTenant(@CurrentTenantId() tenantId: string) {
    return this.tenants.describe(tenantId);
  }

  @Post()
  create(@Body() body: { name: string; slug: string }) {
    return this.tenants.provision(body.name, body.slug);
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.tenants.describe(id);
  }
}