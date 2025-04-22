import api from './api';

// Get all products with filters
export const getProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add all params to query string
    if (params.page) queryParams.append('page', params.page);
    if (params.query) queryParams.append('query', params.query);
    if (params.min_price) queryParams.append('min_price', params.min_price);
    if (params.max_price) queryParams.append('max_price', params.max_price);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.categories) queryParams.append('categories', params.categories);
    
    const response = await api.get(`/api/products/?${queryParams.toString()}`);
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