/** @format */
import { Router } from 'express';
import { check } from 'express-validator';

import { usersDelete, usersGet, usersPost, usersPut } from '../controllers/users.controller.js';
import { emailExists, isRoleValid, userByIdExists } from '../helpers/db-validators.js';
import { hasRole, isAdminRole, validateFields, validateJWT } from '../middlewares/index.js';

export const userRouter = Router(); // Instance of router from express.

// "get", "post", "put", "delete", etc. are the keywords to use routes.
userRouter.get('/', usersGet); // We call the reference to our function "usersGet".

userRouter.post(
	'/',
	[
		check('email', 'Invalid email').isEmail(),
		check('name', 'Name is required').not().isEmpty(),
		check('password', 'Password is required with more than 6 characters').isLength({ min: 6 }),
		// check('role', 'Role is invalid').isIn(['ADMIN_ROLE', 'USER_ROLE']),
		check('role').custom(isRoleValid), // check('role').custom((role) => isRoleValid(role)). if the argument is the same we could ignore it
		check('email').custom(emailExists), // To check if the email is already registered.
		validateFields, // The custom middleware to validate if all previous validators capture some error.
	],
	usersPost
); // The second param is an array of middlewares.

userRouter.put(
	'/:id',
	[
		check('id', 'Is not a valid id').isMongoId(),
		check('id').custom(userByIdExists),
		check('role').custom(isRoleValid),
		validateFields,
	],
	usersPut
); // :id to allow a param in the route.

userRouter.delete(
	'/:id',
	[
		hasRole('ADMIN_ROLE', 'VENTAS_ROLE'),
		validateJWT, // To check if the user has a valid token.
		isAdminRole, // To check if is an admin.
		check('id', 'Is not a valid id').isMongoId(),
		check('id').custom(userByIdExists),
		validateFields,
	],
	usersDelete
);
