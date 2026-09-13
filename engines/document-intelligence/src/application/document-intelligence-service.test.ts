import { describe, expect, it } from "vitest";
import type { DomainEvent } from "@glc/contracts";
import { DocumentIntelligenceService } from "./service.js";

describe("DocumentIntelligenceService", () => {
  it("verifies a passport with all fields at high confidence", async () => {
    const svc = new DocumentIntelligenceService(async () => {});
    const result = await svc.verify({
      tenantId: "t_demo",
      documentId: "doc_1",
      documentType: "passport",
      extractedFields: [
        { key: "full_name", value: "Ada Lovelace", confidence: 0.98 },
        { key: "passport_number", value: "P12345", confidence: 0.99 },
        { key: "expiry_date", value: "2030-01-01", confidence: 0.97 }
      ]
    });

    expect(result.verified).toBe(true);
    expect(result.missingFields).toEqual([]);
  });

  it("flags missing and low-confidence fields", async () => {
    const svc = new DocumentIntelligenceService(async () => {});
    const result = await svc.verify({
      tenantId: "t_demo",
      documentId: "doc_2",
      documentType: "id_card",
      extractedFields: [
        { key: "full_name", value: "Ada Lovelace", confidence: 0.99 },
        { key: "national_id", value: "N42", confidence: 0.5 }
      ]
    });

    expect(result.verified).toBe(false);
    expect(result.missingFields).toContain("date_of_birth");
    expect(result.checks.find((c) => c.key === "national_id")).toMatchObject({
      passed: false,
      detail: "low confidence"
    });
  });

  it("publishes document.verified", async () => {
    const events: DomainEvent[] = [];
    const svc = new DocumentIntelligenceService(async (e) => {
      events.push(e);
    });

    await svc.verify({
      tenantId: "t_demo",
      documentId: "doc_3",
      documentType: "paystub",
      extractedFields: [
        { key: "employer_name", value: "Acme", confidence: 1 },
        { key: "gross_income", value: "60000", confidence: 1 },
        { key: "pay_period", value: "2026-01", confidence: 1 }
      ]
    });

    expect(events[0]).toMatchObject({
      type: "document.verified",
      payload: { documentId: "doc_3", verified: true }
    });
  });
});