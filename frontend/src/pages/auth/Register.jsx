import { useState } from "react";
import { registerUser } from "../../services/auth.service.js";
import { Link } from "react-router-dom";

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header Section */}
                <div className="bg-orange-500 p-6 text-center">
                    <h2 className="text-3xl font-bold text-white">Create Account</h2>
                    <p className="text-orange-100 mt-2">Join us today</p>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
                                required
                            />
                        </div>

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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Message Display */}
                    {msg && (
                        <div className={`mt-4 p-3 rounded-lg text-center font-medium ${
                            msg.includes("❌")
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-green-50 text-green-700 border border-green-200"
                        }`}>
                            {msg}
                        </div>
                    )}

                    {/* Login Link */}
                    <div className="mt-8 text-center border-t border-gray-200 pt-6">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-orange-500 font-semibold hover:text-orange-600 transition-colors duration-200 inline-flex items-center"
                            >
                                Sign in
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