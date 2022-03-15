#!/bin/bash

function dlfile() {
  local filedl=$1
  kubectl cp $(kubectl get pod | grep rms-ecert-ca | awk '{print $1}'):/var/hyperledger/fabric/${filedl} network/build/msp/${filedl}
}

function app_extract_MSP_certs() {
  mkdir -p network/build/msp/organizations/peerOrganizations/rms.pharma.com/users/Admin@rms.pharma.com/msp/keystore
  mkdir -p network/build/msp/organizations/peerOrganizations/rms.pharma.com/peers/rms-peer1.rms.pharma.com/tls/cacerts
  mkdir -p network/build/msp/organizations/peerOrganizations/rms.pharma.com/users/Admin@rms.pharma.com/msp/signcerts

  set -ex

  dlfile organizations/peerOrganizations/rms.pharma.com/users/Admin@rms.pharma.com/msp/keystore/server.key
  dlfile organizations/peerOrganizations/rms.pharma.com/peers/rms-peer1.rms.pharma.com/tls/cacerts/rms-tls-ca.pem
  dlfile organizations/peerOrganizations/rms.pharma.com/users/Admin@rms.pharma.com/msp/signcerts/cert.pem


}

function app_one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function app_json_ccp {

  local SK=$(app_one_line_pem $1)
  local RMSTLSCA=$(app_one_line_pem $2)
  local SIGNCERT=$(app_one_line_pem $3)

  #local SK=$(cat $1)
  #local RMSTLSCA=$(cat $2)
  #local SIGNCERT=$(cat $3)
  sed -e "s#\${admin-private-key}#$SK#" \
      -e "s#\${rms-tls-ca.pem}#$RMSTLSCA#" \
      -e "s#\${cert-pem}#$SIGNCERT#" \
      -e 's/\\n/\
    /g'   \
      hlf-explorer/k8s/template/explorer-config.template.yaml
}



function construct_explorer_connection_profile() {
  echo "Constructing explorer connection profile"

  app_extract_MSP_certs

  local serker_key=network/build/msp/organizations/peerOrganizations/rms.pharma.com/users/Admin@rms.pharma.com/msp/keystore/server.key
  local rms_tls_ca=network/build/msp/organizations/peerOrganizations/rms.pharma.com/peers/rms-peer1.rms.pharma.com/tls/cacerts/rms-tls-ca.pem
  local sign_cert=network/build/msp/organizations/peerOrganizations/rms.pharma.com/users/Admin@rms.pharma.com/msp/signcerts/cert.pem

  echo "$(app_json_ccp $serker_key $rms_tls_ca $sign_cert)" > hlf-explorer/k8s/explorer-config.yaml

}


function explorer_connection() {

 construct_explorer_connection_profile

}

explorer_connection
