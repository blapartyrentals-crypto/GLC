import { describe, expect, it } from "vitest";
import type { DomainEvent } from "@glc/contracts";
import { RiskService } from "./service.js";

describe("RiskService", () => {
  it("scores a low-risk applicant as approve", async () => {
    const svc = new RiskService(async () => {});
    const result = await svc.evaluate({
      tenantId: "t_demo",
      applicantId: "a_1",
      factors: [
        { key: "credit", label: "Credit", weight: 0.4, value: 10 },
        { key: "income", label: "Income", weight: 0.3, value: 0 }
      ]
    });

    expect(result.riskScore).toBeLessThan(30);
    expect(result.level).toBe("low");
    expect(result.recommendation).toBe("approve");
  });

  it("flags a high-risk applicant as deny", async () => {
    const svc = new RiskService(async () => {});
    const result = await svc.evaluate({
      tenantId: "t_demo",
      applicantId: "a_2",
      factors: [
        { key: "credit", label: "Credit", weight: 0.4, value: 100 },
        { key: "criminal", label: "Criminal record", weight: 0.6, value: 100 }
      ]
    });

    expect(result.level).toBe("critical");
    expect(result.recommendation).toBe("deny");
    expect(result.riskScore).toBe(100);
  });

  it("publishes risk.evaluated", async () => {
    const events: DomainEvent[] = [];
    const svc = new RiskService(async (e) => {
      events.push(e);
    });

    await svc.evaluate({
      tenantId: "t_demo",
      applicantId: "a_3",
      factors: [{ key: "credit", label: "Credit", weight: 1, value: 50 }]
    });

    expect(events[0]).toMatchObject({ type: "risk.evaluated", tenantId: "t_demo" });
  });
});