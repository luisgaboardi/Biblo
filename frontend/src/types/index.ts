export interface Question {
    id: string;
    type: string;
    text: string;
    options?: string[];
    answer: string;
    explanation?: string;
    sequence?: string[]; // Para perguntas de ordenação
    pairs?: Record<string, string>; // Para perguntas de associação
}

export interface Lesson {
    id: number;
    title: string;
    books: string[];
    level: number;
    content: {
        questions: Question[];
    };
}

export interface QuizResultResponse {
    message: string;
    xp_earned: number;
    current_total_xp: number;
    streak: number;
}