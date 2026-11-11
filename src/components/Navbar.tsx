import React from 'react';

interface NavbarProps {
  currentView: 'presentation' | 'setup' | 'game' | 'ranking' | 'rules';
  onSwitchView: (view: 'presentation' | 'setup' | 'game' | 'ranking' | 'rules') => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  onOpenPause?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSwitchView,
  isSoundEnabled,
  onToggleSound,
  onOpenPause,
}) => {
  return (
    <header className="bg-white/90 dark:bg-slate-900/95 text-slate-900 dark:text-white shadow-sm sticky top-0 z-50 border-b border-indigo-100 dark:border-indigo-950 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        {/* Brand: Logo + Title */}
        <button
          type="button"
          onClick={() => onSwitchView('presentation')}
          className="flex items-center space-x-2 text-left cursor-pointer group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
            🎲
          </div>
          <div>
            <h1 className="kids-font text-base sm:text-lg font-extrabold text-indigo-950 dark:text-white tracking-tight leading-tight">
              Descubriendo Emociones
            </h1>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-300 font-semibold hidden md:block">
              150 Preguntas & Ruleta
            </p>
          </div>
        </button>

        {/* Primary Clean Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5">
          {/* Tablero & Ruleta */}
          <button
            type="button"
            onClick={() => onSwitchView('game')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentView === 'game'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>🎮</span>
            <span>Tablero & Ruleta</span>
          </button>

          {/* Jugadores */}
          <button
            type="button"
            onClick={() => onSwitchView('setup')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentView === 'setup'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>👥</span>
            <span>Jugadores</span>
          </button>

          {/* Reglamento */}
          <button
            type="button"
            onClick={() => onSwitchView('rules')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentView === 'rules'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>📖</span>
            <span className="hidden sm:inline">Reglamento</span>
          </button>

          {/* Unified: Ranking & Historial */}
          <button
            type="button"
            onClick={() => onSwitchView('ranking')}
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentView === 'ranking'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>🏆</span>
            <span>Ranking & Historial</span>
          </button>
        </nav>

        {/* Right Utility: Quick Sound & Pause/Options Button */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Quick Sound Toggle Icon */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition border text-xs cursor-pointer ${
              isSoundEnabled
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
            }`}
            title={isSoundEnabled ? 'Silenciar sonido y voz' : 'Activar sonido y voz'}
          >
            <i className={`fa-solid ${isSoundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
          </button>

          {/* Pause / Settings Button */}
          {onOpenPause && (
            <button
              type="button"
              onClick={onOpenPause}
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
              title="Abrir menú de pausa y opciones"
            >
              <i className="fa-solid fa-pause text-amber-500"></i>
              <span className="hidden sm:inline">Pausa</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
