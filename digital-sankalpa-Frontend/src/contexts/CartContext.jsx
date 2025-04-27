import { createContext, useState, useEffect, useCallback } from 'react';
import * as ordersApi from '../api/orders';
import { useAuth } from '../hooks/useAuth.jsx';

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
      // Optimistically update the UI
      const updatedItems = cartItems.map(item =>
        item.id === cartItemId
          ? { ...item, quantity: quantity, total_price: (item.price || 0) * quantity }
          : item
      );
      setCartItems(updatedItems);

      // Make the API call
      await ordersApi.updateCartItem(cartItemId, quantity);
      
      // Fetch the latest state from server
      const response = await ordersApi.getCart();
      setCartItems(response.cart_items || []);
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update cart item';
      setError(errorMsg);
      // Revert to original state on error
      await fetchCart();
      return { success: false, error: errorMsg };
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



  // Calculate cart totals
  const getCartTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 1000 ? 0 : 100; // Free shipping over Rs. 1000
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  };

  // Checkout with points and discounts
  const checkout = async (shippingInfo, paymentMethod, pointsToRedeem = 0, promoDiscount = 0, userDiscount = 0) => {
    try {
      const totals = getCartTotals();
      // Calculate final price after all discounts
      const totalDiscount = pointsToRedeem / 10 + promoDiscount + userDiscount;
      const finalPrice = Math.max(0, totals.total - totalDiscount);

      const checkoutData = {
        shipping_info: shippingInfo,
        payment_method: paymentMethod,
        points_redeemed: pointsToRedeem,
        total_price: totals.total,
        shipping_fee: totals.shipping,
        subtotal: totals.subtotal,
        promo_discount: promoDiscount,
        user_discount: userDiscount,
        final_price: finalPrice
      };

      const response = await ordersApi.checkout(checkoutData);
      return { success: true, data: response };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to complete checkout';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // For debugging purposes
  useEffect(() => {
    console.log('Cart Items:', cartItems);
  }, [cartItems]);

  // Check if a product is in cart
  const isProductInCart = (productId) => {
    return cartItems.some(item => item.product_id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        getCartTotals,
        checkout,
        isProductInCart,
        isAuthenticated: !!user,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};