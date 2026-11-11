import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KokoSpriteAnimator } from './KokoSpriteAnimator';
import { soundFX } from '../utils/sound';
import confetti from 'canvas-confetti';

interface IntroAnimationModalProps {
  onComplete: () => void;
}

export const IntroAnimationModal: React.FC<IntroAnimationModalProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<number>(1);

  useEffect(() => {
    soundFX.playFanfare();

    const t1 = setTimeout(() => {
      setPhase(2);
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    }, 1200);

    const t2 = setTimeout(() => {
      setPhase(3);
    }, 2400);

    const t3 = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden select-none"
      >
        {/* Background Spotlight Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[130px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-xl p-6">
          {/* Phase 1 */}
          {phase === 1 && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="space-y-3"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/40 px-4 py-1.5 rounded-full text-xs font-bold text-amber-300 uppercase tracking-widest kids-font">
                <span>🎲</span> PREPARANDO EL JUEGO...
              </div>
              <h2 className="kids-font text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200 drop-shadow">
                3... 2... 1...
              </h2>
            </motion.div>
          )}

          {/* Phase 2 & 3 */}
          {phase >= 2 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="space-y-4 flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 border border-indigo-400/50 px-5 py-1.5 rounded-full backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="kids-font text-xs md:text-sm font-extrabold text-amber-300 uppercase tracking-widest">
                  ★ JUEGO DIDÁCTICO Y REFLEXIVO ★
                </span>
              </div>

              <h1 className="kids-font text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-200 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
                Descubriendo Emociones
              </h1>

              {/* Animated Host Sprite Entrance */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="my-2"
              >
                <KokoSpriteAnimator
                  size={200}
                  isSpeaking={false}
                  action="wave"
                  showPedestal={true}
                />
              </motion.div>

              <p className="text-indigo-200 text-xs md:text-sm font-semibold max-w-md kids-font">
                ¡Koko te da la bienvenida a este espacio de escucha y empatía!
              </p>
            </motion.div>
          )}

          {/* Skip Intro Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={onComplete}
              className="px-4 py-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Saltar Intro ➔
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
