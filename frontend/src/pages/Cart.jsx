import React, { useState } from 'react';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthContext';
import {Link, useNavigate} from 'react-router-dom';
import { assets } from '../assets/assets';

const Cart = () => {
    const { cartItems, loading, error, removeFromCart, clearCart, getCartTotal, getCartItemCount } = useCart();
    const { isAuthenticated } = useAuth();
    const [isClearing, setIsClearing] = useState(false);
    const navigate = useNavigate();

    const handleRemoveItem = async (cartItemId) => {
        const success = await removeFromCart(cartItemId);
        if (!success) {
            alert('Failed to remove item from cart');
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            setIsClearing(true);
            const success = await clearCart();
            setIsClearing(false);
            if (!success) {
                alert('Failed to clear cart');
            }
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }
        // Navigate to checkout/ordering page
        navigate('/checkout');

    };


    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-medium text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
                    <p className="text-gray-600 mb-6">Please login to view your cart</p>
                    <Link 
                        to="/login" 
                        className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                    >
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading cart...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-medium text-center max-w-md">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-medium p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">
                                {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'}
                            </span>
                            {cartItems?.length > 0 && (
                                <button
                                    onClick={handleClearCart}
                                    disabled={isClearing}
                                    className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                                >
                                    {isClearing ? 'Clearing...' : 'Clear Cart'}
                                </button>
                            )}
                        </div>
                    </div>

                    {cartItems?.length === 0 ? (
                        <div className="text-center py-12">
                            <img 
                                src={assets.basket_icon} 
                                alt="Empty cart" 
                                className="w-24 h-24 mx-auto mb-4 opacity-50"
                            />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                            <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
                            <Link 
                                to="/" 
                                className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                            >
                                Browse Menu
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems?.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-soft transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={"/default/default-food.jpg"}
                                            alt={item?.foodName}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{item?.foodName}</h3>
                                            {/*<p className="text-gray-600 text-sm">{item.food.description}</p>*/}
                                            <p className="text-primary-500 font-semibold">Rs {item?.priceAtOrderTime}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600">Qty: {item.quantity}</span>
                                        </div>
                                        
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-800">
                                                Rs {(item.priceAtOrderTime * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                        
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                            title="Remove item"
                                        >
                                            <img src={assets.remove_icon_red} alt="Remove" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="border-t pt-6 mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xl font-semibold text-gray-800">Total:</span>
                                    <span className="text-2xl font-bold text-primary-500">
                                        Rs {getCartTotal().toFixed(2)}
                                    </span>
                                </div>
                                
                                <div className="flex gap-4">
                                    <Link 
                                        to="/" 
                                        className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center"
                                    >
                                        Continue Shopping
                                    </Link>
                                    <button
                                        onClick={handleCheckout}
                                        className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
