import { CanActivate, ExecutionContext, Injectable, BadRequestException } from "@nestjs/common";
import { assertDefinedTenant } from "@glc/contracts";

/**
 * Ensures every request carries a tenant id (header x-glc-tenant).
 * This is the first line of multi-tenancy defense; PostgreSQL RLS is the second.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ headers: Record<string, unknown> }>();
    const rawTenant = req.headers["x-glc-tenant"];
    try {
      assertDefinedTenant(rawTenant);
      return true;
    } catch {
      throw new BadRequestException("Missing or invalid x-glc-tenant header");
    }
  }
}