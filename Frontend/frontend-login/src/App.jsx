import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Profile from "./pages/Profile";
import UpdateUser from "./pages/UpdateUser";
import FoodTags from "./pages/FoodTags";
import AdminPanel from "./pages/AdminPanel";
import "./App.css";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/update" element={<UpdateUser />} />
        <Route path="/food-tags" element={<FoodTags />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}