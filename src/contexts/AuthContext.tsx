/** @format */

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { User } from "../types";

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Check if user is logged in on app start
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (error) {
				localStorage.removeItem("user");
			}
		}
		setIsLoading(false);
	}, []);

	const login = async (email: string, password: string): Promise<boolean> => {
		setIsLoading(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Demo login logic
			if (email === "Zaher@gmail.com" && password === "Zaher@#123") {
				const demoUser: User = {
					id: "1",
					email: "Zaher@gmail.com",
					name: "Zaher",
					role: "admin",
				};

				setUser(demoUser);
				localStorage.setItem("user", JSON.stringify(demoUser));
				return true;
			} else {
				throw new Error("Invalid credentials");
			}
		} catch (error) {
			console.error("Login error:", error);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	const value: AuthContextType = {
		user,
		login,
		logout,
		isLoading,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
