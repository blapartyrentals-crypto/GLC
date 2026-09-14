# Module: S3-compatible Object Storage (MinIO on-prem / OVHcloud Object Storage)

variable "name_prefix" {
  type = string
}

variable "bucket_name" {
  type = string
}

resource "terraform_data" "object_storage_metadata" {
  input = {
    bucket  = var.bucket_name
    prefix  = var.name_prefix
  }
}

output "bucket" {
  value = var.bucket_name
}

output "metadata" {
  value = terraform_data.object_storage_metadata.input
}