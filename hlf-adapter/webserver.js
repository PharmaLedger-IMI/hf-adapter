const express = require('express');

function requestBodyJSONMiddleware(request, response, next) {
    /**
     * Prepare headers for response
     */
    response.setHeader('Content-Type', 'application/json');

    const data = [];

    request.on('data', (chunk) => {
        data.push(chunk);
    });

    request.on('end', () => {
        let jsonBody = {};
        try {
            jsonBody = data.length ? JSON.parse(data) : {};
        } catch (err) {
            console.log(err);
        }
        request.body = jsonBody;
        next();
    });
}

function configureHeaders(webServer) {
    webServer.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Content-Length, X-Content-Length');
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Content-Length, X-Content-Length');
        next();
    });

}

function configureAddAnchorEntryPoints(webServer, anchoringContract) {
    const addAnchorHandler = require("./controllers/addAnchor").addAnchor(anchoringContract);
    webServer.use("/addAnchor/*", requestBodyJSONMiddleware);
    webServer.put("/addAnchor/:keySSI", addAnchorHandler);
}

function configureGetAnchorVersionsEntryPoints(webServer, anchoringContract) {
    const getVersionsHandler = require("./controllers/getAnchorVersions").getAnchorVersions(anchoringContract);
    webServer.use("/getAnchorVersions/*", requestBodyJSONMiddleware);
    webServer.get("/getAnchorVersions/:keySSI", getVersionsHandler);
}

function configureCheckEntryPoints(webServer, anchoringContract) {
    const checkHandler = require("./controllers/check").check(anchoringContract);
    webServer.use("/check/*", requestBodyJSONMiddleware);
    webServer.get("/check", checkHandler);
}


function startServer(anchoringContract){
    const port = 3000;
    this.webServer = express();
    configureHeaders(this.webServer);
    configureAddAnchorEntryPoints(this.webServer, anchoringContract);
    configureGetAnchorVersionsEntryPoints(this.webServer, anchoringContract);
    configureCheckEntryPoints(this.webServer, anchoringContract);
    this.webServer.listen(port);
    console.log('Server started. Listening on ', port);
    return this;
}

async function connectToGateway(){
    const anchoringContract = await require('./app').getAnchoringContract();
    console.log('Connected to HLF network - Anchoring.');
    return anchoringContract;
}

function start (){
    connectToGateway().then( (anchoringContract) => {
        return startServer(anchoringContract);
    },
        (err) => {
            console.log('Failed to connect to HFL', err);
            return undefined;
        })
}

module.exports = {
    start
}
