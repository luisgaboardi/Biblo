import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { authService } from "@/shared/services/authService";
import { Eye, EyeOff } from "lucide-react";

// Hook personalizado para debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface LoginPageProps {
  onLoginSuccess: (token: string, refreshToken?: string) => void;
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
}

export function LoginPage({
  onLoginSuccess,
  onSwitchToSignup,
  onSwitchToForgotPassword,
}: LoginPageProps) {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [errorData, setErrorData] = useState({
    username: "",
    password: "",
    general: "",
  });

  const [uiState, setUiState] = useState({
    isLoading: false,
    touched: { username: false, password: false },
    showPassword: false,
    rememberMe: false,
    lastLoginAttempt: 0,
    loginAttempts: 0,
  });

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Validação otimizada para username ou email com sanitização
  const validateUsernameOrEmail = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (trimmed.length < 3) return "Mínimo 3 caracteres.";
    if (trimmed.length > 254) return "Máximo 254 caracteres."; // RFC 5321

    // Sanitização básica contra XSS
    const sanitized = trimmed.replace(/[<>'"&]/g, '');

    // Verifica se é um email válido (mais rigoroso)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (emailRegex.test(sanitized)) {
      return ""; // É um email válido
    }

    // Se não é email, valida como username
    if (!/^[a-zA-Z0-9_.-]+$/.test(sanitized)) return "Apenas letras, números, _ . e -.";
    if (sanitized.includes('..') || sanitized.includes('--') || sanitized.includes('__')) {
      return "Caracteres especiais não podem se repetir.";
    }

    return "";
  }, []);

  // Validação otimizada para password com sanitização
  const validatePassword = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (trimmed.length < 6) return "Mínimo 6 caracteres.";
    if (trimmed.length > 128) return "Máximo 128 caracteres.";

    // Verifica se contém apenas caracteres imprimíveis
    if (/[^\x20-\x7E]/.test(trimmed)) {
      return "Caracteres especiais não permitidos.";
    }

    return "";
  }, []);

  // Debounced validation para melhor performance
  const debouncedUsername = useDebounce(loginData.username, 300);
  const debouncedPassword = useDebounce(loginData.password, 300);

  // Estados de erro calculados com debounce
  const currentUsernameError = useMemo(
    () => validateUsernameOrEmail(debouncedUsername),
    [debouncedUsername, validateUsernameOrEmail],
  );
  const currentPasswordError = useMemo(
    () => validatePassword(debouncedPassword),
    [debouncedPassword, validatePassword],
  );

  // Auto-focus no primeiro campo quando componente monta
  useEffect(() => {
    if (usernameRef.current && !uiState.isLoading) {
      usernameRef.current.focus();
    }
  }, [uiState.isLoading]);

  // Detecta status online/offline
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Verifica se o formulário é válido
  const isFormValid = useMemo(() => {
    return (
      !currentUsernameError &&
      !currentPasswordError &&
      loginData.username.trim() &&
      loginData.password.trim() &&
      !uiState.isLoading
    );
  }, [
    currentUsernameError,
    currentPasswordError,
    loginData.username,
    loginData.password,
    uiState.isLoading,
  ]);

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginData((prev) => ({ ...prev, username: e.target.value }));
      setErrorData((prev) => ({ ...prev, general: "" })); // Limpa erro geral ao digitar
    },
    [],
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginData((prev) => ({ ...prev, password: e.target.value }));
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

  const handlePasswordBlur = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      touched: { ...prev.touched, password: true },
    }));
    setErrorData((prev) => ({ ...prev, password: currentPasswordError }));
  }, [currentPasswordError]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (uiState.isLoading || !isFormValid) return;

    // Proteção contra spam de login (máximo 3 tentativas por minuto)
    const now = Date.now();
    if (now - uiState.lastLoginAttempt < 60000 && uiState.loginAttempts >= 3) {
      setErrorData((prev) => ({
        ...prev,
        general: "Muitas tentativas. Aguarde 1 minuto antes de tentar novamente."
      }));
      return;
    }

    // Validação final antes do submit
    const finalUsernameError = validateUsernameOrEmail(loginData.username);
    const finalPasswordError = validatePassword(loginData.password);

    if (finalUsernameError || finalPasswordError) {
      setErrorData((prev) => ({
        ...prev,
        username: finalUsernameError,
        password: finalPasswordError,
      }));
      setUiState((prev) => ({
        ...prev,
        touched: { username: true, password: true },
      }));
      return;
    }

    setErrorData((prev) => ({ ...prev, general: "" }));
    setUiState((prev) => ({
      ...prev,
      isLoading: true,
      lastLoginAttempt: now,
      loginAttempts: prev.loginAttempts + 1
    }));

    try {
      const { accessToken, refreshToken } = await authService.login(
        loginData.username.trim(),
        loginData.password.trim(),
      );

      if (!accessToken) {
        throw new Error("Token de acesso não recebido");
      }

      // Salva remember me se selecionado
      if (uiState.rememberMe) {
        localStorage.setItem('biblo_remember_me', JSON.stringify({
          username: loginData.username.trim(),
          timestamp: Date.now()
        }));
      } else {
        localStorage.removeItem('biblo_remember_me');
      }

      // Analytics: login successful
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'login', {
          method: 'email',
          success: true
        });
      }

      onLoginSuccess(accessToken, refreshToken);
    } catch (err: unknown) {
      console.error("Erro no login:", err);

      const axiosErr = err as {
        response?: {
          status?: number;
          data?: { detail?: string; message?: string };
        };
        message?: string;
      };

      let errorMessage = "Ocorreu um erro. Tente novamente mais tarde.";

      if (!navigator.onLine) {
        errorMessage = "Sem conexão com a internet. Verifique sua conexão.";
      } else if (axiosErr.response?.status === 401) {
        errorMessage = "Usuário ou senha incorretos.";
      } else if (axiosErr.response?.status === 429) {
        errorMessage = "Muitas tentativas. Tente novamente em alguns minutos.";
      } else if (axiosErr.response?.status === 500) {
        errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
      } else if (axiosErr.response?.data?.detail) {
        errorMessage = axiosErr.response.data.detail;
      } else if (axiosErr.response?.data?.message) {
        errorMessage = axiosErr.response.data.message;
      } else if (axiosErr.message) {
        errorMessage = axiosErr.message;
      }

      // Analytics: login failed
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'login', {
          method: 'email',
          success: false,
          error: errorMessage
        });
      }

      setErrorData((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setUiState((prev) => ({ ...prev, isLoading: false }));
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
            Que bom ver você de novo!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8" noValidate>
          <div>
            <label htmlFor="username" className="sr-only">
              Nome de usuário ou e-mail
            </label>
            <input
              id="username"
              type="text"
              placeholder="USUÁRIO OU E-MAIL *"
              autoComplete="username"
              inputMode="text"
              autoCapitalize="none"
              className={`w-full p-4 bg-gray-50 border-2 rounded-2xl font-bold focus:outline-none transition-all disabled:opacity-50 ${
                errorData.username
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-biblo-blue"
              }`}
              value={loginData.username}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  passwordRef.current?.focus();
                }
              }}
              ref={usernameRef}
              disabled={uiState.isLoading}
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
            <label htmlFor="password" className="sr-only">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={uiState.showPassword ? "text" : "password"}
                placeholder="SENHA *"
                autoComplete="current-password"
                className={`w-full p-4 bg-gray-50 border-2 rounded-2xl font-bold focus:outline-none transition-all disabled:opacity-50 pr-12 ${
                  errorData.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-biblo-blue"
                }`}
                value={loginData.password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                ref={passwordRef}
                disabled={uiState.isLoading}
                aria-invalid={!!errorData.password}
                aria-describedby={
                  errorData.password ? "password-error" : undefined
                }
                required
              />
              <button
                type="button"
                onClick={() => setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                className="absolute right-4 top-1/2 cursor-pointer transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                disabled={uiState.isLoading}
                aria-label={uiState.showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {uiState.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uiState.rememberMe}
                onChange={(e) => setUiState(prev => ({ ...prev, rememberMe: e.target.checked }))}
                className="w-4 h-4 text-biblo-blue bg-gray-100 border-gray-300 rounded focus:ring-biblo-blue focus:ring-2"
                disabled={uiState.isLoading}
              />
              <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                Lembrar de mim
              </span>
            </label>
          </div>

          <div className="h-8 flex items-center justify-center">
            {errorData.general && (
              <div
                key={errorData.general}
                className="w-full bg-red-50 border-2 border-red-100 p-3 rounded-xl animate-shake"
                role="alert"
              >
                <p className="text-red-500 text-[10px] font-black text-center uppercase leading-tight">
                  {errorData.general}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || !isOnline}
            className={`w-full py-4 cursor-pointer text-white font-black rounded-2xl shadow-[0_4px_0_0_#1899d6] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all disabled:bg-gray-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-biblo-blue focus:ring-offset-2 ${
              !isOnline ? 'bg-gray-400' : ''
            }`}
            aria-describedby={!isFormValid ? "submit-disabled" : !isOnline ? "offline-disabled" : undefined}
          >
            {uiState.isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                CARREGANDO...
              </span>
            ) : !isOnline ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L5.636 18.364m12.728-12.728L18.364 18.364M12 3a9 9 0 100 18 9 9 0 000-18z" />
                </svg>
                SEM CONEXÃO
              </span>
            ) : (
              "ENTRAR"
            )}
          </button>
          {!isFormValid && !uiState.isLoading && isOnline && (
            <p id="submit-disabled" className="sr-only">
              Preencha todos os campos corretamente para continuar
            </p>
          )}
          {!isOnline && (
            <p id="offline-disabled" className="text-center text-gray-500 text-xs font-bold uppercase mt-2">
              Verifique sua conexão com a internet
            </p>
          )}
        </form>

        <div className="space-y-4">
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="w-full cursor-pointer text-biblo-blue underline font-black text-sm hover:text-biblo-blue/80 focus:text-biblo-blue/80 transition-colors uppercase focus:outline-none focus:ring-2 focus:ring-biblo-blue focus:ring-offset-2 rounded-md p-1"
            aria-label="Ir para página de cadastro"
          >
            Não tem conta? Cadastre-se
          </button>

          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="w-full cursor-pointer text-gray-400 font-black text-sm hover:text-gray-600 focus:text-gray-600 transition-colors uppercase focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-md p-1"
            aria-label="Ir para página de recuperação de senha"
          >
            Esqueci minha senha
          </button>
        </div>
      </div>
    </div>
  );
}
