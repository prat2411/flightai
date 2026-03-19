const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema(
	{
		from: {
			type: String,
			required: true,
			trim: true,
		},
		to: {
			type: String,
			required: true,
			trim: true,
		},
		date: {
			type: Date,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		seats: {
			type: Number,
			required: true,
		},
		airline: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Flight", flightSchema);
