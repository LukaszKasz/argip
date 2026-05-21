#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${ROOT_DIR}/database"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
DEFAULT_FILE="${OUTPUT_DIR}/baza_danych.sql"
OUTPUT_FILE="${DEFAULT_FILE}"
ARCHIVE_FILE="${OUTPUT_DIR}/baza_danych_${TIMESTAMP}.sql"

mkdir -p "$(dirname "${OUTPUT_FILE}")"

if [[ "${OUTPUT_FILE}" == "${DEFAULT_FILE}" && -f "${DEFAULT_FILE}" ]]; then
    mv "${DEFAULT_FILE}" "${ARCHIVE_FILE}"
    echo "Archived previous dump to ${ARCHIVE_FILE}"
fi

POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-argip_db}"

cd "${ROOT_DIR}"

docker compose exec -T db pg_dump \
    -U "${POSTGRES_USER}" \
    -d "${POSTGRES_DB}" \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges > "${OUTPUT_FILE}"

echo "Database exported to ${OUTPUT_FILE}"
