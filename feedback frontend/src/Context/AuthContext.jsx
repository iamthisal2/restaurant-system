import { createContext, useState, useContext, useEffect } from "react";

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

    // Mock login function - always succeeds for demo purposes
    const login = async (userData) => {
        setLoading(true);
        try {
            // Create a mock user object
            const mockUser = {
                id: 1,
                name: userData.email.split('@')[0] || "Demo User",
                email: userData.email,
                role: "USER"
            };
            
            const mockToken = "mock-jwt-token-" + Date.now();

            setCurrentUser(mockUser);
            setAuthToken(mockToken);
            setIsAuthenticated(true);

            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(mockUser));
            localStorage.setItem(LOCAL_AUTH_TOKEN_KEY, mockToken);

            // Return success response
            return {
                success: true,
                message: "Login successful",
                data: {
                    user: mockUser,
                    authToken: mockToken
                },
                status: 200
            };
        } catch (error) {
            console.error("Login failed:", error);
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

    // Function to manually set user (useful for testing)
    const setUser = (user) => {
        setCurrentUser(user);
        setIsAuthenticated(!!user);
        if (user) {
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(LOCAL_USER_KEY);
        }
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
                setCurrentUser: setUser,
                setAuthToken,
                user: currentUser, // Alias for currentUser for easier access
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