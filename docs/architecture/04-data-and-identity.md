# Datos e Identidad

## 1. Persistencia

- **PostgreSQL (source of truth)** con extensiones obligatorias: `pgvector`, y RLS habilitado
  por defecto en tablas de negocio.
- **Redis/Valkey** para cache + comandos del bus de jobs (BullMQ).
- **S3-compatible** para objetos (documentos, evidencias, adjuntos).

## 2. Multi-tenancy

Modelo de referencia: **todos los datos de negocio llevan `tenant_id`**. El middleware de
autenticación resuelve el tenant desde el token OIDC y lo inyecta en cada query. RLS actúa como
**red de seguridad** a nivel de fila:

- Cada tabla de negocio tiene política RLS limitando por `tenant_id`.
- La aplicación **siempre** filtra por tenant; RLS es la segunda barrera (defensa en
  profundidad).

### Tablas críticas y RLS (borrador)

| Tabla | Política RLS |
|---|---|
| `profiles` | `tenant_id = current_setting('app.tenant_id')` |
| `identities` | `tenant_id = current_setting('app.tenant_id')` |
| `eligibility_decisions` | `tenant_id = current_setting('app.tenant_id')` |
| `risk_scores` | `tenant_id = current_setting('app.tenant_id')` |

## 3. Modelo de identidad

- **Usuarios:** OIDC (Keycloak) con MFA/2FA.
- **Servicios:** identidad de máquina mTLS/SPIFFE (sovereign).
- **Tokens:** JWT firmados (corto plazo); refresh tokens rotados.
- **Autorización:** RBAC + ABAC. ABAC evaluado en **OPA/Rego** (o Cerbos) mediante políticas
  centralizadas, versionadas y auditables.

### Roles mínimo viable (borrador)

`citizen_admin` · `program_operator` · `field_agent` · `partner` · `auditor` · `super_admin`

## 4. Secretos y claves

- **OpenBao** como gestor de secretos (desarrollo/producción autoservicio).
- Claves maestras de cifrado en **KMS del proveedor** (commercial) o **HSM** (sovereign).
- Rotación programada; *encryption at rest* con AES-256; *in transit* con TLS ≥ 1.3.

## 5. Ciclo de vida de datos

- `retention_policy` por tipo de dato.
- Backups cifrados en repositorio soberano.
- `hard-delete` / `soft-delete` según tipo (identidades: soft con anonimización).

## 6. Auditoría

- Logs de acceso, cambios y autorizaciones en tabla `audit_log` (append-only).
- Exportación a SIEM soberano en perfil defensa.