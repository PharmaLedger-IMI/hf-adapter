async function dumpAnchors(contract, from, limit, maxSize ){

    const result = await contract.evaluateTransaction("dumpAnchors",from, limit, maxSize);
    console.log(`*** dumpAnchors Result:`,result.toString());
    return result.toString();
}

module.exports = {
    dumpAnchors
}
