#!/usr/bin/env bash
set -euo pipefail

USERNAME="${DOCKER_USERNAME:-}"
PASSWORD="${DOCKER_PASSWORD:-}"
REPOSITORY="${DOCKER_REPOSITORY:-pomodoro-backend}"
TAG="${DOCKER_TAG:-latest}"
IMAGE_NAME="${DOCKER_IMAGE_NAME:-${USERNAME}/${REPOSITORY}}"

if [[ -z "$USERNAME" || -z "$PASSWORD" ]]; then
  echo "Please set DOCKER_USERNAME and DOCKER_PASSWORD environment variables." >&2
  exit 1
fi

if [[ -z "$REPOSITORY" ]]; then
  echo "Please set DOCKER_REPOSITORY or provide a default repository name." >&2
  exit 1
fi

if [[ -z "$IMAGE_NAME" ]]; then
  echo "Unable to determine Docker image name." >&2
  exit 1
fi

echo "Logging into Docker Hub..."
echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin

echo "Building Docker image: $IMAGE_NAME:$TAG"
docker build -t "$IMAGE_NAME:$TAG" -t "$IMAGE_NAME:latest" ./backend

echo "Pushing Docker image: $IMAGE_NAME:$TAG"
docker push "$IMAGE_NAME:$TAG"
docker push "$IMAGE_NAME:latest"

echo "Image published successfully: $IMAGE_NAME:$TAG"
