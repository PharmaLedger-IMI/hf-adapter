const shim = require('fabric-shim');
const util = require('util');


class AnchorChaincode extends shim.ChaincodeInterface {
    anchorOperations;
    constructor() {
        super();

        const AnchorOperations = require('../operations/AnchorOperations').AnchorOperations;
        this.anchorOperations = new AnchorOperations();
    }

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
                return this.check()
                    .then((data) => {
                            console.log(" Finished invoking check .")
                            return shim.success(Buffer.from(data));
                        },
                        (err) => {
                            console.error(err);
                            return shim.error(Buffer.from(err));
                        });
            case "addAnchor":
                const jsonData = JSON.parse(ret.params[1])
                return this.addAnchor(stub,ret.params[0],jsonData)
                    .then((data) =>{
                            console.log('Finished invoking addAnchor ',ret.params[0],jsonData);
                            return shim.success(Buffer.from(data.toString()));
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

    async check(){
        console.log("Invoking check method.")
        return "Invoking check method.";
    }

    async addAnchor(stub, anchorID, anchorData){
        return await this.anchorOperations.addAnchor(stub, anchorID, anchorData);
    }

    async getAnchorVersions(stub, anchorID){
        return await this.anchorOperations.getAnchorVersions(stub, anchorID);
    }
}

module.exports = AnchorChaincode
