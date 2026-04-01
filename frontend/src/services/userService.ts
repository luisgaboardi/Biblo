import { api } from './api';

export const userService = {
    getProfile: () => api.get('/users/me').then(res => res.data),
    getLessons: () => api.get('/lessons').then(res => res.data),
};