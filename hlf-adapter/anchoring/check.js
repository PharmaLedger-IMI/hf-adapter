async function check(contract){
    let result = await contract.evaluateTransaction('check');
    console.log(`*** check Result: `,result);
    return result;
}


module.exports = {
    check
}
