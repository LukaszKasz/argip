#!/bin/sh
set -e

cd /var/www/html

echo "Starting uvicorn server..."
exec uvicorn main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers 4 \
  --timeout-keep-alive 300 \
  --timeout-graceful-shutdown 120 \
  --access-log \
  --proxy-headers
