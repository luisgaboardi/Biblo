import { useEffect, useState } from 'react';
import axios from 'axios';

interface QuestionForm {
    text: string;
    options: string[];
    answer: string;
}

export function Admin() {
    const [title, setTitle] = useState('');
    const [book, setBook] = useState('Gênesis');
    const [questions, setQuestions] = useState<QuestionForm[]>([
        { text: '', options: ['', '', '', ''], answer: '' }
    ]);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [existingLessons, setExistingLessons] = useState<any[]>([]);

    useEffect(() => {
        fetchLessons();
    }, []);

    // Adiciona uma nova pergunta vazia ao array
    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: ['', '', '', ''], answer: '' }]);
    };

    // Atualiza um campo específico de uma pergunta específica
    const updateQuestion = (index: number, field: keyof QuestionForm, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };


    // Função para carregar as lições (chame no useEffect ou após salvar/apagar)
    const fetchLessons = async () => {
        const res = await axios.get('http://localhost:8000/lessons');
        setExistingLessons(res.data);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Tem a certeza que deseja eliminar esta lição?")) {
            await axios.delete(`http://localhost:8000/lessons/${id}`);
            fetchLessons();
        }
    };

    const startEdit = (lesson: any) => {
        setIsEditing(lesson.id);
        setTitle(lesson.title);
        setBook(lesson.book);
        setQuestions(lesson.questions);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSave = async () => {
        const payload = { title, book, level: 1, questions: { questions } };

        if (isEditing) {
            await axios.put(`http://localhost:8000/lessons/${isEditing}`, payload);
            setIsEditing(null);
        } else {
            await axios.post('http://localhost:8000/lessons', payload);
        }

        // Reset e Refresh
        setTitle('');
        setQuestions([{ text: '', options: ['', '', '', ''], answer: '' }]);
        fetchLessons();
    };

    return (
        <div className="p-8 max-w-3xl mx-auto bg-gray-50 min-h-screen pb-20">
            <h1 className="text-3xl font-black mb-8 text-gray-800">Criador de Conteúdo ✍️</h1>

            <section className="bg-white p-6 rounded-3xl shadow-sm border-2 border-gray-100 mb-8">
                <h2 className="font-bold text-gray-400 uppercase text-xs mb-4 tracking-widest">Informações Básicas</h2>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        placeholder="Título da Lição (ex: O Dilúvio)"
                        className="p-4 border-2 rounded-2xl focus:border-bibloBlue outline-none transition-all"
                        value={title} onChange={e => setTitle(e.target.value)}
                    />
                    <select
                        className="p-4 border-2 rounded-2xl bg-white"
                        value={book} onChange={e => setBook(e.target.value)}
                    >
                        <option>Gênesis</option>
                        <option>Êxodo</option>
                        <option>Mateus</option>
                    </select>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Perguntas do Quiz</h2>

                {questions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-white p-6 rounded-3xl border-2 border-gray-200 relative animate-fadeIn">
                        <span className="absolute -top-3 -left-3 bg-bibloBlue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                            {qIdx + 1}
                        </span>

                        <input
                            placeholder="Qual a pergunta?"
                            className="w-full p-4 border-b-2 mb-4 font-bold text-lg outline-none focus:border-bibloBlue"
                            value={q.text}
                            onChange={e => updateQuestion(qIdx, 'text', e.target.value)}
                        />

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

            <section className="mt-12 border-t-2 pt-8">
                <h2 className="text-xl font-black text-gray-700 mb-6">Gerir Lições Existentes</h2>
                <div className="space-y-3">
                    {existingLessons.map(l => (
                        <div key={l.id} className="bg-white p-4 rounded-2xl border-2 flex justify-between items-center">
                            <div>
                                <span className="text-xs font-bold text-bibloBlue uppercase">{l.book}</span>
                                <h4 className="font-bold text-gray-800">{l.title}</h4>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => startEdit(l)}
                                    className="p-2 text-bibloBlue hover:bg-blue-50 rounded-lg font-bold"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(l.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg font-bold"
                                >
                                    Apagar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}