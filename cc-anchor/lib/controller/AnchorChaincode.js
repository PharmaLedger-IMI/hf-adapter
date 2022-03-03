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
            case "createAnchor":
                const createJsonData = JSON.parse(ret.params[1])
                return this.createAnchor(stub,ret.params[0],createJsonData)
                    .then((data) =>{
                            console.log('Finished invoking createAnchor ',ret.params[0],createJsonData);
                            return shim.success(Buffer.from(data.toString()));
                        },
                        (err) =>{
                            return shim.error(Buffer.from(err.toString()));
                        });
            case "appendAnchor":
                const appendJsonData = JSON.parse(ret.params[1])
                return this.appendAnchor(stub,ret.params[0],appendJsonData)
                    .then((data) =>{
                            console.log('Finished invoking appendAnchor ',ret.params[0],appendJsonData);
                            return shim.success(Buffer.from(data.toString()));
                        },
                        (err) =>{
                            return shim.error(Buffer.from(err.toString()));
                        });

            case "getAllVersions":
                return this.getAllVersions(stub,ret.params[0])
                    .then((data) =>{
                            console.log('Finished getAllVersions for ',ret.params[0]);
                            return shim.success(Buffer.from(data));
                        },
                        (err) =>{
                            return shim.error(Buffer.from(err.toString()));
                        });
            case "getLastVersion":
                return this.getLastVersion(stub,ret.params[0])
                    .then((data) =>{
                            console.log('Finished getLastVersion for ',ret.params[0]);
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

    async createAnchor(stub, anchorID, anchorData){
        return await this.anchorOperations.addAnchor(stub, anchorID, anchorData);
    }

    async appendAnchor(stub, anchorID, anchorData){
        return await this.anchorOperations.appendAnchor(stub, anchorID, anchorData);
    }

    async getAllVersions(stub, anchorID){
        return await this.anchorOperations.getAllVersions(stub, anchorID);
    }

    async getLastVersion(stub, anchorID){
        return await this.anchorOperations.getLastVersion(stub, anchorID);
    }

}

module.exports = AnchorChaincode
