resource "cloudflare_d1_database" "mahjong" {
  account_id = var.cloudflare_account_id
  name       = "hitori-mahjong-db"

  read_replication = {
    mode = "disabled"
  }
}

resource "cloudflare_workers_custom_domain" "mahjong" {
  account_id = var.cloudflare_account_id
  zone_name  = var.zone_name
  hostname   = var.custom_domain
  service    = var.worker_name
}
