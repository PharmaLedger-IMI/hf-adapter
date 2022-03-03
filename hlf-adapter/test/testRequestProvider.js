const httpMocks = require('node-mocks-http');

function getRequestAddAnchor1st() {
    return httpMocks.createRequest({
        method: 'PUT',
        url: '/create-anchor',
        params: {
            keySSI: "ArzZh8TxNMevR6QanDX8ixBgc8y2FQvxijedXanPpAgoWCcm6GsQFSBjAH2c5XVZuk1TYo1YBcgEWafg1zLnrw7KPKUi9vcXVkUbVMJVeHazyovg4Cgw1EyLVwXuxpUzdBX7WiKkctK5JgHnP"
        },
        body:{
            "hashLinkSSI": "2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzYcc2GgzRdtHuVuexm8k6HMVTHehkGtxCqAUkXhqXgRjVJtu1M77sfNnw3AcUxbRk41aoCzYd6XMBf55hYwxb34fh4MgTWwHmtzZzCMeqjS2Asw6ba1AXSRBJmAGbFxMkihPhkN3",
            "zkp": ""
        }
    });
}

function getRequestAddAnchor2nd() {
    return httpMocks.createRequest({
        method: 'PUT',
        url: '/append-to-anchor',
        params: {
            keySSI: "ArzZh8TxNMevR6QanDX8ixBgc8y2FQvxijedXanPpAgoWCcm6GsQFSBjAH2c5XVZuk1TYo1YBcgEWafg1zLnrw7KPKUi9vcXVkUbVMJVeHazyovg4Cgw1EyLVwXuxpUzdBX7WiKkctK5JgHnP"
        },
        body:{
            "hashLinkSSI": "HxMN6F7bEr3MPNP5tKMnX9dW9gftm6g7Dy5UBZFkPYR5UxqmzpV2pP53LGJjjdjMCsYAm4e1MgS6GDffteHP8Mga54pRvaBFJxLRmHmsqSC7cGCrsvc7nxamJYmBDEbcshoEx1ZsrvjfFs8A2dWxdQsiWnghNeZ29eo1jmtgcNYhDC8fZQj9bHhiwQ5QUNqZXSFnVGXZjU5K1rsUvhUGyRMcJaqkpZFF9NnpgoZTJjy",
            "zkp": ""
        }
    });
}

function getRequestAddAnchorUnSynced() {
    return httpMocks.createRequest({
        method: 'PUT',
        url: '/append-to-anchor',
        params: {
            keySSI: "ArzZh8TxNMevR6QanDX8ixBgc8y2FQvxijedXanPpAgoWCcm6GsQFSBjAH2c5XVZuk1TYo1YBcgEWafg1zLnrw7KPKUi9vcXVkUbVMJVeHazyovg4Cgw1EyLVwXuxpUzdBX7WiKkctK5JgHnP"
        },
        body:{
            "hashLinkSSI": "2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzsWZmm6vhG8ta2qSYS13AwVPB65xMZwpQzYzuQVTDntPksubbmYkGbXSueyQqH5Zoa9xgvKsPZxZMoCRbAEbe1MKsyZ6Ykv7u5fZjoNVNWhwXwe6Bjp8DbofqxfthSs8Q5iScu4B",
            "zkp": ""
        }
    });
}
function getRequestGetVersions() {
    return httpMocks.createRequest({
        method: 'GET',
        url: '/get-all-versions',
        params: {
            keySSI: "ArzZh8TxNMevR6QanDX8ixBgc8y2FQvxijedXanPpAgoWCcm6GsQFSBjAH2c5XVZuk1TYo1YBcgEWafg1zLnrw7KPKUi9vcXVkUbVMJVeHazyovg4Cgw1EyLVwXuxpUzdBX7WiKkctK5JgHnP"
        }
    });
}

function getRequestGetLastVersion() {
    return httpMocks.createRequest({
        method: 'GET',
        url: '/get-last-version',
        params: {
            keySSI: "ArzZh8TxNMevR6QanDX8ixBgc8y2FQvxijedXanPpAgoWCcm6GsQFSBjAH2c5XVZuk1TYo1YBcgEWafg1zLnrw7KPKUi9vcXVkUbVMJVeHazyovg4Cgw1EyLVwXuxpUzdBX7WiKkctK5JgHnP"
        }
    });
}

function getRequestAddAnchorWrongPubKey() {
    return httpMocks.createRequest({
        method: 'PUT',
        url: '/create-anchor',
        params: {
            keySSI: "ArzZh8TxNMevR6QanDX8ixBgc8y2FQvxijedXanPpAgoWCcm6GsQFSBjAH2c5XVZuk1TYo1YBcgEWafg1zLnrw7KPKUi9vcXVkUbVMJVeHazyovg4Cgw1EyLVwXuxpUzdBX7WiKkctK5JgHnP"
        },
        body:{
            "hashLinkSSI": "2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzsWZmm6vhG8ta2qSYS13AwVPB65xMZwpQzYzuQVTDntPksubbmYkGbXSueyQqH5Zoa9xgvKsPZxZMoCRbAEbe1MKsyZ6Ykv7u5fZjoNVNWhwXwe6Bjp8DbofqxfthSs8Q5iScu4B",
            "zkp": ""
        }
    });
}


function getRequestAddAnchorConst() {
    return httpMocks.createRequest({
        method: 'PUT',
        url: '/create-anchor',
        params: {
            keySSI: "ArzZh8FqkKL9EpMFTspJhfXfTRBEGCb8EKqhNi3TGEKjBqmhLuwvDKCHTJKqdo1rnCTX7u2NmQtdkbEDJgZabRs1oZjo3KneYr7JzU8tuK1FYHmgxDrF2z3qFwMCMULbr7pCLdogfV6xhNY2s"
        },
        body:{
            "hashLinkSSI": "2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzYcc2GgzRdtHuVuexm8k6HMVTHehkGtxCqAUkXhqXgRjVJtu1M77sfNnw3AcUxbRk41aoCzYd6XMBf55hYwxb34fh4MgTWwHmtzZzCMeqjS2Asw6ba1AXSRBJmAGbFxMkihPhkN3",
            "zkp": ""
        }
    });
}

function getRequestAddAnchorConst2nd() {
    return httpMocks.createRequest({
        method: 'PUT',
        url: '/append-to-anchor',
        params: {
            keySSI: "ArzZh8FqkKL9EpMFTspJhfXfTRBEGCb8EKqhNi3TGEKjBqmhLuwvDKCHTJKqdo1rnCTX7u2NmQtdkbEDJgZabRs1oZjo3KneYr7JzU8tuK1FYHmgxDrF2z3qFwMCMULbr7pCLdogfV6xhNY2s"
        },
        body:{
            "hashLinkSSI": "2HqJt69J687TNyjNUZW2cPrkKxHNFbdsJxDcd21dvLEhaZd7KCA9QCA3TiAn8GvxfwhrPpEr4GXBaXTxdMtzQ7aha9kgqyuULm7nrzYcc2GgzRdtHuVuexm8k6HMVTHehkGtxCqAUkXhqXgRjVJtu1M77sfNnw3AcUxbRk41aoCzYd6XMBf55hYwxb34fh4MgTWwHmtzZzCMeqjS2Asw6ba1AXSRBJmAGbFxMkihPhkN3",
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
    getRequestGetVersions,
    getRequestGetLastVersion
}
