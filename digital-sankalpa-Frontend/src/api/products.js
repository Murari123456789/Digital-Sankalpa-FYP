import api from './api';

// Get all products
export const getProducts = async () => {
  try {
    const response = await api.get('/api/products/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get product details
export const getProductDetails = async (productId) => {
  try {
    const response = await api.get(`/api/products/${productId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get product reviews
export const getProductReviews = async (productId) => {
  try {
    const response = await api.get(`/api/products/${productId}/reviews/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add product review
export const addProductReview = async (productId, reviewData) => {
  try {
    const response = await api.post(`/api/products/${productId}/reviews/`, reviewData);
    return response.data;
  } catch (error) {
    throw error;
  }
};