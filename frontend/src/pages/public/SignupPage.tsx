import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { authService } from "@/shared/services/authService";
import { Check, Eye, EyeOff } from "lucide-react";
import { StatusModal } from "@/features/admin/modals/StatusModal";

interface SignupPageProps {
  onSignupSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function SignupPage({
  onSignupSuccess,
  onSwitchToLogin,
}: SignupPageProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorData, setErrorData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const [uiState, setUiState] = useState({
    isLoading: false,
    isSuccess: false,
    touched: {
      username: false,
      email: false,
      password: false,
      confirmPassword: false,
    },
    showPassword: false,
    showConfirmPassword: false,
  });

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  // Validação otimizada para username
  const validateUsername = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (trimmed.length < 3) return "Mínimo 3 caracteres.";
    if (trimmed.length > 50) return "Máximo 50 caracteres.";
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return "Apenas letras, números e _.";
    return "";
  }, []);

  // Validação otimizada para email
  const validateEmail = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return "E-mail inválido.";
    return "";
  }, []);

  // Validação otimizada para password
  const validatePassword = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (trimmed.length < 6) return "Mínimo 6 caracteres.";
    if (trimmed.length > 128) return "Máximo 128 caracteres.";
    return "";
  }, []);

  // Validação otimizada para confirmPassword
  const validateConfirmPassword = useCallback(
    (value: string, password: string) => {
      const trimmed = value.trim();
      if (!trimmed) return "";
      if (trimmed !== password.trim()) return "Senhas não coincidem.";
      return "";
    },
    [],
  );

  // Estados de erro calculados
  const currentUsernameError = useMemo(
    () => validateUsername(formData.username),
    [formData.username, validateUsername],
  );
  const currentEmailError = useMemo(
    () => validateEmail(formData.email),
    [formData.email, validateEmail],
  );
  const currentPasswordError = useMemo(
    () => validatePassword(formData.password),
    [formData.password, validatePassword],
  );
  const currentConfirmPasswordError = useMemo(
    () => validateConfirmPassword(formData.confirmPassword, formData.password),
    [formData.confirmPassword, formData.password, validateConfirmPassword],
  );

  // Atualiza erros apenas quando os campos são tocados
  useEffect(() => {
    if (uiState.touched.username) {
      setErrorData((prev) => ({ ...prev, username: currentUsernameError }));
    }
  }, [currentUsernameError, uiState.touched.username]);

  useEffect(() => {
    if (uiState.touched.email) {
      setErrorData((prev) => ({ ...prev, email: currentEmailError }));
    }
  }, [currentEmailError, uiState.touched.email]);

  useEffect(() => {
    if (uiState.touched.password) {
      setErrorData((prev) => ({ ...prev, password: currentPasswordError }));
    }
  }, [currentPasswordError, uiState.touched.password]);

  useEffect(() => {
    if (uiState.touched.confirmPassword) {
      setErrorData((prev) => ({
        ...prev,
        confirmPassword: currentConfirmPasswordError,
      }));
    }
  }, [currentConfirmPasswordError, uiState.touched.confirmPassword]);

  // Verifica se o formulário é válido
  const isFormValid = useMemo(() => {
    return (
      !currentUsernameError &&
      !currentEmailError &&
      !currentPasswordError &&
      !currentConfirmPasswordError &&
      formData.username.trim() &&
      formData.email.trim() &&
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      !uiState.isLoading &&
      !uiState.isSuccess
    );
  }, [
    currentUsernameError,
    currentEmailError,
    currentPasswordError,
    currentConfirmPasswordError,
    formData.username,
    formData.email,
    formData.password,
    formData.confirmPassword,
    uiState.isLoading,
    uiState.isSuccess,
  ]);

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, username: e.target.value }));
      setErrorData((prev) => ({ ...prev, general: "" })); // Limpa erro geral ao digitar
    },
    [],
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, email: e.target.value }));
      setErrorData((prev) => ({ ...prev, general: "" })); // Limpa erro geral ao digitar
    },
    [],
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, password: e.target.value }));
      setErrorData((prev) => ({ ...prev, general: "" })); // Limpa erro geral ao digitar
    },
    [],
  );

  const handleConfirmPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }));
      setErrorData((prev) => ({ ...prev, general: "" })); // Limpa erro geral ao digitar
    },
    [],
  );

  const handleUsernameBlur = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      touched: { ...prev.touched, username: true },
    }));
    setErrorData((prev) => ({ ...prev, username: currentUsernameError }));
  }, [currentUsernameError]);

  const handleEmailBlur = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      touched: { ...prev.touched, email: true },
    }));
    setErrorData((prev) => ({ ...prev, email: currentEmailError }));
  }, [currentEmailError]);

  const handlePasswordBlur = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      touched: { ...prev.touched, password: true },
    }));
    setErrorData((prev) => ({ ...prev, password: currentPasswordError }));
  }, [currentPasswordError]);

  const handleConfirmPasswordBlur = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      touched: { ...prev.touched, confirmPassword: true },
    }));
    setErrorData((prev) => ({
      ...prev,
      confirmPassword: currentConfirmPasswordError,
    }));
  }, [currentConfirmPasswordError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uiState.isLoading || uiState.isSuccess || !isFormValid) return;

    // Validação final antes do submit
    const finalUsernameError = validateUsername(formData.username);
    const finalEmailError = validateEmail(formData.email);
    const finalPasswordError = validatePassword(formData.password);
    const finalConfirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
      formData.password,
    );

    if (
      finalUsernameError ||
      finalEmailError ||
      finalPasswordError ||
      finalConfirmPasswordError
    ) {
      setErrorData((prev) => ({
        ...prev,
        username: finalUsernameError,
        email: finalEmailError,
        password: finalPasswordError,
        confirmPassword: finalConfirmPasswordError,
      }));
      setUiState((prev) => ({
        ...prev,
        touched: {
          username: true,
          email: true,
          password: true,
          confirmPassword: true,
        },
      }));
      return;
    }

    setErrorData((prev) => ({ ...prev, general: "" }));
    setUiState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authService.signup({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      setUiState((prev) => ({ ...prev, isLoading: false, isSuccess: true }));
      if ("vibrate" in navigator) navigator.vibrate([30, 50, 30]);

      setTimeout(() => {
        onSignupSuccess();
      }, 2500);
    } catch (err: unknown) {
      setUiState((prev) => ({ ...prev, isLoading: false }));

      if ("vibrate" in navigator) navigator.vibrate(50);

      const axiosErr = err as { response?: { data?: { detail?: string } } };
      let errorMessage = "Ocorreu um erro. Tente novamente mais tarde.";

      if (!axiosErr.response) {
        errorMessage = "Erro de conexão. O servidor está offline?";
      } else if (axiosErr.response?.data?.detail) {
        errorMessage = axiosErr.response.data.detail;
      } else {
        errorMessage = "Este nome ou e-mail já está em uso.";
      }

      setErrorData((prev) => ({ ...prev, general: errorMessage }));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fadeIn relative">
      {uiState.isSuccess && (
        <StatusModal status="success" message="Conta criada com sucesso!" />
      )}

      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-black text-biblo-green tracking-tight mb-2 uppercase">
            Criar Perfil
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-wide text-sm">
            A Bíblia de um jeito novo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="username"
              type="text"
              placeholder="NOME DE USUÁRIO *"
              autoComplete="username"
              inputMode="text"
              autoCapitalize="none"
              className={`w-full p-4 bg-gray-50 border-2 rounded-2xl font-bold focus:outline-none transition-all disabled:opacity-50 ${
                errorData.username
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-biblo-green"
              }`}
              value={formData.username}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  emailRef.current?.focus();
                }
              }}
              disabled={uiState.isLoading || uiState.isSuccess}
              aria-invalid={!!errorData.username}
              aria-describedby={
                errorData.username ? "username-error" : undefined
              }
              required
            />
            {errorData.username && (
              <p
                id="username-error"
                className="text-red-500 text-xs font-black uppercase tracking-tighter mt-1 animate-fadeIn"
                role="alert"
              >
                {errorData.username}
              </p>
            )}
          </div>

          <div>
            <input
              id="email"
              type="email"
              placeholder="E-MAIL *"
              autoComplete="email"
              inputMode="email"
              className={`w-full p-4 bg-gray-50 border-2 rounded-2xl font-bold focus:outline-none transition-all disabled:opacity-50 ${
                errorData.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-biblo-green"
              }`}
              value={formData.email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  passwordRef.current?.focus();
                }
              }}
              ref={emailRef}
              disabled={uiState.isLoading || uiState.isSuccess}
              aria-invalid={!!errorData.email}
              aria-describedby={errorData.email ? "email-error" : undefined}
              required
            />
            {errorData.email && (
              <p
                id="email-error"
                className="text-red-500 text-xs font-black uppercase tracking-tighter mt-1 animate-fadeIn"
                role="alert"
              >
                {errorData.email}
              </p>
            )}
          </div>

          <div className={`relative ${errorData.password ? "mb-1" : ""}`}>
            <input
              id="password"
              type={uiState.showPassword ? "text" : "password"}
              placeholder="SENHA *"
              autoComplete="new-password"
              className={`w-full p-4 bg-gray-50 border-2 rounded-2xl font-bold focus:outline-none transition-all disabled:opacity-50 pr-12 ${
                errorData.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-biblo-green"
              }`}
              value={formData.password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  confirmPasswordRef.current?.focus();
                }
              }}
              ref={passwordRef}
              disabled={uiState.isLoading || uiState.isSuccess}
              aria-invalid={!!errorData.password}
              aria-describedby={
                errorData.password ? "password-error" : undefined
              }
              required
            />
            <button
              type="button"
              onClick={() =>
                setUiState((prev) => ({
                  ...prev,
                  showPassword: !prev.showPassword,
                }))
              }
              className="absolute cursor-pointer p-2 right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              disabled={uiState.isLoading || uiState.isSuccess}
              aria-label={
                uiState.showPassword ? "Ocultar senha" : "Mostrar senha"
              }
            >
              {uiState.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errorData.password && (
              <p
                id="password-error"
                className="text-red-500 text-xs font-black uppercase tracking-tighter mt-1 animate-fadeIn"
                role="alert"
              >
                {errorData.password}
              </p>
            )}
          </div>

          <div
            className={`relative ${errorData.confirmPassword ? "mb-1" : ""}`}
          >
            <input
              id="confirmPassword"
              type={uiState.showConfirmPassword ? "text" : "password"}
              placeholder="CONFIRMAR SENHA *"
              autoComplete="new-password"
              className={`w-full p-4 bg-gray-50 border-2 rounded-2xl font-bold focus:outline-none transition-all disabled:opacity-50 pr-12 ${
                errorData.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-biblo-green"
              }`}
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
              ref={confirmPasswordRef}
              disabled={uiState.isLoading || uiState.isSuccess}
              aria-invalid={!!errorData.confirmPassword}
              aria-describedby={
                errorData.confirmPassword ? "confirm-password-error" : undefined
              }
              required
            />
            <button
              type="button"
              onClick={() =>
                setUiState((prev) => ({
                  ...prev,
                  showConfirmPassword: !prev.showConfirmPassword,
                }))
              }
              className="absolute cursor-pointer p-2 right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              disabled={uiState.isLoading || uiState.isSuccess}
              aria-label={
                uiState.showConfirmPassword
                  ? "Ocultar confirmação de senha"
                  : "Mostrar confirmação de senha"
              }
            >
              {uiState.showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
            {errorData.confirmPassword && (
              <p
                id="confirm-password-error"
                className="text-red-500 text-xs font-black uppercase tracking-tighter mt-1 animate-fadeIn"
                role="alert"
              >
                {errorData.confirmPassword}
              </p>
            )}
          </div>

          <div className="h-8 flex items-center justify-center">
            {errorData.general && (
              <div
                key={errorData.general}
                className="w-full bg-red-50 border-2 border-red-100 p-3 rounded-xl animate-shake"
              >
                <p className="text-red-500 text-[10px] font-black text-center uppercase leading-tight">
                  {errorData.general}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={uiState.isLoading || uiState.isSuccess || !isFormValid}
            className={`w-full py-4 cursor-pointer text-white font-black rounded-2xl transition-all shadow-[0_4px_0_0] active:translate-y-1 active:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed
              ${uiState.isLoading || uiState.isSuccess || !isFormValid ? "bg-gray-300 shadow-none" : "bg-biblo-green shadow-[#46a302] hover:brightness-110"}`}
          >
            {uiState.isLoading ? "CRIANDO..." : "CRIAR CONTA"}
          </button>
        </form>

        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full text-biblo-blue underline cursor-pointer font-black text-sm hover:text-gray-600 transition-colors uppercase"
        >
          Já tem conta? Faça login
        </button>
      </div>
    </div>
  );
}
