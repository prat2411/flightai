import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const linkClassName = ({ isActive }) =>
	isActive ? "navbar-link navbar-link-active" : "navbar-link";

const Navbar = () => {
	const navigate = useNavigate();
	const { user, token, logout } = useAuth();
	const isAuthenticated = Boolean(user && token);

	const handleLogout = () => {
		logout();
		navigate("/login", { replace: true });
	};

	return (
		<header className="navbar-shell">
			<div className="navbar-inner">
				<div className="navbar-brand-group">
					<NavLink to="/" className="navbar-logo" end>
						<span className="navbar-logo-mark">A</span>
						<span className="navbar-logo-text">AeroBlue</span>
					</NavLink>
				</div>

				<div className="navbar-right">
					<nav className="navbar-links" aria-label="Primary">
						<NavLink to="/" className={linkClassName} end>
							Home
						</NavLink>
						<NavLink to="/search" className={linkClassName}>
							Search
						</NavLink>
						{isAuthenticated ? (
							<>
								<NavLink to="/dashboard" className={linkClassName}>
									Dashboard
								</NavLink>
								<NavLink to="/booking" className={linkClassName}>
									Booking
								</NavLink>
							</>
						) : null}
					</nav>

					<div className="navbar-actions">
						{isAuthenticated ? (
							<>
								<span className="navbar-user" title={user?.email || "Logged in user"}>
									{user?.name || "Traveler"}
								</span>
								<button type="button" className="navbar-btn navbar-btn-outline" onClick={handleLogout}>
									Logout
								</button>
							</>
						) : (
							<>
								<NavLink to="/login" className="navbar-btn navbar-btn-outline">
									Login
								</NavLink>
								<NavLink to="/register" className="navbar-btn navbar-btn-solid">
									Register
								</NavLink>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
