{ pkgs, ... }:

{
  packages = with pkgs; [ bun ];
  languages.typescript.enable = true;
}
