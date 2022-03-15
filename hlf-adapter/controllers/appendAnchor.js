function appendAnchor(anchoringContract){
    return function(req, res, next) {
        const anchorID = req.params.keySSI;
        const signedHashLinkSSI = req.params.anchorValue;
        console.log('Serving PUT /appendanchor : ', anchorID,signedHashLinkSSI);
        require('../anchoring/appendAnchor').appendAnchor(anchoringContract, anchorID, {
            "anchorId": anchorID,
            "signedHashLink":signedHashLinkSSI
        }).then(
            (data) => {
                console.log('data received : ', data);
                res.status(200).end(data);
            },
            (err) => {
                res.status(500).end(err.toString());
            },
            (err) => {
                res.status(500).end(err.toString());
            }
        );
    }}


module.exports = {
    appendAnchor
}
