/** @format */
import { Router } from 'express';
import { check } from 'express-validator';

import { showImage, updateImage, updateImageCloudinary } from '../controllers/upload.controller.js';
import { allowedCollections } from '../helpers/db-validators.js';
import { validateFields } from '../middlewares/validate-fields.js';
import { validateFiles } from '../middlewares/validate-files.js';

export const uploadRouter = Router(); // Instance of router from express.

uploadRouter.post('/', [validateFiles], updateImageCloudinary);

uploadRouter.put(
	'/:collection/:id',
	[
		validateFiles,
		check('id', 'Must be a mongo ID').isMongoId(),
		check('collection').custom((c) => allowedCollections(c, ['users', 'products'])),
		validateFields,
	],
	updateImage
);

uploadRouter.get(
	'/:collection/:id',
	[
		check('id', 'Must be a mongo ID').isMongoId(),
		check('collection').custom((c) => allowedCollections(c, ['users', 'products'])),
		validateFields,
	],
	showImage
);
