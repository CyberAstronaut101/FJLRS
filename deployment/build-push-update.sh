#!/usr/bin/env bash
echo -e "\nDeploy  remote instance"

echo -e "\n# 1/4 - Loading and setting options..."
## Show commands (if you want to check, uncomment it)
#set -x

## Stop on errors
set -e

## Include config
source config.sh

## Set GCP compute zone
gcloud config set project ${PROJECT}
gcloud config set compute/zone ${ZONE}

# Build and tag backend
echo -e "\n# 2/4 - Building (and tagging) docker image..."
cd ../
docker build -f Dockerfile -t ${IMAGE_TAG}  .
docker tag ${IMAGE_TAG} ${CONTAINER_IMAGE}




# Push image
echo -e "\n# 3/4 - Pushing image to Google Container Registry..."
docker push ${CONTAINER_IMAGE}

# Update remote instance
echo -e "\n# 4/4 - Pulling and starting remote container..."
gcloud beta compute --project ${PROJECT} ssh ${INSTANCE_NAME} --zone ${ZONE} --command="cd ${REMOTE_PATH} && docker stop \$(docker ps -aq) || true && docker rm \$(docker ps -aq) || true && docker run -d -p 80:8080 --name=${IMAGE_TAG} ${CONTAINER_IMAGE} "

echo -e "\nInstance updated!"