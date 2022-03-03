class AnchorValidator{
    async AnchorExists(stub, anchorId) {
        const anchorJSON = await stub.getState(anchorId);
        return anchorJSON && anchorJSON.length > 0;
    }
}


module.exports = {
    AnchorValidator
}
