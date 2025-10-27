import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { assets } from "../assets/assets";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (selected) => setSelectedMenu(selected);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate("/");
  };

  const NavItems = [
    { name: "Reservations", to: "/reservations", requiredAdmin: false },
    { name: "Admin Panel", to: "/admin-panel", requiredAdmin: true },
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white text-gray-800 sticky top-0 border-b border-gray-200 z-40 font-['Outfit'] shadow-sm">
      
      {/* Left: Logo */}
      <div className="flex-shrink-0">
        <Link to="/">
          <img src={assets.logo} alt="Logo" className="w-10 h-10" />
        </Link>
      </div>

      {/* Center: Menu Links */}
      <div className="hidden md:flex gap-6 justify-center flex-1">
        {NavItems.filter(item => !item.requiredAdmin || currentUser?.role === "ADMIN").map((item) => (
          <Link
            key={item.name}
            to={item.to}
            onClick={() => handleSelect(item.name)}
            className={`relative font-medium text-sm transition-all duration-300
              ${selectedMenu === item.name ? "text-[#ff6347]" : "text-gray-600 hover:text-[#ff6347] hover:scale-105"}
              after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-[#ff6347] after:transition-all after:duration-300 hover:after:w-full
            `}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Right: Basket + Auth */}
      <div className="flex items-center gap-4">
        {/* Basket */}
        <Link
          to="/cart"
          className="relative p-2 border-2 border-[#ff6347] rounded-full hover:scale-105 transition-transform duration-200"
        >
          <img src={assets.basket_icon} alt="Basket" className="w-5 h-5" />
        </Link>

        {/* Auth Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-white text-[#ff6347] border-2 border-[#ff6347] px-3 py-1 rounded-full font-medium cursor-pointer text-sm transition-all duration-200 hover:bg-[#fff4f2] focus:outline-none focus:ring-2 focus:ring-[#ff6347] focus:ring-opacity-40"
          >
            {currentUser ? currentUser.name : "Sign In"} ▾
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-20">
              {!currentUser ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setShowMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setShowMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setShowMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setShowMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/ratings"
                    onClick={() => setShowMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Ratings
                  </Link>
                  <Link
                    to="/feedback"
                    onClick={() => setShowMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Feedback
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
