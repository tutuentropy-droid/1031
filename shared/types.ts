export interface Chemist {
  id: string;
  name: string;
  era: string;
  description: string;
  avatar: string;
}

export interface Question {
  id: string;
  chemistId: string;
  description: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  historicalContext: string;
}

export interface FunFact {
  id: string;
  chemistId: string;
  title: string;
  content: string;
  year?: number;
}

export interface SubmitAnswerRequest {
  questionId: string;
  selectedIndex: number;
  currentTemperature: number;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctIndex: number;
  explanation: string;
  newTemperature: number;
  shouldUnlock: boolean;
  gameOver: boolean;
  unlockedFact?: FunFact;
  nextQuestion?: Question;
}

export type GameStatus = 'idle' | 'playing' | 'answered' | 'unlock' | 'gameover' | 'chainReaction';

export interface Element {
  id: string;
  symbol: string;
  name: string;
  atomicNumber: number;
  row: number;
  col: number;
  chemistId: string;
  category: string;
  color: string;
}

export interface ElementFact {
  id: string;
  elementId: string;
  title: string;
  content: string;
  year?: number;
  chemistId: string;
}

export type CellOwner = 'player' | 'ai' | null;

export interface PeriodicTableGameState {
  board: Map<string, CellOwner>;
  playerCells: string[];
  aiCells: string[];
  prophecyCount: number;
  currentProphecy: string | null;
  selectedElementId: string | null;
  aiAvatar: string;
  aiName: string;
  isProphecyMode: boolean;
  aiThinking: boolean;
  lastCapturedElement: Element | null;
  lastLostElement: Element | null;
  completedLines: { type: 'row' | 'col'; index: number; owner: CellOwner }[];
}

export type ProphecyType = 'boyle' | 'lavoisier' | 'mendeleev' | 'random';

export interface SubmitPeriodicAnswerRequest {
  questionId: string;
  selectedIndex: number;
  elementId: string;
}

export interface SubmitPeriodicAnswerResponse {
  isCorrect: boolean;
  correctIndex: number;
  explanation: string;
  capturedElement: Element | null;
  lostElement: Element | null;
  newBoardState: Record<string, CellOwner>;
  lineCompleted: { type: 'row' | 'col'; index: number; owner: CellOwner } | null;
  gameOver: boolean;
  winner: CellOwner;
  nextQuestion?: Question;
}
