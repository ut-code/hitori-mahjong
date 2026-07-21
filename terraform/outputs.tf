output "d1_database_id" {
  description = "D1 database UUID; must match wrangler.jsonc's d1_databases[].database_id"
  value       = cloudflare_d1_database.hitori_mahjong.id
}

output "custom_domain_id" {
  description = "Immutable ID of the Workers custom domain binding"
  value       = cloudflare_workers_custom_domain.hitori_mahjong.id
}
