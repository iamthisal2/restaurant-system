import { useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { assets } from "../assets/assets";

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const navigate = useNavigate();

    const handleSelect = (selected) => {
        setSelectedMenu(selected);
    }

    const handleLogout = () => {
        logout();
        setShowMenu(false);
        navigate("/");
    };

    const NavItems = [
        {
            name: "Menu",
            to: "/",
            requiredAdmin: false,
        },

        {
            name: "Reservations",
            to: "/reservations",
            requiredAdmin: false,
        },{
            name: "My Tags",
            to: "/food-tags",
            requiredAdmin: false,
        },
        {
            name: "Admin Panel",
            to: "/admin-panel",
            requiredAdmin: true,
        }
    ]

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-white text-gray-800 sticky top-0 border-b border-gray-200 z-40 font-['Outfit']">
            {/* Left: Logo */}
            <div className="nav-left">
                <Link to="/">
                    <img
                        src={assets.logo}
                        alt="Logo"
                        className="w-[50px] h-auto"
                    />
                </Link>
            </div>

            {/* Center: Menu Links */}
            <div className="flex gap-8 justify-center flex-1">

                {NavItems
                    .filter(item => !item.requiredAdmin || (item.requiredAdmin && currentUser?.role === "ADMIN"))
                    .map((item) => (
                        <Link
                            onClick={() => handleSelect(item.name)}
                            key={item.name}
                            to={item.to}
                            className={
                                `${selectedMenu === item.name ? "text-[#ff6347] font-medium" : "text-[#49557E] font-medium  relative transition-all duration-300 hover:text-[#ff6347] hover:scale-105 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-0.5 after:bg-[#ff6347] after:transition-all after:duration-300 hover:after:w-full"}`
                            }
                        >
                            {item.name}
                        </Link>
                    ))
                }
            </div>

            {/* Right: Basket + Auth Dropdown */}
            <div className="flex items-center gap-5">
                <Link to="/cart" className="relative transition-transform duration-200 hover:scale-110 rounded-full border-2 border-[#ff6347] p-2">
                    <img
                        src={assets.basket_icon}
                        alt="Basket"
                        className="w-5 h-5"
                    />
                </Link>

                {!currentUser ? (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="bg-white text-[#ff6347] border-2 border-[#ff6347] px-4 py-2 rounded-full font-medium cursor-pointer transition-all duration-200 hover:bg-[#fff4f2] focus:outline-none focus:ring-3 focus:ring-[#ff6347] focus:ring-opacity-30"
                        >
                            Sign In ▾
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 top-full bg-white min-w-[150px] shadow-lg rounded-lg overflow-hidden z-10 mt-1">
                                <Link
                                    to="/login"
                                    onClick={() => setShowMenu(false)}
                                    className="block text-gray-800 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setShowMenu(false)}
                                    className="block text-gray-800 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="bg-white text-[#ff6347] border-2 border-[#ff6347] px-4 py-2 rounded-full font-medium cursor-pointer transition-all duration-200 hover:bg-[#fff4f2] focus:outline-none focus:ring-3 focus:ring-[#ff6347] focus:ring-opacity-30"
                        >
                            {currentUser.name} ▾
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 top-full bg-white min-w-[150px] shadow-lg rounded-lg overflow-hidden z-10 mt-1">
                                <Link
                                    to="/profile"
                                    onClick={() => setShowMenu(false)}
                                    className="block text-gray-800 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/my-orders"
                                    onClick={() => setShowMenu(false)}
                                    className="block text-gray-800 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                                >
                                    My Orders
                                </Link>
                                <Link
                                    to="/ratings"
                                    onClick={() => setShowMenu(false)}
                                    className="block text-gray-800 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                                >
                                    My Ratings
                                </Link>
                                <Link
                                    to="/feedback"
                                    onClick={() => setShowMenu(false)}
                                    className="block text-gray-800 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                                >
                                    Feedback
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left text-gray-800 px-4 py-2 text-sm hover:bg-gray-100 transition-colors border-none bg-none cursor-pointer"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}