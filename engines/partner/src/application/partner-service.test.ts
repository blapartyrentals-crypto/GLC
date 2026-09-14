import { describe, expect, it } from "vitest";
import type { DomainEvent } from "@glc/contracts";
import { PartnerService } from "./service.js";
import type { Partner, PartnerRepository } from "../domain/contracts.js";

function repoStub(): PartnerRepository & { partners: Partner[] } {
  const partners: Partner[] = [];
  return {
    partners,
    async save(partner) {
      partners.push(partner);
    },
    async listByTenant(tenantId) {
      return partners.filter((p) => p.tenantId === tenantId);
    },
    async findByName(tenantId, name) {
      return partners.find((p) => p.tenantId === tenantId && p.name === name);
    }
  };
}

describe("PartnerService", () => {
  it("registers a partner and publishes event", async () => {
    const repo = repoStub();
    const events: DomainEvent[] = [];
    const svc = new PartnerService(repo, async (e) => {
      events.push(e);
    });

    const partner = await svc.register({
      tenantId: "t_demo",
      name: "Nova Assurance",
      region: "EU",
      requestedTier: "strategic"
    });

    expect(partner.tier).toBe("strategic");
    expect(partner.active).toBe(true);
    expect(events[0]).toMatchObject({
      type: "partner.registered",
      payload: { tier: "strategic" }
    });
  });

  it("rejects duplicate partner names within a tenant", async () => {
    const repo = repoStub();
    const svc = new PartnerService(repo);

    await svc.register({
      tenantId: "t_demo",
      name: "Nova",
      region: "EU",
      requestedTier: "affiliate"
    });

    await expect(
      svc.register({
        tenantId: "t_demo",
        name: "Nova",
        region: "EU",
        requestedTier: "affiliate"
      })
    ).rejects.toThrow(/already registered/);
  });

  it("allows same name in different tenants", async () => {
    const repo = repoStub();
    const svc = new PartnerService(repo);

    await svc.register({
      tenantId: "t_a",
      name: "Nova",
      region: "EU",
      requestedTier: "affiliate"
    });
    const second = await svc.register({
      tenantId: "t_b",
      name: "Nova",
      region: "US",
      requestedTier: "affiliate"
    });

    expect(second.tenantId).toBe("t_b");
    expect(repo.partners).toHaveLength(2);
  });
});