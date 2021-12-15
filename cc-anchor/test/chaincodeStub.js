const sinon = require('sinon');
const { ChaincodeStub } = require('fabric-shim');

function getChainCodeStub(){
    let chaincodeStub = sinon.createStubInstance(ChaincodeStub);

    chaincodeStub.putState.callsFake((key, value) => {
        if (!chaincodeStub.states) {
            chaincodeStub.states = {};
        }
        chaincodeStub.states[key] = value;
    });

    chaincodeStub.getState.callsFake(async (key) => {
        let ret;
        if (chaincodeStub.states) {
            ret = chaincodeStub.states[key];
        }
        return Promise.resolve(ret);
    });
    return chaincodeStub;
}

module.exports = getChainCodeStub
