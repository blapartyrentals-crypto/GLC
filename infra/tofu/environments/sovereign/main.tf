# Perfil Institutional / Sovereign
# Requiere implementar el proveedor objetivo (on-prem / vSphere / bare-metal K8s / nube soberana).

terraform {
  required_version = ">= 1.6"
  required_providers {
    terracurl = {
      source  = "devops-rob/terracurl"
      version = "~> 1.2"
    }
  }
}

# Plantilla de recursos con `terraform_data` (vendor-agnostic) para representar la topología
# soberana: cómputo, datos, modelos y observabilidad dentro de la jurisdicción.
module "postgres" {
  source         = "../../modules/postgres"
  name_prefix    = "glc"
  engine_version = var.postgres_version
}

module "object_storage" {
  source      = "../../modules/object-storage"
  name_prefix = "glc"
  bucket_name = var.sovereign_bucket
}

module "k8s" {
  source      = "../../modules/k8s"
  name_prefix = "glc"
  sovereign   = true
}

output "sovereign_endpoints" {
  value = {
    postgres = module.postgres.endpoint
    bucket   = module.object_storage.bucket
    k8s      = module.k8s.cluster_name
    note     = "All components must live inside the target jurisdiction / network."
  }
}