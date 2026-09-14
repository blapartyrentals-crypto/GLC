import { randomUUID } from "node:crypto";
import { eventSubject, type DomainEvent } from "@glc/contracts";
import type {
  CreatePaymentInput,
  HealthInput,
  HealthOutput,
  Payment,
  PaymentRepository
} from "../domain/contracts.js";

/**
 * Payment engine — use case layer.
 *
 * Money amounts are stored in minor units; no floats across the ledger.
 * The provider gateway (Stripe/Adyen/local rail) plugs in via the repo port.
 */
export class PaymentService {
  constructor(
    private readonly repo: PaymentRepository,
    private readonly publishEvent: (event: DomainEvent) => Promise<void> = async () => {}
  ) {}

  async health(_input: HealthInput): Promise<HealthOutput> {
    return { ok: true, engine: "PAYMENT" };
  }

  async create(input: CreatePaymentInput): Promise<Payment> {
    if (input.amountMinor <= 0) {
      throw new Error("Amount must be positive");
    }

    const payment: Payment = {
      id: randomUUID(),
      tenantId: input.tenantId,
      amountMinor: input.amountMinor,
      currency: input.currency,
      reference: input.reference,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    await this.repo.save(payment);

    await this.publishEvent({
      id: randomUUID(),
      type: "payment.created",
      version: 1,
      tenantId: input.tenantId,
      traceId: "",
      actor: input.reference,
      occurredAt: payment.createdAt,
      payload: { paymentId: payment.id, amountMinor: input.amountMinor, currency: input.currency }
    });

    return payment;
  }

  async settle(id: string, status: "succeeded" | "failed"): Promise<Payment> {
    const payment = await this.repo.findById(id);
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (payment.status !== "pending") {
      throw new Error(`Cannot settle a ${payment.status} payment`);
    }

    payment.status = status;
    payment.settledAt = new Date().toISOString();
    await this.repo.save(payment);

    await this.publishEvent({
      id: randomUUID(),
      type: "payment.settled",
      version: 1,
      tenantId: payment.tenantId,
      traceId: "",
      actor: payment.reference,
      occurredAt: payment.settledAt,
      payload: { paymentId: payment.id, status }
    });

    return payment;
  }

  async refund(id: string): Promise<Payment> {
    const payment = await this.repo.findById(id);
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (payment.status !== "succeeded") {
      throw new Error("Only succeeded payments can be refunded");
    }

    payment.status = "refunded";
    await this.repo.save(payment);

    return payment;
  }
}

export const paymentEventSubjects = {
  created: eventSubject("payment.created"),
  settled: eventSubject("payment.settled")
};
