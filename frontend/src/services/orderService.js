import api from './api';

export const placeOrderRequest = async (data) => {
  const res = await api.post('/orders', data);
  return res.data;
};

export const getMyOrdersRequest = async () => {
  const res = await api.get('/orders');
  return res.data;
};
