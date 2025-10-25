import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { assets } from "../assets/assets";
import "./Navbar.css";

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const navigate = useNavigate();

    const handleSelect = (selected) => {
        setSelectedMenu(selected);
    };

    const handleLogout = () => {
        logout();
        setShowMenu(false);
        navigate("/");
    };

    const NavItems = [
        { name: "Menu", to: "/", requiredAdmin: false },
        { name: "Reservations", to: "/reservations", requiredAdmin: false },
        { name: "My Tags", to: "/food-tags", requiredAdmin: false },
        { name: "Admin Panel", to: "/admin-panel", requiredAdmin: true },
    ];

    return (
        <nav className="navbar">
            {/* Left: Logo */}
            <div className="nav-left">
                <Link to="/">
                    <img src={assets.logo} alt="Logo" className="logo" />
                </Link>
            </div>

            {/* Center: Menu Links */}
            <div className="nav-links">
                {NavItems
                    .filter(item => !item.requiredAdmin || (item.requiredAdmin && currentUser?.role === "ADMIN"))
                    .map((item) => (
                        <Link
                            key={item.name}
                            to={item.to}
                            onClick={() => handleSelect(item.name)}
                            className={`nav-item ${selectedMenu === item.name ? "active" : ""}`}
                        >
                            {item.name}
                        </Link>
                    ))}
            </div>

            {/* Right: Basket + Auth Dropdown */}
            <div className="nav-right">
                <Link to="/cart" className="basket-link">
                    <img src={assets.basket_icon} alt="Basket" className="basket-icon" />
                </Link>

                {!currentUser ? (
                    <div className="dropdown">
                        <button
                            className="dropdown-btn"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            Sign In ▾
                        </button>
                        {showMenu && (
                            <div className="dropdown-menu">
                                <Link to="/login" onClick={() => setShowMenu(false)}>Login</Link>
                                <Link to="/register" onClick={() => setShowMenu(false)}>Register</Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="dropdown">
                        <button
                            className="dropdown-btn"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            {currentUser.name} ▾
                        </button>
                        {showMenu && (
                            <div className="dropdown-menu">
                                <Link to="/profile" onClick={() => setShowMenu(false)}>Profile</Link>
                                <Link to="/my-orders" onClick={() => setShowMenu(false)}>My Orders</Link>
                                <Link to="/ratings" onClick={() => setShowMenu(false)}>My Ratings</Link>
                                <Link to="/feedback" onClick={() => setShowMenu(false)}>Feedback</Link>
                                <button onClick={handleLogout} className="logout-btn">
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
