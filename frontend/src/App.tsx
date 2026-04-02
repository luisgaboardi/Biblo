import { useEffect, useState } from 'react'
import { Login } from './views/Login'
import { Signup } from './views/Signup'
import { Quiz } from './views/Quiz'

// Nossas Views Principais
import { Home } from './views/Home'

// Lógica Centralizada
import { useAuth } from './hooks/useAuth'
import { userService } from './services/userService'
import type { Lesson } from './types'
import { Admin } from './views/Admin'

export default function App() {
  // --- ESTADO GLOBAL DA SESSÃO ---
  const { token, login, logout } = useAuth()
  const [authView, setAuthView] = useState<'login' | 'signup'>('login')

  // --- ESTADO DE DADOS DA APP ---
  const [userData, setUserData] = useState(null as any)
  const [loading, setLoading] = useState(false)

  // --- ESTADO DE UI (Modais/Overlays) ---
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)

  // Carrega dados quando o token existe
  useEffect(() => {
    if (token) {
      fetchUserData()
    }
  }, [token])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      const userData = await userService.getProfile();
      setUserData(userData)
    } catch (err) {
      console.error("Erro ao buscar dados do usuário", err)
      logout()
    } finally {
      setLoading(false)
    }
  }

  // Lógica de finalização do Quiz (Salva no Banco e abre Modal)
  const handleFinishQuiz = async (correct: number, total: number) => {
    setActiveLesson(null) // Fecha o Quiz
  }

  // --- ROTEADOR (Renderização Condicional de Views) ---

  // 1. Loading Global
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white z-50 fixed inset-0">
      <div className="text-center">
        <div className="text-5xl font-black text-biblo-green animate-pulse tracking-tighter">BIBLO</div>
        <div className="text-gray-400 font-bold mt-2 uppercase text-xs tracking-widest">Carregando jornada...</div>
      </div>
    </div>
  )

  // 2. Fluxo de Autenticação (Deslogado)
  if (!token) {
    return authView === 'login'
      ? <Login onLoginSuccess={login} onSwitchToSignup={() => setAuthView('signup')} />
      : <Signup onSignupSuccess={() => setAuthView('login')} onSwitchToLogin={() => setAuthView('login')} />
  }

  // 3. Fluxo do Quiz (Overlay sobre a Home)
  if (activeLesson) {
    return <Quiz lesson={activeLesson} onClose={handleFinishQuiz} />
  }

  // 4. Fluxo de Administração (Logado - Admin)
  if (userData?.type === 'teacher') {
    return <Admin />
  }

  // 5. Fluxo Principal (Logado - Home)
  return (
    <Home
      userData={userData}
      onLogout={logout}
      setActiveLesson={setActiveLesson}
    />
  )
}