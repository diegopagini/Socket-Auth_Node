/** @format */
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const CategorySchema = Schema({
	name: {
		type: String,
		required: [true, 'Name is mandatory'],
		unique: true,
	},
	state: {
		type: Boolean,
		default: true,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId, // Must be a user from the collection.
		ref: 'User',
		required: true,
	},
});

CategorySchema.methods.toJSON = function () {
	// To override the method from mongoose.
	const { __v, status, ...data } = this.toObject(); // It will delete the status and version in our model (Not in the database).
	return data;
};

export const Category = model('Category', CategorySchema);
