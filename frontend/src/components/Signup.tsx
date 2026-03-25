import { useState } from 'react'
import axios from 'axios'

interface SignupProps {
  onSignupSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function Signup({ onSignupSuccess, onSwitchToLogin }: SignupProps) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8000/auth/signup', formData)
      onSignupSuccess()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao criar conta.')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black text-biblo-green tracking-tight mb-2">CRIAR PERFIL</h1>
          <p className="text-gray-500 font-bold">Comece sua jornada bíblica hoje!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <input
            type="text"
            placeholder="NOME DE USUÁRIO"
            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold outline-none focus:border-biblo-green"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="E-MAIL"
            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold outline-none focus:border-biblo-green"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="SENHA"
            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold outline-none focus:border-biblo-green"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 cursor-pointer bg-biblo-green text-white font-black rounded-2xl shadow-[0_4px_0_0_#46a302] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all"
          >
            CRIAR CONTA
          </button>
        </form>

        <button
          onClick={onSwitchToLogin}
          className="w-full text-gray-400 cursor-pointer font-black text-sm hover:text-gray-600"
        >
          JÁ TEM CONTA? FAÇA LOGIN
        </button>
      </div>
    </div>
  )
}