# ADR-0001 — Monorepo con Turborepo + pnpm

- **Estado:** Aceptado
- **Fecha:** 2026-09-13

## Contexto

El stack requiere un solo repositorio que contenga frontend, backend, agents, engines y
configuraciones compartidas, desplegable en varios perfiles. Se necesita aislamiento de builds,
caché, tipados compartidos y un único estándar de calidad.

## Decisión

Monorepo gestionado con **pnpm workspaces** y orquestado por **Turborepo**.

- Workspaces: `apps/*`, `packages/*`, `engines/*`, `agents/*`.
- Paquete de presets `@glc/tsconfig`.
- Paquete `@glc/contracts` como contrato único de tipos y eventos.

## Consecuencias

- Positivas: un `pnpm install`, caché de tareas, `turbo run build` en cascada.
- Negativas: requiere disciplina de límites de dependencias (engines no deben importar entre
  sí si no pasa por contratos). `pnpm` es determinista y rápido.
- Mitigación: reglas de imports por paquete en ESLint (futuro) y revisión en PR.

## Alternativas consideradas

- Nx: potente pero más opinado y pesado para la fase actual.
- Bazel: sobredimensionado para el equipo 1 que inicia GLC.