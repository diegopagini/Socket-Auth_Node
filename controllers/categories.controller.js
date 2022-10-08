/** @format */
import { request, response } from 'express';

import { Category } from '../models/category.js';

export const getCategories = async (req = request, res = response) => {
	const { query } = req; // Query are all the optionals query params: "?name="...
	const { limit = 5, from = 0 } = query;

	// [total, categories] = destructuring of arrays
	const [total, categories] = await Promise.all([
		// Promise.all() to execute all promises at the same time.
		Category.countDocuments(query),
		Category.find(query).populate('user', 'name').skip(Number(from)).limit(Number(limit)),
	]);

	return res.status(200).json({
		total,
		categories,
	});
};

export const getCategory = async (req = request, res = response) => {
	const { id } = req.params;
	const category = await Category.findById(id).populate('user', 'name');

	return res.status(200).json(category);
};

export const createCategory = async (req = request, res = response) => {
	const name = req.body.name.toUpperCase();
	const categoryDB = await Category.findOne({ name });

	if (categoryDB)
		return res.status(400).json({
			msg: `Category with name ${categoryDB.name} already exists`,
		});

	const data = {
		name,
		user: req.user._id,
	};

	// Save in DB
	const category = await new Category(data);
	await category.save();

	return res.status(201).json(category);
};

export const updateCategory = async (req = request, res = response) => {
	const { id } = req.params;
	const { status, user, ...data } = req.body;

	data.name = data.name.toUpperCase();
	data.user = req.user._id;

	const category = await Category.findByIdAndUpdate(id, data, { new: true }); // data is the change that we want to do.

	return res.status(200).json(category);
};

export const deteleCategory = async (req = request, res = response) => {
	const { id } = req.params;

	const deletedCategory = await Category.findByIdAndUpdate(id, { status: false }, { new: true });

	return res.status(200).json(deletedCategory);
};
