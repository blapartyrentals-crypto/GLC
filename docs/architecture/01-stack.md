# Stack Canónico Validado

> Fuente: "STACK FINAL GLC 09/12/2026" — validado y concretado en esta sesión.

Alcance de despliegue: **civil y defensa**. Los huecos que el stack listaba como genéricos se
cierran aquí con una herramienta concreta y un motivo.

## 1. Aplicación

| Dominio | Tecnología | Estado |
|---|---|---|
| UI/UX | Next.js + TypeScript + Tailwind CSS | ✅ Validado |
| Backend | NestJS + TypeScript | ✅ Validado |
| Monorepo | Turborepo + pnpm workspaces | ✅ Validado |

**Decisión:** Next.js con Server Components y, en perfiles soberanos, build `output: "standalone"`
(SRG/despliegues air-gap). El código de servidor de Next.js debe poder compilarse a un artefacto
minimalista sin dependencias de red.

## 2. API / Comunicación

- **REST** para operaciones de administración y consultas síncronas.
- **WebSockets** para presencia, notificaciones en vivo y supervisión.
- **Event-driven** como backbone de integración. El broker concreto se fija en ADR-0004.

## 3. Agente / Orquestación

- **LangGraph.js** como runtime de orquestación de agentes.
- **LiteLLM Proxy** como punto único de acceso a modelos (conmutación sin tocar código).
- Runtime aislado para ejecución de herramientas y agentes (ver `05-security.md`).

> Riesgo conocido: LangGraph.js es más joven que LangGraph (Python). Se mitiga manteniendo el
> runtime de agentes como módulo aislado y con contrato estable vía eventos (ADR-0007).

## 4. Datos

| Dominio | Tecnología | Motivo |
|---|---|---|
| Relacional + vectorial | PostgreSQL + pgvector | ACID, RLS, extensiones; embeddings junto al dato |
| Cache / colas | Redis / Valkey-compatible | BullMQ (jobs) + cache de sesiones |
| Objetos | S3-compatible (MinIO en dev; SO de nube u on-prem en prod) | Documentos, evidencia, archivos |

**Decisión:** Postgres es la *source of truth*. pgvector permite Matching/Recommendation sin
depender de un vector DB separado (menos superficie, más fácil de auditar).

## 5. Async / Jobs

- **BullMQ** sobre Redis/Valkey para jobs duraderos (notificaciones, pagos, procesamiento de
  documentos).

## 6. Plataforma (engines) y seguridad

- 11 engines como paquetes aislados (ver `03-engines.md`).
- RBAC/ABAC, multi-tenancy, RLS, Zero Trust, cifrado en reposo/tránsito, secretos y auditoría.

**Concreción de componentes clave:**

| Componente | Elección | Motivo |
|---|---|---|
| Identity Provider | **Keycloak** (commercial) / **Keycloak + mTLS/SPIFFE** (sovereign) | OIDC, SAML, federación, 2FA; estándar de gobierno |
| Autorización | **OPA/Rego (o Cerbos)** | ABAC desacoplado del código, auditable |
| Secretos | **OpenBao** + **HSM/KMS** para claves maestras (sovereign) | Sin HSM no se alcanza el estándar de programas de gobierno |
| Broker de eventos | **NATS JetStream** (default) | Ligero, soberano, air-gap friendly; Kafka/Redpanda si escala futura lo exige |
| Supply chain | **SBOM + cosign + Trivy + SLSA** | Requisito de defensa, no decoración |

## 7. Observabilidad

- **OpenTelemetry** como API estándar.
- Backend soberano: **Grafana LGTM** (Loki, Tempo, Mimir) o **SigNoz** — ver `06-observability.md`.

## 8. Ejecución / Sandboxing

- Kubernetes-compatible.
- Sandbox de agentes con **Firecracker o gVisor** para código no confiable.
- Diálogo de imágenes firmadas con policy enforcement (Sigstore / cosign).

## 9. Infraestructura

| Perfil | Componentes |
|---|---|
| Commercial / Pilot | Managed compute + Postgres + Redis/Valkey + Object Storage + K8s managed + CDN/Edge |
| Institutional / Sovereign | K8s propio, Postgres+pgvector, Redis/Valkey, S3-compatible, private networking, cómputo y datos bajo control del cliente, endpoints de modelo locales, observabilidad propia |

## 10. Modelos de IA

- LiteLLM Proxy → NVIDIA NIM-compatible inference / endpoints locales / Qwen / otros aprobados.
- **Modelo agnóstico por arquitectura:** la configuración decide, nunca el código.

## 11. Despliegue

- Docker, Kubernetes, **OpenTofu** (IaC), CI/CD, aislamiento de entornos, despliegue regional.

## 12. Brechas identificadas y decisión

| # | Brecha | Decisión |
|---|---|---|
| 1 | Sin Identity Provider | Keycloak + OPA/Cerbos (+ mTLS/SPIFFE en sovereign) |
| 2 | Broker de eventos genérico | NATS JetStream por defecto |
| 3 | Secretos no concretos | OpenBao + KMS/HSM |
| 4 | Observabilidad genérica | LGTM o SigNoz self-hosted |
| 5 | Supply chain ausente | SBOM, cosign, Trivy, SLSA |
| 6 | Registry privado / air-gap | Harbor (registry) + espejos offline |
| 7 | Pagos / documento inteligentes atados a proveedor | Document Intelligence pluggable; Payment multi-proveedor |

Los ADR asociados viven en `adr/` y son la fuente de verdad para cambios futuros.