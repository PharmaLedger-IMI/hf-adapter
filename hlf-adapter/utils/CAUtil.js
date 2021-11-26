

'use strict';

const adminUserId = 'rcaadmin';
const adminUserPasswd = 'rcaadminpw';

/**
 *
 * @param {*} FabricCAServices
 * @param {*} ccp
 */
exports.buildCAClient = (FabricCAServices, ccp, caHostName) => {
	// Create a new CA client for interacting with the CA.
	const caInfo = ccp.certificateAuthorities[caHostName]; //lookup CA details from config
	const caTLSCACerts = caInfo.tlsCACerts.pem;
	const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

	console.log(`Built a CA Client named ${caInfo.caName} connected to ${caInfo.url}`);
	console.log(caClient);
	return caClient;
};

exports.enrollAdmin = async (caClient, wallet, orgMspId) => {
	try {
		// Check to see if we've already enrolled the admin user.
		const identity = await wallet.get(adminUserId);
		if (identity) {
			console.log('An identity for the admin user already exists in the wallet');
			return;
		}
		else{
			console.log('Enrolling the admin user.')
		}

		// Enroll the admin user, and import the new identity into the wallet.
		const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd });
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: orgMspId,
			type: 'X.509',
		};
		await wallet.put(adminUserId, x509Identity);
		console.log('Successfully enrolled admin user and imported it into the wallet');
	} catch (error) {
		console.error(`Failed to enroll admin user : ${error}`);
	}
};

exports.registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, affiliation) => {
	try {
		// Check to see if we've already enrolled the user
		const userIdentity = await wallet.get(userId);
		if (userIdentity) {
			console.log(`An identity for the user ${userId} already exists in the wallet`);
			return;
		}

		// Must use an admin to register a new user
		const adminIdentity = await wallet.get(adminUserId);
		if (!adminIdentity) {
			console.log('An identity for the admin user does not exist in the wallet');
			console.log('Enroll the admin user before retrying');
			return;
		}

		// build a user object for authenticating with the CA
		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
		const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

		// user enrollment is global, on network level
		// try to enroll user, if it fails, it means it already exists, so reenroll it
		//console.log('provider : ',provider);
		//console.log('admin user : ',adminUser);
		let enrollment = await registerUser(caClient, affiliation, adminUser, userId);
		if (enrollment === undefined)
		{
			enrollment = await reenroll(userId, caClient,adminUser);
		}

		//console.log('x509 identity - enrollment', enrollment);
		//console.log('enrollment.certificate', enrollment.certificate);
		//console.log('enrollment.key', enrollment.key);

		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: 'RmsMSP',
			type: 'X.509',
		};
		await wallet.put(userId, x509Identity);

		console.log(`Successfully registered and enrolled admin user ${userId} and imported it into the wallet`);
	} catch (error) {
		console.error(`Failed to register user : ${error}`);
	}
};

async function reenroll(userId, caClient,adminUser){
	console.log(`Trying to reenroll the user ${userId}`)
	return  await caClient.reenroll(adminUser,[{
		name:userId,
		optional: true
	}]);
}
async function registerUser(caClient, affiliation, adminUser,userId){
	try {
		console.log(`Trying to register the user ${userId}`)
		// Register the user, enroll the user, and import the new identity into the wallet.
		// if affiliation is specified by client, the affiliation value must be configured in CA
		const secret = await caClient.register({
			affiliation: affiliation,
			enrollmentID: userId,
			role: 'client'
		}, adminUser);
		//console.log('user secret :', userId,secret);
		const enrollment = await caClient.enroll({
			enrollmentID: userId,
			enrollmentSecret: secret
		});
		//console.log('register user - enrollment : ',enrollment);

		return enrollment;
	}
	catch (err){
		console.log('Failed to register user. Trying to re enroll it. ', err);
		return undefined;
	}
}
