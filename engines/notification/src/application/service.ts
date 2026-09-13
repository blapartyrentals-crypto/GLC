import { randomUUID } from "node:crypto";
import { eventSubject, type DomainEvent } from "@glc/contracts";
import type {
  HealthInput,
  HealthOutput,
  NotificationOutput,
  NotificationSender,
  SendNotificationInput
} from "../domain/contracts.js";

/**
 * Notification engine — use case layer.
 *
 * Renders templates with variable interpolation and delegates delivery to a
 * channel sender port (email provider, SMS gateway, push service).
 */
export class NotificationService {
  constructor(
    private readonly sender: NotificationSender,
    private readonly publishEvent: (event: DomainEvent) => Promise<void> = async () => {}
  ) {}

  async health(_input: HealthInput): Promise<HealthOutput> {
    return { ok: true, engine: "NOTIFICATION" };
  }

  async send(input: SendNotificationInput): Promise<NotificationOutput> {
    const subject = this.render(input.template.subject, input.variables);
    const body = this.render(input.template.body, input.variables);

    const message: NotificationOutput = {
      channel: input.channel,
      recipientId: input.recipientId,
      subject,
      body,
      deliveredAt: new Date().toISOString()
    };

    await this.sender.send(message);

    await this.publishEvent({
      id: randomUUID(),
      type: "notification.sent",
      version: 1,
      tenantId: input.tenantId,
      traceId: "",
      actor: input.recipientId,
      occurredAt: message.deliveredAt,
      payload: { channel: input.channel, recipientId: input.recipientId }
    });

    return message;
  }

  private render(template: string, variables?: Record<string, string>): string {
    if (!variables) return template;
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => variables[key] ?? `{{${key}}}`);
  }
}

export const notificationEventSubjects = {
  sent: eventSubject("notification.sent")
};
