#!/bin/bash

. scripts/.env

kubectl get deploy -n $NS --no-headers=true | awk '/rms-/{print $1}'| xargs  kubectl delete -n $NS deploy
kubectl get svc -n $NS --no-headers=true | awk '/rms-/{print $1}'| xargs  kubectl delete -n $NS svc
kubectl get configmaps -n $NS --no-headers=true | awk '/rms-/{print $1}'| xargs  kubectl delete -n $NS configmaps
kubectl get configmaps -n $NS --no-headers=true | awk '/msp-/{print $1}'| xargs  kubectl delete -n $NS configmaps

echo "Scrubbing Fabric volumes"

# clean job to make this function can be rerun
kubectl -n $NS delete jobs --all

# scrub all pv contents
kubectl -n $NS create -f templates/k8s/job-scrub-fabric-volumes.yaml
kubectl -n $NS wait --for=condition=complete --timeout=60s job/job-scrub-fabric-volumes
kubectl -n $NS delete jobs --all

kubectl get pvc --no-headers=true | awk '/-rms/{print $1}'| xargs  kubectl delete pvc
kubectl get pv --no-headers=true | awk '/-rms/{print $1}'| xargs  kubectl delete pv

# drop the adapter
kubectl delete -f ./hlf-adapter/k8s/

#drop blockchain explorer
kubectl delete -f ./hlf-explorer/k8s
