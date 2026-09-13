import { describe, expect, it } from "vitest";
import type { DomainEvent } from "@glc/contracts";
import { IdentityService, type IdentityRepository } from "./identity-service.js";
import type { IdentityProfile } from "../domain/identity.js";

function repoStub(): IdentityRepository & { saved: IdentityProfile[] } {
  const saved: IdentityProfile[] = [];
  return {
    saved,
    async save(p: IdentityProfile) {
      saved.push(p);
    },
    async findById(id: string) {
      return saved.find((p) => p.id === id);
    }
  };
}

describe("IdentityService", () => {
  it("registers an identity and publishes identity.created", async () => {
    const repo = repoStub();
    const events: DomainEvent[] = [];
    const svc = new IdentityService(repo, async (e) => {
      events.push(e);
    });

    const profile = await svc.register({
      tenantId: "t_demo",
      legalName: "Ada Lovelace"
    });

    expect(profile.status).toBe("created");
    expect(repo.saved).toHaveLength(1);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: "identity.created", tenantId: "t_demo" });
  });

  it("verifies an identity and publishes identity.verified", async () => {
    const repo = repoStub();
    const events: DomainEvent[] = [];
    const svc = new IdentityService(repo, async (e) => {
      events.push(e);
    });

    await svc.register({ tenantId: "t_demo", legalName: "Ada Lovelace" });
    const eventsAfterRegister = events.length;
    const profile = await svc.verify({
      identityId: repo.saved[0]!.id,
      method: "documents",
      verifiedBy: "t_admin"
    });

    expect(profile.status).toBe("verified");
    expect(profile.verifiedAt).toBeDefined();
    expect(events.length).toBe(eventsAfterRegister + 1);
    expect(events.at(-1)).toMatchObject({ type: "identity.verified" });
  });

  it("mocks no-op publisher by default", async () => {
    const repo = repoStub();
    const svc = new IdentityService(repo);
    const profile = await svc.register({ tenantId: "t_demo", legalName: "Grace Hopper" });
    expect(profile.id).toBeTruthy();
  });
});