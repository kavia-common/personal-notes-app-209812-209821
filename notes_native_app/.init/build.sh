#!/usr/bin/env bash
set -euo pipefail
WORKSPACE="/home/kavia/workspace/code-generation/personal-notes-app-209812-209821/notes_native_app"
cd "$WORKSPACE"
# Use gradlew if present, otherwise skip (per requirements, do not install gradle here)
if [ -x "${WORKSPACE}/gradlew" ] || command -v gradle >/dev/null 2>&1; then
  if [ -x "${WORKSPACE}/gradlew" ]; then
    "${WORKSPACE}/gradlew" -p "$WORKSPACE" assembleRelease --no-daemon || { echo "Gradle build failed" >&2; exit 2; }
  else
    gradle -p "$WORKSPACE" assembleRelease --no-daemon || { echo "Gradle build failed" >&2; exit 2; }
  fi
else
  echo "No gradle wrapper or system gradle; skipping Android build" >&2
fi
