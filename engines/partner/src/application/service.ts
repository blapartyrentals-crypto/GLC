import { randomUUID } from "node:crypto";
import { eventSubject, type DomainEvent } from "@glc/contracts";
import type {
  HealthInput,
  HealthOutput,
  Partner,
  PartnerRepository,
  RegisterPartnerInput
} from "../domain/contracts.js";

/**
 * Partner engine — use case layer.
 *
 * Onboarding and tier approval. Sovereign deployments can enforce stricter
 * approval rules here (defense/civil variants inherit the same code path).
 */
export class PartnerService {
  constructor(
    private readonly repo: PartnerRepository,
    private readonly publishEvent: (event: DomainEvent) => Promise<void> = async () => {}
  ) {}

  async health(_input: HealthInput): Promise<HealthOutput> {
    return { ok: true, engine: "PARTNER" };
  }

  async register(input: RegisterPartnerInput): Promise<Partner> {
    if (!input.name.trim()) {
      throw new Error("Partner name is required");
    }

    const existing = await this.repo.findByName(input.tenantId, input.name);
    if (existing) {
      throw new Error("Partner already registered");
    }

    const partner: Partner = {
      id: randomUUID(),
      tenantId: input.tenantId,
      name: input.name.trim(),
      tier: input.requestedTier,
      active: true,
      createdAt: new Date().toISOString()
    };

    await this.repo.save(partner);

    await this.publishEvent({
      id: randomUUID(),
      type: "partner.registered",
      version: 1,
      tenantId: input.tenantId,
      traceId: "",
      actor: input.name,
      occurredAt: partner.createdAt,
      payload: { partnerId: partner.id, tier: partner.tier }
    });

    return partner;
  }

  async list(tenantId: string): Promise<Partner[]> {
    return this.repo.listByTenant(tenantId);
  }
}

export const partnerEventSubjects = {
  registered: eventSubject("partner.registered")
};
