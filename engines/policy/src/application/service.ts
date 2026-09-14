import { randomUUID } from "node:crypto";
import { eventSubject, type DomainEvent } from "@glc/contracts";
import type {
  HealthInput,
  HealthOutput,
  IssuePolicyInput,
  Policy,
  PolicyRepository,
  PolicyStatus
} from "../domain/contracts.js";

/**
 * Policy engine — use case layer.
 *
 * Business rules only. Persistence and messaging arrive via ports (not yet
 * wired): the `repo` and `publishEvent` seams plug into PostgreSQL and NATS.
 */
export class PolicyService {
  constructor(
    private readonly repo: PolicyRepository,
    private readonly publishEvent: (event: DomainEvent) => Promise<void> = async () => {}
  ) {}

  async health(_input: HealthInput): Promise<HealthOutput> {
    return { ok: true, engine: "POLICY" };
  }

  async issue(input: IssuePolicyInput): Promise<Policy> {
    if (input.premium <= 0) {
      throw new Error("Premium must be positive");
    }
    if (input.termInMonths <= 0) {
      throw new Error("Term must be positive");
    }

    const effective = new Date(input.effectiveDate);
    const expiry = new Date(effective);
    expiry.setMonth(expiry.getMonth() + input.termInMonths);

    const policy: Policy = {
      id: randomUUID(),
      tenantId: input.tenantId,
      productCode: input.productCode,
      policyholderId: input.policyholderId,
      status: "proposed",
      effectiveDate: effective.toISOString(),
      expiryDate: expiry.toISOString(),
      premium: input.premium,
      createdAt: new Date().toISOString()
    };

    await this.repo.save(policy);

    await this.publishEvent({
      id: randomUUID(),
      type: "policy.issued",
      version: 1,
      tenantId: input.tenantId,
      traceId: "",
      actor: input.policyholderId,
      occurredAt: policy.createdAt,
      payload: { policyId: policy.id, productCode: policy.productCode }
    });

    return policy;
  }

  async transition(id: string, to: PolicyStatus): Promise<Policy> {
    const policy = await this.repo.findById(id);
    if (!policy) {
      throw new Error("Policy not found");
    }
    const from = policy.status;
    if (!this.canTransition(from, to)) {
      throw new Error(`Cannot transition policy ${id} from ${from} to ${to}`);
    }

    policy.status = to;
    await this.repo.save(policy);

    await this.publishEvent({
      id: randomUUID(),
      type: "policy.transitioned",
      version: 1,
      tenantId: policy.tenantId,
      traceId: "",
      actor: policy.policyholderId,
      occurredAt: new Date().toISOString(),
      payload: { policyId: policy.id, from, to }
    });

    return policy;
  }

  private canTransition(from: PolicyStatus, to: PolicyStatus): boolean {
    const allowed: Record<PolicyStatus, PolicyStatus[]> = {
      proposed: ["active", "cancelled"],
      active: ["lapsed", "cancelled", "expired"],
      cancelled: [],
      lapsed: ["active", "expired"],
      expired: []
    };
    return allowed[from].includes(to);
  }
}

export const policyEventSubjects = {
  issued: eventSubject("policy.issued"),
  transitioned: eventSubject("policy.transitioned")
};
