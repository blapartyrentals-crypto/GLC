import { randomUUID } from "node:crypto";
import {
  eventSubject,
  type DomainEvent,
  type TenantId
} from "@glc/contracts";
import type {
  IdentityProfile,
  RegisterIdentityInput,
  VerifyIdentityInput
} from "../domain/identity.js";

/**
 * Identity engine — use case layer.
 *
 * Business rules only. Persistence and messaging arrive via ports (not yet
 * wired): the `eventBus` callback is the seam where NATS will plug in.
 */
export class IdentityService {
  constructor(
    private readonly repo: IdentityRepository,
    private readonly publishEvent: (event: DomainEvent) => Promise<void> = async () => {}
  ) {}

  async register(input: RegisterIdentityInput): Promise<IdentityProfile> {
    const profile: IdentityProfile = {
      id: randomUUID(),
      tenantId: input.tenantId,
      legalName: input.legalName,
      status: "created",
      createdAt: new Date().toISOString()
    };

    await this.repo.save(profile);

    await this.publishEvent({
      id: randomUUID(),
      type: "identity.created",
      version: 1,
      tenantId: input.tenantId,
      traceId: "",
      actor: input.legalName,
      occurredAt: profile.createdAt,
      payload: { identityId: profile.id }
    });

    return profile;
  }

  async verify(input: VerifyIdentityInput): Promise<IdentityProfile> {
    const profile = await this.repo.findById(input.identityId);
    if (!profile) {
      throw new Error("Identity not found");
    }

    profile.status = "verified";
    profile.verifiedAt = new Date().toISOString();
    await this.repo.save(profile);

    await this.publishEvent({
      id: randomUUID(),
      type: "identity.verified",
      version: 1,
      tenantId: profile.tenantId as TenantId,
      traceId: "",
      actor: input.verifiedBy,
      occurredAt: profile.verifiedAt,
      payload: { identityId: profile.id, method: input.method }
    });

    return profile;
  }
}

export interface IdentityRepository {
  save(profile: IdentityProfile): Promise<void>;
  findById(id: string): Promise<IdentityProfile | undefined>;
}

export const identityEventSubjects = {
  created: eventSubject("identity.created"),
  verified: eventSubject("identity.verified")
};