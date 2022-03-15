async function createOrAppendMultipleAnchors(contract, keySSI, body ){
    console.log(`Call createOrAppendMultipleAnchors for : ${keySSI} and ${body}`);

    const sendData = JSON.stringify(body);
    const result = await contract.submitTransaction("createOrAppendMultipleAnchors",keySSI, sendData);
    console.log('*** createOrAppendMultipleAnchors Result: ', result.toString());
    return result.toString();
}


module.exports = {
    createOrAppendMultipleAnchors
}
