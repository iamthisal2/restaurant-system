import { useState } from "react";
import { useAuth } from "../../Context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // import the new CSS file

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const { login } = useAuth();
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");

        try {
            const res = await login(form);

            if (!res.success) {
                setMsg(res?.message || "Invalid Credentials");
                return;
            }

            if (res.data?.user?.role === "ADMIN") {
                navigate("/admin-panel");
            } else {
                navigate("/");
            }
        } catch (error) {
            setMsg("Login failed. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>
                <div className="login-form-container">
                    <form onSubmit={handleSubmit}>
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
                            <div className="label-row">
                                <label htmlFor="password">Password</label>
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn">
                            Sign In
                        </button>
                    </form>

                    {msg && (
                        <div className={`message ${msg.includes("failed") || msg.includes("Invalid") ? "error" : "success"}`}>
                            {msg}
                        </div>
                    )}

                    <div className="register-link">
                        <p>
                            Don't have an account?{" "}
                            <Link to="/register" className="create-account">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
