# ADR-0005 — Multi-tenancy con PostgreSQL RLS

- **Estado:** Aceptado
- **Fecha:** 2026-09-13

## Contexto

Plataforma civil multi-tenant y despliegues soberanos con datos sensibles. El aislamiento entre
tenants debe ser defensivo (no confiar solo en el código de aplicación).

## Decisión

Multi-tenancy por `tenant_id` en cada tabla de negocio, con **PostgreSQL Row Level Security**
como segunda barrera.

- La sesión de base de datos establece `current_setting('app.tenant_id')` por query.
- Las políticas RLS filtran por `tenant_id`.
- La aplicación siempre filtra por tenant; si el filtro falta, RLS bloquea.

## Consecuencias

- Positivas: defensa en profundidad, aislamiento verificable en DB, auditoría más simple.
- Negativas: requiere disciplina en migraciones (toda tabla de negocio con RLS + política), y
  `SET LOCAL` de context por request. Coste por query mínimo.

## Alternativas consideradas

- Un esquema/cluster por tenant: aislamiento máximo pero operación y costo altos; se puede
  habilitar por tenant premium en el futuro, no como default.