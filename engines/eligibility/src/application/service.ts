import { randomUUID } from "node:crypto";
import { eventSubject, type DomainEvent } from "@glc/contracts";
import type {
  ApplicantProfile,
  EligibilityCheckInput,
  EligibilityResult,
  EligibilityStatus,
  HealthInput,
  HealthOutput
} from "../domain/contracts.js";
import { DEFAULT_ELIGIBILITY_RULES, DEFAULT_REVIEW_TRIGGERS } from "../domain/rules.js";

/**
 * Eligibility engine — use case layer.
 *
 * Business rules only. Persistence and messaging arrive via ports (not yet
 * wired): the `publishEvent` callback is the seam where NATS will plug in.
 */
export class EligibilityService {
  constructor(
    private readonly publishEvent: (event: DomainEvent) => Promise<void> = async () => {}
  ) {}

  async health(_input: HealthInput): Promise<HealthOutput> {
    return { ok: true, engine: "ELIGIBILITY" };
  }

  async check(input: EligibilityCheckInput): Promise<EligibilityResult> {
    const rules = input.rules ?? DEFAULT_ELIGIBILITY_RULES;
    const triggers = DEFAULT_REVIEW_TRIGGERS;

    const passed: string[] = [];
    const failed: string[] = [];
    const review: string[] = [];

    for (const rule of rules) {
      try {
        if (rule.condition(input.applicant)) {
          passed.push(rule.id);
        } else {
          failed.push(rule.id);
        }
      } catch {
        failed.push(rule.id);
      }
    }

    for (const trigger of triggers) {
      if (trigger.condition(input.applicant)) {
        review.push(trigger.id);
      }
    }

    const declined = failed.length > 0;
    const needsReview = review.length > 0;

    let status: EligibilityStatus;
    if (declined) {
      status = "ineligible";
    } else if (needsReview) {
      status = "review";
    } else {
      status = "eligible";
    }

    const result: EligibilityResult = {
      status,
      passedRules: passed,
      failedRules: failed,
      reviewRules: review
    };

    if (status === "eligible") {
      result.policyHint = this.policyHint(input.applicant);
    }

    await this.publishEvent({
      id: randomUUID(),
      type: "eligibility.checked",
      version: 1,
      tenantId: input.tenantId,
      traceId: "",
      actor: input.applicant.id,
      occurredAt: new Date().toISOString(),
      payload: {
        applicantId: input.applicant.id,
        status
      }
    });

    return result;
  }

  private policyHint(profile: ApplicantProfile): string {
    if (profile.income && profile.income >= 100_000 && profile.creditScore && profile.creditScore >= 750) {
      return "premium";
    }
    if (profile.age && profile.age >= 65) {
      return "senior";
    }
    return "standard";
  }
}

export const eligibilityEventSubjects = {
  checked: eventSubject("eligibility.checked")
};
