#!/usr/bin/env bash
set -euo pipefail
WORKSPACE="/home/kavia/workspace/code-generation/personal-notes-app-209812-209821/notes_native_app"
cd "$WORKSPACE"
# 1) Build
if [ -x "${WORKSPACE}/gradlew" ] || command -v gradle >/dev/null 2>&1; then
  if [ -x "${WORKSPACE}/gradlew" ]; then
    "${WORKSPACE}/gradlew" -p "$WORKSPACE" assembleRelease --no-daemon || { echo "Gradle build failed" >&2; exit 2; }
  else
    gradle -p "$WORKSPACE" assembleRelease --no-daemon || { echo "Gradle build failed" >&2; exit 2; }
  fi
else
  echo "No gradle wrapper or system gradle; skipping Android build" >&2
fi
# 2) find APK
APK=""
while IFS= read -r f; do APK="$f"; break; done < <(find "$WORKSPACE" -type f -path "*/build/outputs/apk/*/*/*.apk" -print 2>/dev/null | sort -u)
if [ -z "$APK" ]; then
  echo "No APK found via recursive scan" >&2
else
  echo "FOUND_APK:$APK"
fi
# 3) validate zipalign and apksigner
if [ -n "$APK" ]; then
  ZIPALIGN=$(ls /opt/android-sdk/build-tools/*/zipalign 2>/dev/null | head -n1 || true)
  if [ -z "$ZIPALIGN" ]; then
    echo "zipalign not found under /opt/android-sdk/build-tools; try installing Android build-tools" >&2
    exit 5
  fi
  # run zipalign check
  if "$ZIPALIGN" -v -c 4 "$APK" >/dev/null 2>&1; then
    echo "ZIPALIGNED_OK"
  else
    echo "zipalign check failed for $APK" >&2
    exit 6
  fi
  APKSIGNER=$(ls /opt/android-sdk/build-tools/*/apksigner 2>/dev/null | head -n1 || true)
  if [ -n "$APKSIGNER" ]; then
    echo "APKSIGNER_AVAILABLE:$APKSIGNER"
  else
    echo "apksigner not found under /opt/android-sdk/build-tools" >&2
  fi
fi
# 4) Start app via start script
# Prefer using .init/start to keep consistent PID file handling
bash .init/start.sh || { echo "start script failed to launch" >&2; exit 7; }
PID_FILE=".init/start.pid"
if [ ! -f "$PID_FILE" ]; then echo "start did not create pid file" >&2; exit 8; fi
START_PID=$(cat "$PID_FILE")
if ! ps -p "$START_PID" >/dev/null 2>&1; then echo "start process $START_PID not running" >&2; exit 9; fi
echo "STARTED_PID:$START_PID"
# 5) readiness probe
if [ -n "${HTTP_PORT:-}" ]; then
  READY=false
  for i in {1..20}; do
    if curl -sSf "http://localhost:${HTTP_PORT:-}" >/dev/null 2>&1; then READY=true; break; else sleep 1; fi
  done
  if $READY; then
    echo "READY"
  else
    echo "service did not respond on port ${HTTP_PORT:-}" >&2
    # continue to shutdown but mark failure
    FAILED_READY=1
  fi
else
  # No HTTP_PORT: just ensure process is running
  if ps -p "$START_PID" >/dev/null 2>&1; then echo "PROCESS_RUNNING"; else echo "Process not running after start" >&2; fi
fi
# 6) graceful shutdown
PGID=$(ps -o pgid= -p "$START_PID" | tr -d ' ')
if [ -n "$PGID" ]; then
  kill -TERM -"$PGID" >/dev/null 2>&1 || true
  for i in {1..10}; do if ps -p "$START_PID" >/dev/null 2>&1; then sleep 1; else break; fi; done
  if ps -p "$START_PID" >/dev/null 2>&1; then kill -KILL -"$PGID" >/dev/null 2>&1 || true; fi
fi
# remove pidfile
rm -f "$PID_FILE" || true
echo "STOPPED"
# exit non-zero if readiness failed
if [ "${FAILED_READY:-0}" = "1" ]; then exit 10; fi
echo "VALIDATION_DONE"
exit 0
