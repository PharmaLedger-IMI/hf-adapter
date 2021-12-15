function addAnchor(anchoringContract){
    return function(req, res, next) {

        const anchorID = req.params.keySSI;
        console.log('Serving PUT /addAnchor : ', anchorID);
        const body = req.body;
        console.log("body received : ", body);
        try {
            if (body.hash.newHashLinkSSI === undefined || body.hash.lastHashLinkSSI === undefined) {
                console.log('Invalid body', body);
                return res.status(428).send('Invalid body');
            }
        } catch (err) {
            console.log(err);
            return res.status(428).send('Invalid body');
        }
        const base58Alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
        const base58 = require('base-x')(base58Alphabet);
        const keySSI = base58.decode(anchorID).toString().split(':');
        console.log(keySSI);
        /*
                    string anchorID - addAnchor param
                    string keySSIType - keySSI[1]
                    string controlString - keySSI[4]
                    string vn - keySSI[5]
                    string newHashLinkSSI - body
                    string ZKPValue - body.zkp
                    string lastHashLinkSSI - body
                    string signature - body.digitalProof.signature
                    string publicKey - body.digitalProof.publicKey
                    */

        let controlSubstring = base58.decode(keySSI[4]).toString('hex');
        console.log('control string : ',controlSubstring);
        // currently these fields are not used in the smart contract
        //const versionNumber = keySSI[5];
        //const keySSIType = keySSI[1];
        const newHashLinkSSI = body.hash.newHashLinkSSI;
        const lastHashLinkSSI = body.hash.lastHashLinkSSI == null ? newHashLinkSSI : body.hash.lastHashLinkSSI;
        const zkpValue = body.zkp;
        const signature = body.digitalProof.signature;
        const publicKeyRaw = base58.decode(body.digitalProof.publicKey).toString('hex');
        console.log('public key raw : ', publicKeyRaw);
        require('../anchoring/addAnchor').addAnchor(anchoringContract, req.params.keySSI, {
            anchorID,
            newHashLinkSSI,
            lastHashLinkSSI,
            controlSubstring,
            zkpValue,
            signature,
            publicKeyRaw
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
    addAnchor
}
