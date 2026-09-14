variable "region" {
  type    = string
  # OVHcloud regions: GRA (Gravelines), SBG (Strasbourg), WAW (Warsaw), BHS (Beauharnois), etc.
  default = "GRA9"
}

variable "postgres_version" {
  type    = string
  default = "16"
}