/** @format */
import jwt from 'jsonwebtoken';

import { User } from '../models/user.js';

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

export const checkJWT = async (token = '') => {
	try {
		if (token.length < 10) return null;

		const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
		const user = await User.findById(uid);

		if (user && user.status) return user;
		else return null;
	} catch (error) {
		return null;
	}
};
