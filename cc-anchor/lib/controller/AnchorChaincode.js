const shim = require('fabric-shim');
const util = require('util');


class AnchorChaincode extends shim.ChaincodeInterface {
    constructor() {
        super();
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
        const HLFPersistence = require('../chaincode/hlfPersistence');
        const hlfPersistence = new HLFPersistence(stub);
        require("../../../privatesky/psknode/bundles/openDSU");
        const openDSU = require("opendsu");
        const AnchoringBCC = openDSU.loadApi("anchoring").getAnchoringBehaviour(hlfPersistence);
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
                return $$.promisify(AnchoringBCC.createAnchor)(ret.params[0], createJsonData.signedHashLink).then(
                    () => {
                        return shim.success();
                    },
                    (err) => {
                        return shim.error(Buffer.from(err.toString()));
                    }
                );
            case "appendAnchor":
                const appendJsonData = JSON.parse(ret.params[1])
                return $$.promisify(AnchoringBCC.appendAnchor)(ret.params[0], appendJsonData.signedHashLink).then(
                    () => {
                        return shim.success();
                    },
                    (err) => {
                        return shim.error(Buffer.from(err.toString()));
                    }
                )
            case "getAllVersions":
                return $$.promisify(AnchoringBCC.getAllVersions)(ret.params[0]).then(
                    (data) => {
                        return shim.success(Buffer.from(JSON.stringify(data)));
                    },
                    (err) => {
                        return shim.error(Buffer.from(err.toString()));
                    }
                )
            case "getLastVersion":
                return $$.promisify(AnchoringBCC.getLastVersion)(ret.params[0]).then(
                    (data) => {
                        let returnData = data;
                        if (typeof data === "undefined") {
                            returnData = "";
                        }
                        return shim.success(Buffer.from(JSON.parse(JSON.stringify(returnData))));
                    },
                    (err) => {
                        return shim.error(Buffer.from(err.toString()));
                    }
                )
            case "dumpAnchors" :
                try {
                    //zero index  eg. 0, 3, maxsize of the returned buffer
                    const from = ret.params[0];
                    let to = ret.params[1];
                    const maxSize = ret.params[2];
                    const currentNoOfAnchors = await $$.promisify(hlfPersistence.getTotalNumberOfAnchors)();
                    if (currentNoOfAnchors > to){
                        to = currentNoOfAnchors;
                    }
                    const dumpAnchors = []
                    for(let i = from; i < to;i++){
                        const anchorId = await $$.promisify(hlfPersistence.getAnchorIdOnIndex)(i);
                        const allVersions = await $$.promisify(hlfPersistence.getAllVersions)(anchorId);
                        dumpAnchors.push({
                            anchorId: anchorId,
                            anchorValues: allVersions
                        });
                        const size = Buffer.from(JSON.stringify(dumpAnchors)).length
                        if (size > maxSize){
                            return shim.success(Buffer.from(JSON.stringify(dumpAnchors)))
                        }
                    }
                    return shim.success(Buffer.from(JSON.stringify(dumpAnchors)))
                } catch (err){
                    return shim.error(Buffer.from(err.toString()));
                }
            case "totalNumberOfAnchors":
                return $$.promisify(hlfPersistence.getTotalNumberOfAnchors)().then(
                    (data) =>{
                        let returnData = data;
                        if (typeof data === "undefined") {
                            returnData = 0;
                        }
                        return shim.success(Buffer.from(returnData.toString()));
                    },
                    (err) => {
                        return shim.error(Buffer.from(err.toString()));
                    }
                )
            case "createOrAppendMultipleAnchors":
                // input array of {anchorId, signedHashLink}
                try {
                    const input = JSON.parse(ret.params[0]);
                    for (let i = 0; i < input.length ; i++) {
                        const data = input[i];
                        const anchorExists = await $$.promisify(hlfPersistence.anchorExist)(data.anchorId);
                        if (!anchorExists){
                            await $$.promisify(AnchoringBCC.createAnchor)(data.anchorId,data.signedHashLink);
                        }
                        else{
                            await $$.promisify(AnchoringBCC.appendAnchor)(data.anchorId,data.signedHashLink);
                        }
                    }
                    return shim.success();
                } catch (err){
                    return shim.error(Buffer.from(err.toString()));
                }
            default:
                return shim.error(Buffer.from("Method not supported :" + ret.fcn));
        }

    }

    async check(){
        console.log("Invoking check method.")
        return "Invoking check method.";
    }

}

module.exports = AnchorChaincode
