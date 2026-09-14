# GLC — Arquitectura de Referencia

> **Estado:** v0.1 (draft)
> **Principio rector:** ONE GLC CODEBASE → MULTIPLE DEPLOYMENT PROFILES

## 1. Propósito

GLC (Global Life Change) es una plataforma orientada a operar con dos grandes familias de
despliegue:

| Perfil | Carga | Características |
|---|---|---|
| **Commercial** | Civil (alta demanda, multi-tenant) | Managed cloud, time-to-market, escala horizontal |
| **Institutional / Sovereign** | Institucional y defensa (datos sensibles) | Residencia de datos, control de claves, air-gap posible, modelos locales |

Un mismo código de aplicación debe poder desplegarse en cualquiera de los perfiles sin
reescribir lógica de negocio. **Lo que cambia entre perfiles es la configuración de
infraestructura, el broker de eventos, el motor de identidad, los modelos y el backend de
observabilidad**, no el código de los engines.

## 2. Principios arquitectónicos

1. **Portabilidad de la lógica de negocio.** Los engines son agnósticos a la infraestructura.
2. **Multi-tenancy de primera clase.** Aislamiento a nivel de fila (PostgreSQL RLS) más
   políticas RBAC/ABAC en un motor de autorización externo.
3. **Zero Trust.** Cada servicio se autentica con identidad de máquina (mTLS/SPIFFE en
   perfiles soberanos); cada petición de usuario requiere autenticación y autorización.
4. **Eventos como contratos versionados.** Los eventos publicados tienen esquema y
   compatibilidad hacia atrás.
5. **Modelo agnóstico.** La capa de IA es sustituible vía LiteLLM Proxy (local, NVIDIA NIM,
   Qwen, o proveedor comercial).
6. **Soberanía de datos.** El perfil Sovereign puede operar con control total de datos,
   claves, cómputo y observabilidad dentro de la jurisdicción requerida.
7. **Supply chain protegida.** SBOM, firma de imágenes, escaneo de vulnerabilidades y
   pipeline auditado (ver `05-security.md`).

## 3. Vistas de arquitectura

- `01-stack.md` — Stack canónico validado, capas y decisiones clave.
- `02-deployment-profiles.md` — Diferencias operativas entre Commercial e Institutional/Sovereign.
- `03-engines.md` — Los 11 engines y sus contratos.
- `04-data-and-identity.md` — Persistencia, multi-tenancy, RLS, identidad y secretos.
- `05-security.md` — Modelo de amenazas, supply chain, cumplimiento.
- `06-observability.md` — OTel, logs, métricas y trazas soberanas.
- `adr/` — Architecture Decision Records (registro de decisiones trazable).