import type { ApplicantProfile, EligibilityRule } from "./contracts.js";

/**
 * Baseline eligibility rules. Qualifiers apply per tenant profile and can be
 * overridden via engine config (commercial/sovereign drive different
 * risk appetites — see ADR-0007).
 */
export const DEFAULT_ELIGIBILITY_RULES: EligibilityRule[] = [
  {
    id: "age.minimum",
    name: "Minimum age",
    description: "Applicant must be at least 21 years old.",
    appliesTo: "individual",
    condition: (p) => (p.age ?? 0) >= 21
  },
  {
    id: "region.supported",
    name: "Supported region",
    description: "Applicant must reside in a supported region.",
    appliesTo: "individual",
    condition: (p) => p.region !== "UNAVAILABLE"
  },
  {
    id: "income.minimum",
    name: "Minimum income",
    description: "Applicant must meet a minimum income threshold.",
    appliesTo: "individual",
    condition: (p) => (p.income ?? 0) >= 20_000
  },
  {
    id: "credit.minimum",
    name: "Minimum credit score",
    description: "Applicant must have a viable credit record.",
    appliesTo: "individual",
    condition: (p) => (p.creditScore ?? 0) >= 600
  }
];

export interface ReviewTrigger {
  id: string;
  name: string;
  condition: (profile: ApplicantProfile) => boolean;
}

export const DEFAULT_REVIEW_TRIGGERS: ReviewTrigger[] = [
  {
    id: "region.sensitive",
    name: "Applicant from sensitive region",
    condition: (p) => p.region === "SANCTIONED"
  }
];