class AnchorOperations{
    anchorValidator;
    executionCodes;
    constructor() {
        const AnchorValidator = require('./Validation').AnchorValidator
        const ExecutionCodes = require('./ExecutionCodes').ExecutionCodes

        this.anchorValidator = new AnchorValidator();
        this.executionCodes = new ExecutionCodes();
    }
    async addAnchor(stub, anchorId, anchorPayload){
        //handle const anchors
        const anchorExists = await this.anchorValidator.AnchorExists(stub, anchorId);
        if (!anchorExists && this.anchorValidator.IsNullOrEmpty(anchorPayload.controlSubstring))
        {
            // we have const, return ok
            return await this._addConstAnchor(stub, anchorId, anchorPayload);
        }

        if (await this._isConstAnchorInUpdateMode(stub,anchorExists, anchorId))
        {
            //we have const in update mode, return error
            return this.executionCodes.statusCannotUpdateReadOnlyAnchor();
        }

        // handle normal anchoring
        return await this._addOrUpdateAnchor(stub,anchorExists, anchorId, anchorPayload);
    }

    async _isConstAnchorInUpdateMode(stub, anchorExists, anchorId){
        if (anchorExists){
            const anchor = await this._getAnchor(stub, anchorId);
            return anchor.isReadOnly;
        }
        return false;
    }

    async _addOrUpdateAnchor(stub,anchorExists, anchorId, anchorPayload){
        let anchor;
        if (anchorExists){
            anchor = await this._getAnchor(stub, anchorId);
        }
        if (!this.anchorValidator.IsSignatureVerified(anchorPayload)){
            return this.executionCodes.statusSignatureCheckFailed();
        }

        if (!this.anchorValidator.IsPublicKeyVerified(anchor,anchorPayload)){
            console.log('Failed to verify the public key : ', anchorPayload);
            console.log('Existing anchor : ', anchor);
            return this.executionCodes.statusHashOfPublicKeyDoesntMatchControlString();
        }

        if (this.anchorValidator.IsHashlinkOutOfSync(stub,anchor, anchorId, anchorPayload)){
            console.log('Hashlinks are out of sync.')
            return this.executionCodes.statusHashLinkOutOfSync();
        }

        return await this._addOrUpdateAnchorInternal(stub, anchorId, anchorPayload);

    }

    async _addOrUpdateAnchorInternal(stub, anchorId, anchorPayload){
        const anchorExists = await this.anchorValidator.AnchorExists(stub, anchorId);
        if (anchorExists){

            const anchors = await this._getAnchor(stub, anchorId);
            anchors.hashLinks.push(anchorPayload.newHashLinkSSI);
            console.log('Add new hashlink for anchor : ', anchors);
            return await this._storeAnchor(stub, anchorId, anchors);
        }
        console.log('Add new anchor with payload : ', anchorPayload);
        const data = {
            "anchorId": anchorId,
            "isReadOnly": false,
            "controlSubstring": anchorPayload.controlSubstring,
            "hashLinks": [anchorPayload.newHashLinkSSI]
        }
        return await this._storeAnchor(stub, anchorId, data);
    }

    async _addConstAnchor(stub, anchorId, anchorPayload){
        const data = {
            "anchorId": anchorId,
            "isReadOnly": true,
            "hashLinks": [anchorPayload.newHashLinkSSI]
        }
        return await this._storeConstAnchor(stub, anchorId, data);
    }

    async _storeConstAnchor(stub, anchorId, data){
        console.log('Storing CONST anchor information : ',data);
        const jsonStr = JSON.stringify(data);
        await stub.putState(anchorId, Buffer.from(jsonStr));
        return this.executionCodes.statusAddedConstSSIOK();
    }

    async _storeAnchor(stub, anchorId, data){
        console.log('Storing normal anchor information : ',data);
        const jsonStr = JSON.stringify(data);
        await stub.putState(anchorId, Buffer.from(jsonStr));
        return this.executionCodes.statusOK();
    }

    async getAnchorVersions(stub, anchorId){
        if (await this.anchorValidator.AnchorExists(stub, anchorId)){
            const scAnchorData = await this._getAnchor(stub, anchorId);
            return JSON.stringify(scAnchorData.hashLinks);
        }
        return JSON.stringify([]);
    }

    async _getAnchor(stub, anchorId){
        const data =  await stub.getState(anchorId);
        const jsonData = JSON.parse(data.toString('utf8'));
        console.log('Reading stored anchor : ',jsonData);
        return jsonData;
    }
}



module.exports = {
    AnchorOperations
}
