/** @format */
import mongoose from 'mongoose';

const { model, Schema } = mongoose;

const UserSchema = Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
	},
	img: {
		type: String,
	},
	role: {
		type: String,
		required: [true, 'Role is required'],
		enum: ['ADMIN_ROLE', 'USER_ROLE'],
	},
	status: {
		type: Boolean,
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	},
});

UserSchema.methods.toJSON = function () {
	// To override the method from mongoose.
	const { __v, password, _id, ...user } = this.toObject(); // It will delete the version and password in our model (Not in the database).
	user.uid = _id; // To visually change _id to uid.
	return user;
};

export const User = model('User', UserSchema);
