#!/bin/sh
# Fly mounts the volume owned by root. Hand /data to the app user, then drop root for good.
set -eu
chown -R app:app /data
exec setpriv --reuid=app --regid=app --init-groups --inh-caps=-all \
  uvicorn main:app \
  --host 0.0.0.0 \
  --port "${PORT:-8000}" \
  --proxy-headers \
  --forwarded-allow-ips='*' \
  --no-server-header
