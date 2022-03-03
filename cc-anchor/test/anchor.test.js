'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const { ChaincodeStub } = require('fabric-shim');
const AnchorCC = require('../lib/controller/AnchorChaincode');


describe('Anchoring Tests', () => {

    let chaincodeStub;
    beforeEach(() => {
        chaincodeStub = sinon.createStubInstance(ChaincodeStub);

        chaincodeStub.putState.callsFake((key, value) => {
            if (!chaincodeStub.states) {
                chaincodeStub.states = {};
            }
            chaincodeStub.states[key] = value;
        });

        chaincodeStub.getState.callsFake(async (key) => {
            let ret;
            if (chaincodeStub.states) {
                ret = chaincodeStub.states[key];
            }
            return Promise.resolve(ret);
        });

    });

    describe('Test Check', () => {
        it('should return success on Check', async () => {
            let anchorCC = new AnchorCC();
            const data = await anchorCC.check(chaincodeStub);
            expect(data).to.be.equal("Invoking check method.");
        });
        it ('should return empty array for non existing anchors', async () =>{
            let anchorCC = new AnchorCC();
            const data = await anchorCC.getAllVersions(chaincodeStub,"112");
            const json = JSON.parse(data);
            expect(json.length).to.be.equal(0);
        });
        it('should add anchor and be able to read it back', async () => {
            let anchorCC = new AnchorCC();
            const anchorId = "ArzZh8TxNMevR6QanDX8ixBgc8y2FQvxijedXanPpAgoWCcm6GsQFSBjAH2c5XVZuk1TYo1YBcgEWafg1zLnrw7KPKUi9vcXVkUbVMJVeHazyovg4Cgw1EyLVwXuxpUzdBX7WiKkctK5JgHnP";
            const anchorData = {
                "anchorId" : anchorId,
                "signedHashLink": "2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzYcc2GgzRdtHuVuexm8k6HMVTHehkGtxCqAUkXhqXgRjVJtu1M77sfNnw3AcUxbRk41aoCzYd6XMBf55hYwxb34fh4MgTWwHmtzZzCMeqjS2Asw6ba1AXSRBJmAGbFxMkihPhkN3",
                "zkp": ""
            };
            const status = await anchorCC.createAnchor(chaincodeStub,anchorId, anchorData);
            expect(status).to.be.equal( 200);
            const data = await anchorCC.getAllVersions(chaincodeStub,anchorId);
            const json = JSON.parse(data);
            expect(json.length).to.be.equal( 1);
            expect(json[0]).to.be.equal('2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzYcc2GgzRdtHuVuexm8k6HMVTHehkGtxCqAUkXhqXgRjVJtu1M77sfNnw3AcUxbRk41aoCzYd6XMBf55hYwxb34fh4MgTWwHmtzZzCMeqjS2Asw6ba1AXSRBJmAGbFxMkihPhkN3');
        });

        it('should add new const anchor', async () =>{
            let anchorCC = new AnchorCC();
            const anchorId = "ArzZh8FqkKL9EpMFTspJhfXfTRBEGCb8EKqhNi3TGEKjBqmhLuwvDKCHTJKqdo1rnCTX7u2NmQtdkbEDJgZabRs1oZjo3KneYr7JzU8tuK1FYHmgxDrF2z3qFwMCMULbr7pCLdogfV6xhNY2s";
            const anchorData = {
                "anchorId" : anchorId,
                "signedHashLink": "2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzYcc2GgzRdtHuVuexm8k6HMVTHehkGtxCqAUkXhqXgRjVJtu1M77sfNnw3AcUxbRk41aoCzYd6XMBf55hYwxb34fh4MgTWwHmtzZzCMeqjS2Asw6ba1AXSRBJmAGbFxMkihPhkN3",
                "zkp": ""
            };

            let status = await anchorCC.createAnchor(chaincodeStub,anchorId, anchorData);
            expect(status).to.be.equal(201);
            const data = await anchorCC.getAllVersions(chaincodeStub,anchorId);
            const json = JSON.parse(data);
            expect(json.length).to.be.equal(1);
            expect(json[0]).to.be.equal('2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzYcc2GgzRdtHuVuexm8k6HMVTHehkGtxCqAUkXhqXgRjVJtu1M77sfNnw3AcUxbRk41aoCzYd6XMBf55hYwxb34fh4MgTWwHmtzZzCMeqjS2Asw6ba1AXSRBJmAGbFxMkihPhkN3')
        });


        it('should add anchor and add new hashlinks if required', async () => {
            let anchorCC = new AnchorCC();
            let anchorId = "ArzZh8TxNMevR6QanDX8ixBgc8y2FQvxijedXanPpAgoWCcm6GsQFSBjAH2c5XVZuk1TYo1YBcgEWafg1zLnrw7KPKUi9vcXVkUbVMJVeHazyovg4Cgw1EyLVwXuxpUzdBX7WiKkctK5JgHnP";
            let anchorData = {
                "anchorId" : anchorId,
                "signedHashLink": "2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzYcc2GgzRdtHuVuexm8k6HMVTHehkGtxCqAUkXhqXgRjVJtu1M77sfNnw3AcUxbRk41aoCzYd6XMBf55hYwxb34fh4MgTWwHmtzZzCMeqjS2Asw6ba1AXSRBJmAGbFxMkihPhkN3",
                "zkp": ""
            };
            let status = await anchorCC.createAnchor(chaincodeStub,anchorId, anchorData);
            expect(status).to.be.equal( 200);
            anchorData = {
                "anchorId" : anchorId,
                "signedHashLink": "HxMN6F7bEr3MPNP5tKMnX9dW9gftm6g7Dy5UBZFkPYR5UxqmzpV2pP53LGJjjdjMCsYAm4e1MgS6GDffteHP8Mga54pRvaBFJxLRmHmsqSC7cGCrsvc7nxamJYmBDEbcshoEx1ZsrvjfFs8A2dWxdQsiWnghNeZ29eo1jmtgcNYhDC8fZQj9bHhiwQ5QUNqZXSFnVGXZjU5K1rsUvhUGyRMcJaqkpZFF9NnpgoZTJjy",
                "zkp": ""
            };
            status = await anchorCC.appendAnchor(chaincodeStub,anchorId, anchorData);
            expect(status).to.be.equal( 200);
            let data = await anchorCC.getAllVersions(chaincodeStub,anchorId);
            let json = JSON.parse(data);
            expect(json.length).to.be.equal(2);
            expect(json[0]).to.be.equal("2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzYcc2GgzRdtHuVuexm8k6HMVTHehkGtxCqAUkXhqXgRjVJtu1M77sfNnw3AcUxbRk41aoCzYd6XMBf55hYwxb34fh4MgTWwHmtzZzCMeqjS2Asw6ba1AXSRBJmAGbFxMkihPhkN3");
            expect(json[1]).to.be.equal("HxMN6F7bEr3MPNP5tKMnX9dW9gftm6g7Dy5UBZFkPYR5UxqmzpV2pP53LGJjjdjMCsYAm4e1MgS6GDffteHP8Mga54pRvaBFJxLRmHmsqSC7cGCrsvc7nxamJYmBDEbcshoEx1ZsrvjfFs8A2dWxdQsiWnghNeZ29eo1jmtgcNYhDC8fZQj9bHhiwQ5QUNqZXSFnVGXZjU5K1rsUvhUGyRMcJaqkpZFF9NnpgoZTJjy");
            data = await anchorCC.getLastVersion(chaincodeStub, anchorId);
            json = JSON.parse(data);
            expect(json.length).to.be.equal(1);
            expect(json[0]).to.be.equal("HxMN6F7bEr3MPNP5tKMnX9dW9gftm6g7Dy5UBZFkPYR5UxqmzpV2pP53LGJjjdjMCsYAm4e1MgS6GDffteHP8Mga54pRvaBFJxLRmHmsqSC7cGCrsvc7nxamJYmBDEbcshoEx1ZsrvjfFs8A2dWxdQsiWnghNeZ29eo1jmtgcNYhDC8fZQj9bHhiwQ5QUNqZXSFnVGXZjU5K1rsUvhUGyRMcJaqkpZFF9NnpgoZTJjy");
        });

        it('should fail when updating const anchor', async () =>{
            let anchorCC = new AnchorCC();
            const anchorId = "ArzZh8FqkKL9EpMFTspJhfXfTRBEGCb8EKqhNi3TGEKjBqmhLuwvDKCHTJKqdo1rnCTX7u2NmQtdkbEDJgZabRs1oZjo3KneYr7JzU8tuK1FYHmgxDrF2z3qFwMCMULbr7pCLdogfV6xhNY2s";
            let anchorData = {
                "anchorId" : anchorId,
                "signedHashLink": "2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzYcc2GgzRdtHuVuexm8k6HMVTHehkGtxCqAUkXhqXgRjVJtu1M77sfNnw3AcUxbRk41aoCzYd6XMBf55hYwxb34fh4MgTWwHmtzZzCMeqjS2Asw6ba1AXSRBJmAGbFxMkihPhkN3",
                "zkp": ""
            };
            let status = await anchorCC.createAnchor(chaincodeStub,anchorId, anchorData);
            expect(status).to.be.equal(201);
            anchorData = {
                "anchorId" : anchorId,
                "signedHashLink": "random data .. doesn't matter",
                "zkp": ""
            };
            status = await anchorCC.appendAnchor(chaincodeStub,anchorId, anchorData);
            expect(status).to.be.equal(101);
        });

        it('should fail to add a new anchor with invalid signature', async () => {
            let anchorCC = new AnchorCC();
            let anchorId = "ArzZh8TxNMevR6QanDX8ixBgc8y2FQvxijedXanPpAgoWCcm6GsQFSBjAH2c5XVZuk1TYo1YBcgEWafg1zLnrw7KPKUi9vcXVkUbVMJVeHazyovg4Cgw1EyLVwXuxpUzdBX7WiKkctK5JgHnP";
            let anchorData = {
                "anchorId" : anchorId,
                "signedHashLink": "2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzsWZmm6vhG8ta2qSYS13AwVPB65xMZwpQzYzuQVTDntPksubbmYkGbXSueyQqH5Zoa9xgvKsPZxZMoCRbAEbe1MKsyZ6Ykv7u5fZjoNVNWhwXwe6Bjp8DbofqxfthSs8Q5iScu4B",
                "zkp": ""
            };
            const status = await anchorCC.createAnchor(chaincodeStub,anchorId, anchorData);
            expect(status).to.be.equal( 103);
        });


    });

})
