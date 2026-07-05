import api from './api';

export const getWishlistRequest = async () => {
  const res = await api.get('/wishlist');
  return res.data;
};

export const addToWishlistRequest = async (productId) => {
  const res = await api.post('/wishlist', { productId });
  return res.data;
};

export const removeFromWishlistRequest = async (productId) => {
  const res = await api.delete(`/wishlist/${productId}`);
  return res.data;
};
