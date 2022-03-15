async function getLastAnchorVersion(contract, keySSI ){

    const result = await contract.evaluateTransaction("getLastVersion",keySSI);
    console.log(`*** getLastAnchorVersion Result: `,result.toString());
    return result.toString();
}

module.exports = {
    getLastAnchorVersion
}
