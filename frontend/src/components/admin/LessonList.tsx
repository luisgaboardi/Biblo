import { bibleBooks, type LessonListItem } from '../../types';


interface LessonListProps {
    lessons: LessonListItem[];
    filters: {
        filterTitle: string;
        filterBook: string;
        filterLevel: number;
    };
    setFilters: {
        setFilterTitle: (val: string) => void;
        setFilterBook: (val: string) => void;
        setFilterLevel: (val: number) => void;
    };
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export function LessonList({ lessons, filters, setFilters, onEdit, onDelete }: LessonListProps) {
    return (
        <div className="space-y-6 animate-fadeIn">
            {/* FILTROS */}
            <section className="bg-white p-4 rounded-2xl border-2 border-b-4 border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                    placeholder="🔍 Buscar título..."
                    className="p-3 bg-gray-50 rounded-xl border-2 border-gray-100 outline-none focus:border-biblo-blue font-bold text-sm"
                    value={filters.filterTitle}
                    onChange={e => setFilters.setFilterTitle(e.target.value)}
                />
                <select
                    className="p-3 bg-gray-50 rounded-xl border-2 border-gray-100 font-bold text-sm text-gray-500 cursor-pointer"
                    value={filters.filterBook}
                    onChange={e => setFilters.setFilterBook(e.target.value)}
                >
                    <option value="">Todos os Livros</option>
                    {bibleBooks.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select
                    className="p-3 bg-gray-50 rounded-xl border-2 border-gray-100 font-bold text-sm text-gray-500 cursor-pointer"
                    value={filters.filterLevel}
                    onChange={e => setFilters.setFilterLevel(e.target.value ? parseInt(e.target.value) : '' as any)}
                >
                    <option value="">Todos os Níveis</option>
                    <option value={1}>Nível 1</option>
                    <option value={2}>Nível 2</option>
                    <option value={3}>Nível 3</option>
                </select>
            </section>

            {/* TABELA / CARDS */}
            <div className="grid gap-3">

                {/* Se não houver lições, exibir mensagem */}
                {lessons?.length === 0 && (
                    <div className="bg-white p-4 rounded-2xl border-2 border-b-4 border-gray-200 text-center">
                        <p className="text-gray-500">Nenhuma lição encontrada.</p>
                    </div>
                )}

                {lessons?.map(lesson => (
                    <div key={lesson.id} className="bg-white p-4 rounded-2xl border-2 border-b-4 border-gray-200 flex justify-between items-center hover:border-gray-300 transition-all">
                        <div>
                            <h3 className="font-black text-gray-800">{lesson.title}</h3>
                            <div className="flex gap-2 mt-1">
                                <span className="text-[10px] font-black bg-blue-100 text-biblo-blue px-2 py-0.5 rounded-full uppercase">{lesson.book}</span>
                                <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase">Lvl {lesson.level}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => onEdit(lesson.id)} className="p-2 text-biblo-blue hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">✏️</button>
                            <button onClick={() => onDelete(lesson.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">🗑️</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}