const httpMocks = require('node-mocks-http');

function getRequestAddAnchor(anchorId, signedhashlink) {
    return httpMocks.createRequest({
        method: 'PUT',
        url: '/createanchor',
        params: {
            keySSI: anchorId,
            anchorValue: signedhashlink
        },
        body:{}
    });
}

function getRequestAppendAnchor(anchorId, signedHashlink) {
    return httpMocks.createRequest({
        method: 'PUT',
        url: '/appendanchor',
        params: {
            keySSI: anchorId,
            anchorValue: signedHashlink
        },
        body:{}
    });
}

function getRequestGetVersions(anchorId) {
    return httpMocks.createRequest({
        method: 'GET',
        url: '/getallversions',
        params: {
            keySSI: anchorId
        }
    });
}

function getRequestGetLastVersion(anchorId) {
    return httpMocks.createRequest({
        method: 'GET',
        url: '/getlastversion',
        params: {
            keySSI: anchorId
        }
    });
}

function getNoOfAnchors() {
    return httpMocks.createRequest({
        method: 'GET',
        url: '/totalNumberOfAnchors',
        params: {},
        body:{}
    });
}

module.exports = {
    getRequestAddAnchor,
    getRequestAppendAnchor,
    getRequestGetVersions,
    getRequestGetLastVersion,
    getNoOfAnchors
}
