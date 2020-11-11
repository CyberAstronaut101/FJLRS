#!/usr/bin/env bash

## Show commands (if you want to check, uncomment it)
set -x

## Stop on errors
set -e

## Include config
source config.sh

## Configure instance
echo -e "\nConfiguring instance\n"

## install Docker
echo -e "\n# 1/4 - Installing docker..."
if ! hash docker 2>/dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker ${LOGNAME}
    sudo chmod 666 /var/run/docker.sock
    echo "Testing..."
    docker --version
else
    echo "Docker already installed"
fi

## Install docker-compose
echo -e "\n# 2/4 - Installing docker-compose..."
if ! hash docker-compose 2>/dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
    echo "Testing..."
    docker-compose --version
else
    echo "Docker-compose already installed"
fi

## Auth on docker registry (GCR)
echo -e "\n# 3/4 - Authenticating on GCR docker..."
VERSION=1.5.0
OS=linux
ARCH=amd64
curl -fsSL "https://github.com/GoogleCloudPlatform/docker-credential-gcr/releases/download/v${VERSION}/docker-credential-gcr_${OS}_${ARCH}-${VERSION}.tar.gz" \
| tar xz --to-stdout ./docker-credential-gcr \
| sudo tee /usr/bin/docker-credential-gcr > /dev/null
sudo chmod +x /usr/bin/docker-credential-gcr
docker-credential-gcr configure-docker

## Create project folder
echo -e "\n# 4/4 - Creating project folder..."
if [[ ! -d "REMOTE_PATH" ]]; then
    sudo mkdir -p ${REMOTE_PATH}
    sudo chmod -R 777 ${REMOTE_PATH}
    echo "Project folder created at ${REMOTE_PATH}"
else
    echo "Project folder already exists"
fi

## Remove unnecessary files
rm local-setup.sh
rm config.sh


// Clone the current 



echo -e "\nInstance ready!"