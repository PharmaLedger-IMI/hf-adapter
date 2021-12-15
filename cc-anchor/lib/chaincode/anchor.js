const shim = require('fabric-shim');

function getCCID(){

    if (typeof process.env.CHAINCODE_ID !== "undefined")
    {
        console.log('Using env CHAINCODE_ID : ', process.env.CHAINCODE_ID, typeof process.env.CHAINCODE_ID);
        return process.env.CHAINCODE_ID;
    }

    return undefined;
}


function getAddress(){

    if (typeof process.env.CHAINCODE_SERVER_ADDRESS !== "undefined")
    {
        console.log('Using env CHAINCODE_SERVER_ADDRESS : ', process.env.CHAINCODE_SERVER_ADDRESS, typeof process.env.CHAINCODE_SERVER_ADDRESS);
        return process.env.CHAINCODE_SERVER_ADDRESS;
    }

    return undefined;
}



function startChainCodeServer(){
    const AnchorChaincode = require('../controller/AnchorChaincode');
    const server = shim.server(new AnchorChaincode(), {
        ccid: getCCID(),
        address: getAddress()
    });
    server.start();
}

module.exports = {
    startChainCodeServer
}
