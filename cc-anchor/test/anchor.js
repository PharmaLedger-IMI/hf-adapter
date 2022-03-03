async function  addAnchor(stub, anchorID, anchorData){
    const AnchorOperations = require('../lib/operations/AnchorOperations').AnchorOperations;
    const anchorOperations = new AnchorOperations();
    return await anchorOperations.addAnchor(stub, anchorID, anchorData);
}

async function  appendAnchor(stub, anchorID, anchorData){
    const AnchorOperations = require('../lib/operations/AnchorOperations').AnchorOperations;
    const anchorOperations = new AnchorOperations();
    return await anchorOperations.appendAnchor(stub, anchorID, anchorData);
}

async function  getAnchorVersions(stub, anchorID){
    const AnchorOperations = require('../lib/operations/AnchorOperations').AnchorOperations;
    const anchorOperations = new AnchorOperations();
    return await anchorOperations.getAllVersions(stub, anchorID);
}

module.exports = {
    addAnchor,
    appendAnchor,
    getAnchorVersions
}
