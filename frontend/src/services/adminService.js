import api from './api';

export const getDashboardStatsRequest = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

// Products (admin)
export const createProductRequest = async (data) => {
  const res = await api.post('/products', data);
  return res.data;
};

export const updateProductRequest = async (id, data) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};

export const deleteProductRequest = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

// Categories (admin)
export const createCategoryRequest = async (data) => {
  const res = await api.post('/categories', data);
  return res.data;
};

export const updateCategoryRequest = async (id, data) => {
  const res = await api.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategoryRequest = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};

// Orders (admin)
export const getAllOrdersRequest = async () => {
  const res = await api.get('/orders/admin/all');
  return res.data;
};

export const updateOrderStatusRequest = async (id, status) => {
  const res = await api.put(`/orders/${id}/status`, { status });
  return res.data;
};

// Users (admin)
export const getAllUsersRequest = async () => {
  const res = await api.get('/users/admin/all');
  return res.data;
};

export const updateUserRoleRequest = async (id, role) => {
  const res = await api.put(`/users/admin/${id}/role`, { role });
  return res.data;
};

export const toggleBlockUserRequest = async (id, isBlocked) => {
  const res = await api.put(`/users/admin/${id}/block`, { isBlocked });
  return res.data;
};

export const deleteUserRequest = async (id) => {
  const res = await api.delete(`/users/admin/${id}`);
  return res.data;
};

// Reviews (admin)
export const getAllReviewsRequest = async () => {
  const res = await api.get('/reviews/admin/all');
  return res.data;
};

export const adminDeleteReviewRequest = async (id) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};
