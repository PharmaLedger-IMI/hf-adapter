const shim = require('fabric-shim');
const stringify  = require('json-stringify-deterministic');
const util = require('util');

class AnchorChaincode extends shim.ChaincodeInterface {
    async Init(stub) {
        console.log('Init called.');
        return shim.success(Buffer.from('Init called.'));
    }
    async Invoke(stub) {
        console.info('Transaction ID: ' + stub.getTxID());
        console.info(util.format('Args: %j', stub.getArgs()));

        let ret = stub.getFunctionAndParameters();
        console.info('Calling function: ' + ret.fcn);
        console.info('Calling parameters: ' + ret.params);
        switch (ret.fcn) {
            case "check":
                return this.check(stub)
                    .then((data) => {
                        console.log(" Finished invoking check .")
                        return shim.success(Buffer.from(data));
                    },
                        (err) => {
                        console.error(err);
                        return shim.error(Buffer.from(err));
                        });
            case "addAnchor":
                return this.addAnchor(stub,ret.params[0],ret.params[1])
                    .then(() =>{
                        console.log('Finished addAnchor ',ret.params[0]);
                        return shim.success();
                    },
                        (err) =>{
                        return shim.error(Buffer.from(err.toString()));
                        });
            case "getAnchorVersions":
                return this.getAnchorVersions(stub,ret.params[0])
                    .then((data) =>{
                            console.log('Finished getAnchorVersions for ',ret.params[0]);
                            return shim.success(Buffer.from(data));
                        },
                        (err) =>{
                            return shim.error(Buffer.from(err.toString()));
                        });
            default:
                return shim.error(Buffer.from("Method not supported :" + ret.fcn));

        }

    }

    async check(stub){
        console.log("Invoking check method.")
        return "Invoking check method.";
    }

    async addAnchor(stub, anchorID, anchorData){
        /*
        anchorData : {
        controlString,
        newHashLinkSSI,
        ZKPValue,
        lastHashLinkSSI,
        signature,
        publicKey
        }
         */
        await stub.putState(anchorID, Buffer.from(anchorData));
        return "200OK";
    }

    async getAnchorVersions(stub, anchorID){
        const data =  await stub.getState(anchorID);
        const jsonData = data.toString('utf8');
        console.log(`Read data for anchorID : ${anchorID} : \n`, JSON.parse(jsonData));
        return jsonData;
    }
}

function getCCID(){

    if (typeof process.env.CHAINCODE_ID !== "undefined")
    {
        console.log('Using env CHAINCODE_ID : ', process.env.CHAINCODE_ID, typeof process.env.CHAINCODE_ID);
        return process.env.CHAINCODE_ID;
    }

    return undefined;
}


function getaddress(){

    if (typeof process.env.CHAINCODE_SERVER_ADDRESS !== "undefined")
    {
        console.log('Using env CHAINCODE_SERVER_ADDRESS : ', process.env.CHAINCODE_SERVER_ADDRESS, typeof process.env.CHAINCODE_SERVER_ADDRESS);
        return process.env.CHAINCODE_SERVER_ADDRESS;
    }

    return undefined;
}

const server = shim.server(new AnchorChaincode(), {
    ccid: getCCID(),
    address: getaddress()
});

function startChainCodeServer(){
    server.start();
}

module.exports = {
    startChainCodeServer,
    AnchorChaincode
}
