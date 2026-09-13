# Infraestructura GLC

Un solo codebase, múltiples perfiles de despliegue (ADR-0002).

| Perfil | Objetivo | Provisión | Orquestación |
| --- | --- | --- | --- |
| `local` | Dev en laptop | Docker Compose | — |
| `commercial` | Piloto / SaaS | OpenTofu (AWS) | Helm |
| `sovereign` | Institucional / defensa | OpenTofu (on-prem) | Helm |

## Primeros pasos (local)

```bash
cd infra/compose
cp .env.example .env
docker compose up -d
docker compose ps
```

## Estructura

```
infra/
  compose/           # stack de desarrollo local
  tofu/              # IaC vendor-agnostic + entornos
  helm/glc/          # chart Helm base con perfiles
  db/                # migraciones SQL compartidas
```

## Principios

- **Misma imagen, mismo manifiesto**: los perfiles solo cambian valores, no código de aplicación.
- **Secrets vía OpenBao** (nunca en repositorio).
- **Estado de OpenTofu** remoto y cifrado por entorno.
- **Red**: en sovereign el egress externo está bloqueado por defecto (NetworkPolicy).