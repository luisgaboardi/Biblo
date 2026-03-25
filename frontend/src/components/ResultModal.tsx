interface ResultModalProps {
    xp: number;
    streak: number;
    onClose: () => void;
}

export function ResultModal({ xp, streak, onClose }: ResultModalProps) {
    return (
        /* O segredo está no fixed inset-0 e z-[100] */
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop: Escurece o fundo */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose} />

            {/* Conteúdo do Modal */}
            <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_8px_0_0_#e5e5e5] border-2 border-gray-200 animate-popIn">
                <h2 className="text-3xl font-black text-biblo-green mb-6">LIÇÃO CONCLUÍDA!</h2>

                <div className="flex justify-around mb-8">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2">✨</span>
                        <span className="text-sm font-black text-gray-400 uppercase">XP Ganho</span>
                        <span className="text-2xl font-black text-biblo-blue">+{xp}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl mb-2">🔥</span>
                        <span className="text-sm font-black text-gray-400 uppercase">Ofensiva</span>
                        <span className="text-2xl font-black text-orange-500">{streak}</span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full py-4 bg-biblo-green text-white font-black rounded-2xl shadow-[0_4px_0_0_#46a302] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                    CONTINUAR
                </button>
            </div>
        </div>
    );
}