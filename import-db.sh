#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_FILE="${ROOT_DIR}/database/baza_danych.sql"
INPUT_FILE="${DEFAULT_FILE}"

if [[ ! -f "${INPUT_FILE}" ]]; then
    echo "Dump file not found: ${INPUT_FILE}"
    exit 1
fi

POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-argip_db}"

cd "${ROOT_DIR}"

docker compose exec -T db psql \
    -U "${POSTGRES_USER}" \
    -d "${POSTGRES_DB}" < "${INPUT_FILE}"

echo "Database imported from ${INPUT_FILE}"
