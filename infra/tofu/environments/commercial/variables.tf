variable "ovh_endpoint" {
  type    = string
  description = "OVHcloud API endpoint: ovh-eu | ovh-us | ovh-ca"
  default = "ovh-us"
}

variable "region" {
  type    = string
  # OVHcloud US regions example: US-EAST-VA-1, US-WEST-OR-1, US-CENTRAL-IA-1
  default = "US-EAST-VA-1"
}

variable "postgres_version" {
  type    = string
  default = "16"
}