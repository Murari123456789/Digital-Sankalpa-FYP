import api from './index';

// Fetch products with optional search query and pagination
export const getProducts = async (query = '', page = 1) => {
  try {
    const response = await api.get('/products/', {
      params: { query, page }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch single product by ID
export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/products/product/${productId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add product review
export const addProductReview = async (productId, reviewData) => {
    try {
      const response = await api.post(`/products/product/${productId}/`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };