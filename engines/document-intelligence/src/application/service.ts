import { randomUUID } from "node:crypto";
import { eventSubject, type DomainEvent } from "@glc/contracts";
import type {
  DocumentVerificationInput,
  DocumentVerificationOutput,
  DocumentType,
  HealthInput,
  HealthOutput
} from "../domain/contracts.js";

/**
 * Document intelligence engine — use case layer.
 *
 * Validates extracted documents against required field sets per document type.
 * The extraction itself will be handled later by LangGraph.js + LiteLLM.
 */
export class DocumentIntelligenceService {
  constructor(
    private readonly publishEvent: (event: DomainEvent) => Promise<void> = async () => {}
  ) {}

  async health(_input: HealthInput): Promise<HealthOutput> {
    return { ok: true, engine: "DOCUMENT-INTELLIGENCE" };
  }

  async verify(input: DocumentVerificationInput): Promise<DocumentVerificationOutput> {
    const required = REQUIRED_FIELDS[input.documentType];
    const present = new Map(input.extractedFields.map((f) => [f.key, f]));

    const checks: DocumentVerificationOutput["checks"] = required.map((key) => {
      const field = present.get(key);
      if (!field) {
        return { key, passed: false, detail: "missing field" };
      }
      if (field.confidence < 0.7) {
        return { key, passed: false, detail: "low confidence" };
      }
      return { key, passed: true };
    });

    const missingFields = required.filter((key) => !checks.find((c) => c.key === key)?.passed);
    const verified = missingFields.length === 0;

    await this.publishEvent({
      id: randomUUID(),
      type: "document.verified",
      version: 1,
      tenantId: input.tenantId,
      traceId: "",
      actor: input.documentId,
      occurredAt: new Date().toISOString(),
      payload: { documentId: input.documentId, verified }
    });

    return {
      documentId: input.documentId,
      documentType: input.documentType,
      verified,
      missingFields,
      checks
    };
  }
}

const REQUIRED_FIELDS: Record<DocumentType, string[]> = {
  id_card: ["full_name", "national_id", "date_of_birth"],
  passport: ["full_name", "passport_number", "expiry_date"],
  paystub: ["employer_name", "gross_income", "pay_period"],
  bank_statement: ["account_holder", "account_number", "statement_period"],
  utility_bill: ["service_provider", "address", "customer_name"]
};

export const documentIntelligenceEventSubjects = {
  verified: eventSubject("document.verified")
};
