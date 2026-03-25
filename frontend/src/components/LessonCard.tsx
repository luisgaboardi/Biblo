import type { Lesson } from '../types';

interface LessonCardProps {
    lesson: Lesson;
    onClick: (lesson: Lesson) => void;
}

export function LessonCard({ lesson, onClick }: LessonCardProps) {
    return (
        <button
            onClick={() => onClick(lesson)}
            className="w-full bg-white cursor-pointer border-2 border-gray-200 border-b-[6px] rounded-2xl p-4 sm:p-5 text-left active:translate-y-1 active:border-b-2 transition-all flex items-center gap-4 group"
        >
            {/* Container de Texto: 'flex-1' garante que o texto ocupe o máximo de espaço sem empurrar o botão para fora */}
            <div className="flex-1 min-w-0">
                <div className='flex justify-between items-center mb-1'>
                    <p className="text-[10px] sm:text-xs font-black text-biblo-blue uppercase truncate">
                        {lesson.books.join(', ')}
                    </p>
                    {/* Dificuldade visível apenas se houver espaço ou em versão compacta */}
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        Lvl {lesson.level}
                    </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight line-clamp-2">
                    {lesson.title}
                </h3>
            </div>

            {/* Botão de Ação: Tamanho fixo para não esmagar */}
            <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-biblo-green flex items-center justify-center text-white group-hover:brightness-110 transition-all">
                <span className="ml-1 mb-1 text-base sm:text-lg">▶</span>
            </div>
        </button>
    );
}