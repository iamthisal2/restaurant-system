import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { disableMe } from "../services/user.service";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const handleDelete = async () => {
    try {
      await disableMe();
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      <p><b>Name:</b> {currentUser.name}</p>
      <p><b>Email:</b> {currentUser.email}</p>
      <p><b>Role:</b> {currentUser.role}</p>

      <div className="profile-actions">
        <Link to="/update" className="update-btn">Update Profile</Link>
        <button onClick={() => setShowConfirm(true)} className="delete-btn">
          Disable Account
        </button>
      </div>

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <p>Are you sure you want to disable your account?</p>
            <div className="confirm-actions">
              <button
                className="update-btn"
                onClick={() => {
                  handleDelete();
                  setShowConfirm(false);
                }}
              >
                Yes
              </button>
              <button
                className="delete-btn"
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}