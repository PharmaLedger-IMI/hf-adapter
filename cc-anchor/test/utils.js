require("../../privatesky/psknode/bundles/openDSU");
let keySSIApis = require("opendsu").loadAPI("keyssi");

function generateSeedSSI(){
    const domain = 'default';
    return keySSIApis.createSeedSSI(domain);
}

function generateConstSSI(constString){
    const domain = 'default';
    return keySSIApis.createConstSSI(domain,constString);
}

function getAnchorId(seedSSI){
    return seedSSI.getAnchorId();
}

async function getSignedHashLink(seedSSI, previousSignHashLinkId){
    const domain = 'default';
    let anchorSSI = keySSIApis.parse(getAnchorId(seedSSI));
    let previousSignHashLinkSSI = null;
    if (previousSignHashLinkId){
        previousSignHashLinkSSI = keySSIApis.parse(previousSignHashLinkId);
    }
    const timestamp = Date.now();

    const dummy = keySSIApis.createSignedHashLinkSSI(domain, "HASH1", timestamp, "signature", seedSSI.getVn());
    let dataToSign = dummy.getDataToSign(anchorSSI,previousSignHashLinkSSI);

    let signature = await $$.promisify(seedSSI.sign)(dataToSign);
    const signedHashLinkSSI = keySSIApis.createSignedHashLinkSSI(domain, "HASH1", timestamp, signature, seedSSI.getVn());
    return signedHashLinkSSI.getIdentifier();
}


function getHashLink(constSSI,hashData){
    const domain = 'default';
    let hash = "some hash data";
    if (typeof hashData !== "undefined")
    {
        hash = hashData;
    }
    return keySSIApis.createHashLinkSSI(domain,hash, constSSI.getVn(),'hint').getIdentifier();
}



module.exports = {
    getAnchorId,
    getSignedHashLink,
    generateSeedSSI,
    generateConstSSI,
    getHashLink
}
