export interface DomainEvent<Payload = unknown> {
  id: string;
  type: EventType;
  version: number;
  tenantId: string;
  traceId: string;
  actor?: string;
  occurredAt: string;
  payload: Payload;
}

export type EventType = string;

export const EVENT_SUBJECT_PREFIX = "glc";

export function eventSubject(type: EventType): string {
  return `${EVENT_SUBJECT_PREFIX}.${type}`;
}

export type EventEnvelope = DomainEvent;