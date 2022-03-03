/*
                  string anchorID - addAnchor param
                  string keySSIType - keySSI[1] - IF cza - update is not possible, only creation, otherwise do add/update
                  string controlString - keySSI[4] - public key value
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
                hashlink : Sn8Ne44Tiohfi72jwh9t9zBAX4vzHprGPinmYeUA6ssNNBcLajgGWH4vPShLacky4ofbtjYxR5EALN6Bn9N5nJUPV372rRMm8Xkfp744JEnj8abgrYdpyPj3necqTHUNcAguYmiTLKw2Spfts7KTb5ji9TjVKwtqTauXGngAKHhGT12VdXCZCyKFWS7EPbBCyWjJKTDjtPTQrixEHvdhCaqmSeYE87UQGvLcuAvHCUpXLLCdrYEhvogjasjhx2M5uB69fKhPjbwx6oDDPBgubKNgdznoAcc7tKT238zp8bXWXf9CFBb9XShrMGp4KbRdi9YKRvtWbXQAKVubvaFxGEQbL6FWaPcpzY4uyQQ8y89MsV
                decoded : ssi:shl:epipoc.demo:8CMSWcELLmNmVT8u326KSXgRdMp9ubpuJjZKwZ5xfstt:1634813532846/AN1rKoswdHnCv1VwzUDRQP8PhJpbpUYKuGdF3B1XB5VEraZtf92jxfse2e7yCRRMJL8G3ffhvHePFjkVtabPgZTkMCkK4zKH2/PnzoCBTC5ToT29KvBJM2d1cP5C2CRijV2oDLdTNbNAQ3WHDN2x1QKtE4Bpdi6JtiKyCKCbR6Nq6ofJRhWqqHhiMD:v0


                //data
                anchorid : ArzZh8TxNMevR6QanDX8ixBgc8y2FQvxijedXanPpAgoWCcm6GsQFSBjAH2c5XVZuk1TYo1YBcgEWafg1zLnrw7KPKUi9vcXVkUbVMJVeHazyovg4Cgw1EyLVwXuxpUzdBX7WiKkctK5JgHnP
                    ssi:sza:vault::NZba4aXsqGj6qTbn4MuHTY3yiuZkHXMLh8FLSPTyEasPS3GkebyuCWiiLQ1kR77J85Kf2pnQPGFMasn7cTp4eBeg:v0
                hashlink1 : 2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzYcc2GgzRdtHuVuexm8k6HMVTHehkGtxCqAUkXhqXgRjVJtu1M77sfNnw3AcUxbRk41aoCzYd6XMBf55hYwxb34fh4MgTWwHmtzZzCMeqjS2Asw6ba1AXSRBJmAGbFxMkihPhkN3
                 ssi:shl:vault:5dDtRCQukB4NQtqPWvyHwVUKMpwiABxi93cJW7eLjQww:1642763906227/AN1rKqa8CtL2CSXdLK1kFXp9WsUMaenv2UooBtHwwHiHEPRQUtVGLQtHm7z4WVrEnjCe4LJUaHJGn5Huzu9gwuLv5S2sJYhSG:v0
                hashlink2 : HxMN6F7bEr3MPNP5tKMnX9dW9gftm6g7Dy5UBZFkPYR5UxqmzpV2pP53LGJjjdjMCsYAm4e1MgS6GDffteHP8Mga54pRvaBFJxLRmHmsqSC7cGCrsvc7nxamJYmBDEbcshoEx1ZsrvjfFs8A2dWxdQsiWnghNeZ29eo1jmtgcNYhDC8fZQj9bHhiwQ5QUNqZXSFnVGXZjU5K1rsUvhUGyRMcJaqkpZFF9NnpgoZTJjy
                 ssi:shl:vault:H87hKjSodt1xRPDJUnQ7eUJVF3knqT9bGnjYQ2SDHHts:1642763907319/381yXYqKf5z9w4DVbn2bGe98GRHNpwYYLMn5avDdD9PYyTDMcdSFXybLQHowsgUNHiEZLdtQkatdA9sahuizZjY9RuXhwBUV:v0


                  */


class AnchorOperations{
    anchorValidator;
    executionCodes;
    constructor() {
        const AnchorValidator = require('./Validation').AnchorValidator
        const ExecutionCodes = require('./ExecutionCodes').ExecutionCodes

        this.anchorValidator = new AnchorValidator();
        this.executionCodes = new ExecutionCodes();
        this.anchoring = require('../anchoring/Anchoring');
    }

    async appendAnchor(stub, anchorId, anchorPayload){
        console.log('invoke of the appendAnchor sc method:', anchorId, anchorPayload);
        //if anchorID not exists, return error code
        const anchorExists = await this.anchorValidator.AnchorExists(stub, anchorId);
        if (!anchorExists){
            return this.executionCodes.statusAnchorDoesNotExists();
        }
        this.anchoring.initialize(anchorId);

        if (this.anchoring.canAppend()){
            return await this._appendSZAAnchor(stub, anchorPayload);
        }
        return this.executionCodes.statusCannotUpdateReadOnlyAnchor();
    }

    async addAnchor(stub, anchorId, anchorPayload){
        //if anchorID exists, return error code
        const anchorExists = await this.anchorValidator.AnchorExists(stub, anchorId);
        if (anchorExists){
            return this.executionCodes.statusAnchorAlreadyExists();
        }
        this.anchoring.initialize(anchorId);

        if (this.anchoring.canAppend()){
            //regular
            return await this._addSZAAnchor(stub, anchorPayload);
        }

        //const
        return await this._addCZAAnchor(stub, anchorPayload);

    }

    async _addSZAAnchor(stub,  anchorPayload){
        const currentHashLink = anchorPayload.signedHashLink;
        const previousHashLink = undefined;
        if (!this.anchoring.verifySignature(currentHashLink, previousHashLink,[])){
            return this.executionCodes.statusSignatureCheckFailed();
        }
        const anchorId = anchorPayload.anchorId;
        console.log('Add new regular anchor with payload : ', anchorPayload);
        const data = {
            "anchorId": anchorId,
            "isReadOnly": false,
            "hashLinks": [anchorPayload.signedHashLink]
        }
        return await this._storeAnchor(stub, anchorId, data);
    }

    async _addCZAAnchor(stub, anchorPayload){
        const anchorId = anchorPayload.anchorId;
        console.log('Add new const anchor with payload : ', anchorPayload);
        const data = {
            "anchorId": anchorId,
            "isReadOnly": true,
            "hashLinks": [anchorPayload.signedHashLink]
        }
        return await this._storeConstAnchor(stub, anchorId, data);
    }

    async _appendSZAAnchor(stub, anchorPayload){
        const anchorId = anchorPayload.anchorId;
        const existingAnchor = await this._getAnchor(stub, anchorId);
        const currentHashLink = anchorPayload.signedHashLink;
        const previousHashLink = existingAnchor.hashLinks[existingAnchor.hashLinks.length-1]
        if (!this.anchoring.verifySignature(currentHashLink, previousHashLink,existingAnchor.hashLinks)){
            console.log('Failed to verify signature');
            return this.executionCodes.statusSignatureCheckFailed();
        }

        existingAnchor.hashLinks.push(anchorPayload.signedHashLink);
        console.log('Add new hashlink for anchor : ', existingAnchor);
        return await this._storeAnchor(stub, anchorId, existingAnchor);
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

    async getLastVersion(stub, anchorId){
        if (await this.anchorValidator.AnchorExists(stub, anchorId)){
            const scAnchorData = await this._getAnchor(stub, anchorId);
            return JSON.stringify(
                [scAnchorData.hashLinks[scAnchorData.hashLinks.length-1]]
            );
        }
        return JSON.stringify([]);
    }

    async getAllVersions(stub, anchorId){
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
