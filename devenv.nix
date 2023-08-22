{ pkgs, ... }:

let
  bun = pkgs.bun.overrideAttrs (oldAttrs: rec {
        version = "0.7.3";
      });
in
{
  packages = with pkgs; [ bun ];
  languages.typescript.enable = true;
}
