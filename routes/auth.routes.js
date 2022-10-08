/** @format */
import { Router } from 'express';
import { check } from 'express-validator';

import { googleSignIn, login } from '../controllers/auth.controller.js';
import { validateFields } from '../middlewares/validate-fields.js';

export const authRouter = Router(); // Instance of router from express.

authRouter.post(
	'/login',
	[
		check('email', 'Email is required').isEmail(),
		check('password', 'Password is required').not().isEmpty(),
		validateFields,
	],
	login
);

authRouter.post(
	'/google',
	[check('id_token', 'Google TOken is required').not().isEmpty(), validateFields],
	googleSignIn
);
