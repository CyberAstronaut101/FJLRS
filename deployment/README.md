These files are used to deploy to Google Cloud Platform

using covid19memoriam@gmail.com GCP account for this project

run scripts using `bash <script-name>`

# Process for Deploying to GCP

## Install and login to gcloud CLI on machine

## Run create-instance.sh

```
› $ ./create-instance.sh                                          1 ↵ 

Create remote instance

# 1/2 - Loading and setting options...
Updated property [core/project].
Updated property [compute/zone].

# 1/2 - Creating Compute Instance...
Created [https://www.googleapis.com/compute/v1/projects/fjlrs-287920/zones/us-central1-a/instances/docker-host-fjlrs].
NAME               ZONE           MACHINE_TYPE  PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP    STATUS
docker-host-fjlrs  us-central1-a  f1-micro                   10.128.0.2   34.123.250.75  RUNNING
```

## Run ./remote-setup.sh to copy local-setup.sh to the new machine to do initial setup

