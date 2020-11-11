## Google cloud config
PROJECT="fjlrs-287920"
ZONE="us-central1-a"

## Instance settings
INSTANCE_NAME="docker-host-fjlrs"

### Instance creation settings
TAGS="http-server,https-server" # or "http-server,https-server"
DELETION_PROTECTION="no-deletion-protection" # or "deletion-protection"
IMAGE_FAMILY="ubuntu-1604-lts"
IMAGE_PROJECT="ubuntu-os-cloud"
MACHINE_TYPE="f1-micro"

## Target docker images
IMAGE_TAG="fjlrs-docker"
CONTAINER_IMAGE="gcr.io/${PROJECT}/${IMAGE_TAG}"
REMOTE_PATH="/srv/project"