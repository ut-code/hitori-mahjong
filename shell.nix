{
  pkgs ? import <nixpkgs> {},
  nix-prisma-utils ? builtins.getFlake "github:VanCoding/nix-prisma-utils",
}: let
  prisma =
    (nix-prisma-utils.lib.prisma-factory {
      inherit pkgs;
      prisma-fmt-hash = "sha256-ROsmQvRXtpClfj/de8hifTc4FVCMNT7u2Qwie+G7l1Y=";
      query-engine-hash = "sha256-bIkXzxjR7exW1US2XJAFedpCo7huuDjDIUE4bGmSSs0=";
      libquery-engine-hash = "sha256-8VL8/jmWR325PXFwrzIoNSTtRxiQ9SXDjXoUmfeVxgU=";
      schema-engine-hash = "sha256-jSM/yfKACWAFwmbXDDL9VO1oGIiILyYDFXXTfcSWbwA=";
    }).fromBunLock
    ./bun.lock;
in
  pkgs.mkShell {
    packages = with pkgs; [bun nodejs-slim];
    env = prisma.env;
  }
