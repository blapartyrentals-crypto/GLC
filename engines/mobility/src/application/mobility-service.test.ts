import { describe, expect, it } from "vitest";
import type { DomainEvent } from "@glc/contracts";
import { MobilityService } from "./service.js";
import type { MobilitySubscription, MobilityRepository } from "../domain/contracts.js";

function repoStub(): MobilityRepository & { subs: MobilitySubscription[] } {
  const subs: MobilitySubscription[] = [];
  return {
    subs,
    async save(subscription) {
      subs.push(subscription);
    },
    async listByMember(tenantId, memberId) {
      return subs.filter((s) => s.tenantId === tenantId && s.memberId === memberId);
    }
  };
}

describe("MobilityService", () => {
  it("creates a city plan with 30-day validity", async () => {
    const repo = repoStub();
    const svc = new MobilityService(repo);

    const sub = await svc.create({
      tenantId: "t_demo",
      memberId: "m_1",
      plan: "city",
      countryCode: "ES"
    });

    expect(sub.active).toBe(true);
    const start = new Date(sub.startedAt).getTime();
    const end = new Date(sub.expiresAt).getTime();
    expect(end - start).toBe(30 * 24 * 60 * 60 * 1000);
  });

  it("creates a global plan with 365-day validity", async () => {
    const repo = repoStub();
    const svc = new MobilityService(repo);

    const sub = await svc.create({
      tenantId: "t_demo",
      memberId: "m_2",
      plan: "global",
      countryCode: "SG"
    });

    const start = new Date(sub.startedAt).getTime();
    const end = new Date(sub.expiresAt).getTime();
    expect(end - start).toBe(365 * 24 * 60 * 60 * 1000);
  });

  it("publishes mobility.subscribed", async () => {
    const repo = repoStub();
    const events: DomainEvent[] = [];
    const svc = new MobilityService(repo, async (e) => {
      events.push(e);
    });

    await svc.create({
      tenantId: "t_demo",
      memberId: "m_3",
      plan: "country",
      countryCode: "DE"
    });

    expect(events[0]).toMatchObject({
      type: "mobility.subscribed",
      payload: { plan: "country" }
    });
  });
});