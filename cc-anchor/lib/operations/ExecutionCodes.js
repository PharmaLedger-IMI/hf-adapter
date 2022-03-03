class ExecutionCodes {
    // error codes
   statusOK() {
        return 200;
    }
    statusAddedConstSSIOK(){
       return 201;
    }

    statusCannotUpdateReadOnlyAnchor() {
       return 101;
    }

    statusSignatureCheckFailed(){
       return 103;
    }

    statusAnchorAlreadyExists(){
        return 104;
    }

    statusAnchorDoesNotExists(){
        return 105;
    }
}

module.exports = {
    ExecutionCodes
}
