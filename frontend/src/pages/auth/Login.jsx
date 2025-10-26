import { useState } from "react";
import { useAuth } from "../../Context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const { login } = useAuth();
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(""); // Clear previous messages

        try {
            const res = await login(form);
            console.log("Login response:", res); // Debug log

            if (!res.success) {
                setMsg(res?.message || "Invalid Credentials");
                return;
            }

            // Navigate based on user role
            if (res.data?.user?.role === "ADMIN") {
                console.log("Navigating to admin panel"); // Debug log
                navigate("/admin-panel");
            } else {
                console.log("Navigating to home"); // Debug log
                navigate("/");
            }
        } catch (error) {
            console.error("Login error:", error);
            setMsg("Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header Section */}
                <div className=" bg-orange-500  p-6 text-center">
                    <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                    <p className="text-orange-100 mt-2">Sign in to your account</p>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>

                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-orange-500  text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-700 hover:to-indigo-800 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Message Display */}
                    {msg && (
                        <div className={`mt-4 p-3 rounded-lg text-center font-medium ${
                            msg.includes("failed") || msg.includes("Invalid")
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-green-50 text-green-700 border border-green-200"
                        }`}>
                            {msg}
                        </div>
                    )}

                    {/* Registration Link */}
                    <div className="mt-8 text-center border-t border-gray-200 pt-6">
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-orange-600 font-semibold hover:text-orange-500 transition-colors duration-200 inline-flex items-center"
                            >
                                Create account
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}