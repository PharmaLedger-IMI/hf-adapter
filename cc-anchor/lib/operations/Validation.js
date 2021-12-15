class AnchorValidator{
    async AnchorExists(stub, anchorId) {
        const anchorJSON = await stub.getState(anchorId);
        return anchorJSON && anchorJSON.length > 0;
    }

    IsHashlinkOutOfSync(stub,anchor, anchorId, anchorPayload){
        let lastHashLink;
        if (anchor !== undefined){
            if (anchorPayload.lastHashLinkSSI === anchorPayload.newHashLinkSSI){
                console.log('Invalid hashlinks. Possible Replay call for new addAnchor.')
                return true;
            }
            lastHashLink = anchor.hashLinks.pop();
        } else {
            return anchorPayload.newHashLinkSSI !== anchorPayload.lastHashLinkSSI || this.IsNullOrEmpty(anchorPayload.newHashLinkSSI);
        }
        const hashLinksOutOfSync = lastHashLink !== anchorPayload.lastHashLinkSSI ;
        console.log(`Last anchor hashlink : ${lastHashLink}. Add Anchor request lasthashlink : ${anchorPayload.lastHashLinkSSI}. Out Of Sync ? ${hashLinksOutOfSync}`)
        return hashLinksOutOfSync;
    }

    IsPublicKeyVerified(anchor, anchorPayload){
        let controlString;
        if (anchor !== undefined){
            controlString = anchor.controlSubstring;
        } else {
            controlString = anchorPayload.controlSubstring;
        }

        if ( this.IsNullOrEmpty(controlString) || this.IsNullOrEmpty(anchorPayload.publicKeyRaw)){
            console.log('Invalid control string or public key.')
            return false;
        }
        const phash = require('crypto')
            .createHash('sha256')
            .update(Buffer.from(anchorPayload.publicKeyRaw,'hex'))
            .digest().toString('hex');
        console.log(anchor, anchorPayload, phash,controlString);
        return phash === controlString;
    }

    IsSignatureVerified(anchorPayload){
        //todo
        return true;
    }

    IsNullOrEmpty(data){
        return data === null || data === '' || data === {};
    }
}


module.exports = {
    AnchorValidator
}
