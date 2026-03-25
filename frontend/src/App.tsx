import { useEffect, useState } from 'react'
import axios from 'axios'
import { Login } from './components/Login'
import { Signup } from './components/Signup'
import { Quiz } from './components/Quiz'
import { ResultModal } from './components/ResultModal'
import { Header } from './components/Header'
import { LessonCard } from './components/LessonCard'
import type { Lesson, QuizResultResponse } from './types'

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [authView, setAuthView] = useState<'login' | 'signup'>('login')
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [userStats, setUserStats] = useState({ xp: 0, streak: 0, hearts: 5 })
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState<{ xp: number; streak: number } | null>(null)

  const apiConfig = { headers: { Authorization: `Bearer ${token}` } }

  useEffect(() => {
    if (token) fetchUserData();
  }, [token])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      const [lRes, uRes] = await Promise.all([
        axios.get('http://localhost:8000/lessons', apiConfig),
        axios.get('http://localhost:8000/users/me', apiConfig)
      ])

      const mockLessons: Lesson[] = [
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        },
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        },
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        },
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        },
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        },
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        },
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        },
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        },
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        },
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        },
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        },
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        },
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        },
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        },
        {
          id: 1,
          title: "Lição de Exemplo",
          books: ["Gênesis"],
          level: 1,
          content: {
            questions: [
              {
                id: "q1",
                type: "multiple_choice",
                text: "Quem foi o primeiro homem criado por Deus?",
                options: ["Adão", "Eva", "Noé", "Abraão"],
                answer: "Adão",
                explanation: "De acordo com a Bíblia, Adão foi o primeiro homem criado por Deus no Jardim do Éden."
              },
            ]
          }
        }
      ]

      setLessons(mockLessons)
      console.log(uRes.data)
      setUserStats({ xp: uRes.data.xp, streak: uRes.data.streak, hearts: uRes.data.hearts })
    } catch (err) { handleLogout() }
    finally { setLoading(false) }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleFinishQuiz = async (correct: number, total: number) => {
    // 1. Se o usuário apenas fechou o Quiz no "X", apenas fecha.
    if (total === 0 || correct === 0) {
      setActiveLesson(null);
      return;
    }

    try {
      const { data } = await axios.post<QuizResultResponse>(
        'http://localhost:8000/users/progress',
        { correct_answers: correct, total_questions: total },
        apiConfig
      )

      // 2. Primeiro atualizamos os status e PREPARAMOS o modal
      setUserStats(prev => ({ ...prev, xp: data.current_total_xp, streak: data.streak }))
      setShowModal({ xp: data.xp_earned, streak: data.streak })

      // 3. AGORA fechamos a lição para voltar para a Home onde o modal vai brilhar
      setActiveLesson(null);

    } catch (err) {
      console.error("Erro ao salvar progresso", err);
      setActiveLesson(null);
    }
  }

  // RENDERIZAÇÃO CONDICIONAL
  if (!token) {
    return authView === 'login'
      ? <Login onLoginSuccess={t => setToken(t)} onSwitchToSignup={() => setAuthView('signup')} />
      : <Signup onSignupSuccess={() => setAuthView('login')} onSwitchToLogin={() => setAuthView('login')} />
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-black text-biblo-green text-3xl animate-pulse">
      BIBLO
    </div>
  )

  if (activeLesson) return <Quiz lesson={activeLesson} onClose={handleFinishQuiz} />

  return (
    <div className="min-h-screen bg-[#f7f7f7] pb-20">
      <Header hearts={userStats.hearts} streak={userStats.streak} xp={userStats.xp} onLogout={handleLogout} />

      <main className="max-w-2xl mx-auto px-4 mt-8">
        <h2 className="text-xl font-black text-gray-500 uppercase tracking-widest mb-6 px-2">Suas Lições</h2>
        <div className="grid gap-4">
          {lessons.map(l => <LessonCard key={l.id} lesson={l} onClick={setActiveLesson} />)}
          {lessons.length === 0 && <p className="text-center text-gray-400 font-bold mt-10">Nenhuma lição disponível.</p>}
        </div>
      </main>

      {/* Movido para o final do JSX para garantir que fique no topo da árvore de renderização */}
      {showModal && (
        <ResultModal
          xp={showModal.xp}
          streak={showModal.streak}
          onClose={() => setShowModal(null)}
        />
      )}
    </div>
  )
}