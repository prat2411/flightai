import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
	const location = useLocation();
	const { user, token } = useAuth();

	if (!token || !user) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return children || <Outlet />;
};

export default ProtectedRoute;
