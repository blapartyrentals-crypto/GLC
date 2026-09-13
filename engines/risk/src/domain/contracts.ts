export interface HealthInput {
  tenantId: string;
}

export interface HealthOutput {
  ok: boolean;
  engine: string;
}

export interface RiskFactor {
  key: string;
  label: string;
  weight: number;
  value: number;
  score?: number;
}

export interface RiskEvaluationInput {
  tenantId: string;
  applicantId: string;
  factors: RiskFactor[];
}

export interface RiskEvaluationOutput {
  riskScore: number;
  level: "low" | "medium" | "high" | "critical";
  factors: (RiskFactor & { score: number })[];
  recommendation: "approve" | "approve_with_review" | "deny";
}
