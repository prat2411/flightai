require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const flightRoutes = require("./routes/flights");
const bookingRoutes = require("./routes/bookings");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
	res.json({ message: "FlightAI backend is running" });
});

const startServer = async () => {
	try {
		if (!MONGO_URI) {
			throw new Error("MONGO_URI is not set in environment variables");
		}

		await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        family: 4
    });
		console.log("MongoDB connected");

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error.message);
		process.exit(1);
	}
};

startServer();
