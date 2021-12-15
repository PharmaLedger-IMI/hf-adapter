const httpMocks = require('node-mocks-http');

function getRequestAddAnchor1st() {
    return httpMocks.createRequest({
        method: 'PUT',
        url: '/addAnchor',
        params: {
            keySSI: "G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP"
        },
        body:{
            "hash": {
                "newHashLinkSSI": "hl1",
                "lastHashLinkSSI": null
            },
            "digitalProof": {
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKey": "PnzoCBTC5ToT29KvBJM2d1cP5C2CRijV2oDLdTNbNAQ3WHDN2x1QKtE4Bpdi6JtiKyCKCbR6Nq6ofJRhWqqHhiMD"
            },
            "zkp": ""
        }
    });
}

function getRequestAddAnchor2nd() {
    return httpMocks.createRequest({
        method: 'PUT',
        url: '/addAnchor',
        params: {
            keySSI: "G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP"
        },
        body:{
            "hash": {
                "newHashLinkSSI": "hl2",
                "lastHashLinkSSI": "hl1"
            },
            "digitalProof": {
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKey": "PnzoCBTC5ToT29KvBJM2d1cP5C2CRijV2oDLdTNbNAQ3WHDN2x1QKtE4Bpdi6JtiKyCKCbR6Nq6ofJRhWqqHhiMD"
            },
            "zkp": ""
        }
    });
}

function getRequestAddAnchorUnSynced() {
    return httpMocks.createRequest({
        method: 'PUT',
        url: '/addAnchor',
        params: {
            keySSI: "G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP"
        },
        body:{
            "hash": {
                "newHashLinkSSI": "hl9",
                "lastHashLinkSSI": "hl8"
            },
            "digitalProof": {
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKey": "PnzoCBTC5ToT29KvBJM2d1cP5C2CRijV2oDLdTNbNAQ3WHDN2x1QKtE4Bpdi6JtiKyCKCbR6Nq6ofJRhWqqHhiMD"
            },
            "zkp": ""
        }
    });
}
function getRequestGetVersions() {
    return httpMocks.createRequest({
        method: 'GET',
        url: '/getAnchorVersions',
        params: {
            keySSI: "G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP"
        }
    });
}

function getRequestAddAnchorWrongPubKey() {
    return httpMocks.createRequest({
        method: 'PUT',
        url: '/addAnchor',
        params: {
            keySSI: "G73iPJmPoTkDygqyuRNP6G7Wd9wHjeSZqRaxGdCtgsiEeN9PudAs57nSG8eZhT1Btu5PjnmsZPoRPY5AmcckYC8sWTHaP"
        },
        body:{
            "hash": {
                "newHashLinkSSI": "hl1",
                "lastHashLinkSSI": null
            },
            "digitalProof": {
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKey": "DxPnzoCBTC5ToT29KvBJM2d1cP5C2CRijV2oDLdTNbNAQ3WHDN2x1QKtE4Bpdi6JtiKyCKCbR6Nq6ofJRhWqqHhiMD"
            },
            "zkp": ""
        }
    });
}


function getRequestAddAnchorConst() {
    return httpMocks.createRequest({
        method: 'PUT',
        url: '/addAnchor',
        params: {
            keySSI: "BXSxxiosnXKwmcxLwygQZzvswkfgBMyUK"
        },
        body:{
            "hash": {
                "newHashLinkSSI": "hl1",
                "lastHashLinkSSI": null
            },
            "digitalProof": {
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKey": ""
            },
            "zkp": ""
        }
    });
}

function getRequestAddAnchorConst2nd() {
    return httpMocks.createRequest({
        method: 'PUT',
        url: '/addAnchor',
        params: {
            keySSI: "BXSxxiosnXKwmcxLwygQZzvswkfgBMyUK"
        },
        body:{
            "hash": {
                "newHashLinkSSI": "hl2",
                "lastHashLinkSSI": "hl1"
            },
            "digitalProof": {
                "signature": "iKx1CJLzw6zRqrHerujqMEpswHZB2LHyLmXRb6kHApCPgSt3zKxfi5YXXFBpnqBhnjDsrVjVm2ksRg1NYnuMvCfcw81gGBmqr6",
                "publicKey": ""
            },
            "zkp": ""
        }
    });
}

module.exports = {
    getRequestAddAnchor1st,
    getRequestAddAnchor2nd,
    getRequestAddAnchorUnSynced,
    getRequestAddAnchorWrongPubKey,
    getRequestAddAnchorConst,
    getRequestAddAnchorConst2nd,
    getRequestGetVersions
}
