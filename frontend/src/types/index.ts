export interface LessonListItem {
    id: number;
    title: string;
    book: string;
    level: number;
}

export interface Lesson {
    id: number;
    title: string;
    book: string;
    level: number;
    questions: Question[];
}

export interface Question {
    text: string;
    type: 'multiple_choice' | 'true_false' | 'order_sequence' | 'fill_in_the_blank';
    options: string[];
    answer: unknown;
    explanation?: string;
}

export const bibleBooks = ["Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras", "Neemias", "Esther", "Jó", "Salmos", "Provérbios", "Eclesiastes", "Cânticos", "Isaías", "Jeremias", "Lamentações", "Ezequiel", "Daniel", "Oseias", "Joel", "Amós", "Obadias", "Jonas", "Miquéias", "Nahum", "Habacuque", "Sofonias", "Zacarias", "Ageu", "Mateus", "Marcos", "Lucas", "João", "Atos", "Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios", "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses", "1 Timóteo", "2 Timóteo", "Tito", "Filemom", "Hebreus", "Tiago", "1 Pedro", "2 Pedro", "1 João", "2 João", "3 João", "Judas", "Apocalipse"];