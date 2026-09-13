# OpenTofu — Infraestructura como Código

Estructura para desplegar GLC en múltiples proveedores y perfiles.

```
infra/tofu/
  main.tf                # providers + backend remoto (secreto)
  outputs.tf
  variables.tf
  environments/
    commercial/          # perfil Commercial/Pilot
      main.tf
      variables.tf
    sovereign/           # perfil Institutional/Sovereign
      main.tf
      variables.tf
  modules/
    postgres/            # módulo Postgres + pgvector
    redis/               # módulo Redis/Valkey
    object-storage/      # módulo S3-compatible
    k8s/                 # módulo Kubernetes-compatible
```

## Uso

```bash
# Perfil commercial (ej. AWS)
cd infra/tofu/environments/commercial
tofu init
tofu plan -var-file=commercial.tfvars
tofu apply -var-file=commercial.tfvars

# Perfil sovereign (ej. on-prem / vSphere / bare-metal K8s)
cd infra/tofu/environments/sovereign
tofu init
tofu plan -var-file=sovereign.tfvars
```

## Principios

- **Vendor-agnostic:** los módulos exponen inputs estándar (`region`, `vpc_cidr`, `name_prefix`).
- **Secrets:** nunca en `.tfvars`; se leen de OpenBao / KMS / variables de CI.
- **Estado:** remoto y cifrado (S3 backend equivalente o similar según plataforma).
- **Perfiles:** cada entorno declara su propio estado y prioridades de red/residencia.