async function  addAnchor(stub, anchorID, anchorData){
    const AnchorOperations = require('../lib/operations/AnchorOperations').AnchorOperations;
    const anchorOperations = new AnchorOperations();
    return await anchorOperations.addAnchor(stub, anchorID, anchorData);
}

async function  getAnchorVersions(stub, anchorID){
    const AnchorOperations = require('../lib/operations/AnchorOperations').AnchorOperations;
    const anchorOperations = new AnchorOperations();
    return await anchorOperations.getAnchorVersions(stub, anchorID);
}

module.exports = {
    addAnchor,
    getAnchorVersions
}
