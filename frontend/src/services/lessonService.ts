import { api } from './api';

export const lessonService = {
    getLessons: () => api.get('/lessons'),
    getLessonById: (id: number) => api.get(`/lessons/${id}`),
    createLesson: (data: any) => api.post('/lessons', data),
    updateLesson: (id: number, data: any) => api.put(`/lessons/${id}`, data),
    deleteLesson: (id: number) => api.delete(`/lessons/${id}`)
};