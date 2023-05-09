#!/bin/bash

# kubehelper.sh AZURE_LOGIN AZURE_PASSWORD AZURE_TENANT_ID AZURE_RESOURCEGROUP AZURE_CLUSTERNAME CIRCLE_SHA1 IMAGE_NAME

IMAGE_NAME=$1
FOLDER_NAME=$2
NAMESPACE=$3
REPRO_NAME="leancoders/integral-versicherung"

mkdir -p ~/repo/k8s

echo "kubehelper.sh ${FOLDER_NAME} with ${NAMESPACE} ${AZURE_LOGIN} ${AZURE_TENANT_ID} ${AZURE_RESOURCEGROUP} ${AZURE_CLUSTERNAME} ${CIRCLE_SHA1} ${IMAGE_NAME}"
echo "output current dir"
ls -l ./

echo "output home dir"
ls -l ~/repo

echo "copy files ${FOLDER_NAME}"
mkdir -p ./k8s/$FOLDER_NAME
cp ./deployment/$FOLDER_NAME/* ./k8s/$FOLDER_NAME

echo "Replace dotenv vars ${FOLDER_NAME}"
sed -E 's/__(([^_]|_[^_])*)__/${\1}/g' ./k8s/$FOLDER_NAME/deployment.yaml | envsubst > ./k8s/$FOLDER_NAME/newdeployment.yaml

echo "apply deployment files ${FOLDER_NAME}"
kubectl apply -f ./k8s/$FOLDER_NAME/newdeployment.yaml

echo "set image not needed anymore because we are using the"
#kubectl set image deployment/$IMAGE_NAME $IMAGE_NAME=${ACR_ENDPOINT}/${REPRO_NAME}/$IMAGE_NAME:dev --namespace=${NAMESPACE}

echo "using annotation hack to redeploy"
kubectl patch deployment $IMAGE_NAME -p "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"date\":\"`date +'%s'`\"}}}}}" --namespace=${NAMESPACE}