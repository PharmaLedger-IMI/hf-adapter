
const sinon = require("sinon");
const {ContractImpl} = require('fabric-network/lib/contract');
const httpMocks = require('node-mocks-http');
const reqProvider = require('./testRequestProvider');
const chai = require('chai');
const expect = chai.expect;


describe('HLF-Adapter fail check tests', () =>{
    let anchoringContractStub;
    let req;
    let res;
    let ccStub;
    beforeEach(() => {
        anchoringContractStub = sinon.createStubInstance(ContractImpl);
        ccStub = require('../../cc-anchor/test/chaincodeStub')();
        const AnchorCC = require('../../cc-anchor/lib/controller/AnchorChaincode')
        anchoringContractStub.submitTransaction.callsFake( async (method,anchorId, data) => {
            ccStub.InitAdapter(method,anchorId,data);

            let anchorCC = new AnchorCC();
            const info =  await anchorCC.Invoke(ccStub);
            return info.payload;

        });
        anchoringContractStub.evaluateTransaction.callsFake( async (method, anchorId) => {
            ccStub.InitAdapter(method,anchorId);

            let anchorCC = new AnchorCC();
            const info =  await anchorCC.Invoke(ccStub);
            return info.payload;
        });
        res = httpMocks.createResponse({
            eventEmitter: require('events').EventEmitter
        });
    });

    describe ('Add Anchor fail check tests', () => {
        it ('should fail to add anchor with wrong public key', async () =>{
            const ssiUtils = require('./utils-opendsu');
            const seedSSI = ssiUtils.generateSeedSSI();
            const anchorId = ssiUtils.getAnchorId(seedSSI);
            const signedHashLink = await ssiUtils.getSignedHashLink(seedSSI);
            const seedSSI2 = ssiUtils.generateSeedSSI();
            const anchorId2 = ssiUtils.getAnchorId(seedSSI2);
            req = reqProvider.getRequestAddAnchor(anchorId2, signedHashLink);
            return new Promise( (resolve) => {
                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(500);
                    resolve();
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
            })
        });

        it (' should fail to replay create anchor calls', async () => {
            const ssiUtils = require('./utils-opendsu');
            const seedSSI = ssiUtils.generateSeedSSI();
            const anchorId = ssiUtils.getAnchorId(seedSSI);
            const signedHashLink = await ssiUtils.getSignedHashLink(seedSSI);
            req = reqProvider.getRequestAddAnchor(anchorId, signedHashLink);
            return new Promise( (resolve) => {

                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(200);
                    //create 2nd request, response pair
                    req = reqProvider.getRequestAddAnchor(anchorId, signedHashLink);
                    res = httpMocks.createResponse({
                        eventEmitter: require('events').EventEmitter
                    });
                    res.on('end', () => {
                        expect(res.statusCode).to.be.equal(500);
                        resolve();
                    });
                    require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
            })
        })

        it ('should fail to add new un synced hashlink for existing anchor', async () =>{
            const ssiUtils = require('./utils-opendsu');
            const seedSSI = ssiUtils.generateSeedSSI();
            const anchorId = ssiUtils.getAnchorId(seedSSI);
            const signedHashLink = await ssiUtils.getSignedHashLink(seedSSI);
            const signedHashLink2nd = await ssiUtils.getSignedHashLink(seedSSI,signedHashLink);
            const signedHashLink3rd = await ssiUtils.getSignedHashLink(seedSSI,signedHashLink2nd);
            req = reqProvider.getRequestAddAnchor(anchorId, signedHashLink);
            return new Promise( (resolve) => {

                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(200);
                    //create 2nd request, response pair
                    req = reqProvider.getRequestAppendAnchor(anchorId, signedHashLink3rd);
                    res = httpMocks.createResponse({
                        eventEmitter: require('events').EventEmitter
                    });
                    res.on('end', () => {
                        expect(res.statusCode).to.be.equal(500);
                        resolve();
                    });
                    require('../controllers/appendAnchor').appendAnchor(anchoringContractStub)(req,res);
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
            })
        });

        it ('should fail to add const anchor new hashlink', () => {
            const ssiUtils = require('./utils-opendsu');
            const constSSI = ssiUtils.generateConstSSI();
            const anchorId = ssiUtils.getAnchorId(constSSI);
            const hashlink = ssiUtils.getHashLink(constSSI);
            const hashlink2 = ssiUtils.getHashLink(constSSI,'some data 2 hash');
            req = reqProvider.getRequestAddAnchor(anchorId, hashlink);
            return new Promise( (resolve) => {
                res.on('end', () =>{
                    expect(res.statusCode).to.be.equal(200);
                    //create 2nd request, response pair
                    req = reqProvider.getRequestAppendAnchor(anchorId, hashlink2);
                    res = httpMocks.createResponse({
                        eventEmitter: require('events').EventEmitter
                    });
                    res.on('end', () => {
                        expect(res.statusCode).to.be.equal(500);
                        resolve();
                    });
                    require('../controllers/appendAnchor').appendAnchor(anchoringContractStub)(req,res);
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
            })
        });

    })
})

