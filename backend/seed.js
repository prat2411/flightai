require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

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

	{ from: "Delhi", to: "Dubai", date: "2026-04-08T04:45:00.000Z", price: 23500, seats: 160, airline: "Emirates" },
	{ from: "Mumbai", to: "Singapore", date: "2026-04-09T05:35:00.000Z", price: 26800, seats: 150, airline: "Singapore Airlines" },
	{ from: "Bengaluru", to: "Bangkok", date: "2026-04-10T07:10:00.000Z", price: 21400, seats: 142, airline: "Thai Airways" },
	{ from: "Delhi", to: "London", date: "2026-04-11T02:30:00.000Z", price: 54200, seats: 188, airline: "British Airways" },
	{ from: "Mumbai", to: "Doha", date: "2026-04-12T03:20:00.000Z", price: 25100, seats: 172, airline: "Qatar Airways" },
	{ from: "Delhi", to: "Kathmandu", date: "2026-04-13T06:50:00.000Z", price: 12800, seats: 124, airline: "Air India" },
	{ from: "Chennai", to: "Colombo", date: "2026-04-14T09:40:00.000Z", price: 11400, seats: 118, airline: "SriLankan Airlines" },
	{ from: "Kolkata", to: "Dhaka", date: "2026-04-15T08:15:00.000Z", price: 9900, seats: 112, airline: "Biman Bangladesh" },

	{ from: "Delhi", to: "Mumbai", date: "2026-05-02T06:20:00.000Z", price: 5350, seats: 122, airline: "Vistara" },
	{ from: "Mumbai", to: "Ahmedabad", date: "2026-05-03T07:30:00.000Z", price: 3450, seats: 101, airline: "IndiGo" },
	{ from: "Hyderabad", to: "Delhi", date: "2026-05-04T09:20:00.000Z", price: 6200, seats: 114, airline: "Air India" },
	{ from: "Kochi", to: "Bengaluru", date: "2026-05-05T11:05:00.000Z", price: 3900, seats: 94, airline: "Akasa Air" },
	{ from: "Pune", to: "Delhi", date: "2026-05-06T12:25:00.000Z", price: 6400, seats: 107, airline: "SpiceJet" },
	{ from: "Kolkata", to: "Goa", date: "2026-05-07T14:55:00.000Z", price: 7800, seats: 96, airline: "IndiGo" },

	{ from: "Delhi", to: "Paris", date: "2026-05-08T01:55:00.000Z", price: 57800, seats: 174, airline: "Air France" },
	{ from: "Mumbai", to: "Abu Dhabi", date: "2026-05-09T04:30:00.000Z", price: 22600, seats: 168, airline: "Etihad Airways" },
	{ from: "Bengaluru", to: "Kuala Lumpur", date: "2026-05-10T06:40:00.000Z", price: 24500, seats: 149, airline: "Malaysia Airlines" },
	{ from: "Delhi", to: "Frankfurt", date: "2026-05-11T00:50:00.000Z", price: 60300, seats: 181, airline: "Lufthansa" },
	{ from: "Mumbai", to: "Muscat", date: "2026-05-12T05:15:00.000Z", price: 19800, seats: 156, airline: "Oman Air" },
	{ from: "Chennai", to: "Male", date: "2026-05-13T08:20:00.000Z", price: 17600, seats: 132, airline: "Air India" },
	{ from: "Delhi", to: "Toronto", date: "2026-05-14T22:10:00.000Z", price: 81200, seats: 196, airline: "Air Canada" },
	{ from: "Mumbai", to: "Nairobi", date: "2026-05-15T02:35:00.000Z", price: 46900, seats: 164, airline: "Kenya Airways" },

	{ from: "Jaipur", to: "Mumbai", date: "2026-06-02T07:10:00.000Z", price: 5200, seats: 92, airline: "IndiGo" },
	{ from: "Delhi", to: "Lucknow", date: "2026-06-03T09:00:00.000Z", price: 2900, seats: 109, airline: "Air India" },
	{ from: "Bengaluru", to: "Chennai", date: "2026-06-04T10:45:00.000Z", price: 3100, seats: 116, airline: "Akasa Air" },
	{ from: "Mumbai", to: "Kolkata", date: "2026-06-05T12:30:00.000Z", price: 6900, seats: 99, airline: "Vistara" },
	{ from: "Delhi", to: "Goa", date: "2026-06-06T14:20:00.000Z", price: 7400, seats: 105, airline: "IndiGo" },
	{ from: "Hyderabad", to: "Pune", date: "2026-06-07T16:10:00.000Z", price: 4300, seats: 87, airline: "SpiceJet" },

	{ from: "Delhi", to: "Tokyo", date: "2026-06-08T03:15:00.000Z", price: 68400, seats: 177, airline: "Japan Airlines" },
	{ from: "Mumbai", to: "Sydney", date: "2026-06-09T00:40:00.000Z", price: 92100, seats: 189, airline: "Qantas" },
	{ from: "Bengaluru", to: "Dubai", date: "2026-06-10T05:30:00.000Z", price: 24200, seats: 161, airline: "Emirates" },
	{ from: "Delhi", to: "New York", date: "2026-06-11T22:35:00.000Z", price: 88900, seats: 198, airline: "United Airlines" },
	{ from: "Mumbai", to: "Istanbul", date: "2026-06-12T01:45:00.000Z", price: 45200, seats: 171, airline: "Turkish Airlines" },
	{ from: "Chennai", to: "Singapore", date: "2026-06-13T07:25:00.000Z", price: 22900, seats: 147, airline: "Singapore Airlines" },
	{ from: "Delhi", to: "Seoul", date: "2026-06-14T02:55:00.000Z", price: 64100, seats: 166, airline: "Korean Air" },
	{ from: "Kolkata", to: "Bangkok", date: "2026-06-15T06:05:00.000Z", price: 21300, seats: 139, airline: "Thai Airways" },

	{ from: "Delhi", to: "Mumbai", date: "2026-07-02T06:40:00.000Z", price: 5450, seats: 119, airline: "IndiGo" },
	{ from: "Mumbai", to: "Delhi", date: "2026-07-03T07:25:00.000Z", price: 5550, seats: 115, airline: "Air India" },
	{ from: "Bengaluru", to: "Pune", date: "2026-07-04T09:05:00.000Z", price: 4200, seats: 98, airline: "Akasa Air" },
	{ from: "Chennai", to: "Hyderabad", date: "2026-07-05T11:00:00.000Z", price: 3600, seats: 91, airline: "SpiceJet" },
	{ from: "Kolkata", to: "Delhi", date: "2026-07-06T13:35:00.000Z", price: 6150, seats: 104, airline: "Vistara" },
	{ from: "Goa", to: "Mumbai", date: "2026-07-07T15:20:00.000Z", price: 3250, seats: 96, airline: "IndiGo" },

	{ from: "Delhi", to: "Dubai", date: "2026-07-08T04:20:00.000Z", price: 23800, seats: 158, airline: "Emirates" },
	{ from: "Mumbai", to: "London", date: "2026-07-09T01:40:00.000Z", price: 55600, seats: 183, airline: "British Airways" },
	{ from: "Bengaluru", to: "Frankfurt", date: "2026-07-10T00:25:00.000Z", price: 61700, seats: 176, airline: "Lufthansa" },
	{ from: "Delhi", to: "Singapore", date: "2026-07-11T05:55:00.000Z", price: 27100, seats: 151, airline: "Singapore Airlines" },
	{ from: "Mumbai", to: "New York", date: "2026-07-12T22:55:00.000Z", price: 90300, seats: 195, airline: "United Airlines" },
	{ from: "Chennai", to: "Dubai", date: "2026-07-13T06:45:00.000Z", price: 22100, seats: 145, airline: "Emirates" },
	{ from: "Delhi", to: "Sydney", date: "2026-07-14T23:15:00.000Z", price: 93400, seats: 187, airline: "Qantas" },
	{ from: "Kolkata", to: "Kuala Lumpur", date: "2026-07-15T07:35:00.000Z", price: 24800, seats: 141, airline: "Malaysia Airlines" },
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
