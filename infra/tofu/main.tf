# OpenTofu configuration — GLC platform baseline.
# Providers are declared per environment; this file holds root-level settings.

terraform {
  required_version = ">= 1.6"

  # Uncomment when a remote backend is available per profile:
  # backend "s3" { ... }   # commercial
  # backend "local" { ... }# sovereign (or an on-prem-equivalent)
}

variable "name_prefix" {
  description = "Prefix for all resource names"
  type        = string
  default     = "glc"
}

variable "region" {
  description = "Deployment region / jurisdiction"
  type        = string
  default     = "us-east-1"
}

variable "profile" {
  description = "Deployment profile: commercial | sovereign"
  type        = string
  default     = "commercial"
}

variable "residency_required" {
  description = "Enforce data residency (sovereign profile)"
  type        = bool
  default     = false
}

output "platform" {
  value = {
    profile    = var.profile
    residency  = var.residency_required
    name_prefix = var.name_prefix
  }
}