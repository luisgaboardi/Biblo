interface HeaderProps {
    hearts: number;
    streak: number;
    xp: number;
    onLogout: () => void;
}

export function Header({ hearts, streak, xp, onLogout }: HeaderProps) {
    return (
        <header className="bg-white border-b-2 border-gray-200 py-3 sticky top-0 z-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 flex justify-between items-center">

                {/* Logo - Escondemos em telas MUITO pequenas se necessário, ou diminuímos */}
                <h1 className="text-xl sm:text-2xl font-black text-biblo-green tracking-tighter">
                    BIBLO
                </h1>

                {/* Container de Stats */}
                <div className="flex items-center gap-3 sm:gap-6 font-black text-sm">

                    {/* Stats Individuais com Breakpoints */}
                    <div className="flex items-center gap-1">
                        <span className="text-orange-500 text-lg">🔥</span>
                        <span className="text-orange-600">{streak}</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <span className="text-biblo-blue text-lg">✨</span>
                        <span className="text-biblo-blue-dark">{xp}</span>
                        <span className="hidden xs:inline text-biblo-blue-dark">XP</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <span className="text-red-500 text-lg">❤️</span>
                        <span className="text-red-600">{hearts}</span>
                    </div>

                    {/* Botão Sair - No Mobile, podemos usar apenas um ícone ou estilo minimalista */}
                    <button
                        onClick={onLogout}
                        className="ml-1 hover:bg-gray-200 p-2 bg-gray-50 border-2 cursor-pointer border-gray-200 rounded-xl active:translate-y-0.5 active:border-b-2 transition-all"
                        aria-label="Sair"
                    >
                        <span className="text-xs text-gray-400">SAIR</span>
                    </button>
                </div>
            </div>
        </header>
    );
}