async function getAllAnchorVersions(contract, keySSI ){

    const result = await contract.evaluateTransaction("getAllVersions",keySSI);
    console.log(`*** getAllAnchorVersions Result:`,result.toString());
    return result.toString();
}

module.exports = {
    getAllAnchorVersions
}
