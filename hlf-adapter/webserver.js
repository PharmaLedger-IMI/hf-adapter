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

function configureCreateAnchorEntryPoints(webServer, anchoringContract) {
    const createAnchorHandler = require("./controllers/createAnchor").createAnchor(anchoringContract);
    webServer.use("/create-anchor/*", requestBodyJSONMiddleware);
    webServer.put("/create-anchor/:keySSI", createAnchorHandler);
}

function configureAppendAnchorEntryPoints(webServer, anchoringContract) {
    const appendAnchorHandler = require("./controllers/appendAnchor").appendAnchor(anchoringContract);
    webServer.use("/append-to-anchor/*", requestBodyJSONMiddleware);
    webServer.put("/append-to-anchor/:keySSI", appendAnchorHandler);
}

function configureGetAllVersionsEntryPoints(webServer, anchoringContract) {
    const getAllVersionsHandler = require("./controllers/getAllAnchorVersions").getAllAnchorVersions(anchoringContract);
    webServer.use("/get-all-versions/*", requestBodyJSONMiddleware);
    webServer.get("/get-all-versions/:keySSI", getAllVersionsHandler);
}

function configureGetLastVersionEntryPoints(webServer, anchoringContract) {
    const getLastVersionHandler = require("./controllers/getLastAnchorVersion").getLastAnchorVersion(anchoringContract);
    webServer.use("/get-last-version/*", requestBodyJSONMiddleware);
    webServer.get("/get-last-version/:keySSI", getLastVersionHandler);
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
    configureCreateAnchorEntryPoints(this.webServer, anchoringContract);
    configureAppendAnchorEntryPoints(this.webServer, anchoringContract);
    configureGetAllVersionsEntryPoints(this.webServer, anchoringContract);
    configureGetLastVersionEntryPoints(this.webServer, anchoringContract);
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
