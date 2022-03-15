
const sinon = require("sinon");
const {ContractImpl} = require('fabric-network/lib/contract');
const httpMocks = require('node-mocks-http');
const reqProvider = require('./testRequestProvider');
const chai = require('chai');
const expect = chai.expect;


describe('HLF-Adapter tests', () =>{
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
            const info = await anchorCC.Invoke(ccStub);
            return info.payload;
        });
        res = httpMocks.createResponse({
            eventEmitter: require('events').EventEmitter
        });
    });

    describe ('Create Anchor tests', () => {
        it ('should create the first anchor', async () =>{
            const ssiUtils = require('./utils-opendsu');
            const seedSSI = ssiUtils.generateSeedSSI();
            const anchorId = ssiUtils.getAnchorId(seedSSI);
            const signedHashLink = await ssiUtils.getSignedHashLink(seedSSI);
            req = reqProvider.getRequestAddAnchor(anchorId, signedHashLink);
            return new Promise( (resolve) => {
                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(200);
                    resolve();
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
            })
        });

        it ('should get empty array for non existing anchors', () => {
            const ssiUtils = require('./utils-opendsu');
            const seedSSI = ssiUtils.generateSeedSSI();
            const anchorId = ssiUtils.getAnchorId(seedSSI);
            req = reqProvider.getRequestGetVersions(anchorId);
            return new Promise( (resolve) => {
                res.on('end', () => {
                   expect(res.statusCode).to.be.equal(200);
                    const json = JSON.parse(res._getData());
                    expect(json.length).to.be.equal(0);
                    resolve();
                });
                require('../controllers/getAllAnchorVersions').getAllAnchorVersions(anchoringContractStub)(req,res);
            })
        });

        it ('should add anchor and read it back', async () =>{
            const ssiUtils = require('./utils-opendsu');
            const seedSSI = ssiUtils.generateSeedSSI();
            const anchorId = ssiUtils.getAnchorId(seedSSI);
            const signedHashLink = await ssiUtils.getSignedHashLink(seedSSI);
            req = reqProvider.getRequestAddAnchor(anchorId, signedHashLink);
            return new Promise( (resolve) => {
                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(200);
                    //create 2nd request, response pair
                    req = reqProvider.getRequestGetVersions(anchorId);
                    res = httpMocks.createResponse({
                        eventEmitter: require('events').EventEmitter
                    });
                    res.on('end', () => {
                        expect(res.statusCode).to.be.equal(200);
                        const json = JSON.parse(res._getData());
                        expect(json.length).to.be.equal(1);
                        expect(json[0]).to.be.equal(signedHashLink);
                        resolve();
                    });
                    require('../controllers/getAllAnchorVersions').getAllAnchorVersions(anchoringContractStub)(req,res);
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
            })
        });

        it ('should add new hashlink for existing anchor', async () =>{
            const ssiUtils = require('./utils-opendsu');
            const seedSSI = ssiUtils.generateSeedSSI();
            const anchorId = ssiUtils.getAnchorId(seedSSI);
            const signedHashLink = await ssiUtils.getSignedHashLink(seedSSI);
            const signedHashLink2nd = await ssiUtils.getSignedHashLink(seedSSI, signedHashLink);
            req = reqProvider.getRequestAddAnchor(anchorId, signedHashLink);
            return new Promise( (resolve) => {

                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(200);
                    //create 2nd request, response pair
                    req = reqProvider.getRequestAppendAnchor(anchorId,signedHashLink2nd);
                    res = httpMocks.createResponse({
                        eventEmitter: require('events').EventEmitter
                    });
                    res.on('end', () => {
                        expect(res.statusCode).to.be.equal(200);
                        resolve();
                    });
                    require('../controllers/appendAnchor').appendAnchor(anchoringContractStub)(req,res);
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
            })
        });

        it ('should add const anchor', () => {
            const ssiUtils = require('./utils-opendsu');
            const constSSI = ssiUtils.generateConstSSI();
            const anchorId = ssiUtils.getAnchorId(constSSI);
            const hashlink = ssiUtils.getHashLink(constSSI);
            req = reqProvider.getRequestAddAnchor(anchorId, hashlink);
            return new Promise( (resolve) => {
                res.on('end', () =>{
                    expect(res.statusCode).to.be.equal(200);
                    resolve();
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
            })
        });

        it('should get the last hash link', async () => {
            const ssiUtils = require('./utils-opendsu');
            const seedSSI = ssiUtils.generateSeedSSI();
            const anchorId = ssiUtils.getAnchorId(seedSSI);
            const signedHashLink = await ssiUtils.getSignedHashLink(seedSSI);
            req = reqProvider.getRequestAddAnchor(anchorId, signedHashLink);
            return new Promise( (resolve) => {
                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(200);
                    //create 2nd request, response pair
                    req = reqProvider.getRequestGetLastVersion(anchorId);
                    res = httpMocks.createResponse({
                        eventEmitter: require('events').EventEmitter
                    });
                    res.on('end', () => {
                        expect(res.statusCode).to.be.equal(200);
                        const json = res._getData();
                        expect(json).to.be.equal(signedHashLink);
                        resolve();
                    });
                    require('../controllers/getLastAnchorVersion').getLastAnchorVersion(anchoringContractStub)(req,res);
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
            })
        })

        it('should get the anchors recorded', async () => {
            const ssiUtils = require('./utils-opendsu');
            const constSSI = ssiUtils.generateConstSSI();
            const anchorId = ssiUtils.getAnchorId(constSSI);
            const hashlink = ssiUtils.getHashLink(constSSI);
            req = reqProvider.getRequestAddAnchor(anchorId, hashlink);
            return new Promise( (resolve) => {
                res.on('end', () =>{
                    expect(res.statusCode).to.be.equal(200);
                    req = reqProvider.getNoOfAnchors();
                    res = httpMocks.createResponse({
                        eventEmitter: require('events').EventEmitter
                    });
                    res.on('end', () =>{
                        expect(res.statusCode).to.be.equal(200);
                        const noOfAnchors = res._getData();
                        expect(noOfAnchors).to.be.equal("1");
                        resolve();
                    });
                    require('../controllers/totalNumberOfAnchors').totalNumberOfAnchors(anchoringContractStub)(req,res);
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
            })
        })
    })
})
