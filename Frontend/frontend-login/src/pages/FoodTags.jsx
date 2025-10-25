import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import * as foodTagService from "../services/foodTag.service";
import { assets } from "../assets/assets";
import { Pencil, Trash2 } from "lucide-react";
import './FoodTags.css';

export default function FoodTags() {
  const { currentUser, isAuthenticated } = useAuth();
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTag, setEditTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchTags().then();
    } else {
      setTags([]);
    }
  }, [isAuthenticated, currentUser]);

  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await foodTagService.getFoodTagsForUser(currentUser.id);
      if (response && response.data) setTags(response.data);
    } catch (err) {
      setError("Failed to fetch tags");
      console.error("Failed to fetch tags:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!isAuthenticated || !currentUser) {
      setError("Please log in before adding tags.");
      return;
    }
    if (!newTag.trim()) {
      setError("Please enter a tag name");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await foodTagService.addFoodTag({ userId: currentUser.id, tag: newTag.trim() });
      if (response && response.success) {
        setNewTag("");
        await fetchTags();
      } else setError("Failed to add tag");
    } catch (err) {
      console.error("Failed to add tag:", err);
      setError("Failed to add tag. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editTag.trim()) {
      setError("Please enter a tag name");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await foodTagService.updateFoodTag(id, { tag: editTag.trim() });
      if (response && response.success) {
        setEditId(null);
        setEditTag("");
        await fetchTags();
      } else setError("Failed to update tag");
    } catch (err) {
      console.error("Failed to update tag:", err);
      setError("Failed to update tag");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tag?")) return;

    setLoading(true);
    setError(null);
    try {
      const response = await foodTagService.deleteFoodTag(id);
      if (response && response.success) await fetchTags();
      else setError("Failed to delete tag");
    } catch (err) {
      console.error("Failed to delete tag:", err);
      setError("Failed to delete tag");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="foodtags-login-required">
        <div className="login-box">
          <h2>Login Required</h2>
          <p>Please login to manage your food tags</p>
          <a href="/login">Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="foodtags-container">
      <div className="foodtags-box">
        <div className="foodtags-header">
          <h1>My Food Tags</h1>
          <p>Manage your personal food preferences and tags</p>
        </div>

        {error && <div className="foodtags-error">{error}</div>}

        {/* Add New Tag */}
        <div className="foodtags-add">
          <h2>Add New Tag</h2>
          <div className="foodtags-add-controls">
            <input
              type="text"
              placeholder="New tag (e.g. Spicy, Vegetarian, Favorite)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              disabled={loading}
            />
            <button onClick={handleAdd} disabled={loading || !newTag.trim()}>
              {loading ? "Adding..." : "Add Tag"}
            </button>
          </div>
        </div>

        {/* Tags List */}
        {loading && tags.length === 0 ? (
          <div className="foodtags-loading">
            <div className="spinner"></div>
            <p>Loading tags...</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="foodtags-empty">
            <img src={assets.basket_icon} alt="No tags" />
            <h3>No tags yet</h3>
            <p>Add some tags to organize your food preferences!</p>
          </div>
        ) : (
          <div className="foodtags-list">
            <h2>Your Tags</h2>
            <div className="foodtags-grid">
              {tags.map(tag => (
                <div key={tag.id} className="foodtag-item">
                  {editId === tag.id ? (
                    <div className="foodtag-edit">
                      <input
                        type="text"
                        value={editTag}
                        onChange={(e) => setEditTag(e.target.value)}
                        disabled={loading}
                      />
                      <div className="foodtag-edit-buttons">
                        <button onClick={() => handleUpdate(tag.id)} disabled={loading || !editTag.trim()}>
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button onClick={() => { setEditId(null); setEditTag(""); }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="foodtag-display">
                      <span>{tag.tag}</span>
                      <div className="foodtag-actions">
                        <button onClick={() => { setEditId(tag.id); setEditTag(tag.tag); }} title="Edit tag">
                          <Pencil size={20}/>
                        </button>
                        <button onClick={() => handleDelete(tag.id)} disabled={loading} title="Delete tag">
                          <Trash2 size={20}/>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
