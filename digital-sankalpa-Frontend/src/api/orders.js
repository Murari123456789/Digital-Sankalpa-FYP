import api from './index';

// Get user's orders
export const getOrders = async () => {
  try {
    const response = await api.get('/orders/view-orders/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (orderId) => {
    try {
      const response = await api.get(`/orders/order/${orderId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

// Get user's cart
export const getCart = async () => {
  try {
    const response = await api.get('/orders/view-cart/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add product to cart
export const addToCart = async (productId) => {
  try {
    const response = await api.post(`/orders/add-to-cart/${productId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update cart item quantity
export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const response = await api.post(`/orders/update-cart-item/${cartItemId}/`, { quantity });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
  try {
    const response = await api.delete(`/orders/remove-from-cart/${cartItemId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Proceed to checkout
export const checkout = async () => {
  try {
    const response = await api.post('/orders/checkout/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mark checkout as successful
export const checkoutSuccess = async (orderId) => {
  try {
    const response = await api.get(`/orders/checkout/success/${orderId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mark checkout as failed
export const checkoutFailure = async (orderId) => {
  try {
    const response = await api.get(`/orders/checkout/failure/${orderId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};