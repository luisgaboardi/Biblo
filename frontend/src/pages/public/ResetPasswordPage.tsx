import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/shared/services/authService";

interface ResetPasswordPageProps {}

export function ResetPasswordPage({}: ResetPasswordPageProps) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validação em tempo real para password
  const validatePassword = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && trimmed.length < 6) {
      setPasswordError("Mínimo 6 caracteres.");
    } else {
      setPasswordError("");
    }

    setError("");
  };

  // Validação em tempo real para confirm password
  const validateConfirmPassword = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== password.trim()) {
      setConfirmPasswordError("As senhas não coincidem.");
    } else {
      setConfirmPasswordError("");
    }

    setError("");
  };

  // Atualiza validações ao mudar valores
  useEffect(() => {
    validatePassword(password);
  }, [password]);

  useEffect(() => {
    validateConfirmPassword(confirmPassword);
  }, [confirmPassword, password]);

  // Verifica se o formulário é válido
  const isFormValid =
    !passwordError &&
    !confirmPasswordError &&
    password.trim() &&
    confirmPassword.trim() &&
    password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !isFormValid || !token) return;

    setError("");
    setIsLoading(true);

    try {
      await authService.resetPassword(token, password.trim());
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

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fadeIn">
        <div className="max-w-sm w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-black text-biblo-green tracking-tight mb-2">
              BIBLO
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-wide">
              Link Inválido
            </p>
          </div>

          <div className="text-center space-y-4">
            <p className="text-gray-500 font-bold">
              O link de recuperação é inválido ou expirou.
            </p>
            <a
              href="/login"
              className="w-full py-4 block text-center bg-biblo-blue cursor-pointer text-white font-black rounded-2xl shadow-[0_4px_0_0_#1899d6] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
            >
              Voltar ao Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black text-biblo-green tracking-tight mb-2">
            BIBLO
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-wide">
            Redefinir Senha
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase">
              Senha Alterada!
            </h2>
            <p className="text-gray-500 font-bold">
              Sua senha foi redefinida com sucesso.
            </p>

            <a
              href="/login"
              className="w-full py-4 block text-center mt-8 bg-biblo-blue cursor-pointer text-white font-black rounded-2xl shadow-[0_4px_0_0_#1899d6] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
            >
              FAZER LOGIN
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="NOVA SENHA *"
                  autoComplete="new-password"
                  className={`w-full p-4 bg-gray-50 border-2 rounded-2xl font-bold focus:outline-none transition-all disabled:opacity-50 ${
                    passwordError
                      ? "border-red-500"
                      : "border-gray-200 focus:border-biblo-blue"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={(e) => validatePassword(e.target.value)}
                  disabled={isLoading}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && (
                <p
                  id="password-error"
                  className="text-red-500 text-xs font-black uppercase tracking-tighter mt-1 animate-fadeIn"
                >
                  {passwordError}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="CONFIRMAR SENHA *"
                  autoComplete="new-password"
                  className={`w-full p-4 bg-gray-50 border-2 rounded-2xl font-bold focus:outline-none transition-all disabled:opacity-50 ${
                    confirmPasswordError
                      ? "border-red-500"
                      : "border-gray-200 focus:border-biblo-blue"
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={(e) => validateConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  aria-describedby="confirm-password-error"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={
                    showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {confirmPasswordError && (
                <p
                  id="confirm-password-error"
                  className="text-red-500 text-xs font-black uppercase tracking-tighter mt-1 animate-fadeIn"
                >
                  {confirmPasswordError}
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
              className="w-full py-4 bg-biblo-blue cursor-pointer text-white font-black rounded-2xl shadow-[0_4px_0_0_#1899d6] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all disabled:bg-gray-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
            >
              {isLoading ? "ALTERANDO..." : "ALTERAR SENHA"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
