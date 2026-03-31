import { useState } from 'react'
import { api } from '../services/api'

interface SignupProps {
  onSignupSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function Signup({ onSignupSuccess, onSwitchToLogin }: SignupProps) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false) // Novo estado para o Modal

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading || isSuccess) return

    setError('')
    setIsLoading(true)

    try {
      await api.post('/auth/signup', formData)

      // Ativa o feedback de sucesso
      setIsSuccess(true)
      if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);

      // Aguarda 2 segundos para o usuário ver o modal e então muda de tela
      setTimeout(() => {
        onSignupSuccess()
      }, 2500)

    } catch (err: any) {
      if ('vibrate' in navigator) navigator.vibrate(50);
      setIsLoading(false)

      if (!err.response) {
        setError('Erro de conexão. O servidor está offline?')
      } else {
        setError(err.response?.data?.detail || 'Este nome ou e-mail já está em uso.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fadeIn relative">

      {/* MODAL DE SUCESSO (OVERLAY) */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm animate-fadeIn">
          <div className="text-center p-8 bg-white rounded-3xl shadow-2xl border-2 border-biblo-green animate-bounce">
            <div className="w-20 h-20 bg-biblo-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-4xl font-bold">✓</span>
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase italic">Conta Criada!</h2>
            <p className="text-gray-500 font-bold mt-2">Preparando seu acesso...</p>
          </div>
        </div>
      )}

      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-black text-biblo-green tracking-tight mb-2 uppercase">Criar Perfil</h1>
          <p className="text-gray-500 font-bold uppercase tracking-wide text-sm">A Bíblia de um jeito novo.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="NOME DE USUÁRIO"
            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold outline-none focus:border-biblo-green transition-all"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            disabled={isLoading || isSuccess}
          />
          <input
            type="email"
            placeholder="E-MAIL"
            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold outline-none focus:border-biblo-green transition-all"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isLoading || isSuccess}
          />
          <input
            type="password"
            placeholder="SENHA"
            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold outline-none focus:border-biblo-green transition-all"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading || isSuccess}
          />

          {/* Espaço reservado para o erro (evita pulos no layout) */}
          <div className="h-8 flex items-center justify-center">
            {error && (
              <div key={error + Math.random()} className="w-full bg-red-50 border-2 border-red-100 p-3 rounded-xl animate-shake">
                <p className="text-red-500 text-[10px] font-black text-center uppercase leading-tight">{error}</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className={`w-full py-4 cursor-pointer text-white font-black rounded-2xl transition-all shadow-[0_4px_0_0] active:translate-y-1 active:shadow-none
              ${isLoading || isSuccess ? 'bg-gray-300 shadow-none' : 'bg-biblo-green shadow-[#46a302] hover:brightness-110'}`}
          >
            {isLoading ? 'CRIANDO...' : 'CRIAR CONTA'}
          </button>
        </form>

        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full text-gray-400 cursor-pointer font-black text-sm hover:text-gray-600 transition-colors uppercase"
        >
          Já tem conta? Faça login
        </button>
      </div>
    </div>
  )
}