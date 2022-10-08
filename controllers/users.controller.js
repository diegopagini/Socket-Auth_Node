/** @format */
import bcryptjs from 'bcryptjs';
import { request, response } from 'express';

import { User } from '../models/user.js';

// req = request and res = response to have the types for the response in JS...
export const usersGet = async (req = request, res = response) => {
	const { query } = req; // Query are all the optionals query params: "?name="...
	const { limit = 5, from = 0 } = query;

	// [total, users] = destructuring of arrays
	const [total, users] = await Promise.all([
		// Promise.all() to execute all promises at the same time.
		User.countDocuments({ status: true }),
		User.find({ status: true }).skip(Number(from)).limit(Number(limit)),
	]);

	return res.status(200).json({
		total,
		users,
	});
};

export const usersPost = async (req = request, res = response) => {
	const { name, email, password, role } = req.body;
	const user = new User({
		name,
		email,
		password,
		role,
	});

	// Encrypt the password.
	const salt = bcryptjs.genSaltSync(); // number of turns in the encryption cycle.
	user.password = bcryptjs.hashSync(password, salt); // encrypt method.

	// Save in DB.
	await user.save(); // To save the user in the data base.

	return res.status(200).json({
		user,
	});
};

export const usersPut = async (req = request, res = response) => {
	const { id } = req.params;
	const { _id, password, google, email, ...rest } = req.body;

	if (password) {
		// Encrypt the password.
		const salt = bcryptjs.genSaltSync(); // number of turns in the encryption cycle.
		rest.password = bcryptjs.hashSync(password, salt); // encrypt method.
	}

	const user = await User.findByIdAndUpdate(id, rest);

	return res.status(200).json({
		user,
	});
};

export const usersDelete = async (req = request, res = response) => {
	const { id } = req.params;

	// const user = await User.findByIdAndDelete(id); to delete physically. Not recommended.
	const user = await User.findByIdAndUpdate(id, { status: false }); // To change the status of the user.

	return res.status(200).json({
		user,
	});
};
