function check(anchoringContract){
    return function (req, res, next) {
        console.log('Serving GET /check');
        require('../anchoring/check').check(anchoringContract).then(
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
    check
}
