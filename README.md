# Hyperledger Fabric Adapter
[![HLF Adapter Tests](https://github.com/PharmaLedger-IMI/hf-adapter/actions/workflows/HLFAdapterTests.yml/badge.svg)](https://github.com/PharmaLedger-IMI/hf-adapter/actions/workflows/HLFAdapterTests.yml)
[![Smart Contract Tests](https://github.com/PharmaLedger-IMI/hf-adapter/actions/workflows/SmartContractTests.yml/badge.svg)](https://github.com/PharmaLedger-IMI/hf-adapter/actions/workflows/SmartContractTests.yml)


## Folder structure

1. cc-anchor : chaincode for anchoring
2. hlf-adapter : hyperledger fabric anchoring adapter
3. network : hyperledger fabric blockchain network configuration
4. scripts : deployment, clean scripts
5. templates : k8s deployment templates

## Prerequisites
1. Docker up and running
2. kubectl configured to your working cluster

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
## External

1. [Hyperledger fabric documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.3/whatis.html#hyperledger-fabric)
