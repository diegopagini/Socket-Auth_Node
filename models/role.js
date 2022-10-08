/** @format */
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const RoleSchema = Schema({
	role: {
		type: String,
		required: [true, 'Role is required'],
	},
});

export const Role = model('Role', RoleSchema);
