async function appendAnchor(contract, keySSI, anchorData ){
    console.log(`Call AppendAnchor for : ${keySSI} and ${anchorData}`);

    const sendData = JSON.stringify(anchorData);
    const result = await contract.submitTransaction("appendAnchor",keySSI, sendData);
    console.log(`*** appendAnchor Result: `,result.toString());
    return result.toString();
}


module.exports = {
    appendAnchor
}
