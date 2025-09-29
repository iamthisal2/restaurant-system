import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import UpdateUser from "./pages/UpdateUser";
import FoodTags from "./pages/FoodTags";
import Admin from "./pages/Admin"; // NEW
import "./App.css";

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
        <Route path="/admin" element={<Admin />} /> {/* NEW */}
      </Routes>
    </BrowserRouter>
  );
}
