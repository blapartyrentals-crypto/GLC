export type TenantId = string & { readonly __brand: "TenantId" };

export interface Tenant {
  id: TenantId;
  slug: string;
  name: string;
  profile: "commercial" | "institutional" | "sovereign";
  region?: string;
  status: "active" | "suspended" | "provisioning";
  createdAt: string;
}

export const TENANT_HEADER = "x-glc-tenant";

export function assertDefinedTenant(value: unknown): asserts value is TenantId {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error("Tenant id is required and must be a non-empty string");
  }
}