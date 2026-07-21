terraform {
  required_version = ">= 1.5.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

# Reads the token from the CLOUDFLARE_API_TOKEN environment variable.
# export CLOUDFLARE_API_TOKEN=... before running terraform commands.
provider "cloudflare" {}
