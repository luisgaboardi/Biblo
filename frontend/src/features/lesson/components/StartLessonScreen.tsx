import type { Lesson } from '@/types';

interface StartLessonScreenProps {
  lesson: Lesson;
  onStart: () => void;
  onCancel: () => void;
}

export function StartLessonScreen({ lesson, onStart, onCancel }: StartLessonScreenProps) {
  return (
    <div className="min-h-screen animate-fadeIn flex items-center justify-center bg-gray-50 p-6 fixed inset-0 z-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">

        <div className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
          <span className="text-biblo-green">{lesson.book}</span>
          <span className="text-gray-300">•</span>
          <span className="text-biblo-blue">Level {lesson.level}</span>
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-4">{lesson.title}</h2>

        <p className="text-gray-500 mb-8 leading-relaxed">
          Você está prestes a iniciar esta jornada. <br />
          Responda com atenção para fixar o aprendizado!
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onStart}
            className="w-full bg-biblo-green cursor-pointer text-white font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform shadow-lg shadow-green-100"
          >
            PRONTO PARA COMEÇAR
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full text-gray-400 cursor-pointer font-semibold py-2 hover:text-gray-600 transition-colors"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
