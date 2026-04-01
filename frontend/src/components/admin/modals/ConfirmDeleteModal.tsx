interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDeleteModal({ isOpen, onConfirm, onCancel }: ConfirmDeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-md animate-fadeIn p-6">
            <div className="bg-white p-8 rounded-[32px] shadow-2xl animate-modal w-full max-w-sm text-center border-2 border-gray-100">
                {/* Ícone de Alerta */}
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                    <span className="text-red-500 mb-1 text-4xl">⚠️</span>
                </div>

                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                    Excluir Lição?
                </h2>
                <p className="text-gray-500 font-bold mt-2 text-sm leading-relaxed">
                    Esta ação não pode ser desfeita. <br />
                    Deseja mesmo apagar este conteúdo?
                </p>

                <div className="mt-8 flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        className="w-full py-4 bg-red-500 text-white font-black rounded-2xl shadow-[0_4px_0_0_#b91c1c] active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider cursor-pointer"
                    >
                        Sim, excluir
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full py-4 bg-gray-100 text-gray-500 font-black rounded-2xl border-2 border-b-4 border-gray-200 active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider cursor-pointer"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}