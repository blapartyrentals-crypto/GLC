export type EligibilityStatus = "eligible" | "ineligible" | "review";

export interface HealthInput {
  tenantId: string;
}

export interface HealthOutput {
  ok: boolean;
  engine: string;
}

/**
 * Domain types for the eligibility engine.
 */

export interface EligibilityRule {
  id: string;
  name: string;
  description?: string;
  appliesTo: "individual" | "organization";
  condition: (profile: ApplicantProfile) => boolean;
}

export interface ApplicantProfile {
  id: string;
  tenantId: string;
  age?: number;
  region: string;
  income?: number;
  creditScore?: number;
  employmentStatus?: "employed" | "self-employed" | "unemployed" | "student" | "retired";
  hasExistingPolicy?: boolean;
  citizenship?: string;
}

export interface EligibilityCheckInput {
  tenantId: string;
  applicant: ApplicantProfile;
  rules?: EligibilityRule[];
}

export interface EligibilityResult {
  status: EligibilityStatus;
  passedRules: string[];
  failedRules: string[];
  reviewRules: string[];
  policyHint?: string;
}
