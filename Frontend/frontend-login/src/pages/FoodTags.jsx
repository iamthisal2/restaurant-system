import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getFoodTags, addFoodTag, updateFoodTag, deleteFoodTag } from "../api";
import "./FoodTags.css";

export default function FoodTags() {
  const { user } = useAuth();
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTag, setEditTag] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      fetchTags();
      setMessage("");
    } else {
      setTags([]);
      setMessage("You must log in to manage food tags.");
    }
  }, [user]);

  const fetchTags = async () => {
    try {
      const res = await getFoodTags(user.id);
      setTags(res.data);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    }
  };

  const handleAdd = async () => {
    if (!user) {
      setMessage("⚠️ Please log in before adding tags.");
      return;
    }
    if (!newTag) return;

    try {
      await addFoodTag({ userId: user.id, tag: newTag });
      setNewTag("");
      fetchTags();
    } catch (err) {
      console.error("Failed to add tag:", err);
      setMessage("❌ Could not add tag. Try again.");
    }
  };

  const handleUpdate = async (id) => {
    if (!editTag) return;
    try {
      await updateFoodTag(id, { tag: editTag });
      setEditId(null);
      setEditTag("");
      fetchTags();
    } catch (err) {
      console.error("Failed to update tag:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFoodTag(id);
      fetchTags();
    } catch (err) {
      console.error("Failed to delete tag:", err);
    }
  };

  return (
    <div className="foodtags-card">
      <h2>My Food Tags</h2>

      {message && <p className="info-msg">{message}</p>}

      <div className="tag-add">
        <input
          placeholder="New tag (e.g. Spicy)"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <ul className="tag-list">
        {tags.map((t) => (
          <li key={t.id}>
            {editId === t.id ? (
              <>
                <input
                  className="edit-input"
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                />
                <button onClick={() => handleUpdate(t.id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <div className="tag-text">{t.tag}</div>
                <button
                  onClick={() => {
                    setEditId(t.id);
                    setEditTag(t.tag);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(t.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
