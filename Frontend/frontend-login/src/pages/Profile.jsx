import { useAuth } from "../context/AuthContext";
import { deleteUser } from "../api";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not logged in
  if (!user) {
    navigate("/login");
    return null; // prevent rendering
  }

  const handleDelete = async () => {
    await deleteUser(user.id, user.id);
    setUser(null);
    navigate("/login"); // redirect to login after deletion
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>

      <div className="profile-actions">
        <Link to="/update" className="update-btn">Update Profile</Link>
        <button onClick={handleDelete} className="delete-btn">Delete Account</button>
      </div>
    </div>
  );
}
