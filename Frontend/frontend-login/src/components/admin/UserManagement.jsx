import React, { useState } from "react";
import { useAdmin } from "../../Context/AdminContext";
import { showErrorToast } from "../../utils/toast.utils";
import "./UserManagement.css";

const UserManagement = () => {
  const { users, deleteUser, updateUser, disableUser, createUser, error, setError } = useAdmin();

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "USER",
    });
    setShowModal(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Enter a valid email";
    if (!editingUser && !formData.password)
      errors.password = "Password is required";
    else if (!editingUser && formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingUser) await updateUser(editingUser.id, formData);
      else await createUser(formData);
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
      showErrorToast("Failed to save user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Delete this user?")) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error("Error deleting user:", error);
        showErrorToast("Failed to delete user");
      }
    }
  };

  const handleDisable = async (userId) => {
    if (window.confirm("Disable this user?")) {
      try {
        await disableUser(userId);
      } catch (error) {
        console.error("Error disabling user:", error);
        showErrorToast("Failed to disable user");
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "USER", password: "" });
    setFormErrors({});
    setEditingUser(null);
    setShowModal(false);
    setError(null);
  };

  return (
    <div className="user-management">
      <div className="header">
        <span>Total Users: {users.length}</span>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          Add User
        </button>
      </div>

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name || "Unknown"}</td>
                <td>{u.email || "No email"}</td>
                <td>{u.role}</td>
                <td>{u.enabled ? "Active" : "Disabled"}</td>
                <td>
                  {u.createdDate
                    ? new Date(u.createdDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  <button onClick={() => handleEdit(u)} className="edit-btn">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDisable(u.id)}
                    className="disable-btn"
                  >
                    {u.enabled ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
              <button onClick={resetForm} className="close-btn">
                ✕
              </button>
            </div>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleSubmit} className="form">
              <label>
                Full Name*
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {formErrors.name && (
                  <span className="error">{formErrors.name}</span>
                )}
              </label>

              <label>
                Email*
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {formErrors.email && (
                  <span className="error">{formErrors.email}</span>
                )}
              </label>

              <label>
                Role*
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </label>

              {!editingUser && (
                <label>
                  Password*
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  {formErrors.password && (
                    <span className="error">{formErrors.password}</span>
                  )}
                </label>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={resetForm}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? editingUser
                      ? "Updating..."
                      : "Creating..."
                    : editingUser
                    ? "Update User"
                    : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
