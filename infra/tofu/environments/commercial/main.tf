# Perfil Commercial / Pilot
# Provider: OVHcloud (US data centres, S3-compatible Object Storage, managed K8s).
# Credentials via OVH_APPLICATION_KEY / OVH_APPLICATION_SECRET / OVH_CONSUMER_KEY env vars.

terraform {
  required_version = ">= 1.6"
  required_providers {
    ovh = {
      source  = "ovh/ovh"
      version = "~> 1.6"
    }
  }
}

provider "ovh" {
  endpoint = var.ovh_endpoint
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