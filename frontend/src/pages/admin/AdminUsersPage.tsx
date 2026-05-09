import { useEffect, useState } from "react";
import { Trash2Icon } from "lucide-react";

import { StatusModal } from "@/features/admin/modals/StatusModal";
import { ConfirmModal } from "@/features/admin/modals/ConfirmDeleteModal";
import { authService } from "@/shared/services/authService";
import { userService } from "@/shared/services/userService";

type UserItem = {
  id: number;
  username: string;
  email: string;
  type: string;
};

export function AdminUsersPage() {
  const [view, setView] = useState<"list" | "create-teacher">("list");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [userFilter, setUserFilter] = useState<"all" | "teachers" | "students">(
    "all",
  );
  const [teacherForm, setTeacherForm] = useState({
    username: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);

  useEffect(() => {
    void fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers();
      setUsers(res);
    } catch {
      console.error("Erro ao carregar usuários");
    }
  };

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setStatus("error");
    setTimeout(() => {
      setStatus("idle");
      setErrorMessage("");
    }, 2500);
  };

  const handleCreateTeacher = async () => {
    if (!teacherForm.username.trim() || !teacherForm.email.trim()) {
      return triggerError("Preencha todos os campos.");
    }

    setIsSubmitting(true);
    try {
      await authService.createTeacher({
        username: teacherForm.username.trim(),
        email: teacherForm.email.trim(),
      });

      setStatus("success");
      setTeacherForm({ username: "", email: "" });
      setTimeout(() => {
        setStatus("idle");
        setView("list");
      }, 2000);
      void fetchUsers();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      triggerError(
        axiosErr.response?.data?.detail || "Erro ao criar professor.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (user: UserItem) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const executeDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await userService.deleteUser(userToDelete.id);
      void fetchUsers();
      setStatus("success");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(
        error.response?.data?.detail || "Erro ao deletar usuário.",
      );
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 4000);
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      userFilter === "all" ||
      user.type === (userFilter === "teachers" ? "teacher" : "student"),
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <StatusModal status={status} message={errorMessage} />
      <ConfirmModal
        isOpen={showDeleteModal}
        onConfirm={executeDeleteUser}
        onCancel={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        title="Excluir Usuário?"
        message={`Tem certeza que deseja excluir o usuário "${userToDelete?.username}"? Esta ação não pode ser desfeita.`}
      />

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Usuários</h2>
        {view === "list" && (
          <button
            type="button"
            onClick={() => setView("create-teacher")}
            className="px-4 py-2 rounded-xl font-bold cursor-pointer text-sm bg-biblo-green text-white shadow-[0_3px_0_0_#46a302] hover:bg-biblo-green/90 transition-all"
          >
            + Novo Professor
          </button>
        )}
      </div>

      {view === "list" ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-4">
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setUserFilter("all")}
                className={`px-3 py-1 rounded font-bold text-sm cursor-pointer transition-all ${
                  userFilter === "all"
                    ? "bg-biblo-blue text-white shadow-[0_3px_0_0_#1a73e8]"
                    : "text-gray-400"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setUserFilter("teachers")}
                className={`px-3 py-1 rounded font-bold text-sm cursor-pointer transition-all ${
                  userFilter === "teachers"
                    ? "bg-biblo-blue text-white shadow-[0_3px_0_0_#1a73e8]"
                    : "text-gray-400"
                }`}
              >
                Professores
              </button>
              <button
                type="button"
                onClick={() => setUserFilter("students")}
                className={`px-3 py-1 rounded font-bold text-sm cursor-pointer transition-all ${
                  userFilter === "students"
                    ? "bg-biblo-blue text-white shadow-[0_3px_0_0_#1a73e8]"
                    : "text-gray-400"
                }`}
              >
                Alunos
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.type}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteUser(user)}
                  className="px-2 py-2 bg-red-500 text-white rounded cursor-pointer text-sm hover:bg-red-600"
                >
                  <Trash2Icon size={16} />
                </button>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Nenhum usuário encontrado
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome de usuário
              </label>
              <input
                id="username"
                type="text"
                value={teacherForm.username}
                onChange={(e) =>
                  setTeacherForm((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                className="md:col-span-1 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold focus:border-biblo-blue outline-none transition-all w-full"
                placeholder="Digite o nome de usuário"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={teacherForm.email}
                onChange={(e) =>
                  setTeacherForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="md:col-span-1 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold focus:border-biblo-blue outline-none transition-all w-full"
                placeholder="Digite o email"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setView("list")}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateTeacher}
                disabled={isSubmitting}
                className="px-6 py-2 bg-biblo-green text-white rounded-lg hover:bg-biblo-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Criando..." : "Criar Professor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
