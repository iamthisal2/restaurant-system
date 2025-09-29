import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/assets";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setShowMenu(false);
  };

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="nav-left">
        <Link to="/">
          <img src={assets.logo} alt="Logo" className="logo" />
        </Link>
      </div>

      {/* Center: Menu Links */}
      <div className="nav-center">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/food-tags">Wishlist</Link>
        {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}
      </div>

      {/* Right: Basket + Auth Dropdown */}
      <div className="nav-right">
        <Link to="/cart" className="cart-icon">
          <img src={assets.basket_icon} alt="Basket" />
        </Link>

        {!user ? (
          <div className="dropdown">
            <button onClick={() => setShowMenu(!showMenu)}>Sign In ▾</button>
            {showMenu && (
              <div className="dropdown-content">
                <Link to="/login" onClick={() => setShowMenu(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setShowMenu(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="dropdown">
            <button onClick={() => setShowMenu(!showMenu)}>{user.name} ▾</button>
            {showMenu && (
              <div className="dropdown-content">
                <Link to="/profile" onClick={() => setShowMenu(false)}>
                  Profile
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
