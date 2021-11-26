#!/bin/bash

function launch_TLS_CAs() {
  echo "Launching TLS CAs"

  launch_CA templates/k8s/rms-tls-ca.yaml

  kubectl -n $NS rollout status deploy/rms-tls-ca

  sleep 10
}

function launch_CA() {
  local yaml=$1
  cat ${yaml} \
    | sed 's,{{FABRIC_CONTAINER_REGISTRY}},'${FABRIC_CONTAINER_REGISTRY}',g' \
    | sed 's,{{FABRIC_CA_VERSION}},'${FABRIC_CA_VERSION}',g' \
    | kubectl -n $NS apply -f -
}

# Enroll bootstrap user with TLS CA
# https://hyperledger-fabric-ca.readthedocs.io/en/latest/deployguide/cadeploy.html#enroll-bootstrap-user-with-tls-ca
function enroll_bootstrap_TLS_CA_user() {
  local org=$1
  local auth=$2
  local tlsca=${org}-tls-ca

  # todo: get rid of export here - put in yaml

  echo 'set -x
  echo '${tlsca}'
  echo $FABRIC_CA_CLIENT_HOME

  mkdir -p $FABRIC_CA_CLIENT_HOME/tls-root-cert
  cp $FABRIC_CA_SERVER_HOME/ca-cert.pem $FABRIC_CA_CLIENT_HOME/tls-root-cert/tls-ca-cert.pem

  fabric-ca-client enroll \
    --url https://'$auth'@'${tlsca}' \
    --tls.certfiles $FABRIC_CA_CLIENT_HOME/tls-root-cert/tls-ca-cert.pem \
    --csr.hosts '${tlsca}' \
    --mspdir $FABRIC_CA_CLIENT_HOME/tls-ca/tlsadmin/msp

  ' | exec kubectl -n $NS exec deploy/${tlsca} -i -- sh
}



function enroll_bootstrap_TLS_CA_users() {
  echo "Enrolling bootstrap TLS CA users"

  enroll_bootstrap_TLS_CA_user rms $TLSADMIN_AUTH
}

function register_enroll_ECert_CA_bootstrap_user() {
  local org=$1
  local tlsauth=$2
  local tlsca=${org}-tls-ca
  local ecertca=${org}-ecert-ca

  echo 'set -x
  echo '${tlsca}'
  echo $FABRIC_CA_CLIENT_HOME

  fabric-ca-client register \
    --id.name rcaadmin \
    --id.secret rcaadminpw \
    --url https://'${tlsca}' \
    --tls.certfiles $FABRIC_CA_CLIENT_HOME/tls-root-cert/tls-ca-cert.pem \
    --mspdir $FABRIC_CA_CLIENT_HOME/tls-ca/tlsadmin/msp

  fabric-ca-client enroll \
    --url https://'${tlsauth}'@'${tlsca}' \
    --tls.certfiles $FABRIC_CA_CLIENT_HOME/tls-root-cert/tls-ca-cert.pem \
    --csr.hosts '${ecertca}' \
    --mspdir $FABRIC_CA_CLIENT_HOME/tls-ca/rcaadmin/msp

  # Important: the rcaadmin signing certificate is referenced by the ECert CA FABRIC_CA_SERVER_TLS_CERTFILE config attribute.
  # For simplicity, reference the key at a fixed, known location
  cp $FABRIC_CA_CLIENT_HOME/tls-ca/rcaadmin/msp/keystore/*_sk $FABRIC_CA_CLIENT_HOME/tls-ca/rcaadmin/msp/keystore/key.pem

  ' | exec kubectl -n $NS exec deploy/${tlsca} -i -- sh
}


# https://hyperledger-fabric-ca.readthedocs.io/en/latest/deployguide/cadeploy.html#register-and-enroll-the-organization-ca-bootstrap-identity-with-the-tls-ca
function register_enroll_ECert_CA_bootstrap_users() {
  echo "Registering and enrolling ECert CA bootstrap users"

  register_enroll_ECert_CA_bootstrap_user rms $TLSADMIN_AUTH


}



function launch_ECert_CAs() {
  echo "Launching ECert CAs"

  launch_CA templates/k8s/rms-ecert-ca.yaml

  kubectl -n $NS rollout status deploy/rms-ecert-ca

  sleep 10

}


function enroll_bootstrap_ECert_CA_user() {
  local org=$1
  local auth=$2
  local ecert_ca=${org}-ecert-ca

  echo 'set -x

  fabric-ca-client enroll \
    --url https://'${auth}'@'${ecert_ca}' \
    --tls.certfiles $FABRIC_CA_CLIENT_HOME/tls-root-cert/tls-ca-cert.pem \
    --mspdir $FABRIC_CA_CLIENT_HOME/'${ecert_ca}'/rcaadmin/msp

  ' | exec kubectl -n $NS exec deploy/${ecert_ca} -i -- sh
}

function enroll_bootstrap_ECert_CA_users() {
  echo "Enrolling bootstrap ECert CA users"

  enroll_bootstrap_ECert_CA_user rms $RCAADMIN_AUTH


}
