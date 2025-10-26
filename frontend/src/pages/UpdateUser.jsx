import { useState, useEffect } from "react";
import { updateUser } from "../api";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function UpdateUser() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });
  const [msg, setMsg] = useState("");

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUser(user.id, user.id, form);
      setUser(res.data);
      setMsg("✅ Updated successfully!");
    } catch (err) {
      setMsg("❌ Update failed");
    }
  };

  if (!user) return null; // Prevent rendering before redirect

  return (
    <div className="auth-card update-card">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
        />
        <input
          type="password"
          placeholder="New password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Update</button>
      </form>
      <p className="message">{msg}</p>
    </div>
  );
}
