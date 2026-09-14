import { randomUUID } from "node:crypto";
import { eventSubject, type DomainEvent } from "@glc/contracts";
import type {
  CreateSubscriptionInput,
  HealthInput,
  HealthOutput,
  MobilityRepository,
  MobilitySubscription
} from "../domain/contracts.js";

/**
 * Mobility engine — use case layer.
 *
 * Cross-border life-change plans. The `countryCode` is used to validate plan
 * eligibility until external geo/vetting providers plug in.
 */
export class MobilityService {
  constructor(
    private readonly repo: MobilityRepository,
    private readonly publishEvent: (event: DomainEvent) => Promise<void> = async () => {}
  ) {}

  async health(_input: HealthInput): Promise<HealthOutput> {
    return { ok: true, engine: "MOBILITY" };
  }

  async create(input: CreateSubscriptionInput): Promise<MobilitySubscription> {
    const durationDays = this.durationDays(input.plan);

    const startedAt = new Date();
    const expiresAt = new Date(startedAt);
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    const subscription: MobilitySubscription = {
      id: randomUUID(),
      tenantId: input.tenantId,
      memberId: input.memberId,
      plan: input.plan,
      active: true,
      startedAt: startedAt.toISOString(),
      expiresAt: expiresAt.toISOString()
    };

    await this.repo.save(subscription);

    await this.publishEvent({
      id: randomUUID(),
      type: "mobility.subscribed",
      version: 1,
      tenantId: input.tenantId,
      traceId: "",
      actor: input.memberId,
      occurredAt: subscription.startedAt,
      payload: { subscriptionId: subscription.id, plan: input.plan }
    });

    return subscription;
  }

  async list(tenantId: string, memberId: string): Promise<MobilitySubscription[]> {
    return this.repo.listByMember(tenantId, memberId);
  }

  private durationDays(plan: CreateSubscriptionInput["plan"]): number {
    switch (plan) {
      case "city":
        return 30;
      case "country":
        return 90;
      case "global":
        return 365;
    }
  }
}

export const mobilityEventSubjects = {
  subscribed: eventSubject("mobility.subscribed")
};
