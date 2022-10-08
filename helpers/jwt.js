/** @format */
import jwt from 'jsonwebtoken';

export const generateJWT = (uid = '') => {
	return new Promise((resolve, reject) => {
		const payload = { uid }; // Payload inside the JWT.

		jwt.sign(
			payload,
			process.env.SECRET_OR_PRIVATE_KEY,
			{
				expiresIn: '4h', // Time to be invalid.
			},
			(err, token) => {
				// This package is based in callbacks...
				if (err) {
					console.log(err);
					reject('Could not generate token');
				} else {
					resolve(token);
				}
			}
		);
	});
};
