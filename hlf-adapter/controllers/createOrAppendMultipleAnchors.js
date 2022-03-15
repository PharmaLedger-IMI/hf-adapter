function createOrAppendMultipleAnchors(anchoringContract){
    return function(req, res, next) {

        const anchorID = req.params.keySSI;
        const body = req.body;
        console.log('Serving PUT /createOrAppendMultipleAnchors : ', anchorID,body);

        require('../anchoring/createOrAppendMultipleAnchors').createOrAppendMultipleAnchors(anchoringContract, anchorID, body).then(
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
    createOrAppendMultipleAnchors
}
