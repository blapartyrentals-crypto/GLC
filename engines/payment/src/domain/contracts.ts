export interface HealthInput {
  tenantId: string;
}

export interface HealthOutput {
  ok: boolean;
  engine: string;
}

export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Payment {
  id: string;
  tenantId: string;
  amountMinor: number;
  currency: string;
  reference: string;
  status: PaymentStatus;
  createdAt: string;
  settledAt?: string;
}

export interface CreatePaymentInput {
  tenantId: string;
  amountMinor: number;
  currency: string;
  reference: string;
}

export interface PaymentRepository {
  save(payment: Payment): Promise<void>;
  findById(id: string): Promise<Payment | undefined>;
}
