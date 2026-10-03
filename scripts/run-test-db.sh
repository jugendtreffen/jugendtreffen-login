#!/usr/bin/env bash
set -euo pipefail

PORT=5432
CONTAINER_NAME="redwood-postgres"

if python - <<'PY'
import socket
s = socket.socket()
s.settimeout(1)
try:
    s.connect(('127.0.0.1', 5432))
    raise SystemExit(0)
except Exception:
    raise SystemExit(1)
finally:
    s.close()
PY
then
  exit 0
fi

if command -v podman >/dev/null 2>&1; then
  if ! podman ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
    podman run --name "$CONTAINER_NAME" \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_DB=postgres \
      -p "$PORT:5432" \
      -d docker.io/library/postgres:16-alpine
  fi
elif command -v docker >/dev/null 2>&1; then
  if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
    docker run --name "$CONTAINER_NAME" \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_DB=postgres \
      -p "$PORT:5432" \
      -d postgres:16-alpine
  fi
else
  echo "Neither podman nor docker is installed. Please install one of them to run the tests." >&2
  exit 1
fi

for i in $(seq 1 30); do
  if python - <<'PY'
import socket
s = socket.socket()
s.settimeout(1)
try:
    s.connect(('127.0.0.1', 5432))
    raise SystemExit(0)
except Exception:
    raise SystemExit(1)
finally:
    s.close()
PY
  then
    exit 0
  fi
  sleep 1
done

echo "PostgreSQL did not become ready on localhost:$PORT within 30 seconds." >&2
exit 1
