import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteUser } from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleDelete = async () => {
    try {
      await deleteUser(user.id, user.id);
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>

      <div className="profile-actions">
        <Link to="/update" className="update-btn">Update Profile</Link>
        <button onClick={() => setShowConfirm(true)} className="delete-btn">
          Delete Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <p>Are you sure you want to delete your account?</p>
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
