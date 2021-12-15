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
            const data = await anchorCC.getAnchorVersions(chaincodeStub,"112");
            const json = JSON.parse(data);
            expect(json.length).to.be.equal(0);
        });
        it('should add anchor and be able to read it back', async () => {
            let anchorCC = new AnchorCC();
            const anchorData = {
                "newHashLinkSSI": "Sn8Ne44Tiohfi72jwh9t9zBAX4vzHprGPinmYeUA6ssNNBcLajgGWH4vPShLacky4ofbtjYxR5EALN6Bn9N5nJUPV372rRMm8Xkfp744JEnj8abgrYdpyPj3necqTHUNcAguYmiTLKw2Spfts7KTb5ji9TjVKwtqTauXGngAKHhGT12VdXCZCyKFWS7EPbBCyWjJKTDjtPTQrixEHvdhCaqmSeYE87UQGvLcuAvHCUpXLLCdrYEhvogjasjhx2M5uB69fKhPjbwx6oDDPBgubKNgdznoAcc7tKT238zp8bXWXf9CFBb9XShrMGp4KbRdi9YKRvtWbXQAKVubvaFxGEQbL6FWaPcpzY4uyQQ8y89MsV",
                "lastHashLinkSSI": "Sn8Ne44Tiohfi72jwh9t9zBAX4vzHprGPinmYeUA6ssNNBcLajgGWH4vPShLacky4ofbtjYxR5EALN6Bn9N5nJUPV372rRMm8Xkfp744JEnj8abgrYdpyPj3necqTHUNcAguYmiTLKw2Spfts7KTb5ji9TjVKwtqTauXGngAKHhGT12VdXCZCyKFWS7EPbBCyWjJKTDjtPTQrixEHvdhCaqmSeYE87UQGvLcuAvHCUpXLLCdrYEhvogjasjhx2M5uB69fKhPjbwx6oDDPBgubKNgdznoAcc7tKT238zp8bXWXf9CFBb9XShrMGp4KbRdi9YKRvtWbXQAKVubvaFxGEQbL6FWaPcpzY4uyQQ8y89MsV",
                "controlSubstring": "c2fc4619a01758ceafbf66b2741a1e9aa8f8f9478b4ae074804fb98b07b89774",
                "zkpValue": "",
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKeyRaw": "04740a22abe2bd6f2451aea0c9215257f0c432ea1a3c28c7c742d6af08df7de9dec303dca979633617d64f8a18deec360f594459e308ade4251eebd6ea83397d18"
            };
            const status = await anchorCC.addAnchor(chaincodeStub,"G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP", anchorData);
            expect(status).to.be.equal( 200);
            const data = await anchorCC.getAnchorVersions(chaincodeStub,"G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP");
            const json = JSON.parse(data);
            expect(json.length).to.be.equal( 1);
            expect(json[0]).to.be.equal('Sn8Ne44Tiohfi72jwh9t9zBAX4vzHprGPinmYeUA6ssNNBcLajgGWH4vPShLacky4ofbtjYxR5EALN6Bn9N5nJUPV372rRMm8Xkfp744JEnj8abgrYdpyPj3necqTHUNcAguYmiTLKw2Spfts7KTb5ji9TjVKwtqTauXGngAKHhGT12VdXCZCyKFWS7EPbBCyWjJKTDjtPTQrixEHvdhCaqmSeYE87UQGvLcuAvHCUpXLLCdrYEhvogjasjhx2M5uB69fKhPjbwx6oDDPBgubKNgdznoAcc7tKT238zp8bXWXf9CFBb9XShrMGp4KbRdi9YKRvtWbXQAKVubvaFxGEQbL6FWaPcpzY4uyQQ8y89MsV');
        });

        it('should add anchor and add new hashlinks if required', async () => {
            let anchorCC = new AnchorCC();
            let anchorData = {
                "newHashLinkSSI": "hashlink1",
                "lastHashLinkSSI": "hashlink1",
                "controlSubstring": "c2fc4619a01758ceafbf66b2741a1e9aa8f8f9478b4ae074804fb98b07b89774",
                "zkpValue": "",
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKeyRaw": "04740a22abe2bd6f2451aea0c9215257f0c432ea1a3c28c7c742d6af08df7de9dec303dca979633617d64f8a18deec360f594459e308ade4251eebd6ea83397d18"
            };
            let status = await anchorCC.addAnchor(chaincodeStub,"G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP", anchorData);
            expect(status).to.be.equal( 200);
            anchorData = {
                "newHashLinkSSI": "hashlink2",
                "lastHashLinkSSI": "hashlink1",
                "controlSubstring": "c2fc4619a01758ceafbf66b2741a1e9aa8f8f9478b4ae074804fb98b07b89774",
                "zkpValue": "",
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKeyRaw": "04740a22abe2bd6f2451aea0c9215257f0c432ea1a3c28c7c742d6af08df7de9dec303dca979633617d64f8a18deec360f594459e308ade4251eebd6ea83397d18"
            };
            status = await anchorCC.addAnchor(chaincodeStub,"G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP", anchorData);
            expect(status).to.be.equal( 200);
            anchorData = {
                "newHashLinkSSI": "hashlink3",
                "lastHashLinkSSI": "hashlink2",
                "controlSubstring": "",
                "zkpValue": "",
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKeyRaw": "04740a22abe2bd6f2451aea0c9215257f0c432ea1a3c28c7c742d6af08df7de9dec303dca979633617d64f8a18deec360f594459e308ade4251eebd6ea83397d18"
            };
            status = await anchorCC.addAnchor(chaincodeStub,"G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP", anchorData);
            expect(status).to.be.equal( 200);
            const data = await anchorCC.getAnchorVersions(chaincodeStub,"G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP");
            const json = JSON.parse(data);
            expect(json.length).to.be.equal(3);
            expect(json[0]).to.be.equal("hashlink1");
            expect(json[1],).to.be.equal("hashlink2");
            expect(json[2],).to.be.equal("hashlink3");
        });

        it('should add anchor fail when hashlinks are out of sync', async () =>{
            let anchorCC = new AnchorCC();
            let anchorData = {
                "newHashLinkSSI": "hashlink1",
                "lastHashLinkSSI": "hashlink1",
                "controlSubstring": "c2fc4619a01758ceafbf66b2741a1e9aa8f8f9478b4ae074804fb98b07b89774",
                "zkpValue": "",
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKeyRaw": "04740a22abe2bd6f2451aea0c9215257f0c432ea1a3c28c7c742d6af08df7de9dec303dca979633617d64f8a18deec360f594459e308ade4251eebd6ea83397d18"
            };
            let status = await anchorCC.addAnchor(chaincodeStub,"G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP", anchorData);
            expect(status).to.be.equal(200);
            anchorData = {
                "newHashLinkSSI": "hashlink3",
                "lastHashLinkSSI": "hashlink2",
                "controlSubstring": "c2fc4619a01758ceafbf66b2741a1e9aa8f8f9478b4ae074804fb98b07b89774",
                "zkpValue": "",
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKeyRaw": "04740a22abe2bd6f2451aea0c9215257f0c432ea1a3c28c7c742d6af08df7de9dec303dca979633617d64f8a18deec360f594459e308ade4251eebd6ea83397d18"
            };
            status = await anchorCC.addAnchor(chaincodeStub,"G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP", anchorData);
            expect(status).to.be.equal(100);
        });

        it('should add new const anchor', async () =>{
            let anchorCC = new AnchorCC();
            let anchorData = {
                "newHashLinkSSI": "hashlink1",
                "lastHashLinkSSI": "hashlink1",
                "controlSubstring": "",
                "zkpValue": "",
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKeyRaw": "04740a22abe2bd6f2451aea0c9215257f0c432ea1a3c28c7c742d6af08df7de9dec303dca979633617d64f8a18deec360f594459e308ade4251eebd6ea83397d18"
            };
            let status = await anchorCC.addAnchor(chaincodeStub,"G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP", anchorData);
            expect(status).to.be.equal(201);
            const data = await anchorCC.getAnchorVersions(chaincodeStub,"G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP");
            const json = JSON.parse(data);
            expect(json.length).to.be.equal(1);
            expect(json[0]).to.be.equal('hashlink1')
        });

        it('should fail when updating const anchor', async () =>{
            let anchorCC = new AnchorCC();
            let anchorData = {
                "newHashLinkSSI": "hashlink1",
                "lastHashLinkSSI": "hashlink1",
                "controlSubstring": "",
                "zkpValue": "",
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKeyRaw": "04740a22abe2bd6f2451aea0c9215257f0c432ea1a3c28c7c742d6af08df7de9dec303dca979633617d64f8a18deec360f594459e308ade4251eebd6ea83397d18"
            };
            let status = await anchorCC.addAnchor(chaincodeStub,"G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP", anchorData);
            expect(status).to.be.equal(201);
            anchorData = {
                "newHashLinkSSI": "hashlink2",
                "lastHashLinkSSI": "hashlink1",
                "controlSubstring": "",
                "zkpValue": "",
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKeyRaw": "04740a22abe2bd6f2451aea0c9215257f0c432ea1a3c28c7c742d6af08df7de9dec303dca979633617d64f8a18deec360f594459e308ade4251eebd6ea83397d18"
            };
            status = await anchorCC.addAnchor(chaincodeStub,"G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP", anchorData);
            expect(status).to.be.equal(101);
        });

        it('should fail to add a new anchor with invalid signature', async () => {
            let anchorCC = new AnchorCC();
            const anchorData = {
                "newHashLinkSSI": "Sn8Ne44Tiohfi72jwh9t9zBAX4vzHprGPinmYeUA6ssNNBcLajgGWH4vPShLacky4ofbtjYxR5EALN6Bn9N5nJUPV372rRMm8Xkfp744JEnj8abgrYdpyPj3necqTHUNcAguYmiTLKw2Spfts7KTb5ji9TjVKwtqTauXGngAKHhGT12VdXCZCyKFWS7EPbBCyWjJKTDjtPTQrixEHvdhCaqmSeYE87UQGvLcuAvHCUpXLLCdrYEhvogjasjhx2M5uB69fKhPjbwx6oDDPBgubKNgdznoAcc7tKT238zp8bXWXf9CFBb9XShrMGp4KbRdi9YKRvtWbXQAKVubvaFxGEQbL6FWaPcpzY4uyQQ8y89MsV",
                "lastHashLinkSSI": "Sn8Ne44Tiohfi72jwh9t9zBAX4vzHprGPinmYeUA6ssNNBcLajgGWH4vPShLacky4ofbtjYxR5EALN6Bn9N5nJUPV372rRMm8Xkfp744JEnj8abgrYdpyPj3necqTHUNcAguYmiTLKw2Spfts7KTb5ji9TjVKwtqTauXGngAKHhGT12VdXCZCyKFWS7EPbBCyWjJKTDjtPTQrixEHvdhCaqmSeYE87UQGvLcuAvHCUpXLLCdrYEhvogjasjhx2M5uB69fKhPjbwx6oDDPBgubKNgdznoAcc7tKT238zp8bXWXf9CFBb9XShrMGp4KbRdi9YKRvtWbXQAKVubvaFxGEQbL6FWaPcpzY4uyQQ8y89MsV",
                "controlSubstring": "c2fc4619a01758ceafbf66b2741a1e9aa8f8f9478b4ae074804fb98b07b89774",
                "zkpValue": "",
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKeyRaw": "0455"
            };
            const status = await anchorCC.addAnchor(chaincodeStub,"G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP", anchorData);
            expect(status).to.be.equal( 102);
        });
    });

})
