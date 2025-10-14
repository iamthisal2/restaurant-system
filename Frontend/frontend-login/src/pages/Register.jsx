import { useState } from "react";
import { registerUser } from "../api";
import "./Auth.css";

export default function Register() {
  // Added confirmPassword field to form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side password confirmation check
    if (form.password !== form.confirmPassword) {
      setMsg("❌ Passwords do not match!");
      return;
    }

    try {
      await registerUser(form);
      setMsg("✅ Registered successfully! Now login.");
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Error registering"));
    }
  };

  return (
    <div className="auth-card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {/* Added Confirm Password input */}
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />
        <button type="submit">Register</button>
      </form>
      <p className="message">{msg}</p>
    </div>
  );
}
