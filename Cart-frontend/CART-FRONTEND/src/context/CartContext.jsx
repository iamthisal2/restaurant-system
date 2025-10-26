import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as cartService from '../services/cart.service';

const CartContext = createContext();



export const CartProvider = ({ children }) => {
    const { currentUser, isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load cart items when user is authenticated
    useEffect(() => {
        if (isAuthenticated && currentUser) {
            fetchCartItems().then();
        } else {
            setCartItems([]);
        }
    }, [isAuthenticated, currentUser]);

    const fetchCartItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await cartService.getMyCart();
            if (response && response.data) {
                setCartItems(response.data.items || []);
            }
        } catch (err) {
            setError('Failed to fetch cart items');
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (foodId, quantity = 1) => {
        if (!isAuthenticated) {
            setError('Please login to add items to cart');
            return false;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await cartService.addItemToCart(foodId, quantity);
            if (response && response.success) {
                await fetchCartItems(); // Refresh cart
                return true;
            }
            return false;
        } catch (err) {
            setError('Failed to add item to cart');
            console.error('Error adding to cart:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (cartItemId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await cartService.removeItemFromCart(cartItemId);
            if (response && response.success) {
                await fetchCartItems(); // Refresh cart
                return true;
            }
            return false;
        } catch (err) {
            setError('Failed to remove item from cart');
            console.error('Error removing from cart:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await cartService.clearCart();
            if (response && response.success) {
                setCartItems([]);
                return true;
            }
            return false;
        } catch (err) {
            setError('Failed to clear cart');
            console.error('Error clearing cart:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item?.priceAtOrderTime * item?.quantity);
        }, 0);
    };

    const getCartItemCount = () => {
        return cartItems.reduce((total, item) => total + item?.quantity, 0);
    };

    const value = {
        cartItems,
        loading,
        error,
        setError,
        addToCart,
        removeFromCart,
        clearCart,
        fetchCartItems,
        getCartTotal,
        getCartItemCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
