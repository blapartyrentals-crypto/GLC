import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { TENANT_HEADER, type TenantId } from "@glc/contracts";

export const CurrentTenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TenantId | undefined => {
    const req = ctx.switchToHttp().getRequest<{ headers: Record<string, unknown> }>();
    const value = req.headers[TENANT_HEADER.toLowerCase()];
    return typeof value === "string" && value.length > 0 ? (value as TenantId) : undefined;
  }
);