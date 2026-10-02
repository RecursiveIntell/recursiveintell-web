#!/usr/bin/env bash
# Retired endpoint: visibly forward old full-install commands to Ares.
set -euo pipefail
printf '%s\n' '[Ares] The Hermes installer has been retired. Installing Ares with full defaults.'
args=()
for argument in "$@"; do
  case "$argument" in
    --with-josh-setup|--with-all-mcp) printf '%s\n' "[Ares] $argument is now covered by Ares full defaults." ;;
    *) args+=("$argument") ;;
  esac
done
installer=$(mktemp)
trap 'rm -f "$installer"' EXIT
curl -fsSL https://recursiveintell.com/ares/install.sh -o "$installer"
bash "$installer" "${args[@]}"
