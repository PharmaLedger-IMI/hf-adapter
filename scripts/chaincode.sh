#!/bin/bash


function query_chaincode() {
  set -x

  echo '
  export CORE_PEER_ADDRESS=rms-peer2:7051
  peer chaincode query -n '${CHAINCODE_NAME}' -C '${CHANNEL_NAME}' -c '"'$@'"'
  ' | exec kubectl -n $NS exec deploy/rms-admin-cli -c main -i -- sh
}

function invoke_chaincode() {
  set -x
  echo '
  export CORE_PEER_ADDRESS=rms-peer1:7051
  peer chaincode \
    invoke \
    -o rms-orderer1:6050 \
    --tls --cafile /var/hyperledger/fabric/organizations/ordererOrganizations/rms.pharma.com/msp/tlscacerts/rms-tls-ca.pem \
    -n '${CHAINCODE_NAME}' \
    -C '${CHANNEL_NAME}' \
    -c '"'$@'"'
  ' | exec kubectl -n $NS exec deploy/rms-admin-cli -c main -i -- sh

  sleep 2
}

function instantiate_chaincode() {
  set -x
  echo '
  export CORE_PEER_ADDRESS=rms-peer1:7051
  peer chaincode \
    instantiate \
    -o rms-orderer1:6050 \
    -v v0 \
    --tls --cafile /var/hyperledger/fabric/organizations/ordererOrganizations/rms.pharma.com/msp/tlscacerts/rms-tls-ca.pem \
    -n '${CHAINCODE_NAME}' \
    -C '${CHANNEL_NAME}' \
    -c '"'$@'"'
  ' | exec kubectl -n $NS exec deploy/rms-admin-cli -c main -i -- sh

  sleep 2
}

function package_chaincode_for() {
  local org=$1
  local cc_folder="network/chaincode/${CHAINCODE_NAME}"
  local build_folder="network/build/chaincode"
  local cc_archive="${build_folder}/${CHAINCODE_NAME}.tgz"
  echo "Packaging chaincode folder ${cc_folder}"

  mkdir -p ${build_folder}

  tar -C ${cc_folder} -zcf ${cc_folder}/code.tar.gz connection.json
  tar -C ${cc_folder} -zcf ${cc_archive} code.tar.gz metadata.json

  rm ${cc_folder}/code.tar.gz
}

# Copy the chaincode archive from the local host to the org admin
function transfer_chaincode_archive_for() {
  local org=$1
  local cc_archive="network/build/chaincode/${CHAINCODE_NAME}.tgz"
  echo "Transferring chaincode archive to ${org}"

  tar cf - ${cc_archive} | kubectl -n $NS exec -i deploy/${org}-admin-cli -c main -- tar xvf -
}

function install_chaincode_for() {
  local org=$1
  echo "Installing chaincode for org ${org}"

  # Install the chaincode
  echo 'set -x
  export CORE_PEER_ADDRESS='${org}'-peer1:7051
  peer lifecycle chaincode install network/build/chaincode/'${CHAINCODE_NAME}'.tgz
  ' | exec kubectl -n $NS exec deploy/${org}-admin-cli -c main -i -- sh

 echo 'set -x
  export CORE_PEER_ADDRESS='${org}'-peer2:7051
  peer lifecycle chaincode install network/build/chaincode/'${CHAINCODE_NAME}'.tgz
  ' | exec kubectl -n $NS exec deploy/${org}-admin-cli -c main -i -- sh
}

# Normally the chaincode ID is emitted by the peer install command.  In this case, we'll generate the
# package ID as the sha-256 checksum of the chaincode archive.
function set_chaincode_id() {
  local cc_sha256=$(shasum -a 256 network/build/chaincode/${CHAINCODE_NAME}.tgz | tr -s ' ' | cut -d ' ' -f 1)

  CHAINCODE_ID=${CHAINCODE_LABEL}:${cc_sha256}
}

# Package and install the chaincode, but do not activate.
function install_chaincode() {
  local org=rms

  package_chaincode_for ${org}
  transfer_chaincode_archive_for ${org}
  install_chaincode_for ${org}

  set_chaincode_id
}

function launch_chaincode_service() {
  local org=$1
  local cc_id=$2
  local cc_image=$3
  echo "Launching chaincode container \"${cc_image}\""

  # The chaincode endpoint needs to have the generated chaincode ID available in the environment.
  # This could be from a config map, a secret, or by directly editing the deployment spec.  Here we'll keep
  # things simple by using sed to substitute script variables into a yaml template.
  cat templates/k8s/${org}-cc-template.yaml \
    | sed 's,{{CHAINCODE_NAME}},'${CHAINCODE_NAME}',g' \
    | sed 's,{{CHAINCODE_ID}},'${cc_id}',g' \
    | sed 's,{{CHAINCODE_IMAGE}},'${cc_image}',g' \
    | exec kubectl -n $NS apply -f -

  kubectl -n $NS rollout status deploy/${org}-cc-${CHAINCODE_NAME}

}

function activate_chaincode_for() {
  local org=$1
  local cc_id=$2
  echo "Activating chaincode ${CHAINCODE_ID}"

  echo 'set -x
  export CORE_PEER_ADDRESS='${org}'-peer1:7051

  peer lifecycle \
    chaincode approveformyorg \
    --channelID '${CHANNEL_NAME}' \
    --name '${CHAINCODE_NAME}' \
    --version 1 \
    --package-id '${cc_id}' \
    --sequence 1 \
    -o rms-orderer1:6050 \
    --tls --cafile /var/hyperledger/fabric/organizations/ordererOrganizations/rms.pharma.com/msp/tlscacerts/rms-tls-ca.pem

  peer lifecycle \
    chaincode commit \
    --channelID '${CHANNEL_NAME}' \
    --name '${CHAINCODE_NAME}' \
    --version 1 \
    --sequence 1 \
    -o rms-orderer1:6050 \
    --tls --cafile /var/hyperledger/fabric/organizations/ordererOrganizations/rms.pharma.com/msp/tlscacerts/rms-tls-ca.pem

  ' | exec kubectl -n $NS exec deploy/${org}-admin-cli -c main -i -- sh

}

# Activate the installed chaincode but do not package/install a new archive.
function activate_chaincode() {
  set -x

  set_chaincode_id
  activate_chaincode_for rms $CHAINCODE_ID
}

function deploy_chaincode() {
  set -x

  install_chaincode
  launch_chaincode_service rms $CHAINCODE_ID $CHAINCODE_IMAGE
  activate_chaincode
}
