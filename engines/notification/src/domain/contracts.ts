export interface HealthInput {
  tenantId: string;
}

export interface HealthOutput {
  ok: boolean;
  engine: string;
}

export type NotificationChannel = "email" | "sms" | "push" | "inbox";

export interface NotificationTemplate {
  id: string;
  subject: string;
  body: string;
}

export interface SendNotificationInput {
  tenantId: string;
  recipientId: string;
  channel: NotificationChannel;
  template: NotificationTemplate;
  variables?: Record<string, string>;
}

export interface NotificationOutput {
  channel: NotificationChannel;
  recipientId: string;
  subject: string;
  body: string;
  deliveredAt: string;
}

export interface NotificationSender {
  send(message: NotificationOutput): Promise<void>;
}
