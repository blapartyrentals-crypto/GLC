# ADR-0009 — Infraestructura inicial: Compose + OpenTofu/Helm

- **Estado:** Aceptado
- **Fecha:** 2026-09-13

## Contexto

Para iterar con el monorepo hace falta un entorno local reproducible y una semilla de
infraestructura por perfil.

## Decisión

- **Docker Compose** para entorno local (`infra/compose`): Postgres+pgvector, Redis/Valkey,
  MinIO (S3), NATS, Keycloak, OpenBao y LiteLLM.
- **OpenTofu** para IaC multi-proveedor (`infra/tofu`), con módulos reutilizables y entornos
  `commercial` y `sovereign`.
- **Helm charts** para desplegar en clusters Kubernetes/KIND (`infra/helm/glc`).

## Consecuencias

- Positivas: desarrollo local con un comando; config vendor-agnostic; camino a cloud y on-prem.
- Negativas: mantener tres capas (compose/tofu/helm) requiere coordinación; se mitiga
  centralizando contrato de variables en un único `values` con esquema.

## Alternativas consideradas

- Docker Compose + scripts manuales para prod: insostenible para soberanía.
- Pulumi/CDK: potentes, pero para arrancar OpenTofu da compatibilidad Terraform y menor fricción
  con el equipo.