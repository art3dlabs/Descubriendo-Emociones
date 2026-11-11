import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameHistoryEntry } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: GameHistoryEntry[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 12 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-500/50 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100 max-h-[85vh] flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                🏆
              </div>
              <div>
                <h3 className="kids-font text-2xl text-slate-900 dark:text-white font-extrabold flex items-center gap-2">
                  <span>Historial de Partidas</span>
                </h3>
                <p className="text-xs text-indigo-600 dark:text-amber-300 font-medium">
                  Registro de rondas y participaciones en Descubriendo Emociones
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer font-bold"
            >
              ✕
            </button>
          </div>

          {/* History Content */}
          <div className="flex-grow overflow-y-auto space-y-3 pr-1">
            {history.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-4xl">🎲</span>
                <p className="text-slate-700 dark:text-slate-300 font-bold text-sm">No hay partidas registradas aún.</p>
                <p className="text-slate-500 dark:text-slate-500 text-xs">
                  Completen una partida para registrar las puntuaciones en este historial.
                </p>
              </div>
            ) : (
              history.map((entry, idx) => (
                <div
                  key={`history-item-${entry.id || idx}`}
                  className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 rounded-2xl p-4 space-y-2.5 transition shadow-sm"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-400/30 text-xs font-extrabold px-3 py-1 rounded-full kids-font flex items-center gap-1.5">
                        👑 Destacado: <strong className="text-slate-900 dark:text-white">{entry.winnerName}</strong> ({entry.winnerScore} pts)
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                      <span>📅 {entry.date}</span>
                      <span>•</span>
                      <span>{entry.roundsPlayed} rondas</span>
                    </div>
                  </div>

                  {/* Players list */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {entry.participants.map((p, pIdx) => (
                      <div
                        key={`h-p-${pIdx}`}
                        className={`px-2.5 py-1 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 ${
                          p.name === entry.winnerName
                            ? 'bg-indigo-100 dark:bg-indigo-500/20 border-indigo-300 dark:border-indigo-400 text-indigo-900 dark:text-indigo-200 font-bold'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{p.name}:</span>
                        <span className="font-bold text-indigo-600 dark:text-amber-300">{p.score} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-center gap-2">
            {history.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('¿Borrar todo el historial de partidas?')) {
                    onClearHistory();
                  }
                }}
                className="text-xs text-rose-500 hover:text-rose-700 dark:text-rose-400 font-semibold cursor-pointer flex items-center gap-1"
              >
                <i className="fa-solid fa-trash-can"></i>
                <span>Vaciar Historial</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
