resource "cloudflare_workers_custom_domain" "hitori_mahjong" {
  account_id = local.cloudflare_account_id
  zone_name  = local.zone_name
  hostname   = local.custom_domain
  service    = local.worker_name
}
