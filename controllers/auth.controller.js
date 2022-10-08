/** @format */
import bcryptjs from 'bcryptjs';
import { request, response } from 'express';

import { googleVerify } from '../helpers/google-verify.js';
import { generateJWT } from '../helpers/jwt.js';
import { User } from '../models/user.js';

export const login = async (req = request, res = response) => {
	const { email, password } = req.body;

	try {
		// check if the email exists.
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: 'User / Password not valid.' });
		// check if the user is active.
		if (!user.status) return res.status(400).json({ message: 'User / Password not valid.' });
		// check passowrd
		const validPassword = bcryptjs.compareSync(password, user.password);
		if (!validPassword) return res.status(400).json({ message: 'User / Password not valid.' });
		// generate JWT
		const token = await generateJWT(user.id);

		return res.json({
			user,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: 'Speak with the administrator',
		});
	}
};

export const googleSignIn = async (req = request, res = response) => {
	const { id_token } = req.body;

	try {
		// Verify with google
		const { name, picture, email } = await googleVerify(id_token);

		// Find user
		let user = await User.findOne({ email });

		// If user doesn't exist
		if (!user) {
			const data = {
				name,
				email,
				password: 'empty',
				img: picture,
				google: true,
			};

			user = new User(data);
			await user.save();
		}

		if (!user.status)
			return res.status(401).json({
				msg: 'Bloqued user',
			});

		const token = await generateJWT(user.id);

		return res.status(200).json({
			user,
			token,
		});
	} catch (error) {
		return res.status(400).json({
			msg: 'Error with token',
			error,
		});
	}
};
