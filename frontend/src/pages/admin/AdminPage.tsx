import { NavLink, Outlet } from "react-router-dom";
import { Header } from "@/shared/components/Header";

interface AdminPageProps {
  onLogout: () => void;
}

export function AdminPage({ onLogout }: AdminPageProps) {
  return (
    <div className="min-h-screen bg-[#f7f7f7] pb-20">
      <Header title="BIBLO ADMIN" onLogout={onLogout}>
        <NavLink
          to="users"
          className={({ isActive }) =>
            `px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              isActive
                ? "bg-biblo-green text-white shadow-[0_3px_0_0_#46a302]"
                : "text-gray-400"
            }`
          }
        >
          USUÁRIOS
        </NavLink>
        <NavLink
          to="lessons"
          className={({ isActive }) =>
            `px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              isActive
                ? "bg-biblo-blue text-white shadow-[0_3px_0_0_#1a73e8]"
                : "text-gray-400"
            }`
          }
        >
          LIÇÕES
        </NavLink>
      </Header>

      <main className="max-w-4xl mx-auto p-4 mt-4">
        <Outlet />
      </main>
    </div>
  );
}
