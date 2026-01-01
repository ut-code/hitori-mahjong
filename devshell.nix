{ pkgs }:
pkgs.mkShell {
  # Add build dependencies
  packages = with pkgs; [
    bun
  ];

  # Add environment variables
  env = { };

  # Load custom bash code
  shellHook = ''

  '';
}
