export interface HealthInput {
  tenantId: string;
}

export interface HealthOutput {
  ok: boolean;
  engine: string;
}

export type DocumentType = "id_card" | "passport" | "paystub" | "bank_statement" | "utility_bill";

export interface ExtractedField {
  key: string;
  value: string;
  confidence: number;
}

export interface DocumentVerificationInput {
  tenantId: string;
  documentId: string;
  documentType: DocumentType;
  extractedFields: ExtractedField[];
}

export interface DocumentVerificationOutput {
  documentId: string;
  documentType: DocumentType;
  verified: boolean;
  missingFields: string[];
  checks: { key: string; passed: boolean; detail?: string }[];
}
