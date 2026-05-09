import { Check, X } from "lucide-react";

interface StatusProps {
  status: "idle" | "success" | "error";
  message?: string;
}

export function StatusModal({ status, message }: StatusProps) {
  if (status === "idle") return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white p-8 rounded-3xl shadow-2xl animate-modal text-center border-2 border-gray-100 max-w-sm w-full mx-4">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${status === "success" ? "bg-biblo-green" : "bg-red-500"}`}
        >
          {status === "success" ? (
            <Check className="text-white" size={30} strokeWidth={3} />
          ) : (
            <X className="text-white" size={30} strokeWidth={3} />
          )}
        </div>
        <h2 className="text-xl font-black uppercase text-gray-800">
          {status === "success" ? "Sucesso!" : "Atenção!"}
        </h2>
        <p className="mt-2 text-gray-500 font-bold text-sm leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
