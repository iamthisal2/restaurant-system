import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Profile from "./pages/Profile";
import UpdateUser from "./pages/UpdateUser";
import FoodTags from "./pages/FoodTags";
import AdminPanel from "./pages/AdminPanel";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Reservations from "./pages/Reservations";
import Ratings from "./pages/Ratings";
import Feedback from "./pages/Feedback";
import "./App.css";
import "./index.css";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update" element={<UpdateUser />} />
        <Route path="/food-tags" element={<FoodTags />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/ratings" element={<Ratings />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
