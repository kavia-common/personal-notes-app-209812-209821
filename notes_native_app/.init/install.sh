#!/usr/bin/env bash
set -euo pipefail
WORKSPACE="/home/kavia/workspace/code-generation/personal-notes-app-209812-209821/notes_native_app"
cd "$WORKSPACE"
command -v node >/dev/null 2>&1 || { echo "node missing" >&2; exit 2; }
command -v npm >/dev/null 2>&1 || { echo "npm missing" >&2; exit 3; }
# detect native sqlite bindings robustly using jq or node
NEEDS_NATIVE=false
if [ -f package.json ]; then
  if command -v jq >/dev/null 2>&1; then
    if jq -e '.dependencies + .devDependencies | to_entries[]?.key' package.json >/dev/null 2>&1; then
      if jq -r '(.dependencies // {}) + (.devDependencies // {}) | keys[]' package.json 2>/dev/null | grep -E "better-sqlite3|sqlite3|node-sqlite3|node-gyp" >/dev/null 2>&1; then NEEDS_NATIVE=true; fi
    fi
  else
    # fallback to node-based parse to reduce false positives
    if node -e "const p=require('./package.json'); const ks=Object.keys(Object.assign({},p.dependencies||{},p.devDependencies||{})); console.log(ks.join('\n'))" 2>/dev/null | grep -E "better-sqlite3|sqlite3|node-sqlite3|node-gyp" >/dev/null 2>&1; then NEEDS_NATIVE=true; fi
  fi
fi
# Install native headers only when needed
if [ "$NEEDS_NATIVE" = true ]; then
  PKGS=()
  for p in libsqlite3-dev python3-dev; do dpkg -s "$p" >/dev/null 2>&1 || PKGS+=("$p"); done
  if [ ${#PKGS[@]} -gt 0 ]; then sudo apt-get update -q && sudo apt-get install -yq "${PKGS[@]}"; fi
fi
# Install node deps reproducibly
if [ -f package.json ]; then
  if [ -f package-lock.json ]; then npm ci --no-audit --no-fund --silent || { echo "npm ci failed" >&2; exit 4; }; else npm i --no-audit --no-fund --silent || { echo "npm install failed" >&2; exit 5; }; fi
fi
# Prepare sqlite DB
mkdir -p "$WORKSPACE/data"
if [ ! -f "$WORKSPACE/data/notes.db" ]; then
  command -v sqlite3 >/dev/null 2>&1 || { echo "sqlite3 CLI missing; please install sqlite3" >&2; exit 6; }
  sqlite3 "$WORKSPACE/data/notes.db" "CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY, title TEXT, body TEXT, updated_at DATETIME);" || { echo "sqlite3 DB init failed" >&2; exit 7; }
fi
# Avoid unnecessary chown
WS_UID=$(stat -c %u "$WORKSPACE")
CUR_UID=$(id -u)
if [ "$WS_UID" -ne "$CUR_UID" ]; then sudo chown -R $(id -u):$(id -g) "$WORKSPACE/data" || true; fi

echo "DEPS_OK"
