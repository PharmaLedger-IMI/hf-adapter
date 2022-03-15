const sinon = require('sinon');
const { ChaincodeStub } = require('fabric-shim');

function getChainCodeStub(){
    let chaincodeStub = sinon.createStubInstance(ChaincodeStub);

    let fcn;
    let params;
    chaincodeStub.InitSimple = function(method,p1,p2,p3){
        fcn = method;
        params = [];
        if (typeof p1 !== "undefined"){
            params.push(p1);
        }
        if (typeof p2 !== "undefined"){
            params.push(p2);
        }
        if (typeof p3 !== "undefined"){
            params.push(p3);
        }
    }

    chaincodeStub.Init = function(method,anchorId,signedHashLink){
        fcn = method;
        params = [];
        if (typeof anchorId !== "undefined"){
            params.push(anchorId);
        }
        if (typeof signedHashLink !== "undefined"){
            const jsonData = JSON.stringify( {
                "signedHashLink":signedHashLink
            });
            params.push(jsonData);
        }
    }

    chaincodeStub.InitAdapter = function(method,anchorId,jsonData){
        fcn = method;
        params = [];
        if (typeof anchorId !== "undefined"){
            params.push(anchorId);
        }
        if (typeof jsonData !== "undefined"){
            params.push(jsonData);
        }
    }

    chaincodeStub.getTxID.callsFake(() => {
        return "dummy Tr ID";
    });

    chaincodeStub.getArgs.callsFake(() => {
        return "Dummy args";
    });

    chaincodeStub.getFunctionAndParameters.callsFake(() => {
        return {
            "fcn" : fcn,
            "params": params
        }
    })

    chaincodeStub.putState.callsFake(async (key, value) => {
        if (!chaincodeStub.states) {
            chaincodeStub.states = {};
        }
        chaincodeStub.states[key] = value;
        return Promise.resolve();
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
