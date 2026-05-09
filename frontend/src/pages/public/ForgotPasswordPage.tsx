import { useState, useEffect } from "react";
import { authService } from "@/shared/services/authService";

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Regex para validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validação em tempo real para email
  const validateEmail = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !emailRegex.test(trimmed)) {
      setEmailError("E-mail inválido.");
    } else {
      setEmailError("");
    }

    setError("");
  };

  // Atualiza validação ao mudar email
  useEffect(() => {
    validateEmail(email);
  }, [email]);

  // Verifica se o formulário é válido
  const isFormValid = !emailError && email.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !isFormValid) return;

    setError("");
    setIsLoading(true);

    try {
      await authService.forgotPassword(email.trim());
      setIsSuccess(true);
    } catch (err: unknown) {
      setIsLoading(false);
      const axiosErr = err as {
        response?: { status?: number; data?: { detail?: string } };
      };

      setError(
        axiosErr.response?.data?.detail ||
          "Ocorreu um erro. Tente novamente mais tarde.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black text-biblo-green tracking-tight mb-2">
            BIBLO
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-wide">
            Recuperar Senha
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-biblo-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg
                className="text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                width="32"
                height="32"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase">
              E-mail Enviado!
            </h2>
            <p className="text-gray-500 font-bold">
              Verifique sua caixa de entrada para instruções de recuperação.
            </p>

            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full py-4 mt-8 bg-biblo-blue cursor-pointer text-white font-black rounded-2xl shadow-[0_4px_0_0_#1899d6] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
            >
              VOLTAR AO LOGIN
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="E-MAIL *"
                  autoComplete="email"
                  inputMode="email"
                  className={`w-full p-4 bg-gray-50 border-2 rounded-2xl font-bold focus:outline-none transition-all disabled:opacity-50 ${
                    emailError
                      ? "border-red-500"
                      : "border-gray-200 focus:border-biblo-green"
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => validateEmail(e.target.value)}
                  disabled={isLoading}
                  aria-describedby="email-error"
                />
                {emailError && (
                  <p
                    id="email-error"
                    className="text-red-500 text-xs font-black uppercase tracking-tighter mt-1 animate-fadeIn"
                  >
                    {emailError}
                  </p>
                )}
              </div>

              <div className="h-8 flex items-center justify-center">
                {error && (
                  <div
                    key={error}
                    className="w-full bg-red-50 border-2 border-red-100 p-3 rounded-xl animate-shake"
                  >
                    <p className="text-red-500 text-[10px] font-black text-center uppercase leading-tight">
                      {error}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="w-full py-4 bg-biblo-green cursor-pointer text-white font-black rounded-2xl shadow-[0_4px_0_0_#46a302] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all disabled:bg-gray-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
              >
                {isLoading ? "ENVIANDO..." : "ENVIAR E-MAIL"}
              </button>
            </form>

            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full cursor-pointer text-gray-400 font-black text-sm hover:text-gray-600 transition-colors uppercase"
            >
              Voltar ao login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
