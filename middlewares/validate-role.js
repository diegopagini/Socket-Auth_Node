/** @format */
import { request, response } from 'express';

export const isAdminRole = async (req = request, res = response, next) => {
	if (!req.user)
		return res.status(500).json({
			message: 'You are trying to validate the role without the token.',
		});

	const { role, name } = req.user;

	if (role !== 'ADMIN_ROLE')
		res.status(401).json({
			message: `${name} is not an admin.`,
		});

	next();
};

export const hasRole = (...roles) => {
	// Using ...roles like this in the params we can call this function like this: 	hasRole('ADMIN_ROLE', 'VENTAS_ROLE'),
	return (req = request, res = response, next) => {
		// Return a callback is needed to use the function in the middlewares.
		if (!req.user)
			return res.status(500).json({
				message: 'You are trying to validate the role without the token.',
			});

		if (!roles.includes(req.user.role))
			return res.status(401).json({
				message: `The service require one of this roles ${roles}.`,
			});

		next();
	};
}; /// ...roles is the way to use like hasRole('ADMIN_ROLE', 'VENTAS_ROLE')
