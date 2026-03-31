import { api } from './api';
import type { QuizResultResponse } from '../types';

export const userService = {
    getProfile: () => api.get('/users/me').then(res => res.data),
    getLessons: () => api.get('/lessons').then(res => res.data),
    saveProgress: (correct: number, total: number) =>
        api.post<QuizResultResponse>('/users/progress', {
            correct_answers: correct,
            total_questions: total
        }).then(res => res.data),
};