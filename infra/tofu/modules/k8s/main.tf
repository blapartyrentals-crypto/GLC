# Module: Kubernetes-compatible cluster
# In commercial: managed (EKS/GKE/AKS). In sovereign: on-prem / vSphere / bare-metal.

variable "name_prefix" {
  type = string
}

variable "sovereign" {
  type    = bool
  default = false
}

resource "terraform_data" "k8s_metadata" {
  input = {
    name      = "${var.name_prefix}-k8s"
    sovereign = var.sovereign
  }
}

output "cluster_name" {
  value = "${var.name_prefix}-k8s"
}

output "metadata" {
  value = terraform_data.k8s_metadata.input
}