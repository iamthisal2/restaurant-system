import { useState } from "react";
import { registerUser } from "../../services/auth.service.js";
import { Link } from "react-router-dom";
import "./Register.css"; // import the new CSS file

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [msg, setMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(form);
            setMsg("✅ Registered successfully! Now login.");
        } catch (err) {
            setMsg("❌ " + (err.response?.data?.message || "Error registering"));
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>Create Account</h2>
                    <p>Join us today</p>
                </div>

                <div className="register-form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn">
                            Create Account
                        </button>
                    </form>

                    {msg && (
                        <div className={`message ${msg.includes("❌") ? "error" : "success"}`}>
                            {msg}
                        </div>
                    )}

                    <div className="login-link">
                        <p>
                            Already have an account?{" "}
                            <Link to="/login" className="sign-in">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
