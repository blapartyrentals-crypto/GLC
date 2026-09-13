import { describe, expect, it } from "vitest";
import type { DomainEvent } from "@glc/contracts";
import { PolicyService } from "./service.js";
import type { Policy, PolicyRepository } from "../domain/contracts.js";

function repoStub(): PolicyRepository & { saved: Policy[] } {
  const saved: Policy[] = [];
  return {
    saved,
    async save(policy) {
      saved.push(policy);
    },
    async findById(id) {
      return saved.find((p) => p.id === id);
    }
  };
}

describe("PolicyService", () => {
  it("issues a proposed policy with correct expiry", async () => {
    const repo = repoStub();
    const svc = new PolicyService(repo);
    const policy = await svc.issue({
      tenantId: "t_demo",
      productCode: "LIFE",
      policyholderId: "a_1",
      effectiveDate: "2026-01-01",
      premium: 299,
      termInMonths: 12
    });

    expect(policy.status).toBe("proposed");
    expect(policy.effectiveDate).toBe("2026-01-01T00:00:00.000Z");
    expect(policy.expiryDate).toBe("2027-01-01T00:00:00.000Z");
    expect(repo.saved).toHaveLength(1);
  });

  it("transitions proposed to active and emits event", async () => {
    const repo = repoStub();
    const events: DomainEvent[] = [];
    const svc = new PolicyService(repo, async (e) => {
      events.push(e);
    });

    const policy = await svc.issue({
      tenantId: "t_demo",
      productCode: "LIFE",
      policyholderId: "a_1",
      effectiveDate: "2026-01-01",
      premium: 299,
      termInMonths: 12
    });

    const active = await svc.transition(policy.id, "active");
    expect(active.status).toBe("active");
    expect(events[1]).toMatchObject({
      type: "policy.transitioned",
      payload: { from: "proposed", to: "active" }
    });
  });

  it("rejects invalid transitions", async () => {
    const repo = repoStub();
    const svc = new PolicyService(repo);

    const policy = await svc.issue({
      tenantId: "t_demo",
      productCode: "LIFE",
      policyholderId: "a_1",
      effectiveDate: "2026-01-01",
      premium: 299,
      termInMonths: 12
    });

    await expect(svc.transition(policy.id, "expired")).rejects.toThrow(
      /Cannot transition/
    );
  });

  it("rejects non-positive premium", async () => {
    const repo = repoStub();
    const svc = new PolicyService(repo);

    await expect(
      svc.issue({
        tenantId: "t_demo",
        productCode: "LIFE",
        policyholderId: "a_1",
        effectiveDate: "2026-01-01",
        premium: 0,
        termInMonths: 12
      })
    ).rejects.toThrow(/Premium must be positive/);
  });
});