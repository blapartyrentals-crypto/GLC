# Module: PostgreSQL + pgvector
# Vendor-independent interface; each environment maps it to the platform service.

variable "name_prefix" {
  type = string
}

variable "engine_version" {
  type    = string
  default = "16"
}

variable "size" {
  type    = string
  default = "small"
}

variable "rls_enabled" {
  type    = bool
  default = true
}

resource "terraform_data" "postgres_metadata" {
  input = {
    name        = "${var.name_prefix}-postgres"
    engine      = var.engine_version
    size        = var.size
    rls_enabled = var.rls_enabled
  }
}

output "endpoint" {
  value = "${var.name_prefix}-postgres.internal"
}

output "engine" {
  value = var.engine_version
}

output "metadata" {
  value = terraform_data.postgres_metadata.input
}