import { api } from '@/shared/lib/api';

export const userService = {
  getProfile: () => api.get('/users/me').then((res) => res.data),
  getAllUsers: () => api.get('/users/all').then((res) => res.data),
  deleteUser: (userId: number) => api.delete(`/users/${userId}`),
};
