async function check(contract){
    let result = await contract.evaluateTransaction('check');
    console.log(`*** check Result: ${result.toString()}`);
    return result.toString();
}


module.exports = {
    check
}
