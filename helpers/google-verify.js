/** @format */
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleVerify(token = '') {
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.GOOGLE_CLIENT_ID,
	});

	const { name, picture, email } = ticket.getPayload();

	return {
		name,
		picture,
		email,
	};
}
