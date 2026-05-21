#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
NGINX_DIR="$PROJECTS_DIR/nginx"

echo "Restartuje nginx..."
bash "$NGINX_DIR/restart-docker.sh"

echo "Restartuje aplikacje argip..."
cd "$SCRIPT_DIR"
docker compose down
docker compose up --build -d "$@"

echo
echo "Aplikacja uruchomiona. Otworz:"
echo "Lokalnie: http://localhost/argip/"
echo "Serwer:   https://sprzedaz.advox.pl/argip"
