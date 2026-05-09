import { TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  icon?: LucideIcon;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "red" | "blue" | "green";
}

export function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "Excluir Item?",
  message = "Esta ação não pode ser desfeita. Deseja mesmo apagar este conteúdo?",
  icon: Icon = TriangleAlert,
  confirmText = "Sim, excluir",
  cancelText = "Cancelar",
  confirmColor = "red",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const confirmButtonClasses = {
    red: "bg-red-500 shadow-[0_4px_0_0_#b91c1c] active:shadow-none",
    blue: "bg-biblo-blue shadow-[0_4px_0_0_#1a73e8] active:shadow-none",
    green: "bg-biblo-green shadow-[0_4px_0_0_#46a302] active:shadow-none",
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-md animate-fadeIn p-6">
      <div className="bg-white p-8 rounded-[32px] shadow-2xl animate-modal w-full max-w-sm text-center border-2 border-gray-100">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
          confirmColor === "red" ? "bg-red-100" :
          confirmColor === "blue" ? "bg-blue-100" :
          "bg-green-100"
        }`}>
          <Icon className={`${
            confirmColor === "red" ? "text-red-500" :
            confirmColor === "blue" ? "text-biblo-blue" :
            "text-biblo-green"
          }`} size={36} />
        </div>

        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          {title}
        </h2>
        <p className="text-gray-500 font-bold mt-2 text-sm leading-relaxed">
          {message}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full py-4 text-white font-black rounded-2xl active:translate-y-1 transition-all uppercase tracking-wider cursor-pointer ${confirmButtonClasses[confirmColor]}`}
          >
            {confirmText}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-4 bg-gray-100 text-gray-500 font-black rounded-2xl border-2 border-b-4 border-gray-200 active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider cursor-pointer"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Mantém compatibilidade com o nome antigo
export const ConfirmDeleteModal = ConfirmModal;
