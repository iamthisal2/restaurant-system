import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./Context/AuthContext";
import { AdminProvider } from "./Context/AdminContext";
import { CartProvider } from "./Context/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <AdminProvider>
        <App />
      </AdminProvider>
    </CartProvider>
  </AuthProvider>
);