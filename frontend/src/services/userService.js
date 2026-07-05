import api from './api';

export const updateProfileRequest = async (data) => {
  const res = await api.put('/users/profile', data);
  return res.data;
};

export const changePasswordRequest = async (data) => {
  const res = await api.put('/users/change-password', data);
  return res.data;
};

export const getAddressesRequest = async () => {
  const res = await api.get('/users/addresses');
  return res.data;
};

export const addAddressRequest = async (data) => {
  const res = await api.post('/users/addresses', data);
  return res.data;
};

export const updateAddressRequest = async (addressId, data) => {
  const res = await api.put(`/users/addresses/${addressId}`, data);
  return res.data;
};

export const deleteAddressRequest = async (addressId) => {
  const res = await api.delete(`/users/addresses/${addressId}`);
  return res.data;
};
