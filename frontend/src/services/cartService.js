import api from './api';

export const getCartRequest = async () => {
  const res = await api.get('/cart');
  return res.data;
};

export const addToCartRequest = async (productId, quantity = 1) => {
  const res = await api.post('/cart', { productId, quantity });
  return res.data;
};

export const updateCartItemRequest = async (productId, quantity) => {
  const res = await api.put(`/cart/${productId}`, { quantity });
  return res.data;
};

export const removeFromCartRequest = async (productId) => {
  const res = await api.delete(`/cart/${productId}`);
  return res.data;
};
