import { api } from '@/shared/lib/api';

export const attemptService = {
  startAttempt: (lessonId: number) => api.post('/attempts/start', { lesson_id: lessonId }),
  finishAttempt: (attemptId: number, payload: { correct_count: number; total_count: number; missed_question_keys: string[] }) =>
    api.post(`/attempts/${attemptId}/finish`, payload),
};
