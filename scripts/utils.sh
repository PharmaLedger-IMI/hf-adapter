#!/bin/bash

function check_prereqs() {

  docker version > /dev/null
  if [[ $? -ne 0 ]]; then
    echo "No 'docker' available"
    exit 1
  fi

  kubectl > /dev/null
  if [[ $? -ne 0 ]]; then
    echo "No 'kubectl' available"
    exit 1
  fi
}
