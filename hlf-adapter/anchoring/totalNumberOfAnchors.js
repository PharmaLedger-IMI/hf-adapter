async function totalNumberOfAnchors(contract ){

    const result = await contract.evaluateTransaction("totalNumberOfAnchors");
    console.log(`*** totalNumberOfAnchors Result: `,result.toString());
    return parseInt(result.toString());
}

module.exports = {
    totalNumberOfAnchors
}
