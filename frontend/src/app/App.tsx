import { useCallback, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { LoginPage } from "@/pages/public/LoginPage";
import { SignupPage } from "@/pages/public/SignupPage";
import { ForgotPasswordPage } from "@/pages/public/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/public/ResetPasswordPage";
import { QuizPage } from "@/pages/student/QuizPage";
import { HomePage } from "@/pages/student/HomePage";
import { useAuth } from "@/shared/hooks/useAuth";
import { userService } from "@/shared/services/userService";
import type { Lesson } from "@/types";
import { AdminLessonsPage } from "@/pages/admin/AdminLessonsPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { TeacherPage } from "@/pages/teacher/TeacherPage";
import { StartLessonScreen } from "@/features/lesson/components/StartLessonScreen";
import { AppLoadingScreen } from "@/shared/components/AppLoadingScreen";
import { AdminPage } from "@/pages/admin/AdminPage";

interface UserProfile {
  type?: string;
  xp?: number;
  streak?: number;
  hearts?: number;
}

export default function App() {
  const { token, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getProfile();
      setUserData(data);
    } catch (err) {
      console.error("Erro ao buscar dados do usuário", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      void fetchUserData();
    }
  }, [token, fetchUserData]);

  const handleLogout = useCallback(() => {
    logout();
    setUserData(null);
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  const handleStartLesson = useCallback(
    (lesson: Lesson) => {
      navigate("/lesson/start", { state: { lesson } });
    },
    [navigate],
  );

  const lessonFromState = (location.state as { lesson?: Lesson } | null)
    ?.lesson;

  const handleFinishQuiz = async () => {
    navigate("/", { replace: true });
  };

  if (loading) {
    return <AppLoadingScreen />;
  }

  if (!token) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              onLoginSuccess={(newToken: string, refreshToken?: string) => {
                login(newToken, refreshToken);
                navigate("/", { replace: true });
              }}
              onSwitchToSignup={() => navigate("/signup")}
              onSwitchToForgotPassword={() => navigate("/forgot-password")}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupPage
              onSignupSuccess={() => navigate("/login")}
              onSwitchToLogin={() => navigate("/login")}
            />
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ForgotPasswordPage onBackToLogin={() => navigate("/login")} />
          }
        />
        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (userData?.type === "teacher" || userData?.type === "admin") {
    if (userData.type === "admin") {
      return (
        <Routes>
          <Route path="/admin" element={<AdminPage onLogout={handleLogout} />}>
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="lessons" element={<AdminLessonsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      );
    } else {
      return (
        <Routes>
          <Route path="/teacher" element={<TeacherPage onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/teacher" replace />} />
        </Routes>
      );
    }
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            userData={{
              xp: userData?.xp ?? 0,
              streak: userData?.streak ?? 0,
              hearts: userData?.hearts ?? 0,
            }}
            onLogout={handleLogout}
            setActiveLesson={handleStartLesson}
          />
        }
      />
      <Route
        path="/lesson/start"
        element={
          lessonFromState ? (
            <StartLessonScreen
              lesson={lessonFromState}
              onStart={() =>
                navigate("/quiz", { state: { lesson: lessonFromState } })
              }
              onCancel={() => navigate("/", { replace: true })}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/quiz"
        element={
          lessonFromState ? (
            <QuizPage
              lesson={lessonFromState}
              onClose={() => {
                void handleFinishQuiz();
              }}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
