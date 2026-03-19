const express = require("express");
const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
	try {
		const { flightId, passengers, status, bookingDate } = req.body;
		const userId = req.user.id;

		if (!flightId || passengers === undefined) {
			return res.status(400).json({ message: "flightId and passengers are required" });
		}

		if (!mongoose.Types.ObjectId.isValid(flightId)) {
			return res.status(400).json({ message: "Invalid flightId" });
		}

		const booking = await Booking.create({
			userId,
			flightId,
			passengers,
			status,
			bookingDate,
		});

		return res.status(201).json(booking);
	} catch (error) {
		if (error.name === "ValidationError") {
			return res.status(400).json({ message: error.message });
		}

		return res.status(500).json({ message: "Server error" });
	}
});

router.get("/my", async (req, res) => {
	try {
		const userId = req.user.id;
		const bookings = await Booking.find({ userId })
			.populate("flightId")
			.sort({ createdAt: -1 });

		return res.status(200).json(bookings);
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid booking id" });
		}

		const booking = await Booking.findById(id);
		if (!booking) {
			return res.status(404).json({ message: "Booking not found" });
		}

		if (booking.userId.toString() !== userId) {
			return res.status(403).json({ message: "Not authorized to delete this booking" });
		}

		await booking.deleteOne();

		return res.status(200).json({ message: "Booking deleted successfully" });
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
});

module.exports = router;
