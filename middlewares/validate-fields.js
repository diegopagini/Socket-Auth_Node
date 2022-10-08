/** @format */
import { request, response } from 'express';
import { validationResult } from 'express-validator';

export const validateFields = (req = request, res = response, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json(errors); // If, we have some error...

	next(); // If not, we continue to the next middleware.
};
