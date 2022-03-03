
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
            switch(method){
                case "createAnchor":
                    return await cc.addAnchor(ccStub,anchorId,JSON.parse(data));
                case "appendAnchor":
                    return await cc.appendAnchor(ccStub,anchorId,JSON.parse(data));
                default:
                    console.log('method not supported invoked : ', method);
                    throw "Not supported";
            }

        });
        anchoringContractStub.evaluateTransaction.callsFake( async (method, anchorId) => {
            const cc = require('../../cc-anchor/test/anchor');
            return await cc.getAnchorVersions(ccStub,anchorId);
        })
        res = httpMocks.createResponse({
            eventEmitter: require('events').EventEmitter
        });
    });

    describe ('Create Anchor tests', () => {
        it ('should create the first anchor', () =>{
            req = reqProvider.getRequestAddAnchor1st();
            return new Promise( (resolve) => {
                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(200);
                    resolve();
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
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
                require('../controllers/getAllAnchorVersions').getAllAnchorVersions(anchoringContractStub)(req,res);
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
                        expect(json[0]).to.be.equal("2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzYcc2GgzRdtHuVuexm8k6HMVTHehkGtxCqAUkXhqXgRjVJtu1M77sfNnw3AcUxbRk41aoCzYd6XMBf55hYwxb34fh4MgTWwHmtzZzCMeqjS2Asw6ba1AXSRBJmAGbFxMkihPhkN3");
                        resolve();
                    });
                    require('../controllers/getAllAnchorVersions').getAllAnchorVersions(anchoringContractStub)(req,res);
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
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
                    require('../controllers/appendAnchor').appendAnchor(anchoringContractStub)(req,res);
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
            })
        });

        it ('should add const anchor', () => {
            req = reqProvider.getRequestAddAnchorConst();
            return new Promise( (resolve) => {
                res.on('end', () =>{
                    expect(res.statusCode).to.be.equal(200);
                    resolve();
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
            })
        });

        it('should get the last hash link', () => {
            req = reqProvider.getRequestAddAnchor1st();
            return new Promise( (resolve) => {
                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(200);
                    //create 2nd request, response pair
                    req = reqProvider.getRequestGetLastVersion();
                    res = httpMocks.createResponse({
                        eventEmitter: require('events').EventEmitter
                    });
                    res.on('end', () => {
                        expect(res.statusCode).to.be.equal(200);
                        const json = JSON.parse(res._getData());
                        expect(json.length).to.be.equal(1);
                        expect(json[0]).to.be.equal("2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzYcc2GgzRdtHuVuexm8k6HMVTHehkGtxCqAUkXhqXgRjVJtu1M77sfNnw3AcUxbRk41aoCzYd6XMBf55hYwxb34fh4MgTWwHmtzZzCMeqjS2Asw6ba1AXSRBJmAGbFxMkihPhkN3");
                        resolve();
                    });
                    require('../controllers/getLastAnchorVersion').getLastAnchorVersion(anchoringContractStub)(req,res);
                });
                require('../controllers/createAnchor').createAnchor(anchoringContractStub)(req,res);
            })
        })
    })
})
