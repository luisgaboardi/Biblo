import { api } from '@/shared/lib/api';

export const authService = {
  login: async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    const { data } = await api.post<{
      access_token?: string;
      refresh_token?: string;
    }>('/auth/login', params);
    return {
      accessToken: data?.access_token,
      refreshToken: data?.refresh_token,
    };
  },

  signup: async (payload: { username: string; email: string; password: string }) => {
    await api.post('/auth/signup', payload);
  },

  createTeacher: async (payload: { username: string; email: string }) => {
    await api.post('/auth/create-teacher', payload);
  },

  forgotPassword: async (email: string) => {
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string) => {
    await api.post('/auth/reset-password', { token, password });
  },
};
