#!/usr/bin/env bash
set -euo pipefail
WORKSPACE="/home/kavia/workspace/code-generation/personal-notes-app-209812-209821/notes_native_app"
cd "$WORKSPACE"
PID_FILE=".init/start.pid"
mkdir -p .init
# Launch project start script (project-local scripts/start.sh or npm run start)
if [ -x "${WORKSPACE}/scripts/start.sh" ]; then
  # Start in new process group so we can signal the group
  ( setsid bash -c "${WORKSPACE}/scripts/start.sh" ) &
  PID=$!
  echo "$PID" > "$PID_FILE"
  echo "STARTED_PID:$PID"
else
  if command -v npm >/dev/null 2>&1 && grep -q "\"start\"\s*:\s*" package.json 2>/dev/null || true; then
    ( setsid npm run start --silent ) &
    PID=$!
    echo "$PID" > "$PID_FILE"
    echo "STARTED_PID:$PID"
  else
    echo "No start script found (scripts/start.sh or npm start); nothing started" >&2
    exit 3
  fi
fi
