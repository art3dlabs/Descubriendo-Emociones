import React, { useEffect } from 'react';
import { Participant } from '../types';
import { KokoCharacterAsset } from './KokoCharacterAsset';
import { kokoVoice } from '../utils/speech';
import { soundFX } from '../utils/sound';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

interface GameOverModalProps {
  isOpen: boolean;
  participants: Participant[];
  round: number;
  totalTurns: number;
  onPlayAgain: () => void;
  onExtendMatch: () => void;
  onGoToSetup: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  participants,
  round,
  totalTurns,
  onPlayAgain,
  onExtendMatch,
  onGoToSetup,
}) => {
  if (!isOpen) return null;

  const sorted = [...participants].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  useEffect(() => {
    soundFX.playFanfare();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });

    const winMsg =
      winner && winner.score > 0
        ? `¡Fin de la partida! ¡Fuerte el aplauso para ${winner.name}, que compartió sus reflexiones con ${winner.score} puntos acumulados!`
        : `¡Fin de la partida! ¡Una hermosa jornada de escucha y empatía para toda la mesa!`;

    kokoVoice.speak(winMsg);
  }, [winner?.name, winner?.score]);

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-xl w-full p-6 md:p-8 text-center border-2 border-indigo-500/60 relative overflow-hidden my-8 text-slate-800 dark:text-slate-100"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-amber-300 border border-indigo-200 dark:border-indigo-400/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <span>🏆</span> ¡Partida Completada!
        </div>

        {/* Animated Koko Presenter on Top */}
        <div className="flex justify-center -my-1">
          <KokoCharacterAsset
            size={180}
            isSpeaking={true}
            expression="happy"
            showHoloGlow={true}
            showPedestal={true}
          />
        </div>

        <h2 className="kids-font text-2xl md:text-4xl text-slate-900 dark:text-white font-extrabold mb-1">
          {winner && winner.score > 0 ? `¡${winner.name} lidera el Marcador!` : '¡Excelente Partida Grupal!'}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm max-w-md mx-auto mb-5 font-medium">
          Se completó el límite establecido tras <strong>{round} rondas</strong> y{' '}
          <strong>{totalTurns} preguntas</strong> compartidas en familia.
        </p>

        {/* Standings */}
        <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
          {sorted.map((player, idx) => {
            let rankBadge = 'bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
            let icon = `#${idx + 1}`;
            if (idx === 0) {
              rankBadge = 'bg-indigo-50 dark:bg-amber-500/20 text-indigo-900 dark:text-amber-300 border-indigo-300 dark:border-amber-400/60 ring-2 ring-indigo-400/30';
              icon = '👑 1°';
            } else if (idx === 1) {
              rankBadge = 'bg-purple-50 dark:bg-slate-800/40 text-purple-900 dark:text-slate-200 border-purple-200 dark:border-slate-600';
              icon = '🥈 2°';
            } else if (idx === 2) {
              rankBadge = 'bg-pink-50 dark:bg-amber-900/20 text-pink-900 dark:text-amber-400 border-pink-200 dark:border-amber-800';
              icon = '🥉 3°';
            }

            return (
              <div
                key={`gameover-player-${player.id || idx}-${idx}`}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition ${rankBadge}`}
              >
                <div className="flex items-center gap-3">
                  <span className="kids-font font-bold text-sm px-2.5 py-1 rounded-xl bg-white/60 dark:bg-black/40">
                    {icon}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm md:text-base">👤 {player.name}</span>
                </div>
                <div className="text-right">
                  <span className="kids-font font-extrabold text-xl md:text-2xl text-indigo-600 dark:text-amber-300">
                    {player.score}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1">pts</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-xl transition kids-font text-base cursor-pointer flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-rotate-right"></i> Jugar Otra Partida
          </button>

          <button
            type="button"
            onClick={onExtendMatch}
            className="px-4 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-xs md:text-sm font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
            title="Suma 2 rondas más a esta partida"
          >
            <i className="fa-solid fa-plus text-indigo-500"></i> +2 Rondas
          </button>

          <button
            type="button"
            onClick={onGoToSetup}
            className="px-4 py-3.5 bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs md:text-sm font-medium border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            Configuración
          </button>
        </div>
      </motion.div>
    </div>
  );
};
