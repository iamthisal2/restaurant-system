import { createContext, useState, useContext, useEffect } from "react";
import { logInUser } from "../services/auth.service.js";

const AuthContext = createContext();

export const LOCAL_USER_KEY = "crave-user";
export const LOCAL_AUTH_TOKEN_KEY = "crave-auth-token";

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load user & token from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem(LOCAL_USER_KEY);
        const storedToken = localStorage.getItem(LOCAL_AUTH_TOKEN_KEY);

        if (storedUser && storedToken) {
            setCurrentUser(JSON.parse(storedUser));
            setAuthToken(storedToken);
            setIsAuthenticated(true);
        }
    }, []);


    const login = async (userData) => {
        setLoading(true);
        try {
            const response = await logInUser(userData);
            console.log("AuthContext login response:", response); // Debug log

            // The response structure is: { success, message, data: { authToken, user }, status }
            if (!response.success) {
                // Return the error response instead of throwing
                return response;
            }

            const user = response.data.user;
            const token = response.data.authToken;
            console.log("Setting user:", user, "token:", token); // Debug log

            setCurrentUser(user);
            setAuthToken(token);
            setIsAuthenticated(true);

            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
            localStorage.setItem(LOCAL_AUTH_TOKEN_KEY, token);

            return response; // Return the full response so Login component can access success, message, etc.
        } catch (error) {
            console.error("Login failed:", error);
            // Return error response structure
            return {
                success: false,
                message: "Login failed. Please try again.",
                data: null,
                status: 500
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setCurrentUser(null);
        setAuthToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem(LOCAL_USER_KEY);
        localStorage.removeItem(LOCAL_AUTH_TOKEN_KEY);
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                authToken,
                isAuthenticated,
                loading,
                login,
                logout,
                setCurrentUser,
                setAuthToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Custom hook for easier access
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};











