import { useState, useEffect } from 'react'
import type { Lesson } from '../types';

interface QuizProps {
    lesson: Lesson;
    onClose: (correct: number, total: number) => void;
}

export function Quiz({ lesson, onClose }: QuizProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<any>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [correctCount, setCorrectCount] = useState(0);

    // Garante que questions seja sempre um array para evitar erro de .length
    const questions = lesson.content?.questions || [];
    const currentQuestion = questions[currentIndex];

    useEffect(() => {
        setSelectedOption(null);
        setIsCorrect(null);
        window.scrollTo(0, 0);
    }, [currentIndex]);

    const progressWidth = questions.length > 0
        ? Math.max((currentIndex / questions.length) * 100, 0)
        : 0;

    const handleCheck = () => {
        if (!currentQuestion) return;

        let correct = false;
        const userValue = selectedOption;
        const dbAnswer = currentQuestion.answer;

        // Lógica de verificação robusta
        if (currentQuestion.type === 'order_sequence') {
            const userArr = Array.isArray(userValue) ? userValue : [];
            const correctArr = Array.isArray(dbAnswer) ? dbAnswer : [];
            correct = userArr.length === correctArr.length &&
                userArr.every((v, i) => String(v).trim() === String(correctArr[i]).trim());
        }
        else if (currentQuestion.type === 'true_false') {
            // Converte strings "Verdadeiro"/"Falso" para boolean se necessário
            const normalizedUser = userValue === 'Verdadeiro' || userValue === true;
            correct = normalizedUser === dbAnswer;
        }
        else {
            // Para múltipla escolha e preenchimento de lacuna
            const cleanUser = String(userValue || "").trim().toLowerCase();
            const cleanDb = String(dbAnswer || "").trim().toLowerCase();
            correct = cleanUser === cleanDb;
        }

        if (correct) setCorrectCount(prev => prev + 1);
        setIsCorrect(correct);

        // Scroll suave para a parte de baixo da tela, onde o feedback (#explanation) é mostrado
        setTimeout(() => {
            const explanationEl = document.getElementById('explanation');
            if (explanationEl) {
                explanationEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);

    };

    const handleNext = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Retorna o resultado final para o App.tsx salvar no banco
            onClose(correctCount + (isCorrect ? 1 : 0), questions.length);
        }
    };

    const toggleOrder = (word: string) => {
        if (isCorrect !== null) return;
        const currentSelection = Array.isArray(selectedOption) ? selectedOption : [];
        if (currentSelection.includes(word)) {
            setSelectedOption(currentSelection.filter(w => w !== word));
        } else {
            setSelectedOption([...currentSelection, word]);
        }
    };

    const formatAnswer = (ans: string | boolean | string[] | Record<string, string>) => {
        if (typeof ans === 'boolean') {
            return ans ? 'Verdadeiro' : 'Falso';
        }
        // Primeira letra maiúscula para respostas de texto
        if (typeof ans === 'string') {
            return ans.charAt(0).toUpperCase() + ans.slice(1);
        }
        // Para arrays de strings
        if (Array.isArray(ans)) {
            return ans.join(', ');
        }
        // Para objetos (associação)
        if (typeof ans === 'object') {
            return Object.entries(ans).map(([k, v]) => `${k} → ${v}`).join('; ');
        }

        return String(ans);

    };

    // Dentro do componente Quiz, antes do return:
    const isButtonDisabled = () => {
        if (isCorrect !== null) return false; // Se já respondeu, o botão "Continuar" nunca está disabled
        if (!selectedOption) return true;     // Se não selecionou nada, está disabled

        if (currentQuestion.type === 'order_sequence') {
            const userSelection = Array.isArray(selectedOption) ? selectedOption : [];
            const originalSequence = currentQuestion.sequence || [];
            // Só habilita se o usuário selecionou TODAS as palavras disponíveis
            return userSelection.length !== originalSequence.length;
        }

        // Para outros tipos, basta ter algo selecionado/digitado
        return !selectedOption;
    };

    if (!currentQuestion) return null;

    return (
        <div className="fixed inset-0 bg-white flex flex-col animate-fadeIn select-none z-50">
            {/* HEADER */}
            <header className="w-full max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
                <button
                    onClick={() => onClose(0, 0)}
                    className="p-2 text-gray-400 cursor-pointer hover:text-gray-600 font-bold text-2xl"
                >
                    ✕
                </button>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-biblo-green transition-all duration-500"
                        style={{ width: `${progressWidth}%` }}
                    />
                </div>
                <div className="font-black text-red-500 text-sm flex items-center gap-1">
                    ❤️ 5
                </div>
            </header>

            {/* CONTEÚDO */}
            <main className="flex-1 overflow-y-auto px-6 py-4">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-black text-gray-800 mb-8">
                        {currentQuestion.text}
                    </h2>

                    <div className="grid gap-3">
                        {/* Múltipla Escolha e Verdadeiro/Falso */}
                        {(['multiple_choice', 'true_false'].includes(currentQuestion.type)) && (
                            (currentQuestion.type === 'true_false' ? ['Verdadeiro', 'Falso'] : (currentQuestion.options || [])).map((opt: string) => {

                                let buttonStyles = 'border-gray-200 bg-white text-gray-700';

                                const isSelected = selectedOption === opt;

                                if (isCorrect !== null) {
                                    if (isSelected) {
                                        buttonStyles = isCorrect
                                            ? 'border-biblo-green bg-green-50 text-biblo-green'
                                            : 'border-red-500 bg-red-50 text-red-500';
                                    }
                                } else if (isSelected) {
                                    buttonStyles = 'border-biblo-blue bg-blue-50 text-biblo-blue';
                                }

                                return (
                                    <button
                                        key={opt}
                                        disabled={isCorrect !== null}
                                        onClick={() => setSelectedOption(opt)}
                                        className={`p-4 rounded-2xl cursor-pointer border-2 border-b-4 text-left font-bold transition-all ${buttonStyles}`}
                                    >
                                        {opt}
                                    </button>
                                );
                            })
                        )}


                        {/* Input de Texto */}
                        {currentQuestion.type === 'fill_in_the_blank' && (
                            <input
                                type="text"
                                placeholder="Toque para digitar..."
                                disabled={isCorrect !== null}
                                className="w-full p-5 border-2 border-b-4 rounded-2xl text-xl font-bold focus:border-biblo-blue outline-none bg-gray-50 uppercase"
                                value={selectedOption || ''}
                                onChange={e => setSelectedOption(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && selectedOption) {
                                        handleCheck();
                                    }
                                }}
                            />
                        )}

                        {/* Ordenação */}
                        {currentQuestion.type === 'order_sequence' && (
                            <div className="space-y-6">
                                <div className="flex flex-wrap gap-2 min-h-[80px] p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    {Array.isArray(selectedOption) && selectedOption.map((word, idx) => (
                                        <button key={idx} onClick={() => toggleOrder(word)} className="bg-white border-2 border-b-4 cursor-pointer p-2 rounded-xl font-bold shadow-sm">
                                            {word}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {(currentQuestion.sequence || []).map((word: string, idx: number) => (
                                        <button
                                            key={idx}
                                            disabled={isCorrect !== null || (Array.isArray(selectedOption) && selectedOption.includes(word))}
                                            onClick={() => toggleOrder(word)}
                                            className={`p-2 border-2 border-b-4 rounded-xl font-bold transition-all 
                                                ${Array.isArray(selectedOption) && selectedOption.includes(word) ? 'opacity-20 cursor-default' : 'bg-white cursor-pointer'}`}
                                        >
                                            {word}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* EXPLICAÇÃO */}
                <div className="max-w-2xl mx-auto" id='explanation'>
                    {isCorrect !== null && currentQuestion.explanation && (
                        <div className="mt-12 p-4 bg-gray-100 rounded-xl border-l-4 border-gray-300 animate-fadeIn">
                            <h3 className="font-bold text-lg mb-2">Explicação:</h3>
                            <p className="text-gray-700">{currentQuestion.explanation}</p>
                        </div>
                    )}
                </div>
            </main>

            {/* FOOTER ADAPTATIVO */}
            <footer className={`p-6 border-t-2 transition-colors ${isCorrect === null ? 'bg-white' : isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="max-w-2xl mx-auto flex flex-col gap-4">
                    {isCorrect !== null && (
                        <div className="flex items-center gap-3 animate-bounce">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold ${isCorrect ? 'bg-biblo-green' : 'bg-red-500'}`}>
                                {isCorrect ? '✓' : '✕'}
                            </div>
                            <div>
                                <p className={`font-black text-xl ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                    {isCorrect ? 'Muito bem!' : 'Ops, a resposta era:'}
                                </p>
                                {!isCorrect && <p className="text-red-600 font-bold">{formatAnswer(currentQuestion.answer)}</p>}
                            </div>
                        </div>
                    )}
                    <button
                        onClick={isCorrect === null ? handleCheck : handleNext}
                        disabled={isButtonDisabled()}
                        className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-[0_4px_0_0] active:translate-y-1 active:shadow-none
        ${isCorrect === null
                                ? (isButtonDisabled()
                                    ? 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed'
                                    : 'bg-biblo-blue text-white shadow-blue-700 cursor-pointer')
                                : (isCorrect
                                    ? 'bg-biblo-green text-white shadow-green-700 cursor-pointer'
                                    : 'bg-red-500 text-white shadow-red-700 cursor-pointer')
                            }`}
                    >
                        {isCorrect === null ? 'VERIFICAR' : 'CONTINUAR'}
                    </button>
                </div>
            </footer>
        </div>
    );
}