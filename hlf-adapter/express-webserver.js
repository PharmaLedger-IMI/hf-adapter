const express = require('express');
const server = express();
server.use(express.json());

let anchoringContract;

server.get('/', (req,res, next) => {
    setResHeader(res);
    return res.status(200).send('HLF adapter');
});

server.get('/check',(req,res,next) => {
    setResHeader(res);
    require('./anchoring/check').check(anchoringContract).then(
        (data) => {
            res.status(200).end(data);
        },
        (err) => {
            res.status(500).end(err.toString());
        }
    );
});

server.get('/getAnchorVersions/:keySSI',(req,res,next) => {
    setResHeader(res);
    require('./anchoring/getAnchorVersions').getAnchorVersions(anchoringContract, req.params.keySSI ).then(
        (data) => {
            res.status(200).end(data);
        },
        (err) => {
            res.status(500).end(err.toString());
        }
    );
});

server.get('/addAnchor/:keySSI',(req,res,next) => {
    setResHeader(res);
    //todo: body process
    require('./anchoring/addAnchor').addAnchor(anchoringContract, req.params.keySSI ).then(
        (data) => {
            res.status(200).end(data);
        },
        (err) => {
            res.status(500).end(err.toString());
        }
    );
});



function setResHeader(res){
    res.setHeader("Content-Type", "application/json");
}

async function connectToHLF(){
    anchoringContract = await require('./app').getAnchoringContract();
}

connectToHLF().then(() => {
    server.listen(3000);
});

