import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const getInitialUser = () => {
	const storedUser = localStorage.getItem("user");
	if (!storedUser) {
		return null;
	}

	try {
		return JSON.parse(storedUser);
	} catch (error) {
		localStorage.removeItem("user");
		return null;
	}
};

const getInitialToken = () => localStorage.getItem("token") || null;

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(getInitialUser);
	const [token, setToken] = useState(getInitialToken);

	const login = (userData, tokenValue) => {
		setUser(userData);
		setToken(tokenValue);

		localStorage.setItem("user", JSON.stringify(userData));
		localStorage.setItem("token", tokenValue);
	};

	const logout = () => {
		setUser(null);
		setToken(null);

		localStorage.removeItem("user");
		localStorage.removeItem("token");
	};

	const value = useMemo(
		() => ({
			user,
			token,
			login,
			logout,
		}),
		[user, token]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};

export { AuthProvider, useAuth };
export default AuthContext;
