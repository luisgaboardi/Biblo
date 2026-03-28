import { useEffect, useState } from 'react';
import axios from 'axios';

interface QuestionForm {
    text: string;
    type: 'multiple-choice';
    options: string[];
    answer: string;
    explanation?: string;
}

export function Admin() {
    const [title, setTitle] = useState('');
    const [book, setBook] = useState('Gênesis');
    const [questions, setQuestions] = useState<QuestionForm[]>([
        { text: '', type: 'multiple-choice', options: ['', '', '', ''], answer: '' }
    ]);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const bibleBooks = [
        "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué", "Juízes", "Rute",
        "1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas",
        "Esdras", "Neemias", "Esther", "Jó", "Salmos", "Provérbios",
        "Eclesiastes", "Cânticos", "Isaías", "Jeremias", "Lamentações",
        "Ezequiel", "Daniel", "Oseias", "Joel", "Amós", "Obadias",
        "Jonas", "Miquéias", "Nahum", "Habacuque", "Sofonias",
        "Zacarias", "Ageu",
        // Novo Testamento
        "Mateus", "Marcos", "Lucas", "João", "Atos", "Romanos", "1 Coríntios",
        "2 Coríntios", "Gálatas", "Efésios", "Filipenses", "Colossenses",
        "1 Tessalonicenses", "2 Tessalonicenses", "1 Timóteo", "2 Timóteo",
        "Tito", "Filemom", "Hebreus", "Tiago", "1 Pedro", "2 Pedro",
        "1 João", "2 João", "3 João", "Judas", "Apocalipse"
    ];

    // Adiciona uma nova pergunta vazia ao array
    const addQuestion = () => {
        setQuestions([...questions, { text: '', type: 'multiple-choice', options: ['', '', '', ''], answer: '' }]);
    };

    // Atualiza um campo específico de uma pergunta específica
    const updateQuestion = (index: number, field: keyof QuestionForm, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const handleSave = async () => {
        const payload = { title, books: [book], level: 1, questions };

        if (isEditing) {
            await axios.put(`http://localhost:8000/lessons/${isEditing}`, payload);
            setIsEditing(null);
        } else {
            await axios.post('http://localhost:8000/lessons', payload);
        }

        // Reset e Refresh
        setTitle('');
        setQuestions([{ text: '', type: 'multiple-choice', options: ['', '', '', ''], answer: '' }]);
    };

    return (
        <div className="p-8 max-w-3xl mx-auto bg-gray-50 min-h-screen pb-20">
            <h1 className="text-3xl font-black mb-8 text-gray-800">Criador de Conteúdo ✍️</h1>

            <section className="bg-white p-6 rounded-3xl shadow-sm border-2 border-gray-100 mb-8">
                <h2 className="font-bold text-gray-400 uppercase text-xs mb-4 tracking-widest">Informações Básicas</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        placeholder="Título da Lição (ex: O Dilúvio)"
                        className="p-4 border-2 rounded-2xl focus:border-biblo-blue outline-none transition-all"
                        value={title} onChange={e => setTitle(e.target.value)}
                    />
                    <select
                        className="p-4 border-2 rounded-2xl bg-white"
                        value={book} onChange={e => setBook(e.target.value)}
                    >
                        {bibleBooks.map((b, idx) => (
                            <option key={idx} value={b}>{b}</option>
                        ))}
                    </select>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Perguntas do Quiz</h2>

                {questions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-white p-6 rounded-3xl border-2 border-gray-200 relative animate-fadeIn">
                        <span className="absolute -top-3 -left-3 bg-biblo-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                            {qIdx + 1}
                        </span>

                        <input
                            placeholder="Qual a pergunta?"
                            className="w-full p-4 border-b-2 mb-4 font-bold text-lg outline-none focus:border-biblo-blue"
                            value={q.text}
                            onChange={e => updateQuestion(qIdx, 'text', e.target.value)}
                        />

                        <select
                            className="mb-4 p-3 border-2 rounded-xl bg-white w-full"
                            value={q.type}
                            onChange={e => updateQuestion(qIdx, 'type', e.target.value)}
                        >
                            <option value="" disabled>Selecione o tipo de pergunta</option>
                            <option value="multiple-choice">Múltipla Escolha</option>
                            <option value="true-false">Verdadeiro ou Falso</option>
                        </select>

                        <div className="grid grid-cols-2 gap-3">
                            {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name={`correct-${qIdx}`}
                                        checked={q.answer === opt && opt !== ''}
                                        onChange={() => updateQuestion(qIdx, 'answer', opt)}
                                    />
                                    <input
                                        placeholder={`Opção ${oIdx + 1}`}
                                        className="flex-1 p-2 border-2 rounded-xl text-sm"
                                        value={opt}
                                        onChange={e => {
                                            const newOpts = [...q.options];
                                            newOpts[oIdx] = e.target.value;
                                            updateQuestion(qIdx, 'options', newOpts);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div>
                            <input
                                placeholder="Justifique a resposta"
                                className="w-full p-4 border-b-2 mb-4 font-bold text-lg outline-none focus:border-biblo-blue"
                                value={q.explanation}
                                onChange={e => updateQuestion(qIdx, 'explanation', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </section>

            <div className="mt-8 flex gap-4">
                <button
                    onClick={addQuestion}
                    className="flex-1 py-4 border-2 border-dashed border-gray-300 rounded-2xl font-bold text-gray-400 hover:border-biblo-blue hover:text-biblo-blue transition-all"
                >
                    + ADICIONAR PERGUNTA
                </button>
                <button
                    onClick={handleSave}
                    className="flex-1 bg-biblo-green text-white font-black py-4 rounded-2xl shadow-[0_4px_0_0_#46a302] active:translate-y-1 active:shadow-none transition-all"
                >
                    PUBLICAR NO BIBLO
                </button>
            </div>
        </div>
    );
}