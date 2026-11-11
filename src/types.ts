export interface Participant {
  id: string;
  name: string;
  score: number;
}

export interface SavedPlayer {
  id: string;
  name: string;
  gamesPlayed: number;
  totalWins: number;
  totalScore: number;
  lastPlayed?: string;
}

export type GameMode = 'classic' | 'coop' | 'night' | 'timer';

export type CategoryName =
  | 'Relaciones Mágicas'
  | 'Mi Mundo'
  | 'Mar de Emociones'
  | 'Caja de Sorpresas'
  | 'Misiones Especiales';

export type GameLimitType = 'rounds' | 'turns' | 'points' | 'unlimited';

export interface GameLimitConfig {
  type: GameLimitType;
  maxRounds: number;    // e.g. 3, 5, 10
  maxTurns: number;     // e.g. 10, 15, 25
  targetPoints: number; // e.g. 3, 5, 7
}

export interface GameHistoryEntry {
  id: string;
  date: string;         // e.g. "10/11/2026, 22:15"
  winnerName: string;
  winnerScore: number;
  participants: { name: string; score: number }[];
  roundsPlayed: number;
  turnsPlayed: number;
  limitType: GameLimitType;
}

export interface HostDialogue {
  trigger: 'start' | 'spin' | 'correct' | 'mission' | 'turn' | 'win' | 'idle' | 'night';
  messages: string[];
  expression: 'happy' | 'thinking' | 'excited' | 'knowing' | 'wink';
}
