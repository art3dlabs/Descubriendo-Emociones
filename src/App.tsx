import { useState, useEffect, useCallback } from 'react';
import { Participant, GameMode, GameLimitConfig, GameHistoryEntry, SavedPlayer } from './types';
import { soundFX } from './utils/sound';
import { kokoVoice } from './utils/speech';
import { Navbar } from './components/Navbar';
import { PresentationView } from './components/PresentationView';
import { SetupView } from './components/SetupView';
import { GameView } from './components/GameView';
import { RankingView } from './components/RankingView';
import { RulesView } from './components/RulesView';
import { PunishmentModal } from './components/PunishmentModal';
import { CustomModal } from './components/CustomModal';
import { GameOverModal } from './components/GameOverModal';
import { HistoryModal } from './components/HistoryModal';
import { IntroAnimationModal } from './components/IntroAnimationModal';
import { PauseModal } from './components/PauseModal';

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
      const saved = localStorage.getItem('reality_v2_participants');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      const seenIds = new Set<string>();
      return parsed.map((p: any, idx: number) => {
        let id = p && p.id ? String(p.id) : '';
        if (!id || seenIds.has(id)) {
          id = `p-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 8)}`;
        }
        seenIds.add(id);
        return {
          id,
          name: p && p.name ? String(p.name) : `Jugador ${idx + 1}`,
          score: typeof p?.score === 'number' ? p.score : 0,
        };
      });
    } catch {
      return [];
    }
  });

  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [round, setRound] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('reality_v2_round');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [totalTurnsPlayed, setTotalTurnsPlayed] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('reality_v2_turns');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [gameMode, setGameMode] = useState<GameMode>(() => {
    try {
      return (localStorage.getItem('reality_v2_mode') as GameMode) || 'classic';
    } catch {
      return 'classic';
    }
  });

  const [gameLimitConfig, setGameLimitConfig] = useState<GameLimitConfig>(() => {
    try {
      const saved = localStorage.getItem('reality_v2_limit');
      return saved
        ? JSON.parse(saved)
        : {
            type: 'rounds',
            maxRounds: 5,
            maxTurns: 15,
            targetPoints: 5,
          };
    } catch {
      return {
        type: 'rounds',
        maxRounds: 5,
        maxTurns: 15,
        targetPoints: 5,
      };
    }
  });

  const [history, setHistory] = useState<GameHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('reality_v2_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedPlayers, setSavedPlayers] = useState<SavedPlayer[]>(() => {
    try {
      const saved = localStorage.getItem('reality_v2_player_directory');
      if (saved) return JSON.parse(saved);
      return [
        { id: 'sp-1', name: 'Sofía', gamesPlayed: 4, totalWins: 2, totalScore: 18 },
        { id: 'sp-2', name: 'Mateo', gamesPlayed: 3, totalWins: 1, totalScore: 14 },
        { id: 'sp-3', name: 'Valentina', gamesPlayed: 2, totalWins: 0, totalScore: 8 },
        { id: 'sp-4', name: 'Lucas', gamesPlayed: 5, totalWins: 1, totalScore: 21 },
      ];
    } catch {
      return [];
    }
  });

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Toggle pause on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPaused((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return (localStorage.getItem('reality_v2_theme') as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [currentView, setCurrentView] = useState<'presentation' | 'setup' | 'game' | 'ranking' | 'rules'>('presentation');
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);

  // Modals state
  const [isPunishmentOpen, setIsPunishmentOpen] = useState<boolean>(false);
  const [customModal, setCustomModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    iconClass?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    iconClass: 'fa-circle-check',
  });

  useEffect(() => {
    try {
      localStorage.setItem('reality_v2_participants', JSON.stringify(participants));
      localStorage.setItem('reality_v2_round', round.toString());
      localStorage.setItem('reality_v2_turns', totalTurnsPlayed.toString());
      localStorage.setItem('reality_v2_mode', gameMode);
      localStorage.setItem('reality_v2_limit', JSON.stringify(gameLimitConfig));
      localStorage.setItem('reality_v2_theme', theme);
      localStorage.setItem('reality_v2_history', JSON.stringify(history));
      localStorage.setItem('reality_v2_player_directory', JSON.stringify(savedPlayers));
    } catch {
      // storage error
    }
  }, [participants, round, totalTurnsPlayed, gameMode, gameLimitConfig, theme, history, savedPlayers]);

  const recordMatchCompletion = useCallback(
    (currentParticipants: Participant[], rounds: number, turns: number, config: GameLimitConfig) => {
      if (currentParticipants.length === 0) return;
      const sorted = [...currentParticipants].sort((a, b) => b.score - a.score);
      const winner = sorted[0];
      const now = new Date();
      const dateStr = now.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const entry: GameHistoryEntry = {
        id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        date: dateStr,
        winnerName: winner ? winner.name : 'Mesa Grupal',
        winnerScore: winner ? winner.score : 0,
        participants: currentParticipants.map((p) => ({ name: p.name, score: p.score })),
        roundsPlayed: rounds,
        turnsPlayed: turns,
        limitType: config.type,
      };

      setHistory((prev) => [entry, ...prev].slice(0, 40));

      // Update directory player stats
      setSavedPlayers((prev) =>
        prev.map((sp) => {
          const matchP = currentParticipants.find(
            (p) => p.name.toLowerCase() === sp.name.toLowerCase()
          );
          if (!matchP) return sp;
          const isWinner = winner && winner.name.toLowerCase() === sp.name.toLowerCase();
          return {
            ...sp,
            gamesPlayed: sp.gamesPlayed + 1,
            totalWins: isWinner ? sp.totalWins + 1 : sp.totalWins,
            totalScore: sp.totalScore + matchP.score,
          };
        })
      );
    },
    []
  );

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleSound = () => {
    const next = !isSoundEnabled;
    setIsSoundEnabled(next);
    soundFX.enabled = next;
    kokoVoice.enabled = next;
    if (!next) {
      kokoVoice.stop();
    }
  };

  const addParticipant = (name: string) => {
    if (participants.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      showModal('Participante Duplicado', 'Ya existe un participante con ese nombre.', 'fa-triangle-exclamation');
      return;
    }
    const newParticipant: Participant = {
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      name,
      score: 0,
    };
    setParticipants([...participants, newParticipant]);

    // Upsert to persistent player directory
    setSavedPlayers((prev) => {
      if (prev.some((sp) => sp.name.toLowerCase() === name.toLowerCase())) return prev;
      return [
        ...prev,
        {
          id: `sp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name,
          gamesPlayed: 0,
          totalWins: 0,
          totalScore: 0,
        },
      ];
    });
  };

  const addSavedPlayerToActive = (saved: SavedPlayer) => {
    if (participants.some((p) => p.name.toLowerCase() === saved.name.toLowerCase())) return;
    const newParticipant: Participant = {
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      name: saved.name,
      score: 0,
    };
    setParticipants((prev) => [...prev, newParticipant]);
  };

  const deleteSavedPlayer = (id: string) => {
    setSavedPlayers((prev) => prev.filter((sp) => sp.id !== id));
  };

  const removeParticipant = (id: string) => {
    const updated = participants.filter((p) => p.id !== id);
    setParticipants(updated);
    if (currentTurnIndex >= updated.length) {
      setCurrentTurnIndex(0);
    }
  };

  const clearParticipants = () => {
    setParticipants([]);
    setCurrentTurnIndex(0);
    setRound(1);
    setTotalTurnsPlayed(1);
    setIsGameOver(false);
  };

  const resetScores = () => {
    setParticipants(participants.map((p) => ({ ...p, score: 0 })));
    setRound(1);
    setTotalTurnsPlayed(1);
    setIsGameOver(false);
    showModal('Puntajes Restablecidos', 'Todos los puntajes han vuelto a 0.', 'fa-rotate-right');
  };

  const startGame = () => {
    if (participants.length === 0) {
      showModal('Faltan Participantes', 'Agrega al menos un participante para comenzar.', 'fa-triangle-exclamation');
      return;
    }
    setIsGameOver(false);
    setCurrentView('game');
  };

  const checkGameLimitEnd = (
    nextRound: number,
    nextTurns: number,
    updatedParticipants: Participant[]
  ): boolean => {
    let ended = false;
    if (gameLimitConfig.type === 'rounds') {
      if (nextRound > gameLimitConfig.maxRounds) {
        ended = true;
      }
    } else if (gameLimitConfig.type === 'turns') {
      if (nextTurns > gameLimitConfig.maxTurns) {
        ended = true;
      }
    } else if (gameLimitConfig.type === 'points') {
      const topScore = Math.max(...updatedParticipants.map((p) => p.score), 0);
      if (topScore >= gameLimitConfig.targetPoints) {
        ended = true;
      }
    }
    if (ended) {
      setIsGameOver(true);
      recordMatchCompletion(updatedParticipants, nextRound, nextTurns, gameLimitConfig);
      return true;
    }
    return false;
  };

  const nextTurn = () => {
    if (participants.length === 0) return;
    const nextIdx = (currentTurnIndex + 1) % participants.length;
    setCurrentTurnIndex(nextIdx);

    const nextTurnCount = totalTurnsPlayed + 1;
    setTotalTurnsPlayed(nextTurnCount);

    let nextRoundCount = round;
    if (nextIdx === 0) {
      nextRoundCount = round + 1;
      setRound(nextRoundCount);
    }

    checkGameLimitEnd(nextRoundCount, nextTurnCount, participants);
  };

  const awardPoints = (points: number, recipientIndex?: number) => {
    if (participants.length === 0) return;
    const targetIdx = typeof recipientIndex === 'number' ? recipientIndex : currentTurnIndex;
    const updated = [...participants];
    updated[targetIdx].score += points;
    setParticipants(updated);
    soundFX.playScorePoint();

    // Check if points target reached
    if (
      gameLimitConfig.type === 'points' &&
      updated[targetIdx].score >= gameLimitConfig.targetPoints
    ) {
      setIsGameOver(true);
      recordMatchCompletion(updated, round, totalTurnsPlayed, gameLimitConfig);
      return;
    }
  };

  const handlePlayAgain = () => {
    setParticipants(participants.map((p) => ({ ...p, score: 0 })));
    setRound(1);
    setTotalTurnsPlayed(1);
    setCurrentTurnIndex(0);
    setIsGameOver(false);
  };

  const handleExtendMatch = () => {
    if (gameLimitConfig.type === 'rounds') {
      setGameLimitConfig({
        ...gameLimitConfig,
        maxRounds: gameLimitConfig.maxRounds + 2,
      });
    } else if (gameLimitConfig.type === 'turns') {
      setGameLimitConfig({
        ...gameLimitConfig,
        maxTurns: gameLimitConfig.maxTurns + 5,
      });
    } else if (gameLimitConfig.type === 'points') {
      setGameLimitConfig({
        ...gameLimitConfig,
        targetPoints: gameLimitConfig.targetPoints + 3,
      });
    }
    setIsGameOver(false);
  };

  const handleGoToSetup = () => {
    setIsGameOver(false);
    setCurrentView('setup');
  };

  const showModal = (title: string, message: string, iconClass = 'fa-circle-check') => {
    setCustomModal({
      isOpen: true,
      title,
      message,
      iconClass,
    });
  };

  const closeModal = () => {
    setCustomModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div
      className={`min-h-full flex flex-col transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100'
          : 'bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-50 text-slate-900'
      }`}
    >
      <Navbar
        currentView={currentView}
        onSwitchView={setCurrentView}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={toggleSound}
        onOpenPause={() => setIsPaused(true)}
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-4 md:py-6">
        {currentView === 'presentation' && (
          <PresentationView
            participants={participants}
            onStartNewGame={() => setCurrentView('setup')}
            onResumeGame={() => {
              if (participants.length === 0) {
                setCurrentView('setup');
              } else {
                setCurrentView('game');
              }
            }}
            onOpenRules={() => setCurrentView('rules')}
          />
        )}

        {currentView === 'setup' && (
          <SetupView
            participants={participants}
            savedPlayers={savedPlayers}
            onAddParticipant={addParticipant}
            onRemoveParticipant={removeParticipant}
            onClearParticipants={clearParticipants}
            onResetScores={resetScores}
            onAddSavedPlayerToActive={addSavedPlayerToActive}
            onDeleteSavedPlayer={deleteSavedPlayer}
            gameMode={gameMode}
            onSetGameMode={setGameMode}
            gameLimitConfig={gameLimitConfig}
            onSetGameLimitConfig={setGameLimitConfig}
            onStartGame={startGame}
          />
        )}

        {currentView === 'game' && (
          <GameView
            participants={participants}
            currentTurnIndex={currentTurnIndex}
            round={round}
            totalTurnsPlayed={totalTurnsPlayed}
            gameLimitConfig={gameLimitConfig}
            onSetGameLimitConfig={setGameLimitConfig}
            gameMode={gameMode}
            onSetGameMode={setGameMode}
            onNextTurn={nextTurn}
            onAwardPoints={awardPoints}
            onOpenPunishment={() => setIsPunishmentOpen(true)}
            onOpenPause={() => setIsPaused(true)}
            onShowModal={showModal}
            onResetScores={resetScores}
            onGoToSetup={() => setCurrentView('setup')}
            onGoToRules={() => setCurrentView('rules')}
            onGoToPresentation={() => setCurrentView('presentation')}
            isSoundEnabled={isSoundEnabled}
            onToggleSound={toggleSound}
          />
        )}

        {currentView === 'ranking' && (
          <RankingView
            participants={participants}
            history={history}
            onClearHistory={() => setHistory([])}
            onResetScores={resetScores}
            onSwitchView={setCurrentView}
          />
        )}

        {currentView === 'rules' && <RulesView onSwitchView={setCurrentView} />}
      </main>

      <footer className="bg-white/80 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 py-3 text-center text-xs text-slate-500 dark:text-slate-400 backdrop-blur-md">
        <p>Descubriendo Emociones En Palabras • Edición Interactiva con 150 Preguntas y Ruleta</p>
      </footer>

      {/* Pause & Settings Modal */}
      <PauseModal
        isOpen={isPaused}
        onClose={() => setIsPaused(false)}
        participants={participants}
        round={round}
        totalTurns={totalTurnsPlayed}
        gameMode={gameMode}
        onSetGameMode={setGameMode}
        gameLimitConfig={gameLimitConfig}
        onSetGameLimitConfig={setGameLimitConfig}
        onResetScores={resetScores}
        onGoToSetup={() => {
          setIsPaused(false);
          setCurrentView('setup');
        }}
        onGoToRules={() => {
          setIsPaused(false);
          setCurrentView('rules');
        }}
        onGoToPresentation={() => {
          setIsPaused(false);
          setCurrentView('presentation');
        }}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={toggleSound}
        isDarkMode={theme === 'dark'}
        onToggleTheme={toggleTheme}
        onOpenIntro={() => {
          setIsPaused(false);
          setShowIntro(true);
        }}
      />

      {/* Punishment Roulette Modal */}
      <PunishmentModal
        isOpen={isPunishmentOpen}
        onClose={() => setIsPunishmentOpen(false)}
      />

      {/* General Notification Modal */}
      <CustomModal
        isOpen={customModal.isOpen}
        title={customModal.title}
        message={customModal.message}
        iconClass={customModal.iconClass}
        onClose={closeModal}
      />

      {/* Game Over / Victory Modal hosted by Koko */}
      <GameOverModal
        isOpen={isGameOver}
        participants={participants}
        round={round}
        totalTurns={totalTurnsPlayed}
        onPlayAgain={handlePlayAgain}
        onExtendMatch={handleExtendMatch}
        onGoToSetup={handleGoToSetup}
      />

      {/* Game History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
      />

      {/* Animated Opening Intro Sequence */}
      {showIntro && (
        <IntroAnimationModal onComplete={() => setShowIntro(false)} />
      )}
    </div>
  );
}
