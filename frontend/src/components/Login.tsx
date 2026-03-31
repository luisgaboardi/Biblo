import { useState } from 'react'
import { api } from '../services/api'

interface LoginProps {
    onLoginSuccess: (token: string) => void;
    onSwitchToSignup: () => void;
}

export function Login({ onLoginSuccess, onSwitchToSignup }: LoginProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        // 1. Previne IMEDIATAMENTE o comportamento do navegador
        if (e) e.preventDefault();

        // Se já estiver carregando, ignora cliques duplos (comum no celular)
        if (isLoading) return;

        setError('')
        setIsLoading(true)

        try {
            const params = new URLSearchParams()
            params.append('username', username)
            params.append('password', password)

            // Usando a instância centralizada da API
            const response = await api.post('/auth/login', params)

            if (response.data?.access_token) {
                onLoginSuccess(response.data.access_token)
            } else {
                throw new Error('Token não recebido')
            }
        } catch (err: any) {
            console.error("Erro no login:", err); // Ajuda no debug do PC

            if (!err.response) {
                setError('Sem conexão. Verifique o Wi-Fi e o IP do servidor.')
            } else if (err.response.status === 401) {
                setError('Usuário ou senha incorretos.')
            } else {
                setError(err.response?.data?.detail || 'Erro ao entrar.')
            }

            // IMPORTANTE: setIsLoading(false) está no finally, 
            // garantindo que a tela não "destrave" antes da hora.
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fadeIn">
            <div className="max-w-sm w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-biblo-green tracking-tight mb-2">BIBLO</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-wide">Que bom ver você de novo!</p>
                </div>

                {/* onSubmit lida com o Enter do teclado mobile */}
                <form onSubmit={handleSubmit} className="space-y-4 mt-8">
                    <input
                        type="text"
                        placeholder="NOME DE USUÁRIO"
                        autoComplete="username"
                        className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold focus:border-biblo-blue outline-none transition-all disabled:opacity-50"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        placeholder="SENHA"
                        autoComplete="current-password"
                        className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold focus:border-biblo-blue outline-none transition-all disabled:opacity-50"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    {/* Container de Erro com altura reservada */}
                    <div className="h-8 flex items-center justify-center">
                        {error ? (
                            <div
                                key={error}
                                className="w-full bg-red-50 border-2 border-red-100 p-3 rounded-xl animate-shake animate-fadeIn"
                            >
                                <p className="text-red-500 text-xs font-black text-center uppercase tracking-tighter">
                                    {error}
                                </p>
                            </div>
                        ) : (
                            // Um espaçador invisível para manter o layout estático
                            <div className="h-full w-full opacity-0 pointer-events-none" />
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-biblo-blue text-white font-black rounded-2xl shadow-[0_4px_0_0_#1899d6] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all disabled:bg-gray-300 disabled:shadow-none disabled:translate-y-0"
                    >
                        {isLoading ? 'CARREGANDO...' : 'ENTRAR'}
                    </button>
                </form>

                <button
                    type="button" // 2. GARANTE que este botão não submeta o formulário
                    onClick={(e) => {
                        e.preventDefault();
                        onSwitchToSignup();
                    }}
                    className="w-full text-gray-400 font-black text-sm hover:text-gray-600 transition-colors uppercase"
                >
                    Não tem conta? Cadastre-se
                </button>
            </div>
        </div>
    )
}