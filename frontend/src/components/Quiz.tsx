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

    const questions = lesson.content.questions || [];
    const currentQuestion = questions[currentIndex];

    useEffect(() => {
        setSelectedOption(null);
        setIsCorrect(null);
    }, [currentIndex]);

    // Cálculo da largura da barra (Garante que nunca seja NaN e comece em pelo menos 0%)
    const progressWidth = questions.length > 0
        ? Math.max((currentIndex / questions.length) * 100, 0)
        : 0;

    const handleCheck = () => {
        let correct = false;
        if (currentQuestion.type === 'order_sequence') {
            const userSelection = Array.isArray(selectedOption) ? selectedOption : [];
            const correctAnswer = (currentQuestion.answer as unknown as string[]) || [];
            if (userSelection.length === correctAnswer.length) {
                correct = userSelection.every((val, index) => val?.trim() === correctAnswer[index]?.trim());
            }
        } else if (currentQuestion.type === 'true_false') {
            const selectedValue = selectedOption === 'Verdadeiro' ? true : selectedOption === 'Falso' ? false : selectedOption;
            correct = selectedValue === currentQuestion.answer;
        } else {
            const answer = String(selectedOption || "").trim().toLowerCase();
            const expected = String(currentQuestion.answer || "").trim().toLowerCase();
            correct = answer === expected;
        }

        if (correct) setCorrectCount(prev => prev + 1);
        setIsCorrect(correct);
    };

    const handleNext = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onClose(correctCount, questions.length);
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

    if (!currentQuestion) return null;

    return (
        <div className="fixed inset-0 bg-white flex flex-col animate-fadeIn select-none overflow-hidden">
            {/* 1. HEADER COMPACTO (Apenas progresso no Quiz) */}
            <div className="w-full max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
                <button
                    onClick={() => onClose(0, 0)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <span className="text-2xl font-bold">✕</span>
                </button>

                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                    <div
                        className="h-full bg-biblo-green transition-all duration-700 ease-out rounded-full"
                        style={{ width: `${progressWidth}%` }}
                    />
                </div>

                {/* Mostramos os corações aqui no Quiz, estilo Duolingo */}
                <div className="flex items-center gap-1 font-black text-red-500 text-sm">
                    ❤️ 5
                </div>
            </div>

            {/* 2. ÁREA DE CONTEÚDO SCROLLABLE */}
            <main className="flex-1 overflow-y-auto px-4 py-2 sm:px-6">
                <div className="max-w-2xl mx-auto pb-32"> {/* pb-32 para o conteúdo não ficar atrás do footer */}
                    <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-6 leading-tight">
                        {currentQuestion.text}
                    </h2>

                    <div className="grid gap-2 sm:gap-3">
                        {/* Opções de Múltipla Escolha / True-False */}
                        {(currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false') && (
                            (currentQuestion.type === 'true_false' ? ['Verdadeiro', 'Falso'] : (currentQuestion.options || [])).map((opt) => (
                                <button
                                    key={opt}
                                    disabled={isCorrect !== null}
                                    onClick={() => setSelectedOption(opt)}
                                    className={`p-4 rounded-xl sm:rounded-2xl border-2 border-b-4 text-left font-bold text-base sm:text-lg transition-all active:translate-y-1 active:border-b-2
                                        ${selectedOption === opt
                                            ? 'border-bibloBlue bg-blue-50 text-bibloBlue'
                                            : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'}`}
                                >
                                    {opt}
                                </button>
                            ))
                        )}

                        {/* Input de Texto - Melhoria para Mobile Keyboard */}
                        {currentQuestion.type === 'fill_in_the_blank' && (
                            <input
                                type="text"
                                placeholder="Escreva aqui..."
                                disabled={isCorrect !== null}
                                className="w-full p-4 sm:p-6 border-2 border-b-4 rounded-2xl sm:rounded-3xl text-lg sm:text-xl font-bold focus:border-biblo-blue outline-none bg-gray-50"
                                value={typeof selectedOption === 'string' ? selectedOption : ''}
                                onChange={e => setSelectedOption(e.target.value)}
                            />
                        )}

                        {/* Sequence Order - Layout Flex-Wrap para Mobile */}
                        {currentQuestion.type === 'order_sequence' && (
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2 min-h-[60px] p-3 justify-center border-b-2 border-dashed border-gray-200">
                                    {Array.isArray(selectedOption) && selectedOption.map((word, idx) => (
                                        <button
                                            key={`sel-${idx}`}
                                            onClick={() => toggleOrder(word)}
                                            className="bg-white border-2 border-b-4 border-gray-200 rounded-xl px-3 py-1.5 text-sm sm:text-base font-bold active:translate-y-1 active:border-b-2"
                                        >
                                            {word}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {(currentQuestion.sequence || []).map((word: string, idx: number) => {
                                        const isSelected = Array.isArray(selectedOption) && selectedOption.includes(word);
                                        return (
                                            <button
                                                key={`opt-${idx}`}
                                                disabled={isSelected || isCorrect !== null}
                                                onClick={() => toggleOrder(word)}
                                                className={`px-3 py-1.5 border-2 border-b-4 rounded-xl text-sm sm:text-base font-bold transition-all 
                                                    ${isSelected ? 'opacity-20 grayscale' : 'bg-white border-gray-200 active:translate-y-1 active:border-b-2'}`}
                                            >
                                                {word}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {isCorrect !== null && currentQuestion.explanation && (
                        <div className='mt-6 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 italic text-gray-600 text-sm animate-fadeIn'>
                            💡 {currentQuestion.explanation}
                        </div>
                    )}
                </div>
            </main>

            {/* 3. FOOTER FIXO (Sempre visível) */}
            <footer className={`safe-area-bottom py-4 sm:py-8 px-4 sm:px-6 border-t-2 transition-all duration-300 
                ${isCorrect === null ? 'bg-white' : isCorrect ? 'bg-[#d7ffb8]' : 'bg-[#ffdfe0]'}`}>
                <div className="max-w-2xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">

                    {/* Mensagem de Feedback - Escondida no mobile enquanto seleciona para ganhar espaço */}
                    {isCorrect !== null && (
                        <div className="flex items-center gap-3 w-full sm:w-auto animate-fadeIn">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${isCorrect ? 'bg-biblo-green' : 'bg-red-500'}`}>
                                {isCorrect ? '✓' : '✕'}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-black text-lg sm:text-xl leading-none ${isCorrect ? 'text-[#46a302]' : 'text-[#ea2b2b]'}`}>
                                    {isCorrect ? 'Excelente!' : 'A resposta era:'}
                                </h3>
                                {!isCorrect && <p className="text-[#ea2b2b] font-bold text-xs sm:text-sm mt-1">
                                    {Array.isArray(currentQuestion.answer) ? currentQuestion.answer.join(', ') : String(currentQuestion.answer)}
                                </p>}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={isCorrect === null ? handleCheck : handleNext}
                        disabled={isCorrect === null && (
                            currentQuestion.type === 'order_sequence'
                                ? (!Array.isArray(selectedOption) || selectedOption.length === 0)
                                : !selectedOption
                        )}
                        className={`w-full sm:w-auto px-12 py-4 rounded-2xl font-black tracking-wider transition-all shadow-[0_4px_0_0] active:translate-y-1 active:shadow-none
                            ${isCorrect === null
                                ? (!selectedOption ? 'bg-gray-200 text-gray-400 shadow-none' : 'bg-[#1899d6] text-white shadow-[#1279ab]')
                                : (isCorrect ? 'bg-[#46a302] text-white shadow-[#3a8602]' : 'bg-[#ea2b2b] text-white shadow-[#b81d1d]')
                            }`}
                    >
                        {isCorrect === null ? 'VERIFICAR' : 'CONTINUAR'}
                    </button>
                </div>
            </footer>
        </div>
    );
}