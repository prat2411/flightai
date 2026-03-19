require("dotenv").config();

const mongoose = require("mongoose");
const Flight = require("./models/Flight");

const MONGO_URI = process.env.MONGO_URI;

const sampleFlights = [
	{ from: "Delhi", to: "Mumbai", date: "2026-04-01T06:30:00.000Z", price: 5200, seats: 120, airline: "IndiGo" },
	{ from: "Mumbai", to: "Bengaluru", date: "2026-04-01T10:15:00.000Z", price: 4800, seats: 98, airline: "Akasa Air" },
	{ from: "Bengaluru", to: "Hyderabad", date: "2026-04-01T14:20:00.000Z", price: 3500, seats: 110, airline: "Air India" },
	{ from: "Hyderabad", to: "Chennai", date: "2026-04-02T08:05:00.000Z", price: 3200, seats: 105, airline: "SpiceJet" },
	{ from: "Chennai", to: "Kolkata", date: "2026-04-02T12:40:00.000Z", price: 5600, seats: 95, airline: "IndiGo" },
	{ from: "Kolkata", to: "Delhi", date: "2026-04-02T17:25:00.000Z", price: 5900, seats: 100, airline: "Air India" },
	{ from: "Pune", to: "Goa", date: "2026-04-03T07:10:00.000Z", price: 3000, seats: 85, airline: "Akasa Air" },
	{ from: "Goa", to: "Ahmedabad", date: "2026-04-03T11:55:00.000Z", price: 4700, seats: 92, airline: "IndiGo" },
	{ from: "Ahmedabad", to: "Jaipur", date: "2026-04-03T15:45:00.000Z", price: 3400, seats: 88, airline: "SpiceJet" },
	{ from: "Jaipur", to: "Lucknow", date: "2026-04-04T06:50:00.000Z", price: 3600, seats: 90, airline: "Air India" },
	{ from: "Lucknow", to: "Varanasi", date: "2026-04-04T09:30:00.000Z", price: 2400, seats: 80, airline: "IndiGo" },
	{ from: "Varanasi", to: "Patna", date: "2026-04-04T13:10:00.000Z", price: 2200, seats: 75, airline: "SpiceJet" },
	{ from: "Patna", to: "Bhubaneswar", date: "2026-04-05T08:20:00.000Z", price: 3800, seats: 86, airline: "Air India" },
	{ from: "Bhubaneswar", to: "Ranchi", date: "2026-04-05T12:00:00.000Z", price: 2600, seats: 82, airline: "IndiGo" },
	{ from: "Ranchi", to: "Delhi", date: "2026-04-05T17:35:00.000Z", price: 5100, seats: 96, airline: "Akasa Air" },
	{ from: "Mumbai", to: "Goa", date: "2026-04-06T07:45:00.000Z", price: 3100, seats: 102, airline: "IndiGo" },
	{ from: "Delhi", to: "Chandigarh", date: "2026-04-06T10:25:00.000Z", price: 2700, seats: 89, airline: "SpiceJet" },
	{ from: "Chandigarh", to: "Srinagar", date: "2026-04-06T13:50:00.000Z", price: 4500, seats: 78, airline: "Air India" },
	{ from: "Bengaluru", to: "Kochi", date: "2026-04-07T09:15:00.000Z", price: 3300, seats: 97, airline: "IndiGo" },
	{ from: "Kochi", to: "Thiruvananthapuram", date: "2026-04-07T15:05:00.000Z", price: 2100, seats: 84, airline: "Akasa Air" },
];

const seedFlights = async () => {
	try {
		if (!MONGO_URI) {
			throw new Error("MONGO_URI is not set in environment variables");
		}

		await mongoose.connect(MONGO_URI, { family: 4 });
		console.log("MongoDB connected for seeding");

		await Flight.deleteMany({});
		const insertedFlights = await Flight.insertMany(sampleFlights);

		console.log(`Seed complete: inserted ${insertedFlights.length} flights`);
	} catch (error) {
		console.error("Seeding failed:", error.message);
		process.exitCode = 1;
	} finally {
		await mongoose.connection.close();
		console.log("MongoDB connection closed");
	}
};

seedFlights();
