import { describe, expect, it } from "vitest";
import type { DomainEvent } from "@glc/contracts";
import { MatchingService } from "./service.js";

describe("MatchingService", () => {
  it("ranks the best-matched candidate first", async () => {
    const svc = new MatchingService(async () => {});
    const result = await svc.match({
      tenantId: "t_demo",
      needs: ["protection", "retirement"],
      candidates: [
        { id: "c_1", label: "Term Life", tags: ["protection"] },
        { id: "c_2", label: "Pension", tags: ["retirement", "protection"] },
        { id: "c_3", label: "Travel", tags: ["travel"] }
      ]
    });

    expect(result.matches[0]!.candidateId).toBe("c_2");
    expect(result.matches[0]!.score).toBe(100);
  });

  it("scores zero for candidates with no overlap", async () => {
    const svc = new MatchingService(async () => {});
    const result = await svc.match({
      tenantId: "t_demo",
      needs: ["protection"],
      candidates: [{ id: "c_1", label: "Travel", tags: ["travel"] }]
    });

    expect(result.matches[0]).toEqual({ candidateId: "c_1", score: 0, matchedTags: [] });
  });

  it("publishes matching.computed", async () => {
    const events: DomainEvent[] = [];
    const svc = new MatchingService(async (e) => {
      events.push(e);
    });

    await svc.match({
      tenantId: "t_demo",
      needs: ["protection"],
      candidates: [{ id: "c_1", label: "Life", tags: ["protection"] }]
    });

    expect(events[0]).toMatchObject({
      type: "matching.computed",
      payload: { topCandidateId: "c_1" }
    });
  });
});