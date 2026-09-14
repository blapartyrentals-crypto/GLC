import { describe, expect, it } from "vitest";
import type { DomainEvent } from "@glc/contracts";
import { NotificationService } from "./service.js";
import type { NotificationOutput } from "../domain/contracts.js";

describe("NotificationService", () => {
  it("renders variables and delivers via sender", async () => {
    const sent: NotificationOutput[] = [];
    const svc = new NotificationService({
      async send(message) {
        sent.push(message);
      }
    });

    const result = await svc.send({
      tenantId: "t_demo",
      recipientId: "u_1",
      channel: "email",
      template: {
        id: "welcome",
        subject: "Welcome {{name}}",
        body: "Hello {{name}}, your policy is ready."
      },
      variables: { name: "Ada" }
    });

    expect(result.subject).toBe("Welcome Ada");
    expect(result.body).toBe("Hello Ada, your policy is ready.");
    expect(sent).toHaveLength(1);
  });

  it("leaves unknown variables untouched", async () => {
    const svc = new NotificationService({
      async send() {}
    });

    const result = await svc.send({
      tenantId: "t_demo",
      recipientId: "u_2",
      channel: "sms",
      template: {
        id: "generic",
        subject: "Update",
        body: "Hi {{missing}}"
      },
      variables: { name: "Ada" }
    });

    expect(result.body).toBe("Hi {{missing}}");
  });

  it("publishes notification.sent", async () => {
    const events: DomainEvent[] = [];
    const svc = new NotificationService(
      {
        async send() {}
      },
      async (e) => {
        events.push(e);
      }
    );

    await svc.send({
      tenantId: "t_demo",
      recipientId: "u_3",
      channel: "push",
      template: { id: "generic", subject: "Hi", body: "Body" }
    });

    expect(events[0]).toMatchObject({
      type: "notification.sent",
      payload: { channel: "push" }
    });
  });
});