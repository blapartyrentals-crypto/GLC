# Perfil Commercial / Pilot
# Provider default de ejemplo: AWS. Se puede cambiar por el proveedor comercial elegido.

terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

module "postgres" {
  source       = "../../modules/postgres"
  name_prefix  = "glc"
  engine_version = var.postgres_version
}

module "redis" {
  source      = "../../modules/redis"
  name_prefix = "glc"
}

module "object_storage" {
  source      = "../../modules/object-storage"
  name_prefix = "glc"
  bucket_name = "glc-assets-commercial"
}

module "k8s" {
  source      = "../../modules/k8s"
  name_prefix = "glc"
  sovereign   = false
}

output "commercial_endpoints" {
  value = {
    postgres = module.postgres.endpoint
    redis    = module.redis.endpoint
    bucket   = module.object_storage.bucket
    k8s      = module.k8s.cluster_name
  }
}