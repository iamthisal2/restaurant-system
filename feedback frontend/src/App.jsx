import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

import AdminPanel from "./pages/AdminPanel";
import Reservations from "./pages/Reservations";
import Feedback from "./pages/Feedback";
import "./App.css";
import "./index.css";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
