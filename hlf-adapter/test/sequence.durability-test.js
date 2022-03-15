//require("../../privatesky/psknode/bundles/openDSU");
require('../../privatesky/psknode/bundles/testsRuntime');
const openDSU = require("opendsu");
const http = openDSU.loadApi("http");
const doPut = $$.promisify(http.doPut);
const assert = require('double-check').assert;


assert.callback("sequence testing", async (callback) => {
    const utils = require("./utils-simple");

    for (let i = 0; i < 50 ; i++) {
        const seedSSI = utils.generateSeedSSI();
        const anchorId = utils.getAnchorId(seedSSI);
        const hashLink = await utils.getSignedHashLink(seedSSI);

        await doPut(`http://localhost:3000/createanchor/${anchorId}/${hashLink}`, {});
        console.log(i);
    }
    callback();
}, 5000000)

