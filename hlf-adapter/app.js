
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const EventStrategies = require("fabric-network/lib/impl/event/defaulteventhandlerstrategies");
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./utils/CAUtil.js');
const { buildCCPRms, buildWallet } = require('./utils/AppUtil.js');

const channelName = 'anchoring';
const chaincodeName = 'anchor';

const mspOrg1 = 'RmsMSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'hlfRmsUser';

let hlf_gateway;
let anchor_contract;


async function getAnchoringContract(){
	if (hlf_gateway === undefined || anchor_contract === undefined)
	{
		await connect();
	}

	return anchor_contract;
}

async function disconnect(){
	if (hlf_gateway !== undefined)
	{
		hlf_gateway.disconnect();
	}

}

async function connect() {

	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPRms();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, 'rms-ecert-ca');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'rms.anchoring');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();
		hlf_gateway = gateway;
		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				eventHandlerOptions: {
					commitTimeout: 100,
					strategy: EventStrategies.MSPID_SCOPE_ANYFORTX
				},
				discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			//console.log(gateway);

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);
			//console.log(network);
			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);
			anchor_contract = contract;
			console.log(contract);

		}
		catch (error){
			console.log(error);
		}

	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

module.exports = {
	getAnchoringContract,
	disconnect
}
