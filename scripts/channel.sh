#!/bin/bash

function create_channel_org_MSP() {
  local org=$1
  local org_type=$2
  local ecert_ca=${org}-ecert-ca

  echo 'set -x

  mkdir -p /var/hyperledger/fabric/organizations/'${org_type}'Organizations/'${org}'.pharma.com/msp/cacerts
  cp \
    $FABRIC_CA_CLIENT_HOME/'${ecert_ca}'/rcaadmin/msp/cacerts/'${ecert_ca}'.pem \
    /var/hyperledger/fabric/organizations/'${org_type}'Organizations/'${org}'.pharma.com/msp/cacerts

  mkdir -p /var/hyperledger/fabric/organizations/'${org_type}'Organizations/'${org}'.pharma.com/msp/tlscacerts
  cp \
    $FABRIC_CA_CLIENT_HOME/tls-ca/tlsadmin/msp/cacerts/'${org}'-tls-ca.pem \
    /var/hyperledger/fabric/organizations/'${org_type}'Organizations/'${org}'.pharma.com/msp/tlscacerts

  echo "NodeOUs:
    Enable: true
    ClientOUIdentifier:
      Certificate: cacerts/'${ecert_ca}'.pem
      OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
      Certificate: cacerts/'${ecert_ca}'.pem
      OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
      Certificate: cacerts/'${ecert_ca}'.pem
      OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
      Certificate: cacerts/'${ecert_ca}'.pem
      OrganizationalUnitIdentifier: orderer "> /var/hyperledger/fabric/organizations/'${org_type}'Organizations/'${org}'.pharma.com/msp/config.yaml

  ' | exec kubectl -n $NS exec deploy/${ecert_ca} -i -- sh
}

function create_channel_MSP() {
  echo "Creating channel MSP"

  create_channel_org_MSP rms orderer
  create_channel_org_MSP rms peer
}

function aggregate_channel_MSP(){
  echo "Aggregate channel MSP"
  kubectl exec deploy/rms-ecert-ca -- tar -zcvf msp-rms.pharma.com.tgz -C $WIN_KUBECTL_EXEC_PATH_FIX/var/hyperledger/fabric organizations/ordererOrganizations/rms.pharma.com/msp
  kubectl -n $NS exec deploy/rms-ecert-ca -- tar -zcvf msp-rms.pharma.com.tgz -C $WIN_KUBECTL_EXEC_PATH_FIX/var/hyperledger/fabric organizations/ordererOrganizations/rms.pharma.com/msp
  kubectl -n $NS cp $(kubectl get pod | grep rms-ecert-ca | awk '{print $1}'):msp-rms.pharma.com.tgz network/build/msp/msp-rms.pharma.com.tgz
  kubectl -n $NS  create configmap msp-config --from-file=network/build/msp/
}
function launch_admin_CLIs() {
  echo "Launching admin CLIs"

  launch templates/k8s/rms-admin-cli.yaml

  kubectl -n $NS rollout status deploy/rms-admin-cli
}

function create_genesis_block() {
  echo "Creating channel \"${CHANNEL_NAME}\""

  echo 'set -x
  configtxgen -profile PharmaApplicationGenesis -channelID '${CHANNEL_NAME}' -outputBlock genesis_block.pb
  # configtxgen -inspectBlock genesis_block.pb

  osnadmin channel join --orderer-address rms-orderer1:9443 --channelID '${CHANNEL_NAME}' --config-block genesis_block.pb

  ' | exec kubectl -n $NS exec deploy/rms-admin-cli -i -- sh

   sleep 10
}

function join_org_peers() {
  local org=$1
  echo "Joining ${org} peers to channel \"${CHANNEL_NAME}\""

  echo 'set -x
  # Fetch the genesis block from an orderer
  peer channel \
    fetch oldest \
    genesis_block.pb \
    -c '${CHANNEL_NAME}' \
    -o rms-orderer1:6050 \
    --tls --cafile /var/hyperledger/fabric/organizations/ordererOrganizations/rms.pharma.com/msp/tlscacerts/rms-tls-ca.pem

  # Join peer1 to the channel.
  CORE_PEER_ADDRESS='${org}'-peer1:7051 \
  peer channel \
    join \
    -b genesis_block.pb \
    -o rms-orderer1:6050 \
    --tls --cafile /var/hyperledger/fabric/organizations/ordererOrganizations/rms.pharma.com/msp/tlscacerts/rms-tls-ca.pem

  # Join peer2 to the channel.
  CORE_PEER_ADDRESS='${org}'-peer2:7051 \
  peer channel \
    join \
    -b genesis_block.pb \
    -o rms-orderer1:6050 \
    --tls --cafile /var/hyperledger/fabric/organizations/ordererOrganizations/rms.pharma.com/msp/tlscacerts/rms-tls-ca.pem

  ' | exec kubectl -n $NS exec deploy/${org}-admin-cli -i -- sh

}

function join_peers() {
  join_org_peers rms
}

function channel_up() {

  create_channel_MSP

  aggregate_channel_MSP

  launch_admin_CLIs

  create_genesis_block
  join_peers
}
