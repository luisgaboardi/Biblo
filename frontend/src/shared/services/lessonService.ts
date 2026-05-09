import { api } from '@/shared/lib/api';

export const lessonService = {
  getLessons: () => api.get('/lessons/'),
  getLessonById: (id: number) => api.get(`/lessons/${id}`),
  createLesson: (data: unknown) => api.post('/lessons/', data),
  updateLesson: (id: number, data: unknown) => api.put(`/lessons/${id}`, data),
  deleteLesson: (id: number) => api.delete(`/lessons/${id}`),
};
