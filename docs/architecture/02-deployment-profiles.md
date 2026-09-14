# Perfiles de Despliegue

## 1. Modelo conceptual

Un solo código, múltiples "perfiles". Un perfil es una **configuración de infraestructura y
operación** que resuelve los mismos contratos de aplicación con distinta política.

```
          ONE GLC CODEBASE
                 │
  ┌──────────────┼───────────────┐
  │              │               │
Commercial   Institutional   Sovereign
(público)   (gobierno civil) (defensa / crítica)
```

## 2. Commercial / Pilot

- **Objetivo:** validar producto, on-board de usuarios civiles, escala elástica.
- **Compute:** managed (OVHcloud Managed Kubernetes, AKS/EKS/GKE o equivalente).
- **DB:** managed PostgreSQL (con `pgvector` y `row level security` habilitados).
- **Cache/Jobs:** managed Redis/Valkey.
- **Objetos:** managed S3-compatible + CDN/Edge.
- **Identidad:** Keycloak Hosted o managed OIDC.
- **Modelos:** LiteLLM → proveedor comercial (falta elegir proveedor según mercado).
- **Observabilidad:** backend del proveedor o self-hosted según datos.

## 3. Institutional / Sovereign

- **Objetivo:** operar bajo cumplimiento normativo de una jurisdicción; datos sensibles de
  ciudadanos e instituciones.
- **Compute:** Kubernetes propio, private networking, nodos dedicados.
- **DB:** PostgreSQL + pgvector *self-hosted* con backups cifrados.
- **Cache/Jobs:** Redis/Valkey self-hosted.
- **Objetos:** S3-compatible on-prem (MinIO/CEPH) o región soberana del proveedor.
- **Identidad:** Keycloak + OPA/Rego; **mTLS/SPIFFE** para servicios.
- **Secretos:** OpenBao; claves maestras en **HSM/KMS**.
- **Modelos:** LiteLLM → **NVIDIA NIM-compatible** o **Qwen** / modelos aprobados, en nodos de
  inferencia propia con datos que no abandonan la jurisdicción.
- **Observabilidad:** LGTM o SigNoz self-hosted, con **audit log inmutable** (append-only).
- **Registry:** Harbor privado + espejo de imágenes para operar **sin internet** (air-gap).

### 3.1 Particularidades de nivel Defensa

1. **Identidad de máquina:** SPIFFE/SPIRE (mTLS) — los servicios se declaran y verifican
   mutuamente.
2. **Cifrado:** tránsito TLS ≥ 1.3; reposo AES-256 con claves bajo HSM; rotación periódica.
3. **Residencia:** los datos y su backup no salen de la jurisdicción designada.
4. **Auditoría:** logs con *append-only / tamper-evident*; exportación a SIEM soberano.
5. **Cadena de suministro:** SLSA nivel ≥ 2; imágenes firmadas; SBOM verificable; escaneo Trivy.
6. **Procesamiento de IA:** modelos en infraestructura aislada, con *no-egress* del dato.

## 4. Lo que se debe mantener constante

- Contratos de los engines (`@glc/contracts`).
- Lógica de negocio (reglas, elegibilidad, riesgo).
- Formato de eventos y mensajes.
- Esquema de multi-tenancy (tenant id en cada fila / RLS).

## 5. Lo que cambia por perfil

| Variable | Commercial | Sovereign |
|---|---|---|
| Proveedor de identidad | Hosted / Keycloak | Keycloak + SPIFFE |
| Broker | NATS | NATS (air-gap) |
| Modelos | Comercial | Local / NIM / Qwen |
| Observabilidad | Proveedor | LGTM/SigNoz propio |
| Secretos | Managed | OpenBao + HSM |
| Cómputo | Managed | K8s propio / nodos dedicados |
| Registro de imágenes | Managed | Harbor + espejo offline |

## 6. Estrategia de entornos

- `local` — Docker Compose (ver `infra/compose`).
- `dev` / `staging` — perfil Commercial en K8s.
- `prod-sovereign` — perfil Institutional/Sovereign con IaC dedicado.
- `Workspace/CI` — CPU acotada, sin datos reales, con secrets de prueba.