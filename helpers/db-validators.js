/** @format */
import { Category } from '../models/category.js';
import { Product } from '../models/product.js';
import { Role } from '../models/role.js';
import { User } from '../models/user.js';

export const isRoleValid = async (role = '') => {
	// Custom validatior.
	const exists = await Role.findOne({ role }); // To check if the role in the body match with the roles in the data base.
	if (!exists) throw new Error(`${role} not match with a valid role.`);
};

export const emailExists = async (email = '') => {
	const exists = await User.findOne({ email });
	if (exists) throw new Error('Email already registered.');
};

export const userByIdExists = async (id = '') => {
	const exists = await User.findById(id);
	if (!exists) throw new Error(`ID: ${id} not exist.`);
};

export const categoryExistById = async (id = '') => {
	const exists = await Category.findById(id);
	if (!exists) throw new Error(`ID: ${id} not exist.`);
};

export const productExistById = async (id = '') => {
	const exists = await Product.findById(id);
	if (!exists) throw new Error(`ID: ${id} not exist.`);
};

export const allowedCollections = async (collection = '', collections = []) => {
	const isIncluded = collections.includes(collection);

	if (!isIncluded) throw new Error(`${collection} is not allowed. `);

	// If all is fine.
	return true;
};
