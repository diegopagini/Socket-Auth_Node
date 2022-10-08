/** @format */
import { v2 } from 'cloudinary';
import { request, response } from 'express';
import fs from 'fs';
import path from 'path';

import { uploadFiles } from '../helpers/upload-file.js';
import { Product } from '../models/product.js';
import { User } from '../models/user.js';

// To configure cloudinary.
v2.config(process.env.CLOUDINARY_URL);

export const uploadFile = async (req = request, res = response) => {
	try {
		// const fileName = await uploadFiles(req.files, ['txt', 'md'], 'texts');
		// const fileName = await uploadFiles(req.files, undefined, 'images');
		const fileName = await uploadFiles(req.files);

		return res.json({
			fileName,
		});
	} catch (error) {
		return res.status(400).json({
			error,
		});
	}
};

/**
 * To save files in local server.
 * @param {request} req
 * @param {response} res
 * @returns Promise
 */
export const updateImage = async (req = request, res = response) => {
	const { id, collection } = req.params;

	let model;

	switch (collection) {
		case 'user':
			model = await User.findById(id);
			if (!model)
				return res.status(400).json({
					msg: `There is no user with ${id} id.`,
				});
			break;

		case 'products':
			model = await Product.findById(id);
			if (!model)
				return res.status(400).json({
					msg: `There is no product with ${id} id.`,
				});

			break;

		default:
			return res.status(500).json({
				msg: 'Error',
			});
	}

	// Clean all previous images.
	if (model.img) {
		const imgPath = path.join(__dirname, '../uploads', collection, model.img);

		if (fs.existsSync(imgPath)) {
			fs.unlinkSync(imgPath);
		}
	}

	model.img = await uploadFiles(req.files, undefined, collection);

	await model.save();

	return res.json(model);
};

export const showImage = async (req = request, res = response) => {
	const { id, collection } = req.params;

	let model;

	switch (collection) {
		case 'user':
			model = await User.findById(id);
			if (!model)
				return res.status(400).json({
					msg: `There is no user with ${id} id.`,
				});
			break;

		case 'products':
			model = await Product.findById(id);
			if (!model)
				return res.status(400).json({
					msg: `There is no product with ${id} id.`,
				});

			break;

		default:
			return res.status(500).json({
				msg: 'Error',
			});
	}

	if (model.img) {
		const imgPath = path.join(__dirname, '../uploads', collection, model.img);

		if (fs.existsSync(imgPath)) {
			return res.sendFile(img); // sendFile to send files to the frontend.
		}
	}

	// If there is no image.
	const pathImg = path.join(__dirname, '../assets/no-image.jpg');
	return res.sendFile(pathImg);
};

export const updateImageCloudinary = async (req = request, res = response) => {
	const { id, collection } = req.params;

	let model;

	switch (collection) {
		case 'user':
			model = await User.findById(id);
			if (!model)
				return res.status(400).json({
					msg: `There is no user with ${id} id.`,
				});
			break;

		case 'products':
			model = await Product.findById(id);
			if (!model)
				return res.status(400).json({
					msg: `There is no product with ${id} id.`,
				});

			break;

		default:
			return res.status(500).json({
				msg: 'Error',
			});
	}

	// Clean all previous images from cloudinary.
	if (model.img) {
		const splittedName = model.img.split('/');
		const name = splittedName[splittedName.length - 1];
		const [public_id] = name.split('.');
		await v2.uploader.destroy(public_id);
	}

	const { tempFilePath } = req.files.file;

	const { secure_url } = await v2.uploader.upload(tempFilePath);

	model.img = secure_url;

	await model.save();

	return res.json(model);
};
