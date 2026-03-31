import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { bibleBooks } from '../types';

interface QuestionForm {
    text: string;
    type: 'multiple_choice' | 'true_false' | 'order_sequence' | 'fill_in_the_blank';
    options: string[];
    sequence?: string[];
    answer: any;
    explanation?: string;
}

interface Lesson {
    id: number;
    title: string;
    book: string;
    level: number;
    content: {
        questions: QuestionForm[];
    };
}

export function Admin() {
    // Estados de Controle de Tela
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [editingId, setEditingId] = useState<number | null>(null);

    // Estados da Lista e Filtros
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [filterTitle, setFilterTitle] = useState('');
    const [filterBook, setFilterBook] = useState('');
    const [filterLevel, setFilterLevel] = useState<number | ''>('');

    // Estados do Formulário (Editor)
    const [title, setTitle] = useState('');
    const [book, setBook] = useState('Gênesis');
    const [level, setLevel] = useState(1);
    const [questions, setQuestions] = useState<QuestionForm[]>([
        { text: '', type: 'multiple_choice', options: ['', '', '', ''], answer: '', explanation: '' }
    ]);

    // Estados Globais
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Estados para o Modal de Exclusão
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);

    // Função que abre o modal
    const confirmDelete = (id: number) => {
        setIdToDelete(id);
        setShowDeleteModal(true);
    };

    // Função que executa a exclusão real
    const executeDelete = async () => {
        if (!idToDelete) return;
        try {
            await api.delete(`/lessons/${idToDelete}`);
            fetchLessons();
            setShowDeleteModal(false);
            setIdToDelete(null);
            setStatus('success');
            setTimeout(() => setStatus('idle'), 2000);
        } catch (err) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 2000);
        }
    };

    useEffect(() => {
        if (view === 'list') fetchLessons();
    }, [view]);

    const fetchLessons = async () => {
        try {
            const res = await api.get('/lessons');
            setLessons(res.data);
        } catch (err) {
            console.error("Erro ao carregar lições");
        }
    };

    // Lógica de Filtros no Frontend (ou passar params para o backend)
    const filteredLessons = lessons.filter(l =>
        l.title.toLowerCase().includes(filterTitle.toLowerCase()) &&
        (filterBook === '' || l.book === filterBook) &&
        (filterLevel === '' || l.level === filterLevel)
    );

    const handleEdit = (lesson: Lesson) => {
        setEditingId(lesson.id);
        setTitle(lesson.title);
        setBook(lesson.book);
        setLevel(lesson.level);
        setQuestions(lesson.content?.questions);
        setView('editor');
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setBook('Gênesis');
        setLevel(1);
        setQuestions([{ text: '', type: 'multiple_choice', options: ['', '', '', ''], answer: '', explanation: '' }]);
        setView('list');
    };

    const handleSave = async () => {
        if (isLoading || !title) return;
        setIsLoading(true);
        const payload = { title, book, level, questions };

        try {
            if (editingId) {
                await api.put(`/lessons/${editingId}`, payload);
            } else {
                await api.post('/lessons', payload);
            }
            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                resetForm();
            }, 2000);
        } catch (err) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    // Auxiliares do Questionário
    const addQuestion = () => setQuestions([...questions, { text: '', type: 'multiple_choice', options: ['', '', '', ''], answer: '', explanation: '' }]);
    const removeQuestion = (idx: number) => setQuestions(questions.filter((_, i) => i !== idx));
    const updateQuestion = (idx: number, field: keyof QuestionForm, val: any) => {
        const newQs = [...questions];
        newQs[idx] = { ...newQs[idx], [field]: val };
        setQuestions(newQs);
    };

    return (
        <div className="min-h-screen bg-[#f7f7f7] pb-20">
            {/* MODAL DE STATUS (Mesmo do Signup) */}
            {status !== 'idle' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl animate-modal text-center border-2 border-gray-100">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${status === 'success' ? 'bg-biblo-green' : 'bg-red-500'}`}>
                            <span className="text-white text-3xl font-bold">{status === 'success' ? '✓' : '✕'}</span>
                        </div>
                        <h2 className="text-xl font-black uppercase">{status === 'success' ? 'Sucesso!' : 'Erro!'}</h2>
                    </div>
                </div>
            )}

            {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-md animate-fadeIn p-6">
                    <div className="bg-white p-8 rounded-[32px] shadow-2xl animate-modal w-full max-w-sm text-center border-2 border-gray-100">
                        {/* Ícone de Alerta */}
                        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                            <span className="text-red-500 mb-1 text-4xl">⚠️</span>
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                            Excluir Lição?
                        </h2>
                        <p className="text-gray-500 font-bold mt-2 text-sm leading-relaxed">
                            Esta ação não pode ser desfeita. <br />
                            Deseja mesmo apagar este conteúdo?
                        </p>

                        <div className="mt-8 flex flex-col gap-3">
                            <button
                                onClick={executeDelete}
                                className="w-full py-4 bg-red-500 text-white font-black rounded-2xl shadow-[0_4px_0_0_#b91c1c] active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider"
                            >
                                Sim, excluir
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="w-full py-4 bg-gray-100 text-gray-500 font-black rounded-2xl border-2 border-b-4 border-gray-200 active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER COM ABAS */}
            <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-black text-biblo-green tracking-tighter">BIBLO ADMIN</h1>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setView('list')}
                                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${view === 'list' ? 'bg-biblo-blue text-white shadow-[0_3px_0_0_#1a73e8]' : 'text-gray-400'}`}
                            >
                                LISTA
                            </button>
                            <button
                                onClick={() => { resetForm(); setView('editor'); }}
                                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${view === 'editor' && !editingId ? 'bg-biblo-blue text-white shadow-[0_3px_0_0_#1a73e8]' : 'text-gray-400'}`}
                            >
                                + NOVA
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 mt-4">
                {/* VIEW: LISTAGEM */}
                {view === 'list' && (
                    <div className="space-y-6">
                        {/* FILTROS */}
                        <section className="bg-white p-4 rounded-2xl border-2 border-b-4 border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                                placeholder="🔍 Buscar título..."
                                className="p-3 bg-gray-50 rounded-xl border-2 border-gray-100 outline-none focus:border-biblo-blue font-bold text-sm"
                                value={filterTitle} onChange={e => setFilterTitle(e.target.value)}
                            />
                            <select
                                className="p-3 bg-gray-50 rounded-xl border-2 border-gray-100 font-bold text-sm text-gray-500"
                                value={filterBook} onChange={e => setFilterBook(e.target.value)}
                            >
                                <option value="">Todos os Livros</option>
                                {bibleBooks.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <select
                                className="p-3 bg-gray-50 rounded-xl border-2 border-gray-100 font-bold text-sm text-gray-500"
                                value={filterLevel} onChange={e => setFilterLevel(e.target.value === '' ? '' : parseInt(e.target.value))}
                            >
                                <option value="">Todos os Níveis</option>
                                <option value={1}>Nível 1</option>
                                <option value={2}>Nível 2</option>
                                <option value={3}>Nível 3</option>
                            </select>
                        </section>

                        {/* TABELA / CARDS */}
                        <div className="grid gap-3">
                            {filteredLessons.map(lesson => (
                                <div key={lesson.id} className="bg-white p-4 rounded-2xl border-2 border-b-4 border-gray-200 flex justify-between items-center animate-fadeIn">
                                    <div>
                                        <h3 className="font-black text-gray-800">{lesson.title}</h3>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-[10px] font-black bg-blue-100 text-biblo-blue px-2 py-0.5 rounded-full uppercase">{lesson.book}</span>
                                            <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase">Lvl {lesson.level}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(lesson)} className="p-2 text-biblo-blue hover:bg-blue-50 rounded-lg transition-colors">✏️</button>
                                        <button onClick={() => confirmDelete(lesson.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* VIEW: EDITOR (CRIAR/EDITAR) */}
                {view === 'editor' && (
                    <div className="space-y-6 animate-fadeIn">
                        <section className="bg-white p-6 rounded-3xl border-2 border-b-4 border-gray-200 space-y-4">
                            <h2 className="font-black text-gray-400 text-xs uppercase tracking-widest">{editingId ? 'Editando Lição' : 'Nova Lição'}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    placeholder="Título..."
                                    className="md:col-span-1 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold focus:border-biblo-blue outline-none"
                                    value={title} onChange={e => setTitle(e.target.value)}
                                />
                                <select className="p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold" value={book} onChange={e => setBook(e.target.value)}>
                                    {bibleBooks.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                <select className="p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold" value={level} onChange={e => setLevel(parseInt(e.target.value))}>
                                    {[1, 2, 3].map(n => <option key={n} value={n}>Nível {n}</option>)}
                                </select>
                            </div>
                        </section>

                        {/* LISTA DE QUESTÕES (Mesma lógica anterior, mas com o botão de salvar no footer) */}
                        {questions?.map((q, qIdx) => (
                            <div key={qIdx} className="bg-white p-6 rounded-3xl border-2 border-b-4 border-gray-200 space-y-4 relative">
                                <div className="flex justify-between items-center">
                                    <span className="bg-biblo-blue text-white px-3 py-1 rounded-full font-black text-[12px]">QUESTÃO {qIdx + 1}</span>
                                    <button onClick={() => removeQuestion(qIdx)} className="text-red-300 font-bold text-xs uppercase hover:text-red-500">Remover</button>
                                </div>
                                <select
                                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-gray-600"
                                    value={q.type} onChange={e => updateQuestion(qIdx, 'type', e.target.value)}
                                >
                                    <option value="multiple_choice">Múltipla Escolha</option>
                                    <option value="true_false">Verdadeiro ou Falso</option>
                                    <option value="order_sequence">Ordenação</option>
                                </select>
                                <textarea
                                    placeholder="Enunciado..."
                                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold outline-none focus:border-biblo-blue resize-none"
                                    value={q.text} onChange={e => updateQuestion(qIdx, 'text', e.target.value)}
                                />

                                {/* Verdadeiro ou Falso */}
                                {q.type === 'true_false' && (
                                    <div className="flex gap-4">
                                        {['Verdadeiro', 'Falso'].map((opt, oIdx) => (
                                            <label key={oIdx} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`correct-${qIdx}`}
                                                    checked={q.answer === opt}
                                                    onChange={() => updateQuestion(qIdx, 'answer', opt)}
                                                />
                                                <span className="font-bold">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {/* Múltipla Escolha */}
                                {q.type === 'multiple_choice' && (
                                    <div className="grid gap-2">
                                        {q.options.map((opt, oIdx) => (
                                            <div key={oIdx} className="flex gap-2">
                                                <input
                                                    type="radio"
                                                    name={`correct-${qIdx}`}
                                                    checked={q.answer === opt && opt !== ''}
                                                    onChange={() => updateQuestion(qIdx, 'answer', opt)}
                                                />
                                                <input
                                                    placeholder={`Opção ${oIdx + 1}`}
                                                    className="flex-1 p-2 border-2 rounded-xl text-sm font-bold"
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
                                )}

                                {/* Ordenação */}
                                {q.type === 'order_sequence' && (
                                    <input
                                        placeholder="Frase para ordenar (ex: No princípio era o Verbo)"
                                        className="w-full p-3 border-2 border-dashed rounded-xl font-bold text-biblo-blue"
                                        onChange={e => {}}
                                    />
                                )}

                                {/* Explicação */}
                                <input
                                    placeholder="Explicação da resposta..."
                                    className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm"
                                    value={q.explanation}
                                    onChange={e => updateQuestion(qIdx, 'explanation', e.target.value)}
                                />
                            </div>
                        ))}

                        <button onClick={addQuestion} className="w-full py-6 border-4 border-dashed border-gray-200 rounded-3xl font-black text-gray-300 hover:text-biblo-blue transition-all uppercase tracking-widest">+ Adicionar Questão</button>

                        <div className="flex gap-3">
                            <button onClick={resetForm} className="flex-1 py-4 bg-gray-200 text-gray-500 font-black rounded-2xl">CANCELAR</button>
                            <button
                                onClick={handleSave}
                                className="flex-[2] py-4 bg-biblo-green text-white font-black rounded-2xl shadow-[0_4px_0_0_#46a302] active:translate-y-1 active:shadow-none transition-all"
                            >
                                {editingId ? 'SALVAR ALTERAÇÕES' : 'PUBLICAR LIÇÃO'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}