async function createAnchor(contract, keySSI, anchorData ){
    console.log(`Call CreateAnchor for : ${keySSI} and ${anchorData}`);

    const sendData = JSON.stringify(anchorData);
    const result = await contract.submitTransaction("createAnchor",keySSI, sendData);
    console.log('*** createAnchor Result: ', result, result.toString());
    return result.toString();
}


module.exports = {
    createAnchor
}
