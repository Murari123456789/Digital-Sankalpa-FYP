import api from './index';

// Fetch products with optional search query, pagination, and filters
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/api/products/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch single product by ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/api/products/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add product review
export const addProductReview = async (productId, reviewData) => {
  try {
    const response = await api.post(`/api/products/${productId}/`, reviewData);
    return response.data;
  } catch (error) {
    throw error;
  }
};