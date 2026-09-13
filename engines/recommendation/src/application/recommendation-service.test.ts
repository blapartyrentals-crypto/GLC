import { describe, expect, it } from "vitest";
import type { DomainEvent } from "@glc/contracts";
import { RecommendationService } from "./service.js";

describe("RecommendationService", () => {
  it("ranks preferred product first", async () => {
    const svc = new RecommendationService(async () => {});
    const result = await svc.recommend({
      tenantId: "t_demo",
      applicantId: "a_1",
      preferences: ["health"],
      eligibleProductCodes: ["LIFE", "HEALTH", "TRAVEL"]
    });

    expect(result.ranked[0]!.productCode).toBe("HEALTH");
    expect(result.ranked[0]!.score).toBeGreaterThan(50);
  });

  it("keeps deterministic order for equal scores", async () => {
    const svc = new RecommendationService(async () => {});
    const result = await svc.recommend({
      tenantId: "t_demo",
      applicantId: "a_2",
      eligibleProductCodes: ["LIFE", "TRAVEL"]
    });

    expect(result.ranked.map((r) => r.productCode)).toEqual(["LIFE", "TRAVEL"]);
  });

  it("publishes recommendation.generated", async () => {
    const events: DomainEvent[] = [];
    const svc = new RecommendationService(async (e) => {
      events.push(e);
    });

    await svc.recommend({
      tenantId: "t_demo",
      applicantId: "a_3",
      eligibleProductCodes: ["LIFE"]
    });

    expect(events[0]).toMatchObject({
      type: "recommendation.generated",
      payload: { applicantId: "a_3", topProduct: "LIFE" }
    });
  });
});