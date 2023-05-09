#!/bin/bash

# dockerhelper.sh DOCKER_USER DOCKER_PASS secrets.ACR_URL CIRCLE_SHA1 IMAGE_NAME

IMAGE_NAME=$1
TAG_NAME="latest"

REPRO_NAME="leancoders/integral-versicherung"

# docker tag ${REPRO_NAME}/$IMAGE_NAME "${ACR_URL}/${REPRO_NAME}/${IMAGE_NAME}:${CIRCLE_SHA1}"
docker tag ${REPRO_NAME}/$IMAGE_NAME "${ACR_URL}/${REPRO_NAME}/${IMAGE_NAME}:${TAG_NAME}"
docker tag ${REPRO_NAME}/$IMAGE_NAME "${ACR_URL}/${REPRO_NAME}/${IMAGE_NAME}:dev"

echo "DOCKER PUSH"

# docker push "${ACR_URL}/${REPRO_NAME}/${IMAGE_NAME}:${CIRCLE_SHA1}"
docker push "${ACR_URL}/${REPRO_NAME}/${IMAGE_NAME}:${TAG_NAME}"
docker push "${ACR_URL}/${REPRO_NAME}/${IMAGE_NAME}:dev"
