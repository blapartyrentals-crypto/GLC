export interface HealthInput {
  tenantId: string;
}

export interface HealthOutput {
  ok: boolean;
  engine: string;
}

export interface RecommendationScore {
  productCode: string;
  score: number;
  reason: string;
}

export interface RecommendInput {
  tenantId: string;
  applicantId: string;
  preferences?: string[];
  eligibleProductCodes: string[];
}

export interface RecommendOutput {
  ranked: RecommendationScore[];
}
