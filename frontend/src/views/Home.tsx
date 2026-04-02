import { useEffect, useState } from 'react';
import { Header } from '../components/Header'
import { LessonCard } from '../components/LessonCard'
import type { Lesson, LessonListItem } from '../types'
import { lessonService } from '../services/lessonService';

interface HomeProps {
    userData: { xp: number; streak: number; hearts: number };
    onLogout: () => void;
    setActiveLesson: (lesson: Lesson) => void; // Opcional, para abrir o Quiz
}

export function Home({ userData, onLogout, setActiveLesson }: HomeProps) {

    const [lessons, setLessons] = useState<LessonListItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        fetchLessons();
    }, []);

    const fetchLessons = async () => {
        try {
            const res = await lessonService.getLessons();
            setLessons(res.data);
        } catch (err) {
            console.error("Erro ao carregar lições");
        }
    };

    const handleOpenLesson = async (lessonId: number) => {
        try {
            setIsLoading(true);
            const res = await lessonService.getLessonById(lessonId);
            setActiveLesson(res.data);

        } catch (err) {
            console.error("Erro ao carregar lição");
        }
        finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-white z-50 fixed inset-0">
            <div className="text-center">
                <div className="text-5xl font-black text-biblo-green animate-pulse tracking-tighter">BIBLO</div>
                <div className="text-gray-400 font-bold mt-2 uppercase text-xs tracking-widest">Carregando lição...</div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#f7f7f7] pb-20 animate-fadeIn">
            {/* Cabeçalho Principal */}
            <Header
                hearts={userData?.hearts}
                streak={userData?.streak}
                xp={userData?.xp}
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
                            onClick={() => handleOpenLesson(lesson.id)}
                        />
                    ))}

                    {lessons.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-3xl border-2 border-gray-100 shadow-sm">
                            <span className="text-6xl">📖</span>
                            <p className="text-gray-400 font-bold mt-6 text-lg">
                                Nenhuma lição disponível no momento.
                            </p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}