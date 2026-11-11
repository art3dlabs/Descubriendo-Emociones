import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Participant } from '../types';
import { KokoSpriteAnimator } from './KokoSpriteAnimator';
import { soundFX } from '../utils/sound';
import { kokoVoice } from '../utils/speech';

interface PresentationViewProps {
  participants: Participant[];
  onStartNewGame: () => void;
  onResumeGame: () => void;
  onOpenRules: () => void;
}

export const PresentationView: React.FC<PresentationViewProps> = ({
  participants,
  onStartNewGame,
  onResumeGame,
  onOpenRules,
}) => {
  const [showHowToPlayModal, setShowHowToPlayModal] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [hostDialogue, setHostDialogue] = useState<string>(
    '¡Hola a todos! Soy Koko. Bienvenidos a Descubriendo Emociones En Palabras. ¿Configuramos los participantes o querés ver cómo jugar?'
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      speakGreeting(hostDialogue);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const speakGreeting = (text: string) => {
    setIsSpeaking(true);
    kokoVoice.speak(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleHowToPlayClick = () => {
    soundFX.playPop();
    const tutorialIntro = '¡Con gusto! Te explico las dinámicas de este espacio de escucha y empatía.';
    setHostDialogue(tutorialIntro);
    speakGreeting(tutorialIntro);
    setShowHowToPlayModal(true);
  };

  const handleStartGameClick = () => {
    soundFX.playScorePoint();
    const startMsg = '¡Excelente! Vamos a preparar la partida y cargar a los participantes.';
    speakGreeting(startMsg);
    onStartNewGame();
  };

  const handleResumeClick = () => {
    soundFX.playFanfare();
    const resumeMsg = '¡Bienvenidos de nuevo! Retomamos el tablero donde lo dejamos.';
    speakGreeting(resumeMsg);
    onResumeGame();
  };

  const tutorialSteps = [
    {
      step: 1,
      title: '1. Ruleta de Categorías',
      icon: 'fa-dharmachakra',
      color: 'from-indigo-500 to-purple-600',
      description:
        'Girás la ruleta interactiva para descubrir 1 de las 5 temáticas: Relaciones Mágicas, Mi Mundo, Mar de Emociones, Caja de Sorpresas o Misiones Especiales.',
    },
    {
      step: 2,
      title: '2. Tarjeta Educativa y Reflexión',
      icon: 'fa-heart',
      color: 'from-pink-500 to-rose-600',
      description:
        'Cada pregunta propone una oportunidad para compartir tus pensamientos. Todos escuchan con respeto y empatía, sumando +1 punto por expresarse.',
    },
    {
      step: 3,
      title: '3. Regla de Oro (Bidireccionalidad)',
      icon: 'fa-shield-heart',
      color: 'from-amber-500 to-orange-600',
      description:
        'Niños, jóvenes y adultos responden por igual sin juicios, criticas ni reproches. Lo compartido fortalece la unión grupal.',
    },
    {
      step: 4,
      title: '4. Modos de Juego Flexibles',
      icon: 'fa-sparkles',
      color: 'from-emerald-500 to-teal-600',
      description:
        'Elegí entre Clásico con Ruleta, Cooperativo en equipo, Rutina Nocturna de calma o Contrarreloj de 30 segundos.',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col justify-between overflow-hidden rounded-3xl border border-indigo-200 dark:border-indigo-800 shadow-2xl p-4 md:p-6 my-1 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      {/* Background Stage Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/presentation_stage_curtain_1794275063512.jpg"
          alt="Escenario Didáctico"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-110 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-indigo-950/50" />
      </div>

      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-72 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-pink-500/15 rounded-full blur-[90px] pointer-events-none" />

      {/* TOP: Game Title & Header */}
      <div className="relative z-10 text-center space-y-1.5 pt-2">
        <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-indigo-500/20 border border-indigo-300/40 px-4 py-1.5 rounded-full backdrop-blur-md shadow-md">
          <span className="text-xl">🎲</span>
          <span className="kids-font text-xs md:text-sm font-bold tracking-widest text-amber-300 uppercase">
            Juego Didáctico con Ruleta y 150 Preguntas
          </span>
        </div>

        <h1 className="kids-font text-3xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]">
          Descubriendo Emociones En Palabras
        </h1>

        <p className="text-indigo-100 text-xs md:text-sm max-w-2xl mx-auto font-medium leading-relaxed">
          Un espacio interactivo de reflexión, empatía y conexión sincera guiado por Koko.
        </p>
      </div>

      {/* CENTER: Host Sprite + Speech Bubble */}
      <div className="relative z-10 flex flex-col items-center justify-center my-3">
        {/* Host Speech Popover */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-3 max-w-lg bg-slate-900/95 border-2 border-indigo-500/60 rounded-2xl p-4 shadow-2xl backdrop-blur-md relative text-center"
        >
          <div className="flex items-center justify-between gap-2 border-b border-indigo-500/30 pb-1.5 mb-2">
            <span className="kids-font text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <i className="fa-solid fa-microphone text-pink-400"></i> Koko Host
            </span>
            <button
              type="button"
              onClick={() => speakGreeting(hostDialogue)}
              className="text-[11px] text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer font-semibold"
            >
              <i className="fa-solid fa-volume-high"></i> Escuchar
            </button>
          </div>

          <p className="text-white text-xs md:text-sm font-medium leading-relaxed">
            "{hostDialogue}"
          </p>

          <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-900 border-r-2 border-b-2 border-indigo-500/60 rotate-45" />
        </motion.div>

        {/* Koko Character Interactive Sprite */}
        <div
          className="relative cursor-pointer flex flex-col items-center group"
          onClick={() => {
            const quotes = [
              'En este juego no hay apuros. Cada participante se toma el tiempo que necesita para responder.',
              'Tómate todo el tiempo que quieras. En este espacio la mesa aguarda en calma.',
              'Las preguntas permanecen en pantalla para leer tranquilamente a tu propio ritmo.',
              'Koko observa la pantalla mientras cada participante comparte su punto de vista.',
            ];
            const q = quotes[Math.floor(Math.random() * quotes.length)];
            setHostDialogue(q);
            speakGreeting(q);
          }}
          title="¡Tocá a Koko para conversar!"
        >
          <KokoSpriteAnimator
            size={220}
            isSpeaking={isSpeaking}
            action={isSpeaking ? 'talk' : 'wave'}
            showPedestal={true}
          />
        </div>
      </div>

      {/* BOTTOM ACTION BUTTONS */}
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 pb-2">
        {participants.length > 0 && (
          <button
            type="button"
            onClick={handleResumeClick}
            className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold shadow-xl kids-font text-base cursor-pointer transition border border-emerald-400 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-play"></i>
            <span>Continuar Partida ({participants.length})</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleStartGameClick}
          className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold shadow-xl kids-font text-base cursor-pointer transition border border-indigo-400 flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-plus-circle text-amber-300"></i>
          <span>Nueva Partida</span>
        </button>

        <button
          type="button"
          onClick={handleHowToPlayClick}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold border border-slate-700 shadow-md text-xs cursor-pointer transition flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-circle-question text-amber-400 text-base"></i>
          <span>¿Cómo Jugar?</span>
        </button>
      </div>

      {/* TUTORIAL MODAL */}
      <AnimatePresence>
        {showHowToPlayModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-xl w-full bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-indigo-800 pb-3">
                <h3 className="kids-font text-xl text-white font-bold flex items-center gap-2">
                  <i className="fa-solid fa-book-open text-amber-400"></i> ¿Cómo se juega?
                </h3>
                <button
                  type="button"
                  onClick={() => setShowHowToPlayModal(false)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {tutorialSteps.map((s) => (
                  <div
                    key={`tut-step-${s.step}`}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                        <i className={`fa-solid ${s.icon}`}></i>
                      </div>
                      <h4 className="kids-font font-bold text-white text-sm">{s.title}</h4>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{s.description}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowHowToPlayModal(false);
                    onStartNewGame();
                  }}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold rounded-2xl shadow-lg kids-font text-sm cursor-pointer"
                >
                  ¡Entendido, Armar Partida!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
