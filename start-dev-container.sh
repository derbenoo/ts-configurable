#!/bin/bash

# Get path of this script so that we can use paths relative to this script's path
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

# Use docker-compose to start the node-dev container
docker-compose -p t5s -f $SCRIPTPATH/tools/docker-compose.yml up --build -d

# Attach to dev container if a TTY is present
if [ -z "${CI}" ]
then
  docker exec -it node-dev bash
fi
