import api from './api';

export const signupRequest = async (data) => {
  const res = await api.post('/auth/signup', data);
  return res.data;
};

export const loginRequest = async (data) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const logoutRequest = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export const getMeRequest = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};
