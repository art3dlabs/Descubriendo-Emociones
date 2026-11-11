import React, { useState, useEffect } from 'react';
import { Participant } from '../types';
import { HOST_QUOTES } from '../data/questions';
import { kokoVoice } from '../utils/speech';
import { motion, AnimatePresence } from 'motion/react';
import { KokoSpriteAnimator, KokoSpriteAction } from './KokoSpriteAnimator';

interface HostCharacterProps {
  currentParticipant?: Participant;
  currentQuestion?: string;
  categoryName?: string;
  round?: number;
  eventTrigger?: 'start' | 'spin' | 'correct' | 'points' | 'roundComplete' | 'punishment' | 'mission' | 'turn' | 'idle' | 'question';
  customMessage?: string;
  expression?: 'happy' | 'thinking' | 'excited' | 'mischievous' | 'surprised';
  onHostClick?: () => void;
  autoSpeak?: boolean;
  awardedPlayerName?: string;
  mode?: 'stage' | 'roaming' | 'presentation';
  onToggleRoam?: () => void;
}

export const HostCharacter: React.FC<HostCharacterProps> = ({
  currentParticipant,
  currentQuestion,
  categoryName,
  round = 1,
  eventTrigger = 'start',
  customMessage,
  expression = 'happy',
  onHostClick,
  autoSpeak = true,
  awardedPlayerName,
  mode = 'stage',
}) => {
  const [message, setMessage] = useState<string>('¡Hola a todos! ¡Bienvenidos a Cuestión de Realidad!');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => kokoVoice.enabled);
  const [spriteAction, setSpriteAction] = useState<KokoSpriteAction>('idle');
  const [isRoaming, setIsRoaming] = useState<boolean>(mode === 'roaming');
  const [roamPosition, setRoamPosition] = useState<'right' | 'left' | 'center'>('right');

  // Idle chatter every 22 seconds to keep party lively
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSpeaking && voiceEnabled && kokoVoice.enabled) {
        const idleList = HOST_QUOTES.idle;
        const randomIdle = idleList[Math.floor(Math.random() * idleList.length)];
        const pName = currentParticipant ? currentParticipant.name : 'amigos';
        const msg = `${pName}, ${randomIdle}`;
        setMessage(msg);
        setSpriteAction('talk');
        speakMessage(msg);
      }
    }, 22000);

    return () => clearInterval(timer);
  }, [isSpeaking, voiceEnabled, currentParticipant]);

  useEffect(() => {
    let textToSpeak = customMessage || '';
    let actionHint: KokoSpriteAction = 'talk';

    if (customMessage) {
      textToSpeak = customMessage;
    } else {
      const pName = currentParticipant ? currentParticipant.name : 'amigo';
      const luckyName = awardedPlayerName || pName;

      switch (eventTrigger) {
        case 'start': {
          const quotes = HOST_QUOTES.start;
          textToSpeak = quotes[Math.floor(Math.random() * quotes.length)];
          actionHint = 'wave';
          break;
        }
        case 'spin': {
          const quotes = HOST_QUOTES.spin;
          textToSpeak = quotes[Math.floor(Math.random() * quotes.length)];
          actionHint = 'spin_wheel';
          break;
        }
        case 'question': {
          if (currentQuestion) {
            textToSpeak = `Atención ${pName}, categoría ${categoryName || 'General'}: "${currentQuestion}". ¡A responder sin filtro!`;
          } else {
            textToSpeak = `¡Turno de ${pName}! Hacé girar la ruleta para tu pregunta.`;
          }
          actionHint = 'present';
          break;
        }
        case 'correct':
        case 'points': {
          const quotes = HOST_QUOTES.points;
          const template = quotes[Math.floor(Math.random() * quotes.length)];
          textToSpeak = template.replace('{name}', luckyName);
          actionHint = 'celebrate';
          break;
        }
        case 'roundComplete': {
          const quotes = HOST_QUOTES.roundComplete;
          textToSpeak = quotes[Math.floor(Math.random() * quotes.length)];
          actionHint = 'victory';
          break;
        }
        case 'punishment':
        case 'mission': {
          const quotes = HOST_QUOTES.mission;
          textToSpeak = quotes[Math.floor(Math.random() * quotes.length)];
          actionHint = 'point';
          break;
        }
        case 'turn': {
          const quotes = HOST_QUOTES.turn;
          textToSpeak = quotes[Math.floor(Math.random() * quotes.length)];
          actionHint = 'wave';
          break;
        }
        case 'idle':
        default: {
          const quotes = HOST_QUOTES.idle;
          textToSpeak = `${pName}, ${quotes[Math.floor(Math.random() * quotes.length)]}`;
          actionHint = 'talk';
          break;
        }
      }
    }

    if (textToSpeak) {
      setMessage(textToSpeak);
      setSpriteAction(actionHint);
      if (autoSpeak && voiceEnabled && kokoVoice.enabled) {
        speakMessage(textToSpeak, actionHint);
      }
    }
  }, [eventTrigger, customMessage, currentParticipant, round, currentQuestion, categoryName, autoSpeak, voiceEnabled, awardedPlayerName]);

  const speakMessage = (text: string, actionHint: KokoSpriteAction = 'talk') => {
    if (!voiceEnabled || !kokoVoice.enabled) return;
    setIsSpeaking(true);
    setSpriteAction(actionHint);
    kokoVoice.speak(
      text,
      () => {
        setIsSpeaking(true);
        setSpriteAction(actionHint);
      },
      () => {
        setIsSpeaking(false);
        setSpriteAction('idle');
      }
    );
  };

  const toggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    kokoVoice.enabled = next;
    if (!next) {
      kokoVoice.stop();
      setIsSpeaking(false);
      setSpriteAction('idle');
    } else {
      speakMessage(message);
    }
  };

  const handleHostClick = () => {
    if (onHostClick) {
      onHostClick();
      return;
    }
    const gestures: KokoSpriteAction[] = ['celebrate', 'victory', 'wave', 'jump', 'present'];
    const chosen = gestures[Math.floor(Math.random() * gestures.length)];
    setSpriteAction(chosen);

    const friendlyQuotes = [
      '¡Me encanta la energía de este grupo! ¡Cero caretas, pura verdad!',
      '¿Quién se anima a una pregunta picante ahora?',
      '¡Acá las apariencias se quedan afuera, puro disfrute!',
      '¡El que no dice la verdad, derechito a la Ruleta de Castigos!',
    ];
    const pick = friendlyQuotes[Math.floor(Math.random() * friendlyQuotes.length)];
    setMessage(pick);
    speakMessage(pick, chosen);
    setTimeout(() => setSpriteAction('idle'), 2500);
  };

  return (
    <>
      {/* ----------------- DYNAMIC STAGE HOST BAR WITH FULL SPRITES (NO SVG ERRORS) ----------------- */}
      <div className="relative z-30 my-2 select-none">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-3 md:p-4 shadow-2xl relative overflow-visible">
          {/* Ambient stage lights behind */}
          <div className="absolute top-0 right-1/4 w-96 h-28 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-28 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* LEFT: Full Unboxed Host Character using Smooth Sprites */}
          <div className="flex-shrink-0 flex items-center justify-center -mt-6 md:-mt-10 md:-ml-2 relative z-20">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="relative cursor-pointer"
              title="¡Hacé clic en Koko para que interactúe con el grupo!"
            >
              <KokoSpriteAnimator
                size={165}
                isSpeaking={isSpeaking}
                action={spriteAction}
                showPedestal={true}
                onClick={handleHostClick}
              />
            </motion.div>
          </div>

          {/* CENTER: Dynamic Speech Balloon with Audio Indicator */}
          <div className="flex-grow w-full space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 kids-font">
                  <i className="fa-solid fa-microphone text-pink-400"></i> Koko Anfitrión
                </span>
                {currentParticipant && (
                  <span className="text-xs text-indigo-300 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-400/20">
                    Turno: <strong className="text-white">{currentParticipant.name}</strong>
                  </span>
                )}
              </div>

              {/* Quick Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsRoaming(!isRoaming)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 border shadow-sm ${
                    isRoaming
                      ? 'bg-fuchsia-600 text-white border-fuchsia-400 shadow-fuchsia-900/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title="Activar/Desactivar anfitrión libre"
                >
                  <i className="fa-solid fa-person-walking text-xs"></i>
                  <span className="hidden sm:inline">{isRoaming ? 'En Escenario' : 'Pasear'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 border shadow-sm ${
                    voiceEnabled && kokoVoice.enabled
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                      : 'bg-rose-950/80 text-rose-300 border-rose-700'
                  }`}
                  title={voiceEnabled && kokoVoice.enabled ? 'Silenciar voz de Koko' : 'Activar voz'}
                >
                  <i
                    className={`fa-solid ${
                      voiceEnabled && kokoVoice.enabled ? 'fa-volume-high' : 'fa-volume-xmark'
                    }`}
                  ></i>
                  <span className="hidden sm:inline">
                    {voiceEnabled && kokoVoice.enabled ? 'Voz ON' : 'Mudo'}
                  </span>
                </button>
              </div>
            </div>

            {/* Comic Dialogue Bubble with Tail */}
            <div className="bg-slate-950/90 border border-indigo-500/40 rounded-2xl p-3 md:p-4 shadow-inner relative">
              <p className="text-sm md:text-base text-slate-100 font-medium leading-snug">
                "{message}"
              </p>

              {/* Audio visualizer */}
              {isSpeaking && (
                <div className="flex items-center gap-1 mt-2">
                  <span className="w-1.5 h-3 bg-pink-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-4 bg-purple-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  <span className="text-[10px] text-pink-400 font-bold ml-1 uppercase tracking-wider">
                    Koko hablando
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- ROAMING HOST MODE (FLOATING SPRITE WIDGET) ----------------- */}
      <AnimatePresence>
        {isRoaming && (
          <motion.div
            drag
            dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`fixed bottom-6 ${
              roamPosition === 'right' ? 'right-6' : roamPosition === 'left' ? 'left-6' : 'left-1/2 -translate-x-1/2'
            } z-50 flex flex-col items-center cursor-grab active:cursor-grabbing select-none`}
          >
            {/* Dialogue Bubble */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-2 max-w-xs bg-slate-950/95 border-2 border-fuchsia-500/80 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-center text-xs relative"
            >
              <div className="flex justify-between items-center gap-2 mb-1 border-b border-fuchsia-500/30 pb-1">
                <span className="kids-font text-amber-300 font-bold text-[11px] flex items-center gap-1">
                  <i className="fa-solid fa-microphone text-pink-400"></i> Koko Paseando
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const next = roamPosition === 'right' ? 'left' : roamPosition === 'left' ? 'center' : 'right';
                      setRoamPosition(next);
                    }}
                    className="text-slate-400 hover:text-cyan-400 text-xs p-0.5"
                    title="Mover de lado"
                  >
                    ⇄
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRoaming(false)}
                    className="text-slate-400 hover:text-rose-400 text-xs p-0.5"
                    title="Cerrar modo libre"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <p className="line-clamp-3 leading-snug font-medium text-slate-100">{message}</p>
              {/* Balloon tail */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-slate-900 border-r-2 border-b-2 border-fuchsia-500 rotate-45" />
            </motion.div>

            {/* Unboxed Roaming Character with Smooth Sprites */}
            <div className="relative group flex flex-col items-center">
              <KokoSpriteAnimator
                size={145}
                isSpeaking={isSpeaking}
                action={spriteAction}
                showPedestal={true}
                onClick={handleHostClick}
              />
              <span className="mt-1 bg-fuchsia-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow pointer-events-none">
                Arrastrame
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
