require('../../privatesky/psknode/bundles/testsRuntime');
const openDSU = require("opendsu");
const http = openDSU.loadApi("http");
const doPut = http.doPut;
const assert = require('double-check').assert;
const runs = 2520
let executedRuns = 0




assert.callback("concurrence testing", async (callback) => {
    const utils = require("./utils-simple");
    for (let i = 0; i < 2520  ; i++) {
        const constSSI = utils.generateConstSSI("126-"+i.toString());
        const anchorId = utils.getAnchorId(constSSI);
        const hashLink = await utils.getHashLink(constSSI);

        console.log(anchorId);
        console.log(hashLink);

        setTimeout(put,1000,`http://localhost:3000/createanchor/${anchorId}/${hashLink}`, callback);
        console.log(i);
    }
}, 50000000)

function put(url, end){
    doPut(url, {}, (err, data) => {
        if (err){
            console.log(err);
        }
        console.log(` Run: ${executedRuns}/${runs-1} - executed URL ${url} `);
        executedRuns++;
        if (executedRuns === (runs-1) ) end();
    });
}
