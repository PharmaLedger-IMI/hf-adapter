# Hyperledger Fabric Adapter

## Folder structure

1. cc-anchor : chaincode for anchoring
2. hlf-adapter : hyperledger fabric anchoring adapter
3. network : hyperledger fabric blockchain network configuration
4. scripts : deployment, clean scripts
5. templates : k8s deployment templates

## Deployment

1. Deploy the blockchain network :
```shell
./scripts/deploy-network.sh
```

2. Deploy hlf-adapter
```shell
./scripts/deploy-hlf-adapter.sh
```
## Clean-up
```shell
./scripts/drop-network.sh
```
