# ADR-0008 — Proveedor de identidad Keycloak + OPA para ABAC

- **Estado:** Aceptado
- **Fecha:** 2026-09-13

## Contexto

El stack requiere RBAC/ABAC, multi-tenancy y Zero Trust, pero no declara un proveedor de
identidad ni un motor de autorización. Sin ellos, "RBAC/ABAC" queda en el aire y la auditoría
de acceso es manual.

## Decisión

- **Keycloak** como Identity Provider (OIDC, SAML, MFA/2FA, federación).
- **OPA/Rego** (o Cerbos) como motor de autorización ABAC, con políticas versionadas y
  desacopladas del código de aplicación.
- En perfil Sovereign: **mTLS/SPIFFE (SPIRE)** para identidad de máquina entre servicios.

## Consecuencias

- Positivas: autorización auditable y consistente; multi-tenancy resuelto a nivel de token
  (claims) y RL; estándar reconocido por equipos de gobierno.
- Negativas: Keycloak y OPA son componentes a operar (HA, versionado de políticas). Mitigación:
  Keycloak como servicio manejado en commercial; OPA con bundles versionados en CI.

## Alternativas consideradas

- Auth0/Cognito: rápidos pero reducen soberanía en perfil defensa.
- Autorización vanilla en NestJS guards: rápido pero dispersa lógica y no es auditable a escala.