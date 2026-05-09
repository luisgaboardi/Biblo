import { useEffect, useState } from "react";
import { Header } from "@/shared/components/Header";
import { LessonCard } from "@/features/lesson/components/LessonCard";
import type { Lesson, LessonListItem } from "@/types";
import { lessonService } from "@/shared/services/lessonService";
import { BookOpen } from "lucide-react";

interface HomePageProps {
  userData: { xp: number; streak: number; hearts: number };
  onLogout: () => void;
  setActiveLesson: (lesson: Lesson) => void;
}

export function HomePage({
  userData,
  onLogout,
  setActiveLesson,
}: HomePageProps) {
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      const res = await lessonService.getLessons();
      setLessons(res.data);
    } catch {
      console.error("Erro ao carregar lições");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenLesson = async (lessonId: number) => {
    try {
      const res = await lessonService.getLessonById(lessonId);
      setActiveLesson(res.data);
    } catch {
      console.error("Erro ao carregar lição");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] pb-20 animate-fadeIn">
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

        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-gray-100 shadow-sm">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold mt-6 text-lg">
              Carregando suas lições...
            </p>
          </div>
        ) : null}

        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={() => void handleOpenLesson(lesson.id)}
            />
          ))}

          {!isLoading && lessons.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border-2 border-gray-100 shadow-sm">
              <BookOpen className="mx-auto text-gray-300" size={56} />
              <p className="text-gray-400 font-bold mt-6 text-lg">
                Nenhuma lição disponível no momento.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
