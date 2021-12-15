function getAnchorVersions(anchoringContract){
    console.log('Serving GET /getAnchorVersions');
    return function (req, res, next) {
        require('../anchoring/getAnchorVersions').getAnchorVersions(anchoringContract, req.params.keySSI).then(
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
    getAnchorVersions
}
