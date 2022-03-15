## EPI preconfigured deployment using Hyperledger Fabric adapter 

### Prerequisites
1. nginx configured to be accessible by DNS, have certificates installed and connected to the ePI service. [Details nginx installation](./k8s/nginx/readme.md)

1. Build epi docker image and publish it (Optional step)
```shell
./epi/build-and-push-epi.sh
```
2. Deploy epi installation
```shell
kubectl apply -f ./epi/k8s
```
## Clean-up ePI installation
```shell
kubectl delete -f ./epi/k8s
```
