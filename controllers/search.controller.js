/** @format */
import { request, response } from 'express';
import Types from 'mongoose';

import { Category } from '../models/category.js';
import { Product } from '../models/product.js';
import { User } from '../models/user.js';

const allowedCollections = ['users', 'categories', 'products', 'roles'];

const searchUsers = async (term = '', res = response) => {
	const isMongoId = Types.ObjectId.isValid(term);

	if (isMongoId) {
		const user = await User.findById(term);
		return res.json({
			results: user ? [user] : [],
		});
	}

	const regex = new RegExp(term, 'i'); // To make insensitive the term.

	const users = await User.find({
		$or: [{ name: regex }, { email: regex }], // Search must match with name or email.
		$and: [{ status: true }], // The result must be an active user.
	});

	return res.json({
		results: users,
	});
};

const searchCategories = async (term = '', res = response) => {
	const isMongoId = Types.ObjectId.isValid(term);

	if (isMongoId) {
		const category = await Category.findById(term);
		return res.json({
			results: category ? [category] : [],
		});
	}

	const regex = new RegExp(term, 'i'); // To make insensitive the term.

	const categories = await Category.find({ name: regex, status: true });

	return res.json({
		results: categories,
	});
};

const searchProducts = async (term = '', res = response) => {
	const isMongoId = Types.ObjectId.isValid(term);

	if (isMongoId) {
		const product = await Product.findById(term).populate('category', 'name');
		return res.json({
			results: product ? [product] : [],
		});
	}

	const regex = new RegExp(term, 'i'); // To make insensitive the term.

	const products = await Category.find({ name: regex, status: true }).populate('category', 'name');

	return res.json({
		results: products,
	});
};

export const search = (req = request, res = response) => {
	const { collection, term } = req.params;

	if (!allowedCollections.includes(collection))
		return res.status(400).json({
			msg: `The allowed collections are: ${allowedCollections}`,
		});

	switch (collection) {
		case 'users':
			searchUsers(term, res);
			break;

		case 'categories':
			searchCategories(term, res);
			break;

		case 'products':
			searchProducts(term, res);
			break;

		default:
			return res.status(500).json({
				msg: 'That option is not implemented...',
			});
	}
};
