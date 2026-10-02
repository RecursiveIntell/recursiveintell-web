#!/usr/bin/env bash
# Retired endpoint: visibly forward old full-install commands to Ares.
set -euo pipefail
printf '%s\n' '[Ares] The Hermes installer has been retired. Installing Ares with full defaults.'
args=()
for argument in "$@"; do
  case "$argument" in
    --with-josh-setup|--with-all-mcp|--with-semantic-memory|--with-agent-graph|--with-claim-ledger|--with-cea-graph|--with-pilot-bridge)
      printf '%s\n' "[Ares] $argument is now covered by Ares full defaults." ;;
    --skip-rust)
      printf '%s\n' '[Ares] --skip-rust is unsupported: full Ares requires Rust enhancements. Use --minimal to omit all enhancements, or remove --skip-rust for full defaults.' >&2
      exit 1 ;;
    --no-venv)
      printf '%s\n' '[Ares] --no-venv is unsupported: Ares requires a managed Python runtime. Remove --no-venv and rerun.' >&2
      exit 1 ;;
    *) args+=("$argument") ;;
  esac
done
installer=$(mktemp)
trap 'rm -f "$installer"' EXIT
curl -fsSL https://recursiveintell.com/ares/install.sh -o "$installer"
bash "$installer" "${args[@]}"
