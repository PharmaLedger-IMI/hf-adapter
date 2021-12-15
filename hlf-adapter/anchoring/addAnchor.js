async function addAnchor(contract, keySSI, anchorData ){
    console.log(`Call AddAnchor for : ${keySSI} and ${anchorData}`);

    const sendData = JSON.stringify(anchorData);
    const result = await contract.submitTransaction("addAnchor",keySSI, sendData);
    console.log(`*** addAnchor Result: ${result.toString()}`);
    return result.toString();
}


module.exports = {
    addAnchor
}
