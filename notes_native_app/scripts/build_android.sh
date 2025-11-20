#!/usr/bin/env bash
set -euo pipefail
WORKSPACE=${WORKSPACE_ENV:-$(cat "$(dirname "$0")/../.workspace_root" 2>/dev/null || echo "")}
[ -n "$WORKSPACE" ] || { echo "WORKSPACE not set; export WORKSPACE or create .workspace_root" >&2; exit 2; }
cd "$WORKSPACE"
if [ -x "$WORKSPACE/gradlew" ]; then
  exec "$WORKSPACE/gradlew" -p "$WORKSPACE" assembleRelease --no-daemon
else
  echo "ERROR: Gradle wrapper (gradlew) not found in project root. Add the wrapper or provide system gradle." >&2
  exit 3
fi
