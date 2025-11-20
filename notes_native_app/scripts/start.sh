#!/usr/bin/env bash
set -euo pipefail
# Resolve workspace root; default to script's parent if helper file is absent.
WORKSPACE=${WORKSPACE_ENV:-$(cat "$(dirname "$0")/../.workspace_root" 2>/dev/null || echo "$(cd "$(dirname "$0")/.." && pwd)")}
cd "$WORKSPACE"
if [ ! -f package.json ] || ! command -v npm >/dev/null 2>&1; then
  echo "Missing package.json or npm; cannot start" >&2; exit 4
fi
# Use non-interactive start for CI/preview systems. No backgrounding or '&' used.
exec npm run start:ci
