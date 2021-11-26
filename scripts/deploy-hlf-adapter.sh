#!/bin/bash

./scripts/hlf-adapter-connection.sh
cd hlf-adapter || exit 1
./build.sh
cd ..

kubectl apply -f ./hlf-adapter/k8s

sleep 10
kubectl get svc
