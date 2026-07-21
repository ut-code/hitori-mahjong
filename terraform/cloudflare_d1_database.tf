resource "cloudflare_d1_database" "hitori_mahjong" {
  account_id = local.cloudflare_account_id
  name       = "hitori-mahjong-db"

  read_replication = {
    mode = "disabled"
  }
}
