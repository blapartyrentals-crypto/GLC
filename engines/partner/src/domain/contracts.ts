export interface HealthInput {
  tenantId: string;
}

export interface HealthOutput {
  ok: boolean;
  engine: string;
}

export type PartnerTier = "affiliate" | "strategic" | "sovereign";

export interface Partner {
  id: string;
  tenantId: string;
  name: string;
  tier: PartnerTier;
  active: boolean;
  createdAt: string;
}

export interface RegisterPartnerInput {
  tenantId: string;
  name: string;
  region: string;
  requestedTier: PartnerTier;
}

export interface PartnerRepository {
  save(partner: Partner): Promise<void>;
  listByTenant(tenantId: string): Promise<Partner[]>;
  findByName(tenantId: string, name: string): Promise<Partner | undefined>;
}
