#!/usr/bin/env bash
# Nativer arm64-Test des SatSage-Images auf Apple Silicon (Docker Desktop oder OrbStack).
# Aufruf: ./scripts/test-arm64-mac.sh [tag]   (Default 1.0.1)
set -euo pipefail
TAG="${1:-1.0.1}"
IMG="ghcr.io/juniormind1/satsage:${TAG}"
NAME="satsage-arm64-test"
PORT=18730

echo "== 1) Manifest: amd64 + arm64 vorhanden?"
docker buildx imagetools inspect "$IMG" | grep -E 'Platform:' || true

echo "== 2) arm64-Image ziehen"
docker pull --platform linux/arm64 "$IMG"
docker image inspect "$IMG" --format 'Arch: {{.Architecture}}'

echo "== 3) Python-Abhängigkeiten (chiabip158, embit, argon2, cryptography)"
docker run --rm --platform linux/arm64 --entrypoint python3 "$IMG" -c '
import platform, chiabip158, embit, argon2, cryptography
from chiabip158 import PyBIP158
f = PyBIP158([bytearray(b"abc")])
assert f.Match(bytearray(b"abc")) and not f.Match(bytearray(b"zzz"))
print("OK", platform.machine())'

echo "== 4) Server starten (ohne Node, leeres Datenvolume)"
docker rm -f "$NAME" >/dev/null 2>&1 || true
docker run -d --name "$NAME" --platform linux/arm64 -p "127.0.0.1:${PORT}:8730" "$IMG" >/dev/null
code=000
for i in $(seq 1 30); do
  sleep 2
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${PORT}/" || true)
  [ "$code" = "200" ] && break
done
echo "GUI http://127.0.0.1:${PORT}/ -> HTTP $code"
docker logs --tail 15 "$NAME"

echo "== 5) Aufräumen"
docker rm -f "$NAME" >/dev/null
[ "$code" = "200" ] && echo "ERGEBNIS: arm64 OK" || { echo "ERGEBNIS: FEHLER"; exit 1; }
