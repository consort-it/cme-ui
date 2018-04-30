#!/bin/bash +x

# config
IMAGE='cme-ui'
REGISTRY='consortit-docker-cme-local.jfrog.io'

docker build -t "${REGISTRY}/${IMAGE}" -f Dockerfile .
