async function addAnchor(contract, keySSI ){
    //dummy implementation
    const data = {
        controlString : "aaaa",
        newHashLinkSSI : "aaaaaaaaaaa",
        ZKPValue : "aaaaaaaa",
        lastHashLinkSSI : "111111111",
        signature : "1111111",
        publicKey: "111111111"
    };
    const sendData = JSON.stringify(data);
    const result = await contract.submitTransaction("addAnchor",keySSI, sendData);
    console.log(`*** addAnchor Result: ${result.toString()}`);
    return result.toString();
}


module.exports = {
    addAnchor
}
