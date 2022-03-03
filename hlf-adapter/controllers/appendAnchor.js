function appendAnchor(anchoringContract){
    return function(req, res, next) {
        const anchorID = req.params.keySSI;
        console.log('Serving PUT /append-anchor : ', anchorID);
        const body = req.body;
        console.log("body received : ", body);
        try {
            if (body.hashLinkSSI === undefined) {
                console.log('Invalid body ', body);
                return res.status(428).send('Invalid body');
            }
        } catch (err) {
            console.log(err);
            return res.status(428).send('Invalid body');
        }
        const signedHashLinkSSI = body.hashLinkSSI;
        const zkp = body.zkp;

        require('../anchoring/appendAnchor').appendAnchor(anchoringContract, anchorID, {
            "anchorId": anchorID,
            "signedHashLink":signedHashLinkSSI,
            "zkp": zkp
        }).then(
            (data) => {
                console.log('data received : ', data);
                if (data === "200" || data === "201")
                {
                    res.status(200).end(data);
                } else {
                    console.log('response status send  428');
                    res.status(428).end(data);
                }
            },
            (err) => {
                res.status(500).end(err.toString());
            }
        );
    }}


module.exports = {
    appendAnchor
}
