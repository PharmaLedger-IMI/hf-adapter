'use strict';

const chai = require('chai');
const expect = chai.expect;
const AnchorCC = require('../lib/controller/AnchorChaincode');


describe('Anchoring Tests', () => {

    let chaincodeStub;
    beforeEach(() => {
        const CS = require('./chaincodeStub')
        chaincodeStub = new CS();
    });

    describe('Test Check', () => {
        it('should return success on Check', async () => {
            chaincodeStub.Init("check");

            let anchorCC = new AnchorCC();
            const data = await anchorCC.Invoke(chaincodeStub);
            console.log(data, data.payload.toString());
            expect(data.status).to.be.equal(200);
            expect(data.payload.toString()).to.be.equal("Invoking check method.");
        });
        it ('should return empty array for non existing anchors', async () =>{
            const utils = require('./utils');
            const seedSSI = utils.generateSeedSSI();
            const anchorId = utils.getAnchorId(seedSSI);
            chaincodeStub.Init("getAllVersions",anchorId);

            let anchorCC = new AnchorCC();
            const data = await anchorCC.Invoke(chaincodeStub);
            console.log(data,data.payload.toString());
            expect(data.status).to.be.equal(200);
            const payload = JSON.parse(data.payload.toString());
            expect(payload.length).to.be.equal(0);
        });
        it ('should return 0 no of anchors', async () =>{
            chaincodeStub.Init("totalNumberOfAnchors");
            let anchorCC = new AnchorCC();
            const data = await anchorCC.Invoke(chaincodeStub);
            expect(parseInt(data.payload.toString())).to.be.equal(0);
        });
        it('should add anchor and be able to read it back', async () => {
            const utils = require('./utils');
            const seedSSI = utils.generateSeedSSI();
            const anchorId = utils.getAnchorId(seedSSI);
            const signedHashLink = await utils.getSignedHashLink(seedSSI);
            chaincodeStub.Init("createAnchor",anchorId,signedHashLink);

            let anchorCC = new AnchorCC();
            const data = await anchorCC.Invoke(chaincodeStub);
            console.log("received : ",data);
            expect(data.status).to.be.equal(200);

            chaincodeStub.Init("getAllVersions",anchorId);
            const gav = await anchorCC.Invoke(chaincodeStub);
            console.log("received : ",gav);
            expect(gav.status).to.be.equal(200);
            let payload = JSON.parse(gav.payload.toString());
            expect(payload.length).to.be.equal(1);
            expect(payload[0]).to.be.equal(signedHashLink);

            chaincodeStub.Init("getLastVersion",anchorId);
            const glv = await anchorCC.Invoke(chaincodeStub);
            console.log("received : ",glv);
            expect(glv.status).to.be.equal(200);
            payload = glv.payload.toString();
            expect(payload).to.be.equal(signedHashLink);

            chaincodeStub.Init("totalNumberOfAnchors");
            const noOfAnchors = await anchorCC.Invoke(chaincodeStub);
            expect(parseInt(noOfAnchors.payload.toString())).to.be.equal(1);

        });

        it('should add new const anchor', async () =>{
            const utils = require('./utils');
            const constSSI = utils.generateConstSSI();
            const anchorId = utils.getAnchorId(constSSI);
            const hashLink = await utils.getHashLink(constSSI);
            chaincodeStub.Init("createAnchor",anchorId,hashLink);

            let anchorCC = new AnchorCC();
            const data = await anchorCC.Invoke(chaincodeStub);
            console.log("received : ",data);
            expect(data.status).to.be.equal(200);

            chaincodeStub.Init("getAllVersions",anchorId);
            const gav = await anchorCC.Invoke(chaincodeStub);
            console.log("received : ",gav);
            expect(gav.status).to.be.equal(200);
            let payload = JSON.parse(gav.payload.toString());
            expect(payload.length).to.be.equal(1);
            expect(payload[0]).to.be.equal(hashLink);

            chaincodeStub.Init("getLastVersion",anchorId);
            const glv = await anchorCC.Invoke(chaincodeStub);
            console.log("received : ",glv);
            expect(glv.status).to.be.equal(200);
            payload = glv.payload.toString();
            expect(payload).to.be.equal(hashLink);

        });

        it('should have 3 anchors defined', async () =>{
            const utils = require('./utils');
            const constSSI = utils.generateConstSSI("112");
            const anchorId = utils.getAnchorId(constSSI);
            const hashLink = await utils.getHashLink(constSSI);
            chaincodeStub.Init("createAnchor",anchorId,hashLink);

            let anchorCC = new AnchorCC();
            await anchorCC.Invoke(chaincodeStub);

            const constSSI1 = utils.generateConstSSI("113");
            const anchorId1 = utils.getAnchorId(constSSI1);
            const hashLink1 = await utils.getHashLink(constSSI1);
            chaincodeStub.Init("createAnchor",anchorId1,hashLink1);
            await anchorCC.Invoke(chaincodeStub);

            const constSSI2 = utils.generateConstSSI("114");
            const anchorId2 = utils.getAnchorId(constSSI2);
            const hashLink2 = await utils.getHashLink(constSSI2);
            chaincodeStub.Init("createAnchor",anchorId2,hashLink2);
            await anchorCC.Invoke(chaincodeStub);

            chaincodeStub.Init("totalNumberOfAnchors");
            const noOfAnchors = await anchorCC.Invoke(chaincodeStub);
            expect(parseInt(noOfAnchors.payload.toString())).to.be.equal(3);

            chaincodeStub.InitSimple("dumpAnchors",0,3,100000);
            const anchorsData = await anchorCC.Invoke(chaincodeStub);
            const anchors = JSON.parse(anchorsData.payload.toString());
            expect(anchors.length).to.be.equal(3);
            expect(anchors[0].anchorId).to.be.equal(anchorId);
            expect(anchors[0].anchorValues[0]).to.be.equal(hashLink);
            expect(anchors[1].anchorId).to.be.equal(anchorId1);
            expect(anchors[1].anchorValues[0]).to.be.equal(hashLink1);
            expect(anchors[2].anchorId).to.be.equal(anchorId2);
            expect(anchors[2].anchorValues[0]).to.be.equal(hashLink2);

        });

        it('should create or append multiple anchors', async () =>{
            const utils = require('./utils');
            const anchors = []
            for (let i = 0; i < 10 ; i++) {
                const constSSI = utils.generateConstSSI("112-"+i.toString());
                const anchorId = utils.getAnchorId(constSSI);
                const hashLink = await utils.getHashLink(constSSI);
                anchors.push({
                    anchorId: anchorId,
                    signedHashLink: hashLink
                })
            }
            chaincodeStub.InitSimple("createOrAppendMultipleAnchors",JSON.stringify(anchors));
            let anchorCC = new AnchorCC();
            await anchorCC.Invoke(chaincodeStub);

            chaincodeStub.Init("totalNumberOfAnchors");
            const noOfAnchors = await anchorCC.Invoke(chaincodeStub);
            expect(parseInt(noOfAnchors.payload.toString())).to.be.equal(10);
        })

        it('should add anchor and add new hashlinks if required', async () => {
            const utils = require('./utils');
            const seedSSI = utils.generateSeedSSI();
            const anchorId = utils.getAnchorId(seedSSI);
            const signedHashLink = await utils.getSignedHashLink(seedSSI);
            const nextSignedHashLink = await utils.getSignedHashLink(seedSSI, signedHashLink);
            chaincodeStub.Init("createAnchor",anchorId,signedHashLink);

            let anchorCC = new AnchorCC();
            let data = await anchorCC.Invoke(chaincodeStub);
            console.log("received : ",data);
            expect(data.status).to.be.equal(200);

            chaincodeStub.Init("appendAnchor",anchorId,nextSignedHashLink);
            data = await anchorCC.Invoke(chaincodeStub);
            console.log("received : ",data);
            expect(data.status).to.be.equal(200);

            chaincodeStub.Init("getAllVersions",anchorId);
            const gav = await anchorCC.Invoke(chaincodeStub);
            console.log("received : ",gav);
            expect(gav.status).to.be.equal(200);
            let payload = JSON.parse(gav.payload.toString());
            expect(payload.length).to.be.equal(2);
            expect(payload[0]).to.be.equal(signedHashLink);
            expect(payload[1]).to.be.equal(nextSignedHashLink);

            chaincodeStub.Init("getLastVersion",anchorId);
            const glv = await anchorCC.Invoke(chaincodeStub);
            console.log("received : ",glv);
            expect(glv.status).to.be.equal(200);
            payload = glv.payload.toString();
            expect(payload).to.be.equal(nextSignedHashLink);

            chaincodeStub.Init("totalNumberOfAnchors");
            const noOfAnchors = await anchorCC.Invoke(chaincodeStub);
            expect(parseInt(noOfAnchors.payload.toString())).to.be.equal(1);

        });

        it('should fail when updating const anchor', async () =>{
            const utils = require('./utils');
            const constSSI = utils.generateConstSSI();
            const anchorId = utils.getAnchorId(constSSI);
            const hashLink = await utils.getHashLink(constSSI);
            const nextHashLink = await utils.getHashLink(constSSI, "1");
            chaincodeStub.Init("createAnchor",anchorId,hashLink);

            let anchorCC = new AnchorCC();
            let data = await anchorCC.Invoke(chaincodeStub);
            console.log("received : ",data);
            expect(data.status).to.be.equal(200);

            chaincodeStub.Init("appendAnchor",anchorId,nextHashLink);
            data = await anchorCC.Invoke(chaincodeStub);
            console.log("received : ",data, data.message.toString());
            expect(data.status).to.be.equal(500);

        });




    });

})
