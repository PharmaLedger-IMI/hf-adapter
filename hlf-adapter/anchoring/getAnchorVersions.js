async function getAnchorVersions(contract, keySSI ){
    //dummy implementation
    const result = await contract.evaluateTransaction("getAnchorVersions",keySSI);
    console.log(`*** getAnchorVersions Result: ${result.toString()}`);
    return result.toString();
}

module.exports = {
    getAnchorVersions
}
