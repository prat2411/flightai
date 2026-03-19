const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		flightId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Flight",
			required: true,
		},
		passengers: {
			type: Number,
			required: true,
			min: 1,
		},
		status: {
			type: String,
			enum: ["confirmed", "cancelled", "pending"],
			default: "confirmed",
		},
		bookingDate: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Booking", bookingSchema);
