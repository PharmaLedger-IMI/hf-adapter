function getLastAnchorVersion(anchoringContract){
    return function (req, res, next) {
        const anchorID = req.params.keySSI;
        console.log('Serving GET /get-last-version for ', anchorID);
        require('../anchoring/getLastAnchorVersion').getLastAnchorVersion(anchoringContract, anchorID).then(
            (data) => {
                console.log('data received : ', data);
                res.status(200).end(data);
            },
            (err) => {
                res.status(500).end(err.toString());
            }
        );
    }
}


module.exports = {
    getLastAnchorVersion
}
