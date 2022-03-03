
function MemoryPersistenceStrategy(){
    const self = this;
    const data = new Map();
    self.getLastVersion = function (anchorId, callback){
        //read the last hashlink for anchorId
        if (typeof data.get(anchorId) === 'undefined' || data.get(anchorId).length === 0){
            return callback(undefined,null);
        }
        return callback(undefined, data.get(anchorId)[data.get(anchorId).length - 1]);
    }
    self.getAllVersions = function (anchorId, callback){
        // read all hashlinks for anchorId
        if (typeof data.get(anchorId) === 'undefined'){
            return callback(undefined,[]);
        }
        return callback(undefined, data.get(anchorId));
    }
    self.createAnchor = function (anchorId, anchorValueSSI, callback){
        //check if anchor exist, return error
        if (typeof data.get(anchorId) !== 'undefined' ){
            return callback(Error(`anchor ${anchorId} already exist`));
        }
        //store a new anchorId with anchorValueSSI as new hashlink
        data.set(anchorId,[anchorValueSSI]);
        return callback(undefined, undefined);
    }
    self.appendAnchor = function(anchorId,anchoreValueSSI, callback){
        if (typeof data.get(anchorId) === 'undefined' ){
            return callback(Error(`anchor ${anchorId} does not exist`));
        }
        //store a new hashlink  for the anchorId
        data.get(anchorId).push(anchoreValueSSI);
        return callback(undefined, undefined);
    }

}

function Anchoring(){
    require("../../../privatesky/psknode/bundles/openDSU");
    this.openDSU = require("opendsu");
    const self = this;
    //self.test();
    //self.test = function(){
   //     const fps = new MemoryPersistenceStrategy();
   //     const gab = self.openDSU.loadApi("anchoring").getAnchoringBehaviour(fps);
   //     console.log(gab);
   // }
    self.initialize = function (anchorId){
        self.anchorSSI = self.decodeAndParse(anchorId);
    }

    self.decodeAndParse = function (encodedSSI){
        return self.openDSU.loadAPI("keyssi").parse(encodedSSI);
    }

    self.canAppend = function(){
        return self.anchorSSI.getTypeName() !== self.openDSU.constants.KEY_SSIS.CONSTANT_ZERO_ACCESS_SSI;
    }

    self.isTransfer = function(hashLinkSSI){
        return hashLinkSSI.getTypeName() === self.openDSU.constants.KEY_SSIS.TRANSFER_SSI;
    }

    self.isHashLinkSigned = function(hashlinkSSI){
        return hashlinkSSI.getTypeName() === self.openDSU.constants.KEY_SSIS.SIGNED_HASH_LINK_SSI;
    }

    self.wasHashLinkTransferred = function (hashLinks){
         if (!Array.isArray(hashLinks)){
             throw `hashLinks is not Array. Received ${hashLinks}`;
         }
         for (let i = hashLinks.length-1; i>=0;i--){
             let hashLinkSSI = self.decodeAndParse(hashLinks[i]);
             if (self.isTransfer(hashLinkSSI)){
                 return {
                     wasTransferred : true,
                     signVerifier : hashLinkSSI
                 };
             }
         }
         return {
             wasTransferred: false,
             publicKey: undefined
         }
    }

    self.verifySignature = function (currentHashLink, previousHashLink, hashLinks){
            const currentHashLinkSSI = self.decodeAndParse(currentHashLink);
            const previousHashLinkSSI = previousHashLink === "" || previousHashLink === undefined ? undefined : self.decodeAndParse(previousHashLink);
            let {wasTransferred, signVerifier} = self.wasHashLinkTransferred(hashLinks);

            if (!wasTransferred){
                //no transfer was executed, so we use the public key from the anchor Id
                signVerifier = self.anchorSSI;
            }

            if (self.isTransfer(currentHashLinkSSI)){
                // we have a transfer in progress, but the signature check will be made with the last known public key (either from transfer or from anchor id)
                return verifySignatureInternal(currentHashLinkSSI, previousHashLinkSSI, signVerifier);
            }

            if (!self.isHashLinkSigned(currentHashLinkSSI)){
                //no shl, so we fail
                return false;
            }

            return verifySignatureInternal(currentHashLinkSSI, previousHashLinkSSI, signVerifier);
    }

     function verifySignatureInternal(currentHashLinkSSI, previousHashLinkSSI, signVerifier){
        const signature = currentHashLinkSSI.getSignature();
        const dataToVerify = currentHashLinkSSI.getDataToSign(self.anchorSSI, previousHashLinkSSI);
        return signVerifier.verify(dataToVerify, signature);
    }
}


module.exports =  new Anchoring()

