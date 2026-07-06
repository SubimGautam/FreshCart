import api from './api';

export const placeOrderRequest = async (data) => {
  const res = await api.post('/orders', data);
  return res.data;
};

export const getMyOrdersRequest = async () => {
  const res = await api.get('/orders');
  return res.data;
};

// NOTE: endpoint names/response shape ({ paymentUrl }) are assumed —
// confirm these against your actual backend payment routes.
export const initiateEsewaPaymentRequest = async (orderId) => {
  const res = await api.post('/payments/esewa/initiate', { orderId });
  return res.data;
};

export const initiateMobileBankingPaymentRequest = async (orderId) => {
  const res = await api.post('/payments/mobile-banking/initiate', { orderId });
  return res.data;
};
