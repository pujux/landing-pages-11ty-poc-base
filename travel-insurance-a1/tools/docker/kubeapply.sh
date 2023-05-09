#!/bin/bash
FOLDER_NAME=$1

echo "apply deployment files ${FOLDER_NAME}"
kubectl apply -f ~/repo/apps/$FOLDER_NAME/deployment