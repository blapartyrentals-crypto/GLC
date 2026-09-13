import { randomUUID } from "node:crypto";
import { eventSubject, type DomainEvent } from "@glc/contracts";
import type {
  HealthInput,
  HealthOutput,
  RecommendInput,
  RecommendOutput,
  RecommendationScore
} from "../domain/contracts.js";

/**
 * Recommendation engine — use case layer.
 *
 * Ranks eligible products using a deterministic scoring pass. Later, the same
 * seam will delegate to LangGraph.js agents for personalized narratives.
 */
export class RecommendationService {
  constructor(
    private readonly publishEvent: (event: DomainEvent) => Promise<void> = async () => {}
  ) {}

  async health(_input: HealthInput): Promise<HealthOutput> {
    return { ok: true, engine: "RECOMMENDATION" };
  }

  async recommend(input: RecommendInput): Promise<RecommendOutput> {
    const ranked: RecommendationScore[] = input.eligibleProductCodes
      .map((code) => this.scoreProduct(code, input.preferences ?? []))
      .sort((a, b) => b.score - a.score);

    await this.publishEvent({
      id: randomUUID(),
      type: "recommendation.generated",
      version: 1,
      tenantId: input.tenantId,
      traceId: "",
      actor: input.applicantId,
      occurredAt: new Date().toISOString(),
      payload: {
        applicantId: input.applicantId,
        topProduct: ranked[0]?.productCode
      }
    });

    return { ranked };
  }

  private scoreProduct(code: string, preferences: string[]): RecommendationScore {
    let score = 50;

    if (preferences.includes(code.toLowerCase())) {
      score += 35;
    }
    if (preferences.some((p) => p.toLowerCase().includes(code.toLowerCase()))) {
      score += 15;
    }

    return { productCode: code, score, reason: "product match" };
  }
}

export const recommendationEventSubjects = {
  generated: eventSubject("recommendation.generated")
};
