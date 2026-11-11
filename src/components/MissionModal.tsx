import React, { useState } from 'react';
import { QUESTION_BANK } from '../data/questions';
import { soundFX } from '../utils/sound';
import { kokoVoice } from '../utils/speech';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { KokoCharacterAsset } from './KokoCharacterAsset';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({ isOpen, onClose }) => {
  const missionsList = QUESTION_BANK['Misiones Especiales'];
  const [missionText, setMissionText] = useState<string>(
    '¡Apretá el botón para sortear una Misión Especial para el grupo!'
  );
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasSpun, setHasSpun] = useState<boolean>(false);

  if (!isOpen) return null;

  const spinMission = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setHasSpun(false);

    let count = 0;
    const interval = setInterval(() => {
      const randomItem = missionsList[Math.floor(Math.random() * missionsList.length)];
      setMissionText(randomItem);
      soundFX.playTick();
      count++;
      if (count > 14) {
        clearInterval(interval);
        setIsSpinning(false);
        setHasSpun(true);
        soundFX.playFanfare();
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

        const missionQuote = `¡Salió la Misión Especial! ${randomItem}`;
        kokoVoice.speak(missionQuote);
      }
    }, 75);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 25 }}
        className="bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/90 rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 text-center border-2 border-emerald-500/50 relative overflow-hidden"
      >
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-emerald-600/25 blur-3xl rounded-full pointer-events-none" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mb-2 border border-emerald-500/40 shadow-lg animate-pulse">
            ⭐
          </div>

          <h3 className="kids-font text-2xl md:text-3xl text-white font-extrabold">
            Misión Especial de Koko
          </h3>
          <p className="text-emerald-300/80 text-xs mt-0.5">
            ¡Dinámica de mímica, expresión, respiración o gratitud grupal!
          </p>
        </div>

        {/* Host Reaction */}
        <div className="flex justify-center my-2">
          <KokoCharacterAsset
            size={135}
            isSpeaking={hasSpun}
            expression={isSpinning ? 'surprised' : 'happy'}
            showHoloGlow={true}
            showPedestal={false}
            interactive={false}
          />
        </div>

        {/* Random Mission Result Card */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border-2 border-emerald-500/30 min-h-[105px] flex items-center justify-center my-4 shadow-inner">
          <p
            className={`kids-font text-base md:text-xl font-bold leading-snug transition-all ${
              hasSpun ? 'text-amber-300 scale-105' : 'text-slate-200'
            }`}
          >
            {missionText}
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={spinMission}
            disabled={isSpinning}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3.5 rounded-2xl transition kids-font text-base shadow-xl cursor-pointer disabled:opacity-50 border border-emerald-400 flex items-center justify-center gap-2"
          >
            <span>⭐</span>
            <span>{isSpinning ? 'Sorteando misión...' : '¡Girar Misión!'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3.5 rounded-2xl transition text-sm cursor-pointer border border-slate-700"
          >
            Listo
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const PunishmentModal = MissionModal;
