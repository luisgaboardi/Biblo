import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { type Question, type Lesson } from '../types';
import { useAuth } from '../hooks/useAuth';

// Importação dos novos componentes refatorados
import { LessonList } from '../components/admin/LessonList';
import { LessonEditor } from '../components/admin/LessonEditor';
import { StatusModal } from '../components/admin/modals/StatusModal';
import { ConfirmDeleteModal } from '../components/admin/modals/ConfirmDeleteModal';

export function Admin() {
    const { logout } = useAuth();

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
    const [questions, setQuestions] = useState<Question[]>([]);

    // Estados Globais de Feedback
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Estados para o Modal de Exclusão
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);

    useEffect(() => {
        if (view === 'list') fetchLessons();
    }, [view]);

    const fetchLessons = async () => {
        try {
            const res = await api.get('/lessons/no-shuffle');
            setLessons(res.data);
        } catch (err) {
            console.error("Erro ao carregar lições");
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    // Filtro no Frontend
    const filteredLessons = lessons.filter(l =>
        l.title.toLowerCase().includes(filterTitle.toLowerCase()) &&
        (filterBook === '' || l.book === filterBook) &&
        (filterLevel === '' || l.level === filterLevel)
    );

    const triggerError = (msg: string) => {
        setErrorMessage(msg);
        setStatus('error');
        setTimeout(() => { setStatus('idle'); setErrorMessage(''); }, 3000);
    };

    const handleEdit = (lesson: Lesson) => {
        setEditingId(lesson.id);
        setTitle(lesson.title);
        setBook(lesson.book);
        setLevel(lesson.level);
        setQuestions(lesson.questions);
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
        // Validações
        if (!title.trim()) return triggerError("Dê um título para a lição.");
        if (questions.length === 0) return triggerError("Adicione pelo menos uma questão.");

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.text.trim()) return triggerError(`Enunciado vazio na Questão ${i + 1}`);
            if (q.type === 'fill_in_the_blank' && !q.text.includes('__')) return triggerError(`Questão ${i + 1} precisa de traços (____)`);
            if (!q.explanation?.trim()) return triggerError(`A Questão ${i + 1} precisa de explicação.`);
        }

        setIsLoading(true);
        try {
            const payload = { title, book, level, questions };
            if (editingId) await api.put(`/lessons/${editingId}`, payload);
            else await api.post('/lessons', payload);

            setStatus('success');
            setTimeout(() => { setStatus('idle'); resetForm(); }, 2000);
        } catch (err: any) {
            triggerError(err.response?.data?.detail || "Erro ao salvar lição.");
        } finally {
            setIsLoading(false);
        }
    };

    const executeDelete = async () => {
        if (!idToDelete) return;
        try {
            await api.delete(`/lessons/${idToDelete}`);
            fetchLessons();
            setShowDeleteModal(false);
            setStatus('success');
            setTimeout(() => setStatus('idle'), 2000);
        } catch (err) {
            setStatus('error');
        }
    };

    // Auxiliares de Questão
    const addQuestion = () => setQuestions([...questions, { text: '', type: 'multiple_choice', options: ['', '', '', ''], answer: '', explanation: '' }]);
    const removeQuestion = (idx: number) => setQuestions(questions.filter((_, i) => i !== idx));
    const updateQuestion = (idx: number, field: keyof Question, val: any) => {
        setQuestions(prev => {
            const newQs = [...prev];
            newQs[idx] = { ...newQs[idx], [field]: val };
            // Reset de campos ao mudar o tipo
            if (field === 'type') {
                newQs[idx].answer = val === 'order_sequence' ? [] : '';
                newQs[idx].options = val === 'multiple_choice' ? ['', '', '', ''] : [];
            }
            return newQs;
        });
    };

    return (
        <div className="min-h-screen bg-[#f7f7f7] pb-20">
            {/* Modais Globais */}
            <StatusModal status={status} message={errorMessage} />
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onConfirm={executeDelete}
                onCancel={() => setShowDeleteModal(false)}
            />

            {/* Header com Abas */}
            <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 flex justify-between items-center h-16">
                    <h1 className="text-xl font-black text-biblo-green tracking-tighter">BIBLO ADMIN</h1>
                    <div className="flex gap-2">
                        <button onClick={() => setView('list')} className={`px-4 py-2 rounded-xl font-bold text-sm cursor-pointer transition-all ${view === 'list' ? 'bg-biblo-blue text-white shadow-[0_3px_0_0_#1a73e8]' : 'text-gray-400'}`}>LISTA</button>
                        <button onClick={() => { resetForm(); setView('editor'); }} className={`px-4 py-2 rounded-xl font-bold text-sm cursor-pointer transition-all ${view === 'editor' && !editingId ? 'bg-biblo-blue text-white shadow-[0_3px_0_0_#1a73e8]' : 'text-gray-400'}`}>+ NOVA</button>
                    </div>
                    <button onClick={handleLogout} className="p-2 bg-gray-50 border-2 border-gray-200 rounded-xl text-xs text-gray-400 cursor-pointer font-bold">SAIR</button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 mt-4">
                {view === 'list' ? (
                    <LessonList
                        lessons={filteredLessons}
                        filters={{ filterTitle, filterBook, filterLevel }}
                        setFilters={{
                            setFilterTitle,
                            setFilterBook,
                            setFilterLevel: (val) => setFilterLevel(val)
                        }}
                        onEdit={handleEdit}
                        onDelete={(id) => { setIdToDelete(id); setShowDeleteModal(true); }}
                    />
                ) : (
                    <LessonEditor
                        editingId={editingId}
                        title={title} setTitle={setTitle}
                        book={book} setBook={setBook}
                        level={level} setLevel={setLevel}
                        questions={questions}
                        addQuestion={addQuestion}
                        removeQuestion={removeQuestion}
                        updateQuestion={updateQuestion}
                        onSave={handleSave}
                        onCancel={resetForm}
                        isLoading={isLoading}
                    />
                )}
            </main>
        </div>
    );
}