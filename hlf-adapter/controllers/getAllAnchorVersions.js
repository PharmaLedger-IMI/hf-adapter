function getAllAnchorVersions(anchoringContract){
    return function (req, res, next) {
        const anchorID = req.params.keySSI;
        console.log('Serving GET /get-all-versions for ', anchorID);
        require('../anchoring/getAllAnchorVersions').getAllAnchorVersions(anchoringContract, anchorID).then(
            (data) => {
                res.status(200).end(data);
            },
            (err) => {
                res.status(500).end(err.toString());
            }
        );
    }
}


module.exports = {
    getAllAnchorVersions
}
