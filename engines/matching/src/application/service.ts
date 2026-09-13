import { randomUUID } from "node:crypto";
import { eventSubject, type DomainEvent } from "@glc/contracts";
import type {
  HealthInput,
  HealthOutput,
  MatchOutput,
  MatchRequest,
  MatchResult
} from "../domain/contracts.js";

/**
 * Matching engine — use case layer.
 *
 * Scores candidates against a set of needs using token overlap. Later this can
 * be upgraded to vector similarity on pgvector, keeping the same port shape.
 */
export class MatchingService {
  constructor(
    private readonly publishEvent: (event: DomainEvent) => Promise<void> = async () => {}
  ) {}

  async health(_input: HealthInput): Promise<HealthOutput> {
    return { ok: true, engine: "MATCHING" };
  }

  async match(input: MatchRequest): Promise<MatchOutput> {
    const matches: MatchResult[] = input.candidates
      .map((candidate) => {
        const matched = candidate.tags.filter((tag) => input.needs.includes(tag));
        const score = candidate.tags.length === 0
          ? 0
          : Math.round((matched.length / input.needs.length) * 100);
        return { candidateId: candidate.id, score, matchedTags: matched };
      })
      .sort((a, b) => b.score - a.score);

    await this.publishEvent({
      id: randomUUID(),
      type: "matching.computed",
      version: 1,
      tenantId: input.tenantId,
      traceId: "",
      actor: "",
      occurredAt: new Date().toISOString(),
      payload: { topCandidateId: matches[0]?.candidateId }
    });

    return { matches };
  }
}

export const matchingEventSubjects = {
  computed: eventSubject("matching.computed")
};
