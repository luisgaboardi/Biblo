import { useEffect, useState } from 'react'
import { Login } from './components/Login'
import { Signup } from './components/Signup'
import { Quiz } from './components/Quiz'
import { ResultModal } from './components/ResultModal'

// Nossas Views Principais
import { Home } from './views/Home'

// Lógica Centralizada
import { useAuth } from './hooks/useAuth'
import { userService } from './services/userService'
import type { Lesson } from './types'

export default function App() {
  // --- ESTADO GLOBAL DA SESSÃO ---
  const { token, login, logout } = useAuth()
  const [authView, setAuthView] = useState<'login' | 'signup'>('login')

  // --- ESTADO DE DADOS DA APP ---
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [userStats, setUserStats] = useState({ xp: 0, streak: 0, hearts: 5 })
  const [loading, setLoading] = useState(false)

  // --- ESTADO DE UI (Modais/Overlays) ---
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [showResultModal, setShowResultModal] = useState<{ xp: number; streak: number } | null>(null)

  // Carrega dados quando o token existe
  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [lessonsData, userData] = await Promise.all([
        userService.getLessons(),
        userService.getProfile()
      ])
      setLessons(lessonsData)
      setUserStats({ xp: userData.xp, streak: userData.streak, hearts: userData.hearts })
    } catch (err) {
      console.error("Erro na App", err)
      logout() // Desloga se a API falhar
    } finally {
      setLoading(false)
    }
  }

  // Lógica de finalização do Quiz (Salva no Banco e abre Modal)
  const handleFinishQuiz = async (correct: number, total: number) => {
    if (total === 0 || correct === 0) {
      setActiveLesson(null)
      return
    }

    try {
      const data = await userService.saveProgress(correct, total)
      // Atualiza os dados locais com o retorno do servidor
      setUserStats(prev => ({ ...prev, xp: data.current_total_xp, streak: data.streak }))
      setShowResultModal({ xp: data.xp_earned, streak: data.streak })
      setActiveLesson(null)
    } catch (err) {
      console.error("Erro ao salvar progresso", err)
      setActiveLesson(null)
    }
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

  // 4. Fluxo Principal (Logado - Home)
  return (
    <>
      <Home
        userStats={userStats}
        lessons={lessons}
        onLogout={logout}
        onSelectLesson={setActiveLesson} // Passa a função que abre o Quiz
      />

      {/* Modais Globais (ficam fora da Home para garantir Z-Index) */}
      {showResultModal && (
        <ResultModal
          xp={showResultModal.xp}
          streak={showResultModal.streak}
          onClose={() => setShowResultModal(null)}
        />
      )}
    </>
  )
}