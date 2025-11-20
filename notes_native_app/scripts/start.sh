#!/usr/bin/env bash
set -euo pipefail
WORKSPACE=${WORKSPACE_ENV:-$(cat "$(dirname "$0")/../.workspace_root" 2>/dev/null || echo "")}
[ -n "$WORKSPACE" ] || { echo "WORKSPACE not set; export WORKSPACE or create .workspace_root" >&2; exit 2; }
cd "$WORKSPACE"
if [ ! -f package.json ] || ! command -v npm >/dev/null 2>&1; then
  echo "Missing package.json or npm; cannot start" >&2; exit 4
fi
exec npm run start
