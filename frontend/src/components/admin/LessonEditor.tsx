import { bibleBooks } from '../../types';
import type { Question } from '../../types';
import { QuestionEditorItem } from './QuestionEditorItem';

interface LessonEditorProps {
    editingId: number | null;
    title: string;
    setTitle: (val: string) => void;
    book: string;
    setBook: (val: string) => void;
    level: number;
    setLevel: (val: number) => void;
    questions: Question[];
    addQuestion: () => void;
    removeQuestion: (idx: number) => void;
    updateQuestion: (idx: number, field: keyof Question, val: any) => void;
    onSave: () => void;
    onCancel: () => void;
    isLoading: boolean;
}

export function LessonEditor({
    editingId,
    title,
    setTitle,
    book,
    setBook,
    level,
    setLevel,
    questions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    onSave,
    onCancel,
    isLoading
}: LessonEditorProps) {
    return (
        <div className="space-y-6 animate-fadeIn">
            {/* CABEÇALHO DA LIÇÃO */}
            <section className="bg-white p-6 rounded-3xl border-2 border-b-4 border-gray-200 space-y-4 shadow-sm">
                <h2 className="font-black text-gray-400 text-xs uppercase tracking-widest">
                    {editingId ? '🛠️ Editando Lição' : '✨ Nova Lição'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        placeholder="Título da lição..."
                        className="md:col-span-1 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold focus:border-biblo-blue outline-none transition-all"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <select
                        className="p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold cursor-pointer text-gray-700"
                        value={book}
                        onChange={e => setBook(e.target.value)}
                    >
                        {bibleBooks.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select
                        className="p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold cursor-pointer text-gray-700"
                        value={level}
                        onChange={e => setLevel(parseInt(e.target.value))}
                    >
                        {[1, 2, 3].map(n => <option key={n} value={n}>Nível {n}</option>)}
                    </select>
                </div>
            </section>

            {/* LISTA DE QUESTÕES */}
            <div className="space-y-6">
                {questions.map((q, idx) => (
                    <QuestionEditorItem
                        key={idx}
                        q={q}
                        index={idx}
                        updateQuestion={updateQuestion}
                        removeQuestion={removeQuestion}
                    />
                ))}
            </div>

            {/* BOTÃO ADICIONAR */}
            <button
                onClick={addQuestion}
                className="w-full py-6 border-4 border-dashed border-gray-200 rounded-3xl font-black text-gray-300 hover:text-biblo-blue hover:border-biblo-blue/30 transition-all uppercase tracking-widest cursor-pointer bg-white/50"
            >
                + Adicionar Questão
            </button>

            {/* AÇÕES FINAIS */}
            <div className="flex gap-3 pt-4">
                <button
                    onClick={onCancel}
                    className="flex-1 py-4 bg-gray-200 text-gray-500 font-black rounded-2xl hover:bg-gray-300 transition-colors cursor-pointer"
                >
                    CANCELAR
                </button>
                <button
                    onClick={onSave}
                    disabled={isLoading}
                    className={`flex-[2] py-4 text-white font-black rounded-2xl transition-all uppercase tracking-wider
                        ${isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-biblo-green shadow-[0_4px_0_0_#46a302] active:translate-y-1 active:shadow-none cursor-pointer'
                        }`}
                >
                    {isLoading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Publicar Lição'}
                </button>
            </div>
        </div>
    );
}