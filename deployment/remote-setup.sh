
#!/bin/bash
echo -e "\nSetup remote instance"

echo -e "\n# 1/3 - Loading and setting options..."
## Show commands (if you want to check, uncomment it)
set -x

## Stop on errors
set -e

echo 'test'

## Include config
source config.sh



## Set GCP compute zone
gcloud config set project ${PROJECT}
gcloud config set compute/zone ${ZONE}

## Copy script
echo -e "\n# 2/2 - Copying required files..."
gcloud compute scp ./local-setup.sh ${INSTANCE_NAME}:~  # this is copying to /home/hackerman
gcloud compute scp ./config.sh ${INSTANCE_NAME}:~

## Create remote path
echo -e "\n# 3/3 - Staring remote setup..."
gcloud beta compute --project ${PROJECT} ssh ${INSTANCE_NAME} --zone ${ZONE} --command="chmod +x ~/local-setup.sh && ./local-setup.sh"
