import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ⚙️ IMPORTANT: Define your Spring Boot API base URL
// Ensure your backend is running on http://localhost:8080
const API_BASE_URL = 'http://localhost:8080/api/v1';

const Cart = () => {
  const [carts, setCarts] = useState([]);
   const [newItem, setNewItem] = useState({
     // CHANGED: Using 'itemId' to match the DTO field, assuming this is your primary key name
     itemId: '',
     itemName: '',
     price: 0.0,
     quantity: 1,
   });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. FETCH all Cart Items (GET: /getCarts) ---
  const fetchCarts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/getCarts`);
      setCarts(response.data);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      // Display a clear error if the API connection fails
      setError("Failed to load cart items. Is your Spring Boot backend running on port 8080?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  // --- 2. Save/Add New Cart Item (POST: /saveCarts) ---
  const handleSaveCart = async (e) => {
    e.preventDefault();
    if (!newItem.itemName || newItem.quantity <= 0 || newItem.price <= 0) return;

    // When saving a new item, we don't send the itemId, let the backend generate it.
    const itemToSave = {
        itemName: newItem.itemName,
        price: newItem.price,
        quantity: newItem.quantity,
    };

    try {
      // Your backend expects a DTO object in the request body
      await axios.post(`${API_BASE_URL}/saveCarts`, itemToSave);

      setNewItem({ itemId: '', itemName: '', price: 0.0, quantity: 1 }); // Reset form
      fetchCarts(); // Refresh the list from the server
    } catch (err) {
      console.error("Save Error:", err);
      setError("Failed to save item. Check backend logs.");
    }
  };

  // --- 3. Delete Cart Item (DELETE: /deleteCarts) ---
  const handleDeleteCart = async (cartItem) => {
    // We must send the item object (which contains itemId) in the 'data' field
    // because your backend uses @RequestBody for DELETE
    try {
      await axios.delete(`${API_BASE_URL}/deleteCarts`, { data: cartItem });
      fetchCarts(); // Refresh the list
    } catch (err) {
      console.error("Delete Error:", err);
      setError("Failed to delete item.");
    }
  };

  // --- Loading and Error Display ---
  if (loading) return <div style={{padding: '20px'}}>Loading cart items... ⏳</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;

  const totalCost = carts.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>🛒 Cart Management</h1>

      {/* ADD ITEM FORM */}
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
        <h2>Add New Item</h2>
        <form onSubmit={handleSaveCart} style={{ display: 'flex', gap: '10px' }}>
          <input
            name="itemName"
            value={newItem.itemName}
            onChange={e => setNewItem(prev => ({...prev, itemName: e.target.value}))}
            placeholder="Item Name"
            required
          />
          <input
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={newItem.price}
            onChange={e => setNewItem(prev => ({...prev, price: parseFloat(e.target.value)}))}
            placeholder="Price"
            required
          />
          <input
            name="quantity"
            type="number"
            min="1"
            value={newItem.quantity}
            onChange={e => setNewItem(prev => ({...prev, quantity: parseInt(e.target.value)}))}
            placeholder="Qty"
            required
          />
          <button type="submit" style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 15px' }}>
            Add
          </button>
        </form>
      </div>

      {/* CART ITEMS TABLE */}
      <h2>Current Items ({carts.length})</h2>
      {carts.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid black' }}>
              <th style={{padding: '8px'}}>Item Name</th>
              <th style={{padding: '8px'}}>Price</th>
              <th style={{padding: '8px'}}>Qty</th>
              <th style={{padding: '8px'}}>Subtotal</th>
              <th style={{padding: '8px'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {carts.map(item => (
              // CHANGED: Use item.itemId as the unique key
              <tr key={item.itemId} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{padding: '8px'}}>{item.itemName}</td>
                <td style={{padding: '8px'}}>${item.price.toFixed(2)}</td>
                <td style={{padding: '8px'}}>{item.quantity}</td>
                <td style={{padding: '8px'}}>${(item.price * item.quantity).toFixed(2)}</td>
                <td style={{padding: '8px'}}>
                  <button
                    onClick={() => handleDeleteCart(item)}
                    style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
             <tr style={{ fontWeight: 'bold', borderTop: '2px solid black' }}>
                <td colSpan="3" style={{padding: '8px'}}>Total:</td>
                <td style={{padding: '8px'}}>${totalCost}</td>
                <td></td>
             </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default Cart;