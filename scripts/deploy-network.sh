#!/bin/bash

set -e
set -u

. scripts/.env
. scripts/utils.sh
. scripts/network.sh

check_prereqs

#cd cc-anchor || exit 1
./cc-anchor/build-image.sh
#cd ..

cd network/fabric-ccs-build || exit 1
./build-image.sh
cd ../..

deploy_network

./scripts/hlf-explorer-connection.sh

kubectl apply -f ./hlf-explorer/k8s
