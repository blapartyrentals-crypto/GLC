export interface HealthInput {
  tenantId: string;
}

export interface HealthOutput {
  ok: boolean;
  engine: string;
}

export type MobilityPlan = "city" | "country" | "global";

export interface MobilitySubscription {
  id: string;
  tenantId: string;
  memberId: string;
  plan: MobilityPlan;
  active: boolean;
  startedAt: string;
  expiresAt: string;
}

export interface CreateSubscriptionInput {
  tenantId: string;
  memberId: string;
  plan: MobilityPlan;
  countryCode: string;
}

export interface MobilityRepository {
  save(subscription: MobilitySubscription): Promise<void>;
  listByMember(tenantId: string, memberId: string): Promise<MobilitySubscription[]>;
}
