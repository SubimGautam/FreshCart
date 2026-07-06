import api from './api';

export const getProductsRequest = async (params = {}) => {
  const res = await api.get('/products', { params });
  return res.data;
};

export const getFeaturedProductsRequest = async () => {
  const res = await api.get('/products/featured');
  return res.data;
};

export const getBestSellersRequest = async () => {
  const res = await api.get('/products/best-sellers');
  return res.data;
};

export const getDealsRequest = async () => {
  const res = await api.get('/products/deals');
  return res.data;
};

export const getCategoriesRequest = async () => {
  const res = await api.get('/products/categories');
  return res.data;
};

export const getCategoryListRequest = async () => {
  const res = await api.get('/categories');
  return res.data;
};

export const getProductByIdRequest = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const getRelatedProductsRequest = async (id) => {
  const res = await api.get(`/products/${id}/related`);
  return res.data;
};

export const getProductReviewsRequest = async (productId) => {
  const res = await api.get(`/products/${productId}/reviews`);
  return res.data;
};

export const createReviewRequest = async (productId, data) => {
  const res = await api.post(`/products/${productId}/reviews`, data);
  return res.data;
};

export const updateReviewRequest = async (reviewId, data) => {
  const res = await api.put(`/reviews/${reviewId}`, data);
  return res.data;
};

export const deleteReviewRequest = async (reviewId) => {
  const res = await api.delete(`/reviews/${reviewId}`);
  return res.data;
};
