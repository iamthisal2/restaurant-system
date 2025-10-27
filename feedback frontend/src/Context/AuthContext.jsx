// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const LOCAL_USER_KEY = "crave-user";

// Simple stub: if you want an admin, set isAdmin true in initialUser
// const initialUser = null;
// Example to always have an admin (for development):
const initialUser = { id: 2, name: "Namal Vishwa", email: "namal123@gmail.com", role: "USER" };

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return initialUser;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  }, [currentUser]);

  // Minimal API used by your components
  const logout = () => setCurrentUser(null);
  const loginAsAdmin = () =>
    setCurrentUser({ id: 1, name: "Admin", email: "admin@example.com", role: "ADMIN" });

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout, loginAsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
