import React, { useState } from 'react';
import { Participant, GameMode, GameLimitConfig, GameLimitType, SavedPlayer } from '../types';

interface SetupViewProps {
  participants: Participant[];
  savedPlayers: SavedPlayer[];
  onAddParticipant: (name: string) => void;
  onRemoveParticipant: (id: string) => void;
  onClearParticipants: () => void;
  onResetScores: () => void;
  onAddSavedPlayerToActive: (saved: SavedPlayer) => void;
  onDeleteSavedPlayer: (id: string) => void;
  gameMode: GameMode;
  onSetGameMode: (mode: GameMode) => void;
  gameLimitConfig: GameLimitConfig;
  onSetGameLimitConfig: (config: GameLimitConfig) => void;
  onStartGame: () => void;
}

export const SetupView: React.FC<SetupViewProps> = ({
  participants,
  savedPlayers,
  onAddParticipant,
  onRemoveParticipant,
  onClearParticipants,
  onResetScores,
  onAddSavedPlayerToActive,
  onDeleteSavedPlayer,
  gameMode,
  onSetGameMode,
  gameLimitConfig,
  onSetGameLimitConfig,
  onStartGame,
}) => {
  const [nameInput, setNameInput] = useState('');
  const [showDirectory, setShowDirectory] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onAddParticipant(nameInput.trim());
    setNameInput('');
  };

  const handleLimitTypeChange = (type: GameLimitType) => {
    onSetGameLimitConfig({
      ...gameLimitConfig,
      type,
    });
  };

  const activeNamesSet = new Set(participants.map((p) => p.name.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto space-y-4 py-1">
      {/* Header Container */}
      <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-xl border border-indigo-100 dark:border-indigo-800 p-4 md:p-6 backdrop-blur-md transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-indigo-100 dark:border-indigo-800/60 pb-4 mb-5">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/40">
              <span>🎲 Paso 1</span>
              <span>• Configuración de Partida</span>
            </div>
            <h2 className="kids-font text-2xl md:text-3xl text-slate-900 dark:text-white font-extrabold mt-1">
              Descubriendo Emociones En Palabras
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Agrega a los participantes (niños, jóvenes o adultos) para llevar el marcador y la ruleta.
            </p>
          </div>

          {/* Start CTA */}
          <button
            type="button"
            onClick={onStartGame}
            disabled={participants.length === 0}
            className={`font-extrabold px-6 py-3.5 rounded-2xl transition flex items-center gap-2 kids-font text-base cursor-pointer shadow-lg ${
              participants.length > 0
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white shadow-indigo-200 dark:shadow-indigo-950/50'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>¡Comenzar Partida!</span>
            <span>🚀</span>
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT: PARTICIPANTS & DIRECTORY */}
          <div className="lg:col-span-6 space-y-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>👥</span>
                  <span>Participantes ({participants.length})</span>
                </span>
                {participants.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearParticipants}
                    className="text-rose-600 dark:text-rose-400 hover:underline text-xs font-semibold cursor-pointer"
                  >
                    Vaciar lista
                  </button>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Nombre del participante..."
                  required
                  autoComplete="off"
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs kids-font cursor-pointer whitespace-nowrap shadow-md"
                >
                  + Agregar
                </button>
              </form>

              {/* Active Roster List */}
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 mb-3">
                {participants.length === 0 ? (
                  <div className="text-center py-4 bg-white dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                    Agrega participantes arriba o suma del directorio guardado.
                  </div>
                ) : (
                  participants.map((p, idx) => (
                    <div
                      key={`setup-p-${p.id || idx}-${idx}`}
                      className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900/80 rounded-xl border border-indigo-100 dark:border-slate-800 text-xs shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] kids-font">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-white text-sm">👤 {p.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveParticipant(p.id)}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer font-bold text-xs"
                        title="Quitar participante"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* SAVED DIRECTORY */}
              <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-indigo-700 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>📚</span>
                    <span>Directorio de Jugadores Guardados</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowDirectory(!showDirectory)}
                    className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-indigo-600 cursor-pointer"
                  >
                    {showDirectory ? 'Ocultar' : 'Mostrar'} ({savedPlayers.length})
                  </button>
                </div>

                {showDirectory && (
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {savedPlayers.length === 0 ? (
                      <p className="text-slate-400 text-[11px] italic">
                        No hay jugadores guardados aún. Cada nuevo participante quedará guardado.
                      </p>
                    ) : (
                      savedPlayers.map((sp) => {
                        const inCurrentMatch = activeNamesSet.has(sp.name.toLowerCase());
                        return (
                          <div
                            key={`saved-${sp.id}`}
                            className={`flex items-center justify-between p-2 rounded-xl border text-xs transition ${
                              inCurrentMatch
                                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-500/50 text-indigo-900 dark:text-indigo-200'
                                : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">👤</span>
                              <div>
                                <span className="font-bold text-slate-900 dark:text-white">{sp.name}</span>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                  <span>🏆 {sp.totalWins} vic</span>
                                  <span>•</span>
                                  <span>⭐ {sp.totalScore} pts</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {inCurrentMatch ? (
                                <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 text-[10px] font-bold">
                                  ✓ En Mesa
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => onAddSavedPlayerToActive(sp)}
                                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg cursor-pointer transition kids-font"
                                >
                                  + Sumar
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => onDeleteSavedPlayer(sp.id)}
                                className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                                title="Borrar del directorio"
                              >
                                <i className="fa-solid fa-trash-can text-[10px]"></i>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Reset Scores Option */}
            {participants.length > 0 && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">¿Reiniciar puntajes acumulados?</span>
                <button
                  type="button"
                  onClick={onResetScores}
                  className="text-amber-600 dark:text-amber-300 hover:underline font-semibold cursor-pointer"
                >
                  Reiniciar Puntajes
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: GAME MODES & DURATION */}
          <div className="lg:col-span-6 space-y-4 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              {/* Game Modes Header */}
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <span>🎮</span>
                <span>Selecciona el Modo de Juego:</span>
              </h3>

              {/* 4 OFFICIAL GAME MODES FROM HTML */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                {/* 1. Clásico con Ruleta */}
                <button
                  type="button"
                  onClick={() => onSetGameMode('classic')}
                  className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-start gap-2.5 ${
                    gameMode === 'classic'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-white font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                  }`}
                >
                  <span className="text-xl">🎰</span>
                  <div>
                    <span className="block font-bold text-sm">Clásico con Ruleta</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                      Gira la ruleta y responde según la categoría tocada.
                    </span>
                  </div>
                </button>

                {/* 2. Cooperativo / Misiones */}
                <button
                  type="button"
                  onClick={() => onSetGameMode('coop')}
                  className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-start gap-2.5 ${
                    gameMode === 'coop'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-white font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                  }`}
                >
                  <span className="text-xl">🤝</span>
                  <div>
                    <span className="block font-bold text-sm">Cooperativo / Misiones</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                      Retos grupales y misiones en equipo para todos.
                    </span>
                  </div>
                </button>

                {/* 3. Rutina Nocturna */}
                <button
                  type="button"
                  onClick={() => onSetGameMode('night')}
                  className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-start gap-2.5 ${
                    gameMode === 'night'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-white font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                  }`}
                >
                  <span className="text-xl">🌙</span>
                  <div>
                    <span className="block font-bold text-sm">Rutina Nocturna</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                      Preguntas reflexivas y de calma antes de dormir.
                    </span>
                  </div>
                </button>

                {/* 4. Contrarreloj */}
                <button
                  type="button"
                  onClick={() => onSetGameMode('timer')}
                  className={`p-3 rounded-2xl border-2 text-left transition cursor-pointer flex items-start gap-2.5 ${
                    gameMode === 'timer'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-white font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                  }`}
                >
                  <span className="text-xl">⏱️</span>
                  <div>
                    <span className="block font-bold text-sm">Contrarreloj (30s)</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                      Responde antes de que termine el temporizador.
                    </span>
                  </div>
                </button>
              </div>

              {/* Game Duration / Limit Header */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⏱️</span>
                    <span>Duración / Límite de la Partida:</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => handleLimitTypeChange('rounds')}
                    className={`p-2 rounded-xl border text-left cursor-pointer text-xs ${
                      gameLimitConfig.type === 'rounds'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 font-bold text-indigo-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Por Rondas ({gameLimitConfig.maxRounds})
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLimitTypeChange('points')}
                    className={`p-2 rounded-xl border text-left cursor-pointer text-xs ${
                      gameLimitConfig.type === 'points'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 font-bold text-indigo-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    A Puntos ({gameLimitConfig.targetPoints})
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLimitTypeChange('turns')}
                    className={`p-2 rounded-xl border text-left cursor-pointer text-xs ${
                      gameLimitConfig.type === 'turns'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 font-bold text-indigo-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Por Jugadas ({gameLimitConfig.maxTurns})
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLimitTypeChange('unlimited')}
                    className={`p-2 rounded-xl border text-left cursor-pointer text-xs ${
                      gameLimitConfig.type === 'unlimited'
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 font-bold text-indigo-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Modo Libre ♾️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
