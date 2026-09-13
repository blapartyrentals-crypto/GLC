import { Injectable, NotFoundException } from "@nestjs/common";
import type { Tenant, TenantId } from "@glc/contracts";

/**
 * In-memory registry for the scaffold. Replaced by Identity/Partner engines
 * backed by PostgreSQL once the data layer lands.
 */
@Injectable()
export class TenantsService {
  private readonly tenants = new Map<string, Tenant>();

  describe(id: string): Tenant {
    const tenant = this.tenants.get(id);
    if (!tenant) {
      throw new NotFoundException(`Tenant ${id} not found`);
    }
    return tenant;
  }

  provision(name: string, slug: string): Tenant {
    const id = this.slugToId(slug);
    const tenant: Tenant = {
      id,
      slug,
      name,
      profile: "commercial",
      status: "active",
      createdAt: new Date().toISOString()
    };
    this.tenants.set(id, tenant);
    return tenant;
  }

  private slugToId(slug: string): TenantId {
    return `tenant_${slug.replace(/[^a-z0-9]/gi, "_").toLowerCase()}` as TenantId;
  }
}