export function AppLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white z-50 fixed inset-0">
      <div className="text-center">
        <div className="text-5xl font-black text-biblo-green animate-pulse tracking-tighter">
          BIBLO
        </div>
        <div className="text-gray-400 font-bold mt-2 uppercase text-xs tracking-widest">
          Carregando jornada...
        </div>
      </div>
    </div>
  );
}
