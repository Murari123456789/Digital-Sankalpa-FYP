import { createContext, useState, useEffect, useCallback } from 'react';
import * as ordersApi from '../api/orders';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, initialized } = useAuth();

  // Fetch cart items when user is logged in
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await ordersApi.getCart();
      setCartItems(response.cart_items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (initialized) {
      fetchCart();
    }
  }, [initialized, user, fetchCart]);

  // Add product to cart
  const addToCart = async (productId) => {
    console.log(user)
    // Check if user is authenticated
    if (!user) {
      return { 
        success: false, 
        error: 'Please log in to add items to cart',
        requiresAuth: true
      };
    }
    
    try {
      setLoading(true);
      const response = await ordersApi.addToCart(productId);
      await fetchCart(); // Refresh cart after adding
      return { success: true, message: response.message || 'Item added to cart' };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to add item to cart';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (cartItemId, quantity) => {
    try {
      setLoading(true);
      await ordersApi.updateCartItem(cartItemId, quantity);
      await fetchCart(); // Refresh cart after updating
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update cart item';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    try {
      setLoading(true);
      await ordersApi.removeFromCart(cartItemId);
      await fetchCart(); // Refresh cart after removing
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to remove item from cart';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Checkout process
  const checkout = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.checkout();
      await fetchCart(); // Refresh cart after checkout
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Checkout failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart totals
  const getCartTotals = () => {
    return cartItems.reduce(
      (totals, item) => {
        totals.subtotal += item.total_price || 0;
        totals.itemCount += item.quantity || 0;
        return totals;
      },
      { subtotal: 0, itemCount: 0 }
    );
  };

  // For debugging purposes

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        checkout,
        fetchCart,
        getCartTotals,
        isAuthenticated: !!user
      }}
    >
      {children}
    </CartContext.Provider>
  );
};