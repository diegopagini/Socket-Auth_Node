/** @format */
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProductSchema = Schema({
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
	price: {
		type: Number,
		default: 0,
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category',
		required: true,
	},
	description: {
		type: String,
	},
	available: {
		type: Boolean,
		default: true,
	},
	img: {
		type: String,
	},
});

ProductSchema.methods.toJSON = function () {
	// To override the method from mongoose.
	const { __v, status, ...data } = this.toObject(); // It will delete the status and version in our model (Not in the database).
	return data;
};

export const Product = model('Product', ProductSchema);
