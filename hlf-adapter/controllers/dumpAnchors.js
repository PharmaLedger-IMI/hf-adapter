function dumpAnchors(anchoringContract,){
    return function (req, res, next) {
        const body = req.body;
        console.log('Serving GET /dumpAnchors for ', body);
        require('../anchoring/dumpAnchors').dumpAnchors(anchoringContract, body.from, body.limit, body.maxSize).then(
            (data) => {
                console.log('data received : ', data);
                // data received from smart contract should be like
                /*
                [
                    {
                        anchorId: ...,
                        anchorValues: []
                    },
                    ...
                ]
                */

                res.status(200).end(JSON.stringify(data));
            },
            (err) => {
                res.status(500).end(err.toString());
            }
        );
    }
}


module.exports = {
    dumpAnchors
}
