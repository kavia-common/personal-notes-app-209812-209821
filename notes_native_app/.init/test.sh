#!/usr/bin/env bash
set -euo pipefail
WORKSPACE="/home/kavia/workspace/code-generation/personal-notes-app-209812-209821/notes_native_app"
cd "$WORKSPACE"
# If package-lock exists, use npm ci to install deps otherwise skip
if [ -f package-lock.json ]; then
  npm ci --no-audit --no-fund --silent || { echo "npm ci failed" >&2; exit 4; }
fi
# Run jest if present in package.json or available globally
if grep -q "jest" package.json 2>/dev/null || command -v jest >/dev/null 2>&1; then
  if [ -f node_modules/.bin/jest ]; then
    node_modules/.bin/jest --runInBand --silent || { echo "jest tests failed" >&2; exit 5; }
  else
    jest --runInBand --silent || { echo "jest tests failed" >&2; exit 5; }
  fi
else
  echo "No jest configured; skipping tests"
fi
