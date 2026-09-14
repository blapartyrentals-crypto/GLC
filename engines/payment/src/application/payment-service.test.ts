import { describe, expect, it } from "vitest";
import type { DomainEvent } from "@glc/contracts";
import { PaymentService } from "./service.js";
import type { Payment, PaymentRepository } from "../domain/contracts.js";

function repoStub(): PaymentRepository & { payments: Payment[] } {
  const payments: Payment[] = [];
  return {
    payments,
    async save(payment) {
      payments.push(payment);
    },
    async findById(id) {
      return payments.find((p) => p.id === id);
    }
  };
}

describe("PaymentService", () => {
  it("creates a pending payment", async () => {
    const repo = repoStub();
    const svc = new PaymentService(repo);

    const payment = await svc.create({
      tenantId: "t_demo",
      amountMinor: 299_00,
      currency: "EUR",
      reference: "POL-1"
    });

    expect(payment.status).toBe("pending");
    expect(payment.amountMinor).toBe(299_00);
  });

  it("settles a pending payment and publishes event", async () => {
    const repo = repoStub();
    const events: DomainEvent[] = [];
    const svc = new PaymentService(repo, async (e) => {
      events.push(e);
    });

    const payment = await svc.create({
      tenantId: "t_demo",
      amountMinor: 1_00,
      currency: "USD",
      reference: "POL-2"
    });

    const settled = await svc.settle(payment.id, "succeeded");
    expect(settled.status).toBe("succeeded");
    expect(events[1]).toMatchObject({
      type: "payment.settled",
      payload: { status: "succeeded" }
    });
  });

  it("rejects settling a non-pending payment", async () => {
    const repo = repoStub();
    const svc = new PaymentService(repo);

    const payment = await svc.create({
      tenantId: "t_demo",
      amountMinor: 1_00,
      currency: "USD",
      reference: "POL-3"
    });
    await svc.settle(payment.id, "succeeded");

    await expect(svc.settle(payment.id, "succeeded")).rejects.toThrow(
      /Cannot settle a succeeded payment/
    );
  });

  it("rejects non-positive amounts", async () => {
    const repo = repoStub();
    const svc = new PaymentService(repo);

    await expect(
      svc.create({
        tenantId: "t_demo",
        amountMinor: 0,
        currency: "USD",
        reference: "POL-4"
      })
    ).rejects.toThrow(/Amount must be positive/);
  });
});