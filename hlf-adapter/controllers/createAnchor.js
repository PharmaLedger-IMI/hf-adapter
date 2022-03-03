function createAnchor(anchoringContract){
    return function(req, res, next) {

        const anchorID = req.params.keySSI;
        console.log('Serving PUT /create-anchor : ', anchorID);
        const body = req.body;
        console.log("body received : ", body);
        try {
            if (body.hashLinkSSI === undefined) {
                console.log('Invalid body ', body);
                return res.status(428).send('Invalid body');
            }
        } catch (err) {
            console.log(err);
            return res.status(428).send('Invalid body');
        }
        const signedHashLinkSSI = body.hashLinkSSI;
        const zkp = body.zkp;

        //const base58Alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        //const base58 = require('base-x')(base58Alphabet);
        //const keySSI = base58.decode(anchorID).toString().split(':');
        //console.log(keySSI);
        /*
                    string anchorID - addAnchor param
                    string keySSIType - keySSI[1] - IF cza - update is not possible, only creation, otherwise do add/update
                    string controlString - keySSI[4] - public key value - format raw -> convert in pem pentru verificare semnatura
                    string vn - keySSI[5]
                    string signed hashLinkSSI - body.hashLinkSSI
                    string ZKPValue - body.zkp

                    signed hash link SSI - TYPE shl : ssi:shl:Domain:brickMapHash:timestamp/Signature Of The Current Owner:vn:Hint
                                            signature :  sign(hash(anchorID | lastEntryInAnchor |  timestamp | brickMapHash), currentOwnerPrivateKy)
                                            check signature : 1. build hash(anchorID, last stored hash link, timestamp from the current hash link, brickMapHash from the current hashlink)
                                                              2. get public key from anchor ID - when anchor is created otherwise from the smart contract
                                                              3. check signature
                    signed hash link SSI transfer - TYPE transfer : ssi:transfer:Domain:new Public Key:timestamp/Signature Of The Current Owner:vn:Hint
                                            signature : sign(hash(anchorID | lastEntryInAnchor | timestamp | new Public Key), currentPrivateKey)
                                            check signature : 1. build hash(AnchorID, last stored hash link, timestamp from the current hash link, public key from the current hash link)
                                                               2. get public key from the smart contract for this anchorID or from AnchorID if it doesnt exist
                                                               3. check signature
                                                               4. update in smart contract the public key for sign check for future hash links for this anchorID

                    */

       // let publicKey = base58.decode(keySSI[4]).toString('hex');
       // console.log('public key string : ',publicKey);
        // currently these fields are not used in the smart contract
        //const versionNumber = keySSI[5];
        //const keySSIType = keySSI[1];
       // const newHashLinkSSI = body.hash.newHashLinkSSI;
       // const lastHashLinkSSI = body.hash.lastHashLinkSSI == null ? newHashLinkSSI : body.hash.lastHashLinkSSI;
       // const zkpValue = body.zkp;
       // const signature = body.digitalProof.signature;
       // const publicKeyRaw = base58.decode(body.digitalProof.publicKey).toString('hex');
       // console.log('public key raw : ', publicKeyRaw);
        require('../anchoring/createAnchor').createAnchor(anchoringContract, anchorID, {
            "anchorId": anchorID,
            "signedHashLink":signedHashLinkSSI,
            "zkp": zkp
        }).then(
            (data) => {
                console.log('data received : ', data);
                if (data === "200" || data === "201")
                {
                    res.status(200).end(data);
                } else {
                    console.log('response status send  428');
                    res.status(428).end(data);
                }
            },
            (err) => {
                res.status(500).end(err.toString());
            }
        );
    }
}



module.exports = {
    createAnchor
}
