import api from './api';

// Get user's wishlist
export const getWishlist = async () => {
  try {
    const response = await api.get('/api/products/wishlist/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check if product is in wishlist
export const checkWishlistStatus = async (productId) => {
  try {
    const response = await api.get(`/api/products/wishlist/${productId}/`);
    return response.data.is_in_wishlist;
  } catch (error) {
    // If we get a 401 (unauthorized) or 404 (not found), return false
    if (error.response && (error.response.status === 401 || error.response.status === 404)) {
      return false;
    }
    throw error;
  }
};

// Add to wishlist
export const addToWishlist = async (productId) => {
  try {
    const response = await api.post(`/api/products/wishlist/${productId}/`);
    // Dispatch wishlistUpdated event after successful addition
    window.dispatchEvent(new Event('wishlistUpdated'));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Remove from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const response = await api.delete(`/api/products/wishlist/${productId}/`);
    // Dispatch wishlistUpdated event after successful removal
    window.dispatchEvent(new Event('wishlistUpdated'));
    return response.data;
  } catch (error) {
    throw error;
  }
};
