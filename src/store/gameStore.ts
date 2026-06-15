import { create } from 'zustand';
import type { Chemist, Question, FunFact, GameStatus, SubmitAnswerResponse } from '../../shared/types';

interface GameState {
  selectedChemist: Chemist | null;
  currentQuestion: Question | null;
  temperature: number;
  gameStatus: GameStatus;
  unlockedFacts: FunFact[];
  currentFact: FunFact | null;
  lastAnswerResult: SubmitAnswerResponse | null;
  selectedAnswer: number | null;
  isSmoking: boolean;
  score: number;
  questionsAnswered: number;
  correctAnswers: number;
  catalystQuanta: number;
  consecutiveCorrect: number;
  isChainReaction: boolean;
  isCatalystActive: boolean;
  showLavoisierSpeech: boolean;

  selectChemist: (chemist: Chemist) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setTemperature: (temp: number) => void;
  setGameStatus: (status: GameStatus) => void;
  setSelectedAnswer: (index: number | null) => void;
  setIsSmoking: (smoking: boolean) => void;
  setLastAnswerResult: (result: SubmitAnswerResponse | null) => void;
  unlockFact: (fact: FunFact) => void;
  setCurrentFact: (fact: FunFact | null) => void;
  incrementScore: (points: number) => void;
  incrementQuestionsAnswered: (correct: boolean) => void;
  resetGame: () => void;
  addCatalyst: () => void;
  useCatalyst: () => void;
  incrementConsecutiveCorrect: () => void;
  resetConsecutiveCorrect: () => void;
  setIsChainReaction: (val: boolean) => void;
  setIsCatalystActive: (val: boolean) => void;
  setShowLavoisierSpeech: (val: boolean) => void;
}

const INITIAL_TEMPERATURE = 50;

export const useGameStore = create<GameState>((set) => ({
  selectedChemist: null,
  currentQuestion: null,
  temperature: INITIAL_TEMPERATURE,
  gameStatus: 'idle',
  unlockedFacts: [],
  currentFact: null,
  lastAnswerResult: null,
  selectedAnswer: null,
  isSmoking: false,
  score: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  catalystQuanta: 0,
  consecutiveCorrect: 0,
  isChainReaction: false,
  isCatalystActive: false,
  showLavoisierSpeech: false,

  selectChemist: (chemist) => set({ selectedChemist: chemist }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setTemperature: (temp) => set({ temperature: temp }),
  setGameStatus: (status) => set({ gameStatus: status }),
  setSelectedAnswer: (index) => set({ selectedAnswer: index }),
  setIsSmoking: (smoking) => set({ isSmoking: smoking }),
  setLastAnswerResult: (result) => set({ lastAnswerResult: result }),
  unlockFact: (fact) => set((state) => ({
    unlockedFacts: [...state.unlockedFacts, fact],
    currentFact: fact,
  })),
  setCurrentFact: (fact) => set({ currentFact: fact }),
  incrementScore: (points) => set((state) => ({ score: state.score + points })),
  incrementQuestionsAnswered: (correct) => set((state) => ({
    questionsAnswered: state.questionsAnswered + 1,
    correctAnswers: state.correctAnswers + (correct ? 1 : 0),
  })),
  addCatalyst: () => set((state) => ({ catalystQuanta: state.catalystQuanta + 1 })),
  useCatalyst: () => set((state) => ({
    catalystQuanta: Math.max(0, state.catalystQuanta - 1),
    isCatalystActive: true,
  })),
  incrementConsecutiveCorrect: () => set((state) => {
    const newCount = state.consecutiveCorrect + 1;
    const shouldAddCatalyst = newCount % 2 === 0;
    const shouldChainReact = newCount >= 3 && !state.isChainReaction;
    return {
      consecutiveCorrect: newCount,
      ...(shouldAddCatalyst ? { catalystQuanta: state.catalystQuanta + 1 } : {}),
      ...(shouldChainReact ? { isChainReaction: true } : {}),
    };
  }),
  resetConsecutiveCorrect: () => set({ consecutiveCorrect: 0, isChainReaction: false }),
  setIsChainReaction: (val) => set({ isChainReaction: val }),
  setIsCatalystActive: (val) => set({ isCatalystActive: val }),
  setShowLavoisierSpeech: (val) => set({ showLavoisierSpeech: val }),
  resetGame: () => set({
    selectedChemist: null,
    currentQuestion: null,
    temperature: INITIAL_TEMPERATURE,
    gameStatus: 'idle',
    currentFact: null,
    lastAnswerResult: null,
    selectedAnswer: null,
    isSmoking: false,
    score: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    catalystQuanta: 0,
    consecutiveCorrect: 0,
    isChainReaction: false,
    isCatalystActive: false,
    showLavoisierSpeech: false,
  }),
}));
