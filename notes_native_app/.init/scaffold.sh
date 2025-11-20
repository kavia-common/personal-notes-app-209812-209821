#!/usr/bin/env bash
set -euo pipefail
WORKSPACE="/home/kavia/workspace/code-generation/personal-notes-app-209812-209821/notes_native_app"
mkdir -p "$WORKSPACE" && cd "$WORKSPACE"
# write canonical workspace marker consumed by generated scripts
echo "$WORKSPACE" > .workspace_root
# create minimal package.json if missing
if [ ! -f package.json ]; then cat > package.json <<'JSON'
{ "name": "notes_native_app", "version": "0.1.0", "private": true, "scripts": { "test": "jest --passWithNoTests" } }
JSON
fi
mkdir -p scripts
# Build script reads WORKSPACE from env or .workspace_root
cat > scripts/build_android.sh <<'BASH'
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
BASH
chmod +x scripts/build_android.sh
# Start script fails fast if prerequisites missing
cat > scripts/start.sh <<'BASH'
#!/usr/bin/env bash
set -euo pipefail
WORKSPACE=${WORKSPACE_ENV:-$(cat "$(dirname "$0")/../.workspace_root" 2>/dev/null || echo "")}
[ -n "$WORKSPACE" ] || { echo "WORKSPACE not set; export WORKSPACE or create .workspace_root" >&2; exit 2; }
cd "$WORKSPACE"
if [ ! -f package.json ] || ! command -v npm >/dev/null 2>&1; then
  echo "Missing package.json or npm; cannot start" >&2; exit 4
fi
exec npm run start
BASH
chmod +x scripts/start.sh
# persist NODE_ENV for this project (non-invasive global file named for project)
sudo bash -c 'cat > /etc/profile.d/node_env_notes_native_app.sh <<"EOF"
# Node env for notes_native_app (export only if not already set)
if [ -z "${NODE_ENV:-}" ]; then export NODE_ENV=development; fi
EOF'
sudo chmod 644 /etc/profile.d/node_env_notes_native_app.sh
 echo "SCAFFOLD_OK"
