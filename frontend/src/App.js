import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ChatBot from "./components/ChatBot";
import Navbar from "./components/Navbar";
import Booking from "./pages/BookingPage";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";

function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<main style={{ fontFamily: "sans-serif", margin: "0 auto", maxWidth: 900, padding: "0 16px" }}>

				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/search" element={<Search />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/booking" element={<Booking />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</main>
			<ChatBot />
		</BrowserRouter>
	);
}

export default App;
