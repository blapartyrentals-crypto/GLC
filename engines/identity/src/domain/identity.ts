export type IdentityStatus = "created" | "verified" | "suspended" | "closed";

export interface IdentityProfile {
  id: string;
  tenantId: string;
  externalId?: string;
  legalName: string;
  status: IdentityStatus;
  verifiedAt?: string;
  createdAt: string;
}

export interface RegisterIdentityInput {
  tenantId: string;
  legalName: string;
  documentNumber?: string;
}

export interface VerifyIdentityInput {
  identityId: string;
  method: "manual" | "documents" | "biometric";
  verifiedBy: string;
}