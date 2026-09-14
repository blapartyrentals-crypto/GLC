import { randomUUID } from "node:crypto";
import { eventSubject, type DomainEvent } from "@glc/contracts";
import type {
  HealthInput,
  HealthOutput,
  RiskEvaluationInput,
  RiskEvaluationOutput,
  RiskFactor
} from "../domain/contracts.js";

export type RiskLevel = "low" | "medium" | "high" | "critical";

/**
 * Risk engine — use case layer.
 *
 * Business rules only. Alternates as a deterministic scorer before any AI/ML
 * decisioning (LangGraph/LiteLLM) is plugged in.
 */
export class RiskService {
  constructor(
    private readonly publishEvent: (event: DomainEvent) => Promise<void> = async () => {}
  ) {}

  async health(_input: HealthInput): Promise<HealthOutput> {
    return { ok: true, engine: "RISK" };
  }

  async evaluate(input: RiskEvaluationInput): Promise<RiskEvaluationOutput> {
    const evaluated: (RiskFactor & { score: number })[] = input.factors.map((f) => ({
      ...f,
      score: Math.round(f.weight * f.value * 100) / 100
    }));

    const riskScore = Math.min(
      100,
      Math.round(evaluated.reduce((acc, f) => acc + (f.score ?? 0), 0) * 10) / 10
    );

    const level = this.levelFor(riskScore);
    const recommendation = this.recommendationFor(level);

    await this.publishEvent({
      id: randomUUID(),
      type: "risk.evaluated",
      version: 1,
      tenantId: input.tenantId,
      traceId: "",
      actor: input.applicantId,
      occurredAt: new Date().toISOString(),
      payload: { applicantId: input.applicantId, riskScore, level }
    });

    return { riskScore, level, factors: evaluated, recommendation };
  }

  private levelFor(score: number): RiskLevel {
    if (score < 30) return "low";
    if (score < 60) return "medium";
    if (score < 85) return "high";
    return "critical";
  }

  private recommendationFor(level: RiskLevel): RiskEvaluationOutput["recommendation"] {
    switch (level) {
      case "low":
        return "approve";
      case "medium":
        return "approve_with_review";
      case "high":
      case "critical":
        return "deny";
    }
  }
}

export const riskEventSubjects = {
  evaluated: eventSubject("risk.evaluated")
};
