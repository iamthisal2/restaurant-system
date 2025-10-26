import React, { useState, useEffect } from 'react';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import * as orderService from '../services/order.service';


const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderData, setOrderData] = useState({
        deliveryAddress: '',
        phoneNumber: '',
        specialInstructions: '',
        paymentMethod: 'CASH'
    });

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (!orderData.deliveryAddress.trim()) {
            setError('Please enter a delivery address');
            return;
        }

        if (!orderData.phoneNumber.trim()) {
            setError('Please enter a phone number');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const orderPayload = {
                userId: currentUser.id,
                deliveryAddress: orderData.deliveryAddress,
                contactNumber: orderData.phoneNumber,
                items: cartItems?.map(item => ({
                    foodId: item.foodId,
                    quantity: item.quantity,
                }))
            };

            const response = await orderService.placeOrder(orderPayload);

            
            if (response && response.success) {
                // Clear cart after successful order
                await clearCart();
                alert('Order placed successfully!');
                navigate('/my-orders');
            } else {
                setError(response?.message || 'Failed to place order');
            }
        } catch (err) {
            console.error('Error placing order:', err);
            setError('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-medium text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Cart is Empty</h2>
                    <p className="text-gray-600 mb-6">Add some items to your cart first</p>
                    <Link 
                        to="/" 
                        className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                    >
                        Browse Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Checkout</h1>
                    <p className="text-gray-600">Complete your order</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Form */}
                    <div className="bg-white rounded-lg shadow-medium p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Delivery Information</h2>
                        
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handlePlaceOrder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Delivery Address *
                                </label>
                                <textarea
                                    name="deliveryAddress"
                                    value={orderData.deliveryAddress}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter your full delivery address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={orderData.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method
                                </label>
                                <select
                                    name="paymentMethod"
                                    value={orderData.paymentMethod}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                >
                                    <option value="CASH">Cash on Delivery</option>
                                    <option value="CARD">Card Payment</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Special Instructions
                                </label>
                                <textarea
                                    name="specialInstructions"
                                    value={orderData.specialInstructions}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Any special instructions for your order?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-medium p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                        
                        <div className="space-y-4 mb-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={"/default/default-food.jpg"}
                                            alt={item.foodName}
                                            className="w-12 h-12 object-cover rounded-lg"
                                        />
                                        <div>
                                            <h3 className="font-medium text-gray-800">{item.foodName}</h3>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <span className="font-semibold text-gray-800">
                                        Rs {(item.priceAtOrderTime * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center text-lg font-semibold text-gray-800">
                                <span>Total:</span>
                                <span className="text-primary-500">Rs {getCartTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link 
                                to="/cart" 
                                className="text-primary-500 hover:text-primary-600 font-medium"
                            >
                                ← Back to Cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
