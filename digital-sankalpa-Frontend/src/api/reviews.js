import api from './api';

export const createReview = async (productId, data) => {
  const response = await api.post(`/api/products/${productId}/`, data);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/api/reviews/${reviewId}/`);
  return response.data;
};
