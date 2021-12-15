
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
        anchoringContractStub.submitTransaction.callsFake( async (method,anchorId, data) => {
            const cc = require('../../cc-anchor/test/anchor');
            return await cc.addAnchor(ccStub,anchorId,JSON.parse(data));
        });
        res = httpMocks.createResponse({
            eventEmitter: require('events').EventEmitter
        });
    });

    describe ('Add Anchor fail check tests', () => {
        it ('should fail to add anchor with wrong public key', () =>{
            req = reqProvider.getRequestAddAnchorWrongPubKey();
            return new Promise( (resolve) => {
                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(428);
                    expect(res._getData()).to.be.equal('102')
                    resolve();
                });
                require('../controllers/addAnchor').addAnchor(anchoringContractStub)(req,res);
            })
        });

        it (' should fail to replay add anchor calls', () => {
            req = reqProvider.getRequestAddAnchor1st();
            return new Promise( (resolve) => {

                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(200);
                    //create 2nd request, response pair
                    req = reqProvider.getRequestAddAnchor1st();
                    res = httpMocks.createResponse({
                        eventEmitter: require('events').EventEmitter
                    });
                    res.on('end', () => {
                        expect(res.statusCode).to.be.equal(428);
                        resolve();
                    });
                    require('../controllers/addAnchor').addAnchor(anchoringContractStub)(req,res);
                });
                require('../controllers/addAnchor').addAnchor(anchoringContractStub)(req,res);
            })
        })

        it ('should fail to add new un synced hashlink for existing anchor', () =>{
            req = reqProvider.getRequestAddAnchor1st();
            return new Promise( (resolve) => {

                res.on('end', () => {
                    expect(res.statusCode).to.be.equal(200);
                    //create 2nd request, response pair
                    req = reqProvider.getRequestAddAnchorUnSynced();
                    res = httpMocks.createResponse({
                        eventEmitter: require('events').EventEmitter
                    });
                    res.on('end', () => {
                        expect(res.statusCode).to.be.equal(428);
                        expect(res._getData()).to.be.equal('100');
                        resolve();
                    });
                    require('../controllers/addAnchor').addAnchor(anchoringContractStub)(req,res);
                });
                require('../controllers/addAnchor').addAnchor(anchoringContractStub)(req,res);
            })
        });

        it ('should fail to add const anchor new hashlink', () => {
            req = reqProvider.getRequestAddAnchorConst();
            return new Promise( (resolve) => {
                res.on('end', () =>{
                    expect(res.statusCode).to.be.equal(200);
                    //create 2nd request, response pair
                    req = reqProvider.getRequestAddAnchorConst2nd();
                    res = httpMocks.createResponse({
                        eventEmitter: require('events').EventEmitter
                    });
                    res.on('end', () => {
                        expect(res.statusCode).to.be.equal(428);
                        expect(res._getData()).to.be.equal('101');
                        resolve();
                    });
                    require('../controllers/addAnchor').addAnchor(anchoringContractStub)(req,res);
                });
                require('../controllers/addAnchor').addAnchor(anchoringContractStub)(req,res);
            })
        });

    })
})
