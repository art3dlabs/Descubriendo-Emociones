import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFX } from '../utils/sound';
import { kokoVoice } from '../utils/speech';
import confetti from 'canvas-confetti';
import { CategoryName } from '../types';
import { KokoSpriteAnimator, KokoSpriteAction } from './KokoSpriteAnimator';
import { KokoExpressionBadge, KokoExpression } from './KokoExpressionBadge';

export interface KokoInteractiveHostProps {
  currentCategory?: CategoryName | null;
  currentQuestion?: string;
  activePlayerName?: string;
  eventTrigger?:
    | 'start'
    | 'spin'
    | 'correct'
    | 'points'
    | 'roundComplete'
    | 'mission'
    | 'turn'
    | 'idle'
    | 'question';
  initialMessage?: string;
  className?: string;
  size?: number; // base scale
  externalExpression?: KokoExpression;
  onExpressionChange?: (expr: KokoExpression) => void;
}

export const KokoInteractiveHost: React.FC<KokoInteractiveHostProps> = ({
  currentCategory,
  currentQuestion,
  activePlayerName = 'amigos',
  eventTrigger = 'idle',
  initialMessage = '¡Hola a todos! Soy Koko, su anfitrión.',
  className = '',
  size = 175,
  externalExpression,
  onExpressionChange,
}) => {
  // Speech & Expression states
  const [speechText, setSpeechText] = useState<string>(initialMessage);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showBubble, setShowBubble] = useState<boolean>(true);
  const [spriteAction, setSpriteAction] = useState<KokoSpriteAction>('idle');
  const [expression, setExpression] = useState<KokoExpression>('wink');
  const [voiceMuted, setVoiceMuted] = useState<boolean>(false);

  // Sync external expression if provided
  useEffect(() => {
    if (externalExpression) {
      setExpression(externalExpression);
    }
  }, [externalExpression]);

  const updateExpression = useCallback(
    (newExpr: KokoExpression) => {
      setExpression(newExpr);
      if (onExpressionChange) {
        onExpressionChange(newExpr);
      }
    },
    [onExpressionChange]
  );

  // Auto-hide speech bubble after text finishes or after 7 seconds
  const bubbleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const speak = useCallback(
    (
      text: string,
      expr: KokoExpression = 'wink',
      actionHint: KokoSpriteAction = 'talk'
    ) => {
      setSpeechText(text);
      updateExpression(expr);
      setSpriteAction(actionHint);
      setShowBubble(true);

      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
      bubbleTimeoutRef.current = setTimeout(() => {
        setShowBubble(false);
      }, 7000);

      if (voiceMuted || !kokoVoice.enabled) {
        setTimeout(() => setSpriteAction('idle'), 2200);
        return;
      }

      setIsSpeaking(true);
      kokoVoice.speak(
        text,
        () => {
          setIsSpeaking(true);
          updateExpression(expr);
          setSpriteAction(actionHint);
        },
        () => {
          setIsSpeaking(false);
          setSpriteAction('idle');
        }
      );
    },
    [voiceMuted, updateExpression]
  );

  // Game Event Synchronization
  const prevQuestionRef = useRef<string | undefined>(currentQuestion);
  const prevPlayerRef = useRef<string | undefined>(activePlayerName);
  const prevEventTriggerRef = useRef<string>(eventTrigger);

  // 1. New question card drawn
  useEffect(() => {
    if (
      currentQuestion &&
      currentQuestion !== prevQuestionRef.current &&
      !currentQuestion.includes('Hacé girar la ruleta')
    ) {
      prevQuestionRef.current = currentQuestion;
      const questionPrompt = `Turno de ${activePlayerName}. Categoría ${currentCategory || 'especial'}: "${currentQuestion}". La mesa aguarda en calma.`;
      speak(questionPrompt, 'knowing', 'present');
    }
  }, [currentQuestion, currentCategory, activePlayerName, speak]);

  // 2. Active player changes
  useEffect(() => {
    if (activePlayerName && activePlayerName !== prevPlayerRef.current) {
      prevPlayerRef.current = activePlayerName;
      const turnLines = [
        `Turno de ${activePlayerName}. Tómate tu tiempo, la mesa escucha con atención.`,
        `Le toca a ${activePlayerName}. Hay espacio para pensar antes de girar la ruleta.`,
        `Es el turno de ${activePlayerName}. Escuchamos con atención tu aporte.`,
      ];
      const pick = turnLines[Math.floor(Math.random() * turnLines.length)];
      speak(pick, 'wink', 'point');
    }
  }, [activePlayerName, speak]);

  // 3. Game trigger events
  useEffect(() => {
    if (eventTrigger && eventTrigger !== prevEventTriggerRef.current) {
      prevEventTriggerRef.current = eventTrigger;

      if (eventTrigger === 'points') {
        const cheerLines = [
          `Punto registrado para ${activePlayerName}. La mesa escuchó con atención.`,
          `Respuesta anotada en el marcador para ${activePlayerName}.`,
          `Sumamos un punto a la cuenta de ${activePlayerName}.`,
        ];
        speak(cheerLines[Math.floor(Math.random() * cheerLines.length)], 'laugh', 'celebrate');
        confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
      } else if (eventTrigger === 'mission') {
        const missionLines = [
          `Misión Especial para ${activePlayerName}. Consigna grupal visible en pantalla.`,
          `Aparece un reto grupal. Nos tomamos un momento para realizarlo juntos.`,
        ];
        speak(missionLines[Math.floor(Math.random() * missionLines.length)], 'happy', 'crouch');
      } else if (eventTrigger === 'spin') {
        speak(`La ruleta gira pausadamente para marcar la temática de ${activePlayerName}.`, 'thinking', 'spin_wheel');
      } else if (eventTrigger === 'roundComplete') {
        speak(`Completamos la ronda. Cada integrante tuvo su tiempo para hablar.`, 'laugh', 'victory');
      }
    }
  }, [eventTrigger, activePlayerName, speak]);

  // Interactive click on Koko
  const handleHostClick = () => {
    const list: Array<{ expr: KokoExpression; action: KokoSpriteAction; msg: string }> = [
      { expr: 'wink', action: 'wave', msg: `Koko aguarda en calma mientras la mesa conversan sobre sus ideas.` },
      { expr: 'laugh', action: 'celebrate', msg: 'Aquí nadie apura las palabras. Cada uno se toma el tiempo que necesita.' },
      { expr: 'happy', action: 'talk', msg: 'Las preguntas permanecen en pantalla el tiempo necesario para leer con atención.' },
      { expr: 'knowing', action: 'point', msg: 'Quien habla tiene la palabra y el resto de la mesa escucha en silencio.' },
      { expr: 'thinking', action: 'talk', msg: 'Un espacio tranquilo donde todos participan a su propio ritmo.' },
    ];
    const pick = list[Math.floor(Math.random() * list.length)];
    speak(pick.msg, pick.expr, pick.action);
    soundFX.playPop();
  };

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 select-none flex flex-col items-center pointer-events-auto ${className}`}
    >
      {/* FLOATING SPEECH BUBBLE */}
      <AnimatePresence>
        {showBubble && speechText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            className="mb-2 max-w-[240px] md:max-w-[280px] bg-slate-900/95 border-2 border-indigo-500/80 rounded-2xl p-3 shadow-2xl backdrop-blur-md relative text-left text-xs font-semibold text-slate-100"
          >
            {/* Header pill */}
            <div className="flex items-center justify-between gap-1 mb-1 border-b border-indigo-800/60 pb-1">
              <span className="kids-font text-[11px] font-extrabold text-amber-300 flex items-center gap-1">
                <i className="fa-solid fa-microphone text-pink-400"></i> Koko Host
              </span>
              <button
                type="button"
                onClick={() => setShowBubble(false)}
                className="text-slate-400 hover:text-white text-[10px] px-1 cursor-pointer"
                title="Cerrar diálogo"
              >
                ✕
              </button>
            </div>

            <p className="leading-snug text-slate-100 font-medium">"{speechText}"</p>

            {/* Audio equalizer animation */}
            {isSpeaking && (
              <div className="flex items-center gap-1 mt-1.5">
                {[0.4, 0.9, 0.5, 1, 0.6].map((_, i) => (
                  <motion.div
                    key={`koko-float-bar-${i}`}
                    animate={{ height: ['3px', '12px', '4px'] }}
                    transition={{ repeat: Infinity, duration: 0.35 + i * 0.08, ease: 'easeInOut' }}
                    className="w-1 bg-gradient-to-t from-indigo-400 to-pink-400 rounded-full"
                  />
                ))}
              </div>
            )}

            {/* Bubble tail */}
            <div className="absolute -bottom-2 left-8 w-3.5 h-3.5 bg-slate-900 border-r-2 border-b-2 border-indigo-500/80 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING KOKO SPRITE */}
      <div className="relative group flex flex-col items-center">
        <KokoSpriteAnimator
          action={spriteAction}
          isSpeaking={isSpeaking}
          size={size}
          showPedestal={true}
          onClick={handleHostClick}
        />

        {/* CONTROLS STRIP */}
        <div className="mt-1 flex items-center gap-1.5 bg-slate-900/90 border border-indigo-500/40 px-2.5 py-1.5 rounded-2xl shadow-xl backdrop-blur-md">
          <KokoExpressionBadge
            expression={expression}
            size={36}
            showLabel={false}
            onClick={handleHostClick}
          />

          {/* Voice Mute Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !voiceMuted;
              setVoiceMuted(next);
              kokoVoice.enabled = !next;
              if (next) {
                kokoVoice.stop();
                setIsSpeaking(false);
                setSpriteAction('idle');
              }
            }}
            className={`text-[10px] font-bold px-2 py-1 rounded-xl transition cursor-pointer flex items-center gap-1 border ${
              !voiceMuted && kokoVoice.enabled
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-600'
                : 'bg-rose-950/90 text-rose-300 border-rose-600'
            }`}
            title={voiceMuted || !kokoVoice.enabled ? 'Activar voz latina' : 'Silenciar voz'}
          >
            <i className={`fa-solid ${!voiceMuted && kokoVoice.enabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
            <span>{!voiceMuted && kokoVoice.enabled ? 'Voz ON' : 'Mudo'}</span>
          </button>

          {/* Repeat Speech */}
          <button
            type="button"
            onClick={() => speak(speechText, expression, spriteAction)}
            className="text-[10px] font-bold p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition cursor-pointer"
            title="Repetir frase"
          >
            <i className="fa-solid fa-rotate-right"></i>
          </button>

          {/* Quick Wave */}
          <button
            type="button"
            onClick={() => {
              speak(`¡Hola ${activePlayerName}! Escuchamos atentamente tu participación.`, 'wink', 'wave');
              soundFX.playPop();
            }}
            className="text-[10px] font-bold px-1.5 py-1 bg-indigo-950 hover:bg-indigo-900 text-amber-300 rounded-xl border border-indigo-700 transition cursor-pointer"
            title="Saludar"
          >
            👋
          </button>
        </div>
      </div>
    </div>
  );
};
