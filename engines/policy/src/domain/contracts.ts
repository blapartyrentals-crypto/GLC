export interface HealthInput {
  tenantId: string;
}

export interface HealthOutput {
  ok: boolean;
  engine: string;
}

export type PolicyStatus = "proposed" | "active" | "cancelled" | "lapsed" | "expired";

export interface Policy {
  id: string;
  tenantId: string;
  productCode: string;
  policyholderId: string;
  status: PolicyStatus;
  effectiveDate: string;
  expiryDate: string;
  premium: number;
  createdAt: string;
}

export interface IssuePolicyInput {
  tenantId: string;
  productCode: string;
  policyholderId: string;
  effectiveDate: string;
  premium: number;
  termInMonths: number;
}

export interface PolicyRepository {
  save(policy: Policy): Promise<void>;
  findById(id: string): Promise<Policy | undefined>;
}
