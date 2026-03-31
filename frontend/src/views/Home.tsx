import { Header } from '../components/Header'
import { LessonCard } from '../components/LessonCard'
import type { Lesson } from '../types'

interface HomeProps {
    userStats: { xp: number; streak: number; hearts: number };
    lessons: Lesson[];
    onLogout: () => void;
    onSelectLesson: (lesson: Lesson) => void;
}

export function Home({ userStats, lessons, onLogout, onSelectLesson }: HomeProps) {
    return (
        <div className="min-h-screen bg-[#f7f7f7] pb-20 animate-fadeIn">
            {/* Cabeçalho Principal */}
            <Header
                hearts={userStats.hearts}
                streak={userStats.streak}
                xp={userStats.xp}
                onLogout={onLogout}
            />

            <main className="max-w-2xl mx-auto px-4 mt-8">
                <h2 className="text-xl font-black text-gray-500 uppercase tracking-widest mb-6 px-2">
                    Suas Lições
                </h2>

                <div className="grid gap-4">
                    {lessons.map(lesson => (
                        <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            // Ao clicar, avisa o App.tsx para abrir o Quiz
                            onClick={() => onSelectLesson(lesson)}
                        />
                    ))}

                    {lessons.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-3xl border-2 border-gray-100 shadow-sm">
                            <span className="text-6xl">📖</span>
                            <p className="text-gray-400 font-bold mt-6 text-lg">
                                Nenhuma lição disponível no momento.
                            </p>
                            <p className="text-gray-400 text-sm">Verifique o painel Admin.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}