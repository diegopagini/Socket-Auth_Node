/** @format */
import { Router } from 'express';
import { check } from 'express-validator';

import { createProduct, deteleProduct, getProduct, getProducts, updateProduct } from '../controllers/products.controller.js';
import { categoryExistById, productExistById } from '../helpers/db-validators.js';
import { isAdminRole, validateFields, validateJWT } from '../middlewares/index.js';

export const productsRouter = Router(); // Instance of router from express.

/**
 * Get all products
 */
productsRouter.get('/', getProducts); // No validations.

/**
 * Get details from a product.
 */
productsRouter.get(
	'/:id',
	[
		check('id', 'Is not a Mongo ID').isMongoId(),
		check('id').custom(productExistById),
		validateFields,
	],
	getProduct
);

/**
 * Create a new product.
 */
productsRouter.post(
	'/',
	[
		validateJWT,
		check('name', 'Name is required').not().isEmpty(),
		check('category', 'Is not a Mongo Category').isMongoId(),
		check('category').custom(categoryExistById),
		validateFields,
	], // Middlewares.
	createProduct // Controller.
);

/**
 * Update a product.
 */
productsRouter.put(
	'/:id',
	[validateJWT, check('id').custom(productExistById), validateFields],
	updateProduct
);

/**
 * Delete a product.
 */
productsRouter.delete(
	'/:id',
	[
		validateJWT,
		isAdminRole,
		check('id', 'Is not a Mongo ID').isMongoId(),
		check('id').custom(productExistById),
		validateFields,
	],
	deteleProduct
);
