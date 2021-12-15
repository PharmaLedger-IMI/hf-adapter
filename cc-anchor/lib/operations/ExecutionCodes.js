class ExecutionCodes {
    // error codes
   statusOK() {
        return 200;
    }
    statusAddedConstSSIOK(){
       return 201;
    }

    statusHashLinkOutOfSync() {
       return 100;
    }

    statusCannotUpdateReadOnlyAnchor() {
       return 101;
    }

    statusHashOfPublicKeyDoesntMatchControlString(){
       return 102;
    }

    statusSignatureCheckFailed(){
       return 103;
    }

}

module.exports = {
    ExecutionCodes
}
