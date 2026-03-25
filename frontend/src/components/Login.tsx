import { useState } from 'react'
import axios from 'axios'

interface LoginProps {
    onLoginSuccess: (token: string) => void;
    onSwitchToSignup: () => void;
}

export function Login({ onLoginSuccess, onSwitchToSignup }: LoginProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append('username', username)
            formData.append('password', password)

            const response = await axios.post('http://localhost:8000/auth/login', formData)
            onLoginSuccess(response.data.access_token)
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Erro ao entrar. Verifique suas credenciais.')
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fadeIn">
            <div className="max-w-sm w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-biblo-green tracking-tight mb-2">BIBLO</h1>
                    <p className="text-gray-500 font-bold">Que bom ver você de novo!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-8">
                    <input
                        type="text"
                        placeholder="NOME DE USUÁRIO"
                        className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold focus:border-bibloBlue outline-none transition-all"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="SENHA"
                        className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold focus:border-bibloBlue outline-none transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full cursor-pointer py-4 bg-biblo-blue text-white font-black rounded-2xl shadow-[0_4px_0_0_#1899d6] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
                    >
                        ENTRAR
                    </button>
                </form>

                <button
                    onClick={onSwitchToSignup}
                    className="w-full text-gray-400 cursor-pointer font-black text-sm hover:text-gray-600 transition-colors"
                >
                    NÃO TEM CONTA? CADASTRE-SE
                </button>
            </div>
        </div>
    )
}