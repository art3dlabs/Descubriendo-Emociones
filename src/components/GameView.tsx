import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Participant, CategoryName, GameMode, GameLimitConfig } from '../types';
import { CATEGORY_COLORS, CATEGORY_ICONS, QUESTION_BANK, HOST_QUOTES } from '../data/questions';
import { soundFX } from '../utils/sound';
import { KokoInteractiveHost } from './KokoInteractiveHost';
import { KokoExpression } from './KokoExpressionBadge';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

interface GameViewProps {
  participants: Participant[];
  currentTurnIndex: number;
  round: number;
  totalTurnsPlayed: number;
  gameLimitConfig: GameLimitConfig;
  onSetGameLimitConfig?: (config: GameLimitConfig) => void;
  gameMode: GameMode;
  onSetGameMode?: (mode: GameMode) => void;
  onNextTurn: () => void;
  onAwardPoints: (points: number, recipientIndex?: number) => void;
  onOpenPunishment: () => void; // Used for Special Missions modal
  onOpenPause?: () => void;
  onShowModal?: (title: string, message: string, iconClass?: string) => void;
  onResetScores?: () => void;
  onGoToSetup?: () => void;
  onGoToRules?: () => void;
  onGoToPresentation?: () => void;
  isSoundEnabled?: boolean;
  onToggleSound?: () => void;
}

const TIMER_30_SECONDS = 30;

export const GameView: React.FC<GameViewProps> = ({
  participants,
  currentTurnIndex,
  round,
  totalTurnsPlayed,
  gameLimitConfig,
  gameMode,
  onNextTurn,
  onAwardPoints,
  onOpenPunishment,
  onOpenPause,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryName | null>(null);
  const [questionText, setQuestionText] = useState<string>('');
  const [cardColor, setCardColor] = useState<string>('#6366f1');
  const [cardBadgeText, setCardBadgeText] = useState<string>('Esperando Ruleta');
  const [cardCounter, setCardCounter] = useState<string>('Carta #--');
  const [cardFlipped, setCardFlipped] = useState<boolean>(false);

  // Koko dialogue & reactive expression
  const [hostMsg, setHostMsg] = useState<string>(HOST_QUOTES.start[0]);
  const [kokoExpression, setKokoExpression] = useState<KokoExpression>('wink');
  const [eventTrigger, setEventTrigger] = useState<
    | 'start'
    | 'spin'
    | 'correct'
    | 'points'
    | 'roundComplete'
    | 'mission'
    | 'turn'
    | 'idle'
    | 'question'
  >('start');

  // 30s Contrarreloj timer
  const [timerSeconds, setTimerSeconds] = useState<number>(TIMER_30_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);

  // 3D Card tilt perspective
  const [cardRotate, setCardRotate] = useState({ x: 0, y: 0 });

  const currentPlayer = participants[currentTurnIndex] || { name: 'Participante', score: 0 };

  // Round progression effect
  const prevRoundRef = useRef(round);
  useEffect(() => {
    if (round > prevRoundRef.current) {
      setEventTrigger('roundComplete');
      const rcQuotes = HOST_QUOTES.roundComplete;
      const msg = rcQuotes[Math.floor(Math.random() * rcQuotes.length)];
      setHostMsg(msg);
      setKokoExpression('laugh');
      prevRoundRef.current = round;
    }
  }, [round]);

  // Enhanced 3D Canvas Roulette drawing
  const drawRoulette = useCallback((angleOffset: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const categories = Object.keys(QUESTION_BANK) as CategoryName[];
    const numSlices = categories.length;
    const arc = (2 * Math.PI) / numSlices;
    const size = canvas.width;
    const radius = size / 2;

    ctx.clearRect(0, 0, size, size);

    // Outer metallic bezel glow
    ctx.save();
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#4338ca';
    ctx.stroke();

    // Secondary ring
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#a855f7';
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angleOffset);

    // Draw Category Wedges
    categories.forEach((cat, i) => {
      const startAngle = i * arc;
      const endAngle = (i + 1) * arc;

      // Slice wedge
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius - 12, startAngle, endAngle);
      ctx.closePath();

      // Wedge color
      ctx.fillStyle = CATEGORY_COLORS[cat];
      ctx.fill();

      // Divider line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Wedge Label
      ctx.save();
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Outfit, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 6;

      let shortName: string = cat;
      if (cat === 'Relaciones Mágicas') shortName = 'Relaciones 💖';
      else if (cat === 'Mi Mundo') shortName = 'Mi Mundo 🌍';
      else if (cat === 'Mar de Emociones') shortName = 'Emociones 🌊';
      else if (cat === 'Caja de Sorpresas') shortName = 'Sorpresas 🎁';
      else if (cat === 'Misiones Especiales') shortName = 'Misiones ⭐';

      ctx.fillText(shortName, radius - 24, 5);
      ctx.restore();
    });

    ctx.restore();

    // Center knob hub
    ctx.beginPath();
    ctx.arc(radius, radius, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#6366f1';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(radius, radius, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#6366f1';
    ctx.fill();
  }, []);

  useEffect(() => {
    drawRoulette(0);
  }, [drawRoulette]);

  // Contrarreloj 30s timer
  useEffect(() => {
    if (!isTimerRunning || gameMode !== 'timer') return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          setKokoExpression('happy');
          soundFX.playTick();
          setHostMsg(
            `Se cumplieron los 30 segundos. ¡Muy buen intento, ${currentPlayer.name}!`
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, gameMode, currentPlayer.name]);

  // Roulette Spin Handler
  const spinRoulette = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsTimerRunning(false);
    setEventTrigger('spin');
    setKokoExpression('thinking');

    const sQuotes = HOST_QUOTES.spin;
    setHostMsg(sQuotes[Math.floor(Math.random() * sQuotes.length)]);
    soundFX.playPop();

    const categories = Object.keys(QUESTION_BANK) as CategoryName[];
    const targetCatIndex = Math.floor(Math.random() * categories.length);
    const selectedCategory = categories[targetCatIndex];

    const numSlices = categories.length;
    const arc = (2 * Math.PI) / numSlices;
    const extraRotations = 5 + Math.floor(Math.random() * 3);
    const targetSliceAngle = (numSlices - targetCatIndex - 0.5) * arc;
    const totalRotation = extraRotations * 2 * Math.PI + targetSliceAngle;

    const duration = 2800;
    const startTime = performance.now();

    const animateWheel = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentAngle = ease * totalRotation;

      drawRoulette(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animateWheel);
      } else {
        setIsSpinning(false);
        soundFX.playFanfare();
        selectCategory(selectedCategory);
      }
    };

    requestAnimationFrame(animateWheel);
  };

  const selectCategory = (cat: CategoryName) => {
    setCurrentCategory(cat);
    const color = CATEGORY_COLORS[cat];
    setCardColor(color);
    setCardBadgeText(`${cat}`);

    const questions = QUESTION_BANK[cat];
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQ = questions[randomIndex];

    setCardCounter(`Carta #${randomIndex + 1} de ${questions.length}`);
    setQuestionText(selectedQ);

    setCardFlipped(true);
    setTimeout(() => setCardFlipped(false), 450);

    if (cat === 'Misiones Especiales') {
      setEventTrigger('mission');
      setKokoExpression('happy');
      setHostMsg(`Misión Especial para ${currentPlayer.name}. "${selectedQ}"`);
    } else {
      setEventTrigger('question');
      setKokoExpression('knowing');
      setHostMsg(`Turno de ${currentPlayer.name}. Categoría "${cat}": "${selectedQ}".`);
    }

    if (gameMode === 'timer') {
      setTimerSeconds(TIMER_30_SECONDS);
      setIsTimerRunning(true);
    }
  };

  // Award Point Handler (+1 pto) AND ADVANCE TURN TO NEXT PLAYER!
  const handleAwardPoint = () => {
    if (!currentCategory || isSpinning) return;
    setIsTimerRunning(false);

    // 1. Award point to active player
    onAwardPoints(1);
    setEventTrigger('points');
    setKokoExpression('laugh');

    const pQuotes = HOST_QUOTES.points;
    setHostMsg(pQuotes[Math.floor(Math.random() * pQuotes.length)]);
    soundFX.playScorePoint();
    confetti({
      particleCount: 55,
      spread: 70,
      origin: { y: 0.6 },
    });

    // 2. Advance turn to next player!
    onNextTurn();

    // 3. Reset question card for the next player
    setCurrentCategory(null);
    setCardBadgeText('Esperando Ruleta');
    setCardCounter('Carta #--');
    setCardColor('#6366f1');
  };

  // Skip / Next Turn without awarding point AND ADVANCE TURN TO NEXT PLAYER!
  const handleNextTurnClean = () => {
    setIsTimerRunning(false);
    onNextTurn();
    setCurrentCategory(null);
    setCardBadgeText('Esperando Ruleta');
    setCardCounter('Carta #--');
    setCardColor('#6366f1');
    setEventTrigger('turn');
    setKokoExpression('wink');
    const tQuotes = HOST_QUOTES.turn;
    setHostMsg(tQuotes[Math.floor(Math.random() * tQuotes.length)]);
    soundFX.playPop();
  };

  // 3D Card mouse parallax
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setCardRotate({
      x: (-y / rect.height) * 8,
      y: (x / rect.width) * 8,
    });
  };

  const handleCardMouseLeave = () => {
    setCardRotate({ x: 0, y: 0 });
  };

  // Progress stats calculation
  const getProgressStats = () => {
    switch (gameLimitConfig.type) {
      case 'rounds': {
        const total = gameLimitConfig.maxRounds;
        const current = Math.min(round, total);
        const percent = Math.min(100, Math.round((current / total) * 100));
        return {
          title: `Ronda ${round} de ${total}`,
          subtitle: `${Math.max(0, total - round)} rondas restantes`,
          percent,
        };
      }
      case 'turns': {
        const total = gameLimitConfig.maxTurns;
        const current = Math.min(totalTurnsPlayed, total);
        const percent = Math.min(100, Math.round((current / total) * 100));
        return {
          title: `Jugada ${totalTurnsPlayed} de ${total}`,
          subtitle: `${Math.max(0, total - totalTurnsPlayed)} jugadas restantes`,
          percent,
        };
      }
      case 'points': {
        const target = gameLimitConfig.targetPoints;
        const leaderScore = Math.max(...participants.map((p) => p.score), 0);
        const percent = Math.min(100, Math.round((leaderScore / target) * 100));
        return {
          title: `Meta: ${target} Puntos`,
          subtitle: `Líder: ${leaderScore} / ${target} pts`,
          percent,
        };
      }
      case 'unlimited':
      default:
        return {
          title: `Modo Libre`,
          subtitle: `Ronda ${round} • ${totalTurnsPlayed} jugadas`,
          percent: 100,
        };
    }
  };

  const progressStats = getProgressStats();

  const modeBadgeInfo = {
    classic: { name: 'Clásico con Ruleta', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300' },
    coop: { name: 'Cooperativo / Misiones', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' },
    night: { name: 'Rutina Nocturna 🌙', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300' },
    timer: { name: 'Contrarreloj ⏱️', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' },
  }[gameMode];

  return (
    <div className="space-y-4 transition-transform duration-200 pb-16">
      {/* TOP HUD: ACTIVE PLAYER & STATUS */}
      <div className="bg-white/95 dark:bg-slate-900/90 rounded-3xl p-3 sm:p-4 shadow-sm border border-indigo-100 dark:border-indigo-800/60 backdrop-blur-md space-y-2.5 transition-colors">
        <div className="flex flex-wrap justify-between items-center gap-3">
          {/* Active Player */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-black text-xl shadow-sm kids-font ring-2 ring-indigo-300/40">
                {currentPlayer.name.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Turno en Vivo
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${modeBadgeInfo.color}`}>
                  {modeBadgeInfo.name}
                </span>
              </div>
              <h3 className="kids-font text-lg md:text-xl text-slate-900 dark:text-white font-extrabold leading-tight">
                👤 {currentPlayer.name}
              </h3>
              <span className="text-xs text-indigo-600 dark:text-amber-300 font-bold flex items-center gap-1">
                <span>⭐</span> {currentPlayer.score} puntos acumulados
              </span>
            </div>
          </div>

          {/* Standings strip */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1">
            {participants.map((p, i) => (
              <div
                key={`standing-${p.id || i}-${i}`}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                  p.name === currentPlayer.name
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-[10px] opacity-75 font-bold">#{i + 1}</span>
                <span className="truncate max-w-[85px]">{p.name}</span>
                <span className="font-bold">{p.score} pts</span>
              </div>
            ))}
          </div>

          {/* Action buttons: Pause & Skip to Next Turn */}
          <div className="flex items-center gap-2">
            {onOpenPause && (
              <button
                type="button"
                onClick={onOpenPause}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 text-xs border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm"
                title="Pausar el juego y abrir opciones"
              >
                <i className="fa-solid fa-pause text-amber-500"></i>
                <span>Pausa</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNextTurnClean}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 text-xs shadow-sm cursor-pointer kids-font"
              title="Pasar al siguiente jugador sin sumar punto"
            >
              <span>Siguiente Turno</span>
              <i className="fa-solid fa-forward-step"></i>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {gameLimitConfig.type !== 'unlimited' && (
          <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <span>{progressStats.title}</span>
              <span className="text-indigo-600 dark:text-amber-300 font-bold">{progressStats.percent}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressStats.percent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* COOP & NIGHT BANNERS */}
      {gameMode === 'coop' && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 rounded-2xl p-3 border border-emerald-400/50 shadow-sm flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🤝</span>
            <div>
              <h5 className="kids-font font-extrabold text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm">
                Modo Cooperativo / Misiones en Equipo
              </h5>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                Todos colaboran juntos en consignas grupales de expresión y empatía.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPunishment}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl kids-font text-xs cursor-pointer shadow-sm flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>⭐ Sortea Misión</span>
          </button>
        </div>
      )}

      {/* MAIN ARENA: CARD & ROULETTE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT: THE QUESTION CARD */}
        <div className="lg:col-span-6 flex flex-col">
          <div
            className="perspective-1000 h-full"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <motion.div
              style={{
                transform: `rotateX(${cardRotate.x}deg) rotateY(${cardRotate.y}deg)`,
                transformStyle: 'preserve-3d',
              }}
              animate={cardFlipped ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="bg-white/95 dark:bg-slate-900/90 rounded-3xl shadow-lg border-2 border-indigo-100 dark:border-indigo-500/30 p-5 md:p-6 relative overflow-hidden backdrop-blur-md h-full flex flex-col justify-between transition-colors"
            >
              {/* Category Color Accent */}
              <div
                className="absolute top-0 left-0 right-0 h-3 transition-colors duration-500"
                style={{ backgroundColor: cardColor }}
              />

              {/* Card Header */}
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3 pt-1">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-white shadow-sm transition-colors duration-500 kids-font"
                  style={{ backgroundColor: cardColor }}
                >
                  <span>✨</span>
                  <span>{cardBadgeText}</span>
                </span>

                <div className="flex items-center gap-2">
                  {/* Timer display in Contrarreloj mode */}
                  {gameMode === 'timer' && (
                    <div
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 shadow-sm transition-colors ${
                        isTimerRunning
                          ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                          : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <span>⏱️</span>
                      <span>{timerSeconds}s</span>
                    </div>
                  )}

                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    {cardCounter}
                  </span>
                </div>
              </div>

              {/* Question Text or Waiting Prompt */}
              <div className="my-4 min-h-[130px] flex items-center justify-center text-center px-2">
                <h4 className="kids-font text-xl md:text-2xl text-slate-900 dark:text-white font-extrabold leading-snug drop-shadow-sm">
                  {currentCategory
                    ? `"${questionText}"`
                    : `¡Turno de ${currentPlayer.name}! Hacé girar la ruleta para descubrir tu tarjeta.`}
                </h4>
              </div>

              {/* Golden Rule Footer */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2.5 mb-3">
                <div className="flex items-center gap-1.5 font-medium italic">
                  <span>🌟</span>
                  <span><strong>Regla de Oro:</strong> Escucha activa y empatía.</span>
                </div>

                <button
                  type="button"
                  onClick={onOpenPunishment}
                  className="text-xs text-indigo-600 dark:text-emerald-300 hover:underline font-bold transition cursor-pointer flex items-center gap-1"
                >
                  <span>⭐ Misión Especial</span>
                </button>
              </div>

              {/* Primary Action Buttons: Scoring & Turn Progression */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3.5 flex flex-wrap items-center justify-between gap-2.5">
                {participants.length > 1 && currentCategory ? (
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(true)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                    title="Asignar punto a otro participante"
                  >
                    <i className="fa-solid fa-user-plus mr-1"></i> Punto a otro
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  {/* The main scoring button: Sumar Punto & Siguiente */}
                  <button
                    type="button"
                    onClick={handleAwardPoint}
                    disabled={!currentCategory || isSpinning}
                    className={`font-extrabold px-5 py-3 rounded-2xl shadow-md transition flex items-center gap-2 kids-font text-sm md:text-base cursor-pointer ${
                      currentCategory && !isSpinning
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-emerald-950'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <span>⭐️</span>
                    <span>Sumar Punto & Siguiente</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => currentCategory && selectCategory(currentCategory)}
                    disabled={!currentCategory || isSpinning}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-3 py-3 rounded-2xl transition text-xs cursor-pointer disabled:opacity-40 border border-slate-200 dark:border-slate-700"
                    title="Sacar otra pregunta de esta misma categoría"
                  >
                    Otra pregunta
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT: ROULETTE WHEEL */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="bg-white/95 dark:bg-slate-900/90 rounded-3xl shadow-lg border border-indigo-100 dark:border-indigo-500/30 p-5 flex flex-col items-center justify-between backdrop-blur-md relative overflow-hidden group h-full min-h-[360px] transition-colors">
            <div className="text-center mb-1 relative z-10">
              <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Ruleta Interactiva
              </span>
              <h3 className="kids-font text-xl md:text-2xl text-slate-900 dark:text-white font-bold mt-1">Girar Ruleta</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Descubre la temática del turno</p>
            </div>

            {/* Canvas Roulette with pointer */}
            <div className="relative w-full max-w-[270px] aspect-square flex items-center justify-center my-2 perspective-1000">
              <div className="absolute -top-3 z-30 text-rose-600 drop-shadow-md text-3xl animate-bounce pointer-events-none">
                <i className="fa-solid fa-caret-down"></i>
              </div>

              <canvas
                ref={canvasRef}
                width={270}
                height={270}
                onClick={spinRoulette}
                className="w-full h-full drop-shadow-md cursor-pointer rounded-full transition-transform duration-200 hover:scale-[1.02]"
                title="¡Hacé clic para girar la ruleta!"
              />
            </div>

            {/* Spin CTA Button */}
            <button
              type="button"
              onClick={spinRoulette}
              disabled={isSpinning}
              className="w-full max-w-[260px] mt-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-extrabold py-3 px-5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 kids-font text-base cursor-pointer disabled:opacity-50"
            >
              <span className="text-lg">🎰</span>
              <span>{isSpinning ? '¡Girando la ruleta...!' : '¡Girar Ruleta!'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* FLOATING HOST KOKO */}
      <KokoInteractiveHost
        currentCategory={currentCategory}
        currentQuestion={questionText}
        activePlayerName={currentPlayer.name}
        eventTrigger={eventTrigger}
        externalExpression={kokoExpression}
        onExpressionChange={setKokoExpression}
        initialMessage={hostMsg}
        size={165}
      />

      {/* ASSIGN POINT MODAL */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full bg-white dark:bg-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4 border-b border-indigo-100 dark:border-indigo-800 pb-3">
                <h3 className="kids-font text-xl text-slate-900 dark:text-white font-bold flex items-center gap-2">
                  <span>⭐️</span> ¿A quién premiar?
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
                Elegí al participante que aportó una reflexión sincera y valiosa en esta ronda:
              </p>

              <div className="space-y-2 max-h-56 overflow-y-auto mb-5">
                {participants.map((p, idx) => (
                  <button
                    key={`assign-recipient-${p.id || idx}-${idx}`}
                    type="button"
                    onClick={() => {
                      onAwardPoints(1, idx);
                      setShowAssignModal(false);
                      setEventTrigger('points');
                      setKokoExpression('laugh');
                      setHostMsg(`Punto registrado para ${p.name}.`);
                      soundFX.playScorePoint();
                      confetti({ particleCount: 50, spread: 60 });

                      // Advance turn to next player!
                      onNextTurn();
                      setCurrentCategory(null);
                      setCardBadgeText('Esperando Ruleta');
                      setCardCounter('Carta #--');
                      setCardColor('#6366f1');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/60 border border-slate-200 dark:border-slate-700 text-left transition cursor-pointer"
                  >
                    <span className="font-bold text-slate-900 dark:text-white text-sm">👤 {p.name}</span>
                    <span className="text-xs text-indigo-600 dark:text-amber-300 font-semibold">{p.score} pts</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
