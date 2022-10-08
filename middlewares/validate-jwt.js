/** @format */
import { request, response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/user.js';

export const validateJWT = async (req = request, res = response, next) => {
	const token = req.header('x-token'); // To get an specific header.

	if (!token)
		return res.status(401).json({
			message: 'There is no valid token.',
		});

	try {
		const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY); // To verify if it is a valid token.

		const user = await User.findById(uid);

		// Check if is a valid user.
		if (!user)
			return res.status(401).json({
				message: 'Not a valid user.',
			});

		// Check if the user has a true status.
		if (!user.status)
			return res.status(401).json({
				message: 'Not a valid token.',
			});

		req.user = user; // To add the authenticated user to the request.

		next(); // To continue with the next middleware.
	} catch (error) {
		console.log(error);
		return res.status(401).json({
			message: 'There is no valid token.',
		});
	}
};
