#!/usr/bin/env bash
# Usage: ./deploy.sh sha-abc1234   (no argument = latest)
# Pulls the image from GHCR, restarts the container, waits until it is healthy,
# then removes this repo's old images (older than 7 days).
set -euo pipefail

TAG="${1:-latest}"
CONTAINER="barbershop-client"
PORT="${FRONTEND_PORT:-4003}"
IMAGE_SOURCE="https://github.com/MDilshodbek/Barbershop-client"

cd "$(dirname "$0")"
export IMAGE_TAG="$TAG"

echo "==> Pulling ghcr.io/mdilshodbek/barbershop-client:${TAG}"
docker compose pull

echo "==> Starting container"
docker compose up -d --remove-orphans

echo "==> Waiting for health check on http://127.0.0.1:${PORT}/"
healthy=false
for i in $(seq 1 30); do
  status="$(docker inspect -f '{{.State.Health.Status}}' "$CONTAINER" 2>/dev/null || echo missing)"
  if [ "$status" = "healthy" ] && wget -q --spider "http://127.0.0.1:${PORT}/"; then
    healthy=true
    break
  fi
  echo "    attempt ${i}/30: ${status}"
  sleep 3
done

if [ "$healthy" != "true" ]; then
  echo "!! ${CONTAINER} is not healthy. Last logs:"
  docker compose logs --tail=100 "$CONTAINER" || true
  exit 1
fi
echo "==> ${CONTAINER} is healthy (${TAG})"

echo "==> Removing this repo's unused images older than 7 days"
docker image prune -a -f \
  --filter "label=org.opencontainers.image.source=${IMAGE_SOURCE}" \
  --filter "until=168h"

echo "==> Done"
