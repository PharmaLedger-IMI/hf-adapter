
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
        anchoringContractStub.submitTransaction.callsFake( async (method,anchorId, data) => {
            const cc = require('../../cc-anchor/test/anchor');
            return await cc.addAnchor(ccStub,anchorId,JSON.parse(data));
        });
        anchoringContractStub.evaluateTransaction.callsFake( async (method, anchorId) => {
            const cc = require('../../cc-anchor/test/anchor');
            return await cc.getAnchorVersions(ccStub,anchorId);
        })
        res = httpMocks.createResponse({
            eventEmitter: require('events').EventEmitter
        });
    });

    describe ('Add Anchor tests', () => {
        it ('should add the first anchor', () =>{
            req = reqProvider.getRequestAddAnchor1st();
            return new Promise( (resolve) => {
                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(200);
                    resolve();
                });
                require('../controllers/addAnchor').addAnchor(anchoringContractStub)(req,res);
            })
        });

        it ('should get empty array for non existing anchors', () => {
            req = reqProvider.getRequestGetVersions();
            return new Promise( (resolve) => {
                res.on('end', () => {
                   expect(res.statusCode).to.be.equal(200);
                    const json = JSON.parse(res._getData());
                    expect(json.length).to.be.equal(0);
                    resolve();
                });
                require('../controllers/getAnchorVersions').getAnchorVersions(anchoringContractStub)(req,res);
            })
        });

        it ('should add anchor and read it back', () =>{
            req = reqProvider.getRequestAddAnchor1st();
            return new Promise( (resolve) => {
                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(200);
                    //create 2nd request, response pair
                    req = reqProvider.getRequestGetVersions();
                    res = httpMocks.createResponse({
                        eventEmitter: require('events').EventEmitter
                    });
                    res.on('end', () => {
                        expect(res.statusCode).to.be.equal(200);
                        const json = JSON.parse(res._getData());
                        expect(json.length).to.be.equal(1);
                        expect(json[0]).to.be.equal("hl1");
                        resolve();
                    });
                    require('../controllers/getAnchorVersions').getAnchorVersions(anchoringContractStub)(req,res);
                });
                require('../controllers/addAnchor').addAnchor(anchoringContractStub)(req,res);
            })
        });

        it ('should add new hashlink for existing anchor', () =>{
            req = reqProvider.getRequestAddAnchor1st();
            return new Promise( (resolve) => {

                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(200);
                    //create 2nd request, response pair
                    req = reqProvider.getRequestAddAnchor2nd();
                    res = httpMocks.createResponse({
                        eventEmitter: require('events').EventEmitter
                    });
                    res.on('end', () => {
                        expect(res.statusCode).to.be.equal(200);
                        resolve();
                    });
                    require('../controllers/addAnchor').addAnchor(anchoringContractStub)(req,res);
                });
                require('../controllers/addAnchor').addAnchor(anchoringContractStub)(req,res);
            })
        });

        it ('should add const anchor', () => {
            req = reqProvider.getRequestAddAnchorConst();
            return new Promise( (resolve) => {
                res.on('end', () =>{
                    expect(res.statusCode).to.be.equal(200);
                    resolve();
                });
                require('../controllers/addAnchor').addAnchor(anchoringContractStub)(req,res);
            })
        });

    })
})
