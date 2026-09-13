# GLC — repository memory

## Commands (from repo root)

- `pnpm install` — install workspace deps (pnpm 12.4.1, Node >=22).
- `pnpm lint` — ESLint flat config across all 16 packages.
- `pnpm typecheck` — `tsc --noEmit` per package.
- `pnpm test` — vitest (all packages; API switched away from jest).
- `pnpm build` — tsc for packages/engines, nest build for API, next build for web.
- `pnpm dev` — dev servers (turbo persistent tasks).
- `scripts/validate.sh` — run the full validation (lint → typecheck → test → build).

## Conventions

- Engine layout: `src/domain/contracts.ts` (types) + optionally `src/domain/rules.ts`,
  `src/application/service.ts` (use case layer), `src/index.ts` re-exports.
- Engines expose `EngineService`/named service classes with:
  - `health(input)` returning `{ ok, engine }` with a string-literal engine id.
  - Constructor ports: optional `publishEvent: (event: DomainEvent) => Promise<void>`
    (default no-op) and a repository interface where persistence is needed.
  - Events via `eventSubject("type.name")` from `@glc/contracts`, published with
    `{ id, type, version, tenantId, traceId, actor, occurredAt, payload }`.
  - Test files are `src/application/*.test.ts` run with vitest.
- ESLint ignores `dist/` artifacts via a top-level flat `ignores` block. Never lint
  generated files (`next-env.d.ts`, `.next/`, `dist/`).
- esbuild build approved in `pnpm-workspace.yaml` (`onlyBuiltDependencies`); do not
  re-approve other packages' postinstall scripts.
- Use `randomUUID` from `node:crypto` for ids. Engine ids are string literals, not
  `import.meta` env lookups.
- Money in minor units only (payment engine). Tenancy via `tenantId` on every entity/event.
- `turbo.json` `build` outputs include `.next/**` for web; do not set `outputs` on
  tasks that emit nothing (test) to avoid cache warnings.

## Multi-profile principle

ONE codebase → Commercial / Institutional / Sovereign deployment profiles.
Profile is read from `GLC_PROFILE` env (default `commercial`) in `packages/engine-runtime`.
New features must stay profile-agnostic; differences live in configuration, not forks.

## infra

- SQL migrations in `infra/db/migrations/` (base multi-tenant schema with RLS pattern).
- Leave `dist/`, `.turbo/`, node_modules, `.env*` untracked.