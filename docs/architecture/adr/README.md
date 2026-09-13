# Architecture Decision Records

Este directorio registra las decisiones de arquitectura de GLC de forma **trazable** y
**auditable** — requisito y buena práctica en entornos civiles y de defensa.

## Convenciones

- Archivo `adr-000N-slug.md`.
- Estados: `Aceptado`, `Propuesto`, `Superseded`, `Deprecado`.
- Un ADR "Aceptado" no se reescribe; los cambios generan un ADR nuevo que referencia al
  anterior (relación `Superseded`).

## Índice

| ADR | Título | Estado |
|---|---|---|
| ADR-0001 | Monorepo Turborepo + pnpm | Aceptado |
| ADR-0002 | TypeScript end-to-end | Aceptado |
| ADR-0003 | Event-driven con NATS JetStream | Aceptado |
| ADR-0004 | Modelo agnóstico de IA vía LiteLLM Proxy | Aceptado |
| ADR-0005 | Multi-tenancy con PostgreSQL RLS | Aceptado |
| ADR-0006 | Sandboxing de agentes con Firecracker/gVisor | Aceptado |
| ADR-0007 | Runtime de agentes aislado (mitigación LangGraph.js) | Aceptado |
| ADR-0008 | Proveedor de identidad Keycloak + OPA para ABAC | Aceptado |
| ADR-0009 | Infraestructura inicial: Compose + OpenTofu/Helm | Aceptado |