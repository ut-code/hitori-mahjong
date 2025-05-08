{
  pkgs ? import <nixpkgs> {},
  nix-prisma-utils ? builtins.getFlake "github:VanCoding/nix-prisma-utils",
}: let
  prisma =
    (nix-prisma-utils.lib.prisma-factory {
      inherit pkgs;
      prisma-fmt-hash = "sha256-atD5GZfmeU86mF1V6flAshxg4fFR2ews7EwaJWZZzbc=";
      query-engine-hash = "sha256-8FTZaKmQCf9lrDQvkF5yWPeZ7TSVfFjTbjdbWWEHgq4=";
      libquery-engine-hash = "sha256-USIdaum87ekGY6F6DaL/tKH0BAZvHBDK7zjmCLo//kM=";
      schema-engine-hash = "sha256-k5MkxXViEqojbkkcW/4iBFNdfhb9PlMEF1M2dyhfOok=";
    }).fromBunLock
    ./bun.lock;
in
  pkgs.mkShell {
    packages = with pkgs; [bun nodejs-slim];
    env = prisma.env;
  }
