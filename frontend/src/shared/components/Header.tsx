import { Flame, Heart, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

interface HeaderProps {
  title?: string;
  hearts?: number;
  streak?: number;
  xp?: number;
  onLogout: () => void;
  children?: ReactNode;
}

export function Header({
  title = 'BIBLO',
  hearts,
  streak,
  xp,
  onLogout,
  children,
}: HeaderProps) {
  return (
    <header className="bg-white border-b-2 border-gray-200 py-3 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-black text-biblo-green tracking-tighter">
            {title}
          </h1>
        </div>

        {children ? (
          <div className="flex flex-1 justify-center">
            <div className="flex items-center gap-2">{children}</div>
          </div>
        ) : null}

        <div className="flex items-center gap-3 sm:gap-6 font-black text-sm">
          {typeof streak === 'number' && (
            <div className="flex items-center gap-1">
              <Flame size={18} className="text-orange-500" />
              <span className="text-orange-600">{streak}</span>
            </div>
          )}

          {typeof xp === 'number' && (
            <div className="flex items-center gap-1">
              <Sparkles size={18} className="text-biblo-blue" />
              <span className="text-biblo-blue-dark">{xp}</span>
              <span className="hidden xs:inline text-biblo-blue-dark">XP</span>
            </div>
          )}

          {typeof hearts === 'number' && (
            <div className="flex items-center gap-1">
              <Heart size={18} className="text-red-500 fill-red-500" />
              <span className="text-red-600">{hearts}</span>
            </div>
          )}

          <button
            onClick={onLogout}
            className="ml-1 hover:bg-gray-200 p-2 bg-gray-50 border-2 cursor-pointer border-gray-200 rounded-xl active:translate-y-0.5 active:border-b-2 transition-all"
            aria-label="Sair"
          >
            <span className="text-xs text-gray-400">SAIR</span>
          </button>
        </div>
      </div>
    </header>
  );
}
