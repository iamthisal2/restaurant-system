import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import * as foodTagService from "../services/foodTag.service";
import { assets } from "../assets/assets";
import {Pencil, Trash2} from "lucide-react";

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
      if (response && response.data) {
        setTags(response.data);
      }
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
      const response = await foodTagService.addFoodTag({ 
        userId: currentUser.id, 
        tag: newTag.trim() 
      });
      if (response && response.success) {
        setNewTag("");
        await fetchTags();
      } else {
        setError("Failed to add tag");
      }
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
      } else {
        setError("Failed to update tag");
      }
    } catch (err) {
      console.error("Failed to update tag:", err);
      setError("Failed to update tag");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tag?")) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await foodTagService.deleteFoodTag(id);
      if (response && response.success) {
        await fetchTags();
      } else {
        setError("Failed to delete tag");
      }
    } catch (err) {
      console.error("Failed to delete tag:", err);
      setError("Failed to delete tag");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-medium text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to manage your food tags</p>
          <a 
            href="/login" 
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-medium p-6 border border-gray-200">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Food Tags</h1>
            <p className="text-gray-600">Manage your personal food preferences and tags</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Add New Tag */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Tag</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="New tag (e.g. Spicy, Vegetarian, Favorite)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                disabled={loading}
              />
              <button
                onClick={handleAdd}
                disabled={loading || !newTag.trim()}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Adding...' : 'Add Tag'}
              </button>
            </div>
          </div>

          {/* Tags List */}
          {loading && tags.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tags...</p>
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-8">
              <img 
                src={assets.basket_icon} 
                alt="No tags" 
                className="w-16 h-16 mx-auto mb-4 opacity-50"
              />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No tags yet</h3>
              <p className="text-gray-500">Add some tags to organize your food preferences!</p>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Tags</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tags?.map((tag) => (
                  <div key={tag.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-soft transition-shadow">
                    {editId === tag.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editTag}
                          onChange={(e) => setEditTag(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          disabled={loading}
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleUpdate(tag.id)}
                            disabled={loading || !editTag.trim()}
                            className="flex-1 bg-orange-500 text-white px-3 py-2 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {loading ? 'Saving...' : 'Save'}
                          </button>
                          <button 
                            onClick={() => {
                              setEditId(null);
                              setEditTag("");
                            }}
                            className="flex-1 bg-gray-200 text-gray-800 px-3 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{tag.tag}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditId(tag.id);
                              setEditTag(tag.tag);
                            }}
                            className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Edit tag"
                          >
                              <Pencil size={20}/>
                          </button>
                          <button
                            onClick={() => handleDelete(tag.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Delete tag"
                          >
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
    </div>
  );
}
