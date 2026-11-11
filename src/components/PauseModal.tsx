import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Participant, GameMode, GameLimitConfig } from '../types';

interface PauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  round: number;
  totalTurns: number;
  gameMode: GameMode;
  onSetGameMode: (mode: GameMode) => void;
  gameLimitConfig: GameLimitConfig;
  onSetGameLimitConfig: (config: GameLimitConfig) => void;
  onResetScores: () => void;
  onGoToSetup: () => void;
  onGoToRules: () => void;
  onGoToPresentation: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onOpenIntro?: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  onClose,
  participants,
  round,
  totalTurns,
  gameMode,
  onSetGameMode,
  gameLimitConfig,
  onSetGameLimitConfig,
  onResetScores,
  onGoToSetup,
  onGoToRules,
  onGoToPresentation,
  isSoundEnabled,
  onToggleSound,
  isDarkMode = false,
  onToggleTheme,
  onOpenIntro,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 12 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="w-full max-w-xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-500/50 rounded-3xl p-6 shadow-2xl space-y-5 text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg shadow-md">
                <i className="fa-solid fa-pause"></i>
              </div>
              <div>
                <h3 className="kids-font text-2xl text-slate-900 dark:text-white font-extrabold">Partida en Pausa</h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-300">
                  Presioná <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-300 font-mono">ESC</kbd> o hacé clic en Reanudar
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Reanudar"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          {/* Quick Match Overview */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Ronda</span>
              <span className="kids-font text-xl text-indigo-600 dark:text-amber-300 font-bold">{round}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Jugadas</span>
              <span className="kids-font text-xl text-purple-600 dark:text-cyan-300 font-bold">{totalTurns}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">Participantes</span>
              <span className="kids-font text-xl text-pink-600 dark:text-pink-300 font-bold">{participants.length}</span>
            </div>
          </div>

          {/* Player Standings list */}
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Puntajes Actuales:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto">
              {participants.map((p, i) => (
                <div
                  key={`pause-player-${p.id || i}`}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <span className="font-bold truncate text-slate-800 dark:text-slate-200">{p.name}</span>
                  <span className="font-extrabold text-indigo-600 dark:text-amber-300 ml-1">{p.score} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Game Limit Quick Switch */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>⏱️</span>
              <span>Límite de Partida:</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() =>
                  onSetGameLimitConfig({
                    ...gameLimitConfig,
                    type: 'rounds',
                    maxRounds: 5,
                  })
                }
                className={`p-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                  gameLimitConfig.type === 'rounds'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                5 Rondas
              </button>
              <button
                type="button"
                onClick={() =>
                  onSetGameLimitConfig({
                    ...gameLimitConfig,
                    type: 'turns',
                    maxTurns: 15,
                  })
                }
                className={`p-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                  gameLimitConfig.type === 'turns'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                15 Jugadas
              </button>
              <button
                type="button"
                onClick={() =>
                  onSetGameLimitConfig({
                    ...gameLimitConfig,
                    type: 'points',
                    targetPoints: 5,
                  })
                }
                className={`p-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                  gameLimitConfig.type === 'points'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                5 Puntos
              </button>
              <button
                type="button"
                onClick={() =>
                  onSetGameLimitConfig({
                    ...gameLimitConfig,
                    type: 'unlimited',
                  })
                }
                className={`p-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                  gameLimitConfig.type === 'unlimited'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Sin Límite
              </button>
            </div>
          </div>

          {/* Modo de Juego Quick Switch */}
          <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>🎮</span>
              <span>Modo de Juego Activo:</span>
            </span>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => onSetGameMode('classic')}
                className={`p-2 rounded-xl border text-left cursor-pointer ${
                  gameMode === 'classic'
                    ? 'bg-indigo-600 text-white font-bold border-indigo-500'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                🎰 Clásico con Ruleta
              </button>

              <button
                type="button"
                onClick={() => onSetGameMode('coop')}
                className={`p-2 rounded-xl border text-left cursor-pointer ${
                  gameMode === 'coop'
                    ? 'bg-emerald-600 text-white font-bold border-emerald-500'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                🤝 Cooperativo / Misiones
              </button>

              <button
                type="button"
                onClick={() => onSetGameMode('night')}
                className={`p-2 rounded-xl border text-left cursor-pointer ${
                  gameMode === 'night'
                    ? 'bg-purple-600 text-white font-bold border-purple-500'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                🌙 Rutina Nocturna
              </button>

              <button
                type="button"
                onClick={() => onSetGameMode('timer')}
                className={`p-2 rounded-xl border text-left cursor-pointer ${
                  gameMode === 'timer'
                    ? 'bg-amber-600 text-white font-bold border-amber-500'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                ⏱️ Contrarreloj (30s)
              </button>
            </div>
          </div>

          {/* Action Navigation Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Reset Scores */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('¿Reiniciar todos los puntajes a cero?')) {
                  onResetScores();
                  onClose();
                }
              }}
              className="p-3 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/70 border border-rose-200 dark:border-rose-800/80 rounded-2xl text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <i className="fa-solid fa-rotate-right"></i>
              <span>Reiniciar Puntajes</span>
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              className={`p-3 border rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                isSoundEnabled
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <i className={`fa-solid ${isSoundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
              <span>{isSoundEnabled ? 'Sonido y Voz: Activados' : 'Sonido y Voz: Silenciados'}</span>
            </button>

            {/* Go to Setup */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToSetup();
              }}
              className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>👥</span>
              <span>Gestionar Jugadores</span>
            </button>

            {/* View Rules */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToRules();
              }}
              className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>📖</span>
              <span>Ver Reglamento & Regla de Oro</span>
            </button>

            {/* Theme Toggle */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <i className={`fa-solid ${isDarkMode ? 'fa-sun text-amber-500' : 'fa-moon text-indigo-500'}`}></i>
                <span>{isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}</span>
              </button>
            )}

            {/* Replay Intro */}
            {onOpenIntro && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenIntro();
                }}
                className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>🎬</span>
                <span>Ver Intro Animada</span>
              </button>
            )}
          </div>

          {/* Primary Resume Button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold rounded-2xl shadow-lg kids-font text-base flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <i className="fa-solid fa-play"></i>
              <span>Reanudar Partida</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToPresentation();
              }}
              className="sm:w-auto px-5 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl text-xs transition cursor-pointer"
            >
              Salir al Inicio
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
