export function EndLessonScreen() {
  return (
    <div className="min-h-screen animate-fadeIn flex items-center justify-center bg-gray-50 p-6 fixed inset-0 z-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        <div className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
          <span className="text-biblo-green">Livro</span>
          <span className="text-gray-300">•</span>
          <span className="text-biblo-blue">Level</span>
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-4">Título</h2>

        <p className="text-gray-500 mb-8 leading-relaxed">
          Parabéns! <br />
          Você acertou X de Y!
        </p>

        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => {}}
            className="w-full bg-biblo-green cursor-pointer text-white font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform shadow-lg shadow-green-100"
          >
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
}
