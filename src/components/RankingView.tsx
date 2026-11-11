import React, { useState } from 'react';
import { Participant, GameHistoryEntry } from '../types';
import { HostCharacter } from './HostCharacter';

interface RankingViewProps {
  participants: Participant[];
  history: GameHistoryEntry[];
  onClearHistory: () => void;
  onResetScores: () => void;
  onSwitchView: (view: 'presentation' | 'setup' | 'game' | 'ranking' | 'rules') => void;
}

export const RankingView: React.FC<RankingViewProps> = ({
  participants,
  history,
  onClearHistory,
  onResetScores,
  onSwitchView,
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const sorted = [...participants].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-5">
      <div className="max-w-4xl mx-auto">
        <HostCharacter
          expression="happy"
          customMessage="Aquí podemos ver las puntuaciones de la partida en curso y el historial de encuentros anteriores."
        />
      </div>

      <div className="bg-white/95 dark:bg-slate-900/90 rounded-3xl shadow-xl border border-indigo-100 dark:border-indigo-800/60 p-5 md:p-7 max-w-4xl mx-auto backdrop-blur-md text-slate-800 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-400/30 mb-2">
            <span>🏆</span>
            <span>Marcador & Registro</span>
          </div>
          <h2 className="kids-font text-2xl md:text-4xl text-slate-900 dark:text-white font-extrabold">
            Ranking & Historial
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1">
            Revisá las posiciones en vivo de la mesa actual o consultá el registro de partidas finalizadas.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('current')}
            className={`pb-3 px-4 font-bold text-sm transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'current'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span>🏆 Ranking Actual</span>
            <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full">
              {participants.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 font-bold text-sm transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <span>📜 Historial de Partidas</span>
            <span className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs px-2 py-0.5 rounded-full">
              {history.length}
            </span>
          </button>
        </div>

        {/* TAB 1: CURRENT MATCH RANKING */}
        {activeTab === 'current' && (
          <div className="space-y-4">
            {participants.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-3xl block mb-2">👥</span>
                <p className="text-slate-600 dark:text-slate-400 font-semibold text-sm">No hay participantes registrados en esta partida.</p>
                <p className="text-slate-400 text-xs mt-1">Sumá participantes desde la sección de Jugadores para comenzar a sumar puntos.</p>
                <button
                  type="button"
                  onClick={() => onSwitchView('setup')}
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold kids-font hover:bg-indigo-700 cursor-pointer"
                >
                  Configurar Jugadores
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {sorted.map((p, idx) => {
                  let badgeColor = 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800';
                  let icon = <span className="font-bold kids-font">#{idx + 1}</span>;
                  if (idx === 0) {
                    badgeColor = 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-400/40 ring-1 ring-amber-400/30';
                    icon = <span className="text-xl">👑</span>;
                  } else if (idx === 1) {
                    badgeColor = 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-400/30';
                    icon = <span className="text-xl">🥈</span>;
                  } else if (idx === 2) {
                    badgeColor = 'bg-pink-50 dark:bg-pink-900/10 border-pink-200 dark:border-pink-400/30';
                    icon = <span className="text-xl">🥉</span>;
                  }

                  return (
                    <div
                      key={`rank-row-${p.id || idx}-${idx}`}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition ${badgeColor}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-black/40 flex items-center justify-center text-sm shadow-sm font-bold border border-slate-200 dark:border-slate-700">
                          {icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">👤 {p.name}</h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">En la mesa actual</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="kids-font text-xl md:text-2xl font-black text-indigo-600 dark:text-amber-300">
                          {p.score}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1 font-medium">pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-5 gap-3">
              {participants.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Reiniciar todos los puntajes a cero?')) {
                      onResetScores();
                    }
                  }}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-arrow-rotate-left"></i>
                  <span>Reiniciar Puntajes</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onSwitchView('game')}
                className="ml-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-2xl transition kids-font text-sm shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Volver al Tablero & Ruleta</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: HISTORIAL DE PARTIDAS ANTERIORES */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <span className="text-3xl block mb-2">📜</span>
                <p className="text-slate-700 dark:text-slate-300 font-bold text-sm">No hay partidas registradas en el historial todavía.</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  Al completar una partida según las rondas o límite de puntos, los resultados se guardarán automáticamente aquí.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {history.map((entry, idx) => (
                  <div
                    key={`hist-entry-${entry.id || idx}`}
                    className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5 transition shadow-sm"
                  >
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full kids-font">
                          👑 Ganador: <strong className="text-slate-900 dark:text-white">{entry.winnerName}</strong> ({entry.winnerScore} pts)
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                        <span>📅 {entry.date}</span>
                        <span>•</span>
                        <span>{entry.roundsPlayed} rondas</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      {entry.participants.map((p, pIdx) => (
                        <div
                          key={`hp-${pIdx}`}
                          className={`px-2.5 py-1 rounded-xl border text-[11px] font-medium flex items-center gap-1.5 ${
                            p.name === entry.winnerName
                              ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-300 dark:border-amber-400 text-amber-900 dark:text-amber-200 font-bold'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span>{p.name}:</span>
                          <span className="font-bold text-indigo-600 dark:text-amber-300">{p.score} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-5 gap-3">
              {history.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Deseas vaciar todo el historial de partidas?')) {
                      onClearHistory();
                    }
                  }}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="fa-solid fa-trash-can"></i>
                  <span>Vaciar Historial</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => onSwitchView('game')}
                className="ml-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-2xl transition kids-font text-sm shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Volver al Tablero & Ruleta</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
