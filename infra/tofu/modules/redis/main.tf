# Module: Redis / Valkey (cache + jobs)

variable "name_prefix" {
  type = string
}

variable "size" {
  type    = string
  default = "small"
}

resource "terraform_data" "redis_metadata" {
  input = {
    name = "${var.name_prefix}-cache"
    size = var.size
  }
}

output "endpoint" {
  value = "${var.name_prefix}-cache.internal"
}

output "metadata" {
  value = terraform_data.redis_metadata.input
}