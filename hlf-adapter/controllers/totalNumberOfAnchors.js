function totalNumberOfAnchors(anchoringContract){
    return function (req, res, next) {
        console.log('Serving GET /totalNumberOfAnchors');
        require('../anchoring/totalNumberOfAnchors').totalNumberOfAnchors(anchoringContract).then(
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
    totalNumberOfAnchors
}
