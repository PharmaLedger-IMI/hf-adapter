#!/bin/bash

function dlfile() {
  local filedl=$1
  kubectl cp $(kubectl get pod | grep rms-ecert-ca | awk '{print $1}'):/var/hyperledger/fabric/${filedl} network/build/msp/${filedl}
}

function app_extract_MSP_certs() {
  mkdir -p network/build/msp/organizations/peerOrganizations/rms.pharma.com/msp/tlscacerts
  mkdir -p network/build/msp/organizations/peerOrganizations/rms.pharma.com/msp/cacerts

  set -ex

  dlfile organizations/peerOrganizations/rms.pharma.com/msp/tlscacerts/rms-tls-ca.pem
  dlfile organizations/peerOrganizations/rms.pharma.com/msp/cacerts/rms-ecert-ca.pem


}

function app_one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function app_json_ccp {
  local ORG=$1
  local ORG_NAME=$2
  local PP=$(app_one_line_pem $3)
  local CP=$(app_one_line_pem $4)
  sed -e "s/\${ORG}/$ORG/" \
      -e "s/\${ORG_NAME}/$ORG_NAME/" \
      -e "s#\${PEERPEM}#$PP#" \
      -e "s#\${CAPEM}#$CP#" \
      templates/ccp-template.json
}



function construct_application_connection_profile() {
  echo "Constructing gateway connection profile"

  app_extract_MSP_certs

  mkdir -p hlf-adapter/wallet
  mkdir -p hlf-adapter/gateway

  local peer_pem=network/build/msp/organizations/peerOrganizations/rms.pharma.com/msp/tlscacerts/rms-tls-ca.pem
  local ca_pem=network/build/msp/organizations/peerOrganizations/rms.pharma.com/msp/cacerts/rms-ecert-ca.pem

  echo "$(app_json_ccp rms Rms $peer_pem $ca_pem)" > hlf-adapter/gateway/rms_ccp.json

}


function application_connection() {

 construct_application_connection_profile

}

application_connection
