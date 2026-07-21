variable "cloudflare_account_id" {
  description = "Cloudflare account ID that owns this project's resources"
  type        = string
  default     = "df6c3acd32f66bd1eb95e50607684297"
}

variable "worker_name" {
  description = "Name of the deployed Worker (must match wrangler.jsonc's `name`)"
  type        = string
  default     = "hitori-mahjong"
}

variable "custom_domain" {
  description = "Custom domain routed to the Worker"
  type        = string
  default     = "mahjong.utcode.net"
}

variable "zone_name" {
  description = "Cloudflare zone containing the custom domain"
  type        = string
  default     = "utcode.net"
}
