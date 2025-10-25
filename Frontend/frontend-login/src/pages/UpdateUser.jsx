import { useState, useEffect } from "react";
import { updateMe } from "../services/user.service";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/toast.utils";
import "./Auth.css";

export default function UpdateUser() {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    password: "",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateMe(form);
      if (response && response.success) {
        setCurrentUser(response.data);
        showSuccessToast("Profile updated successfully!");
        setMsg("✅ Updated successfully!");
        setTimeout(() => navigate("/profile"), 1500);
      } else {
        showErrorToast("Update failed");
        setMsg("❌ Update failed");
      }
    } catch (err) {
      showErrorToast("Update failed");
      setMsg("❌ Update failed");
    }
  };

  if (!currentUser) return null;

  return (
    <div className="auth-card update-card">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
        />
        <input
          type="password"
          placeholder="New password (leave blank to keep current)"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Update</button>
      </form>
      {msg && <p className="message">{msg}</p>}
    </div>
  );
}