import { useState, useEffect } from 'react';
import { type Lesson, type LessonListItem } from '../types';
import { useAuth } from '../hooks/useAuth';

import { LessonList } from '../components/admin/LessonList';
import { LessonEditor } from '../components/admin/LessonEditor';
import { StatusModal } from '../components/admin/modals/StatusModal';
import { ConfirmDeleteModal } from '../components/admin/modals/ConfirmDeleteModal';
import { lessonService } from '../services/lessonService';


export function Admin() {
    const { logout } = useAuth();

    // Estados de Controle de Tela
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [currentLesson, setCurrentLesson] = useState<Lesson>({} as Lesson);

    // Estados da Lista e Filtros
    const [lessons, setLessons] = useState<LessonListItem[]>([]);
    const [filterTitle, setFilterTitle] = useState('');
    const [filterBook, setFilterBook] = useState('');
    const [filterLevel, setFilterLevel] = useState('' as any);

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
            const res = await lessonService.getLessons();
            setLessons(res.data);
        } catch (err) {
            console.error("Erro ao carregar lições");
        }
    };

    // Filtro no Frontend
    const filteredLessons = lessons?.filter(l =>
        l.title.toLowerCase().includes(filterTitle.toLowerCase()) &&
        (filterBook === '' || l.book === filterBook) &&
        (filterLevel === '' || l.level === filterLevel)
    );

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const triggerError = (msg: string) => {
        setErrorMessage(msg);
        setStatus('error');
        setTimeout(() => { setStatus('idle'); setErrorMessage(''); }, 2500);
    };

    const handleEdit = async (lessonId: number) => {
        try {
            setIsLoading(true);
            const res = await lessonService.getLessonById(lessonId);
            setCurrentLesson(res.data);
            setView('editor');

        } catch (err) {
            console.error("Erro ao carregar lições");
        }
        finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setCurrentLesson({} as Lesson);
        setView('list');
    };

    const handleSave = async () => {
        // Validações
        if (!currentLesson.title?.trim()) return triggerError("Dê um título para a lição.");
        if (currentLesson.questions?.length === 0) return triggerError("Adicione pelo menos uma questão.");

        for (let i = 0; i < currentLesson.questions?.length; i++) {
            const q = currentLesson.questions[i];
            if (!q.text?.trim()) return triggerError(`Enunciado vazio na Questão ${i + 1}`);
            if (q.type === 'fill_in_the_blank' && !q.text.includes('__')) return triggerError(`Questão ${i + 1} precisa de traços (____)`);
            if (!q.explanation?.trim()) return triggerError(`A Questão ${i + 1} precisa de explicação.`);
        }

        setIsLoading(true);
        try {
            const payload = { title: currentLesson.title, book: currentLesson.book, level: currentLesson.level, questions: currentLesson.questions };
            if (currentLesson.id) await lessonService.updateLesson(currentLesson.id, payload);
            else await lessonService.createLesson(payload);

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
            await lessonService.deleteLesson(idToDelete);
            fetchLessons();
            setShowDeleteModal(false);
            setStatus('success');
            setTimeout(() => setStatus('idle'), 2000);
        } catch (err) {
            setStatus('error');
        }
    };

    // Auxiliares de Questão
    const addQuestion = () => setCurrentLesson(prev => ({ ...prev, questions: [...prev.questions || [], { text: '', type: 'multiple_choice', options: ['', '', '', ''], answer: '', explanation: '' }] }));
    const removeQuestion = (idx: number) => setCurrentLesson(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }));
    const updateQuestion = (idx: number, field: string, value: any) => {
        setCurrentLesson(prev => {
            const updatedQuestions = [...prev.questions];
            (updatedQuestions[idx] as any)[field] = value;
            if (field === 'type') {
                updatedQuestions[idx].answer = value === 'order_sequence' ? [] : '';
                updatedQuestions[idx].options = value === 'multiple_choice' ? ['', '', '', ''] : [];
            }
            return { ...prev, questions: updatedQuestions };
        });
    }

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
                        <button onClick={() => { resetForm(); setView('editor'); }} className={`px-4 py-2 rounded-xl font-bold text-sm cursor-pointer transition-all ${view === 'editor' && !currentLesson.id ? 'bg-biblo-blue text-white shadow-[0_3px_0_0_#1a73e8]' : 'text-gray-400'}`}>+ NOVA</button>
                    </div>
                    <button onClick={handleLogout} className="p-2 bg-gray-50 border-2 border-gray-200 rounded-xl text-xs text-gray-400 cursor-pointer font-bold">SAIR</button>
                </div>
            </header>


            <main className="max-w-4xl mx-auto p-4 mt-4">
                {view === 'list' ? (
                    <LessonList
                        lessons={filteredLessons || []}
                        filters={{ filterTitle, filterBook, filterLevel }}
                        setFilters={{
                            setFilterTitle,
                            setFilterBook,
                            setFilterLevel
                        }}
                        onEdit={handleEdit}
                        onDelete={(id) => { setIdToDelete(id); setShowDeleteModal(true); }}
                    />
                ) : (
                    <LessonEditor
                        lesson={currentLesson}
                        setLesson={setCurrentLesson}
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