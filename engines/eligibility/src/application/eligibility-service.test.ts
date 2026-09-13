import { describe, expect, it } from "vitest";
import type { DomainEvent } from "@glc/contracts";
import { EligibilityService } from "./service.js";

describe("EligibilityService", () => {
  it("marks a qualified applicant as eligible", async () => {
    const svc = new EligibilityService(async () => {});
    const result = await svc.check({
      tenantId: "t_demo",
      applicant: {
        id: "a_1",
        tenantId: "t_demo",
        age: 32,
        region: "EU",
        income: 60_000,
        creditScore: 720
      }
    });

    expect(result.status).toBe("eligible");
    expect(result.failedRules).toEqual([]);
    expect(result.policyHint).toBe("standard");
  });

  it("marks an applicant with low credit as ineligible", async () => {
    const svc = new EligibilityService(async () => {});
    const result = await svc.check({
      tenantId: "t_demo",
      applicant: {
        id: "a_2",
        tenantId: "t_demo",
        age: 30,
        region: "EU",
        income: 50_000,
        creditScore: 450
      }
    });

    expect(result.status).toBe("ineligible");
    expect(result.failedRules).toContain("credit.minimum");
  });

  it("routes sanctioned-region applicants to review", async () => {
    const events: DomainEvent[] = [];
    const svc = new EligibilityService(async (e) => {
      events.push(e);
    });

    const result = await svc.check({
      tenantId: "t_demo",
      applicant: {
        id: "a_3",
        tenantId: "t_demo",
        age: 40,
        region: "SANCTIONED",
        income: 80_000,
        creditScore: 700
      }
    });

    expect(result.status).toBe("review");
    expect(result.reviewRules).toContain("region.sensitive");
    expect(events[0]).toMatchObject({ type: "eligibility.checked", tenantId: "t_demo" });
  });
});