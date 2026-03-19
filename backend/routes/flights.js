const express = require("express");
const mongoose = require("mongoose");

const Flight = require("../models/Flight");

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const { from, to, date } = req.query;
		const query = {};

		if (from) {
			query.from = { $regex: `^${String(from).trim()}$`, $options: "i" };
		}

		if (to) {
			query.to = { $regex: `^${String(to).trim()}$`, $options: "i" };
		}

		if (date) {
			const parsedDate = new Date(date);
			if (Number.isNaN(parsedDate.getTime())) {
				return res.status(400).json({ message: "Invalid date query parameter" });
			}

			const startOfDay = new Date(parsedDate);
			startOfDay.setHours(0, 0, 0, 0);

			const endOfDay = new Date(parsedDate);
			endOfDay.setHours(23, 59, 59, 999);

			query.date = { $gte: startOfDay, $lte: endOfDay };
		}

		const flights = await Flight.find(query).sort({ date: 1 });
		return res.status(200).json(flights);
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;

		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ message: "Invalid flight id" });
		}

		const flight = await Flight.findById(id);
		if (!flight) {
			return res.status(404).json({ message: "Flight not found" });
		}

		return res.status(200).json(flight);
	} catch (error) {
		return res.status(500).json({ message: "Server error" });
	}
});

router.post("/", async (req, res) => {
	try {
		const { from, to, date, price, seats, airline } = req.body;

		if (!from || !to || !date || price === undefined || seats === undefined || !airline) {
			return res.status(400).json({
				message: "from, to, date, price, seats, and airline are required",
			});
		}

		const createdFlight = await Flight.create({
			from,
			to,
			date,
			price,
			seats,
			airline,
		});

		return res.status(201).json(createdFlight);
	} catch (error) {
		if (error.name === "ValidationError") {
			return res.status(400).json({ message: error.message });
		}

		return res.status(500).json({ message: "Server error" });
	}
});

module.exports = router;
