# GLC — GLOBAL LIFE CHANGE

**One codebase → multiple deployment profiles** (Commercial / Institutional / Sovereign).

Infrastructure for a life-change platform covering mobility, eligibility, policy,
matching, recommendation, risk, partner, payments and notifications — targeting
both civil and defense-grade deployments.

## Repo map

| Path | Purpose |
| --- | --- |
| `apps/` | Web (Next.js) + API (NestJS) |
| `packages/contracts` | Shared TypeScript contracts: tenants, events, errors |
| `packages/tsconfig` | Shared TS configurations |
| `packages/engine-runtime` | Engine-runtime helpers |
| `agents/` | Agent runtime + orchestration (LangGraph.js) |
| `engines/identity` | Identity: register + verify, publishes `identity.*` events |
| `engines/eligibility` | Eligibility: rule-based checks, `eligibility.checked` |
| `engines/risk` | Risk: deterministic scoring → low/medium/high/critical |
| `engines/policy` | Policy: lifecycle (proposed → active → …), `policy.*` events |
| `engines/recommendation` | Recommendation: product ranking, `recommendation.generated` |
| `engines/document-intelligence` | Document-intelligence: field verification per doc type |
| `engines/notification` | Notification: templating + channel sender port |
| `engines/matching` | Matching: needs ↔ candidates scoring |
| `engines/partner` | Partner: onboarding + tier management |
| `engines/payment` | Payment: minor-unit ledger state machine |
| `engines/mobility` | Mobility: cross-border subscription plans |
| `infra/` | Compose, OpenTofu, Helm, SQL migrations |
| `docs/` | Architecture + ADRs |

## Stack (Canonical Technical Stack v1.0)

Next.js · NestJS · TypeScript · Tailwind · Turborepo · LangGraph.js · LiteLLM ·
PostgreSQL + pgvector · Redis/Valkey · S3-compatible storage · BullMQ · NATS ·
Keycloak/OpenBao · REST + WebSockets + event-driven.

## Quick start

```bash
corepack enable pnpm
pnpm install
pnpm dev
```

Infra local: see `infra/README.md` (Docker Compose, Postgres+vector, Valkey,
NATS, MinIO, Keycloak, OpenBao, LiteLLM).

## Platform services

Web, API, Engines, Agent runtime, Event bus, Data, Identity, Secrets, Observability.
See `docs/` for the full architecture and ADRs.
