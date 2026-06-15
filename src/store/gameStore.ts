import { create } from 'zustand';
import type { Chemist, Question, FunFact, GameStatus, SubmitAnswerResponse, Element, CellOwner, ElementFact, SubmitPeriodicAnswerResponse, HistoricalRevolution, ReactionMode, ChemistryLanguageStyle } from '../../shared/types';

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

  isPhlogistonTrap: boolean;
  phlogistonIdentified: number;
  unlockedRevolutions: HistoricalRevolution[];
  currentRevolution: HistoricalRevolution | null;
  labCoatShields: number;
  isPhlogistonSmoke: boolean;
  phlogistonTrapExplanation: string;

  periodicBoard: Record<string, CellOwner>;
  periodicPlayerCells: string[];
  periodicAiCells: string[];
  periodicProphecyCount: number;
  periodicCurrentProphecy: string | null;
  periodicSelectedElementId: string | null;
  periodicIsProphecyMode: boolean;
  periodicAiThinking: boolean;
  periodicLastCapturedElement: Element | null;
  periodicLastLostElement: Element | null;
  periodicCompletedLines: { type: 'row' | 'col'; index: number; owner: CellOwner }[];
  periodicGameWinner: CellOwner;
  periodicGameOver: boolean;
  periodicScore: number;
  periodicAnswerResult: SubmitPeriodicAnswerResponse | null;
  periodicCurrentElementFact: ElementFact | null;
  periodicShowElementFact: boolean;

  activationEnergy: number;
  reactionMode: ReactionMode;
  answerStartTime: number;
  answerResponseTimes: number[];
  consecutiveSlowCorrect: number;
  consecutiveFastWrong: number;
  explosionIntensity: number;
  explosionShakeOptions: boolean;
  isCrystalMode: boolean;
  crystalInputAnswer: string;
  chemistryLanguageStyle: ChemistryLanguageStyle;

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

  setIsPhlogistonTrap: (val: boolean) => void;
  incrementPhlogistonIdentified: () => void;
  unlockRevolution: (revolution: HistoricalRevolution) => void;
  setCurrentRevolution: (revolution: HistoricalRevolution | null) => void;
  addLabCoatShield: () => void;
  useLabCoatShield: () => void;
  setIsPhlogistonSmoke: (val: boolean) => void;
  setPhlogistonTrapExplanation: (explanation: string) => void;
  resetPhlogistonTrap: () => void;

  initPeriodicGame: () => void;
  setPeriodicBoard: (board: Record<string, CellOwner>) => void;
  setPeriodicSelectedElement: (elementId: string | null) => void;
  setPeriodicIsProphecyMode: (isProphecy: boolean) => void;
  setPeriodicCurrentProphecy: (prophecy: string | null) => void;
  incrementPeriodicProphecyCount: () => void;
  decrementPeriodicProphecyCount: () => void;
  setPeriodicAiThinking: (thinking: boolean) => void;
  setPeriodicLastCapturedElement: (element: Element | null) => void;
  setPeriodicLastLostElement: (element: Element | null) => void;
  setPeriodicAnswerResult: (result: SubmitPeriodicAnswerResponse | null) => void;
  addPeriodicCompletedLine: (line: { type: 'row' | 'col'; index: number; owner: CellOwner }) => void;
  setPeriodicGameWinner: (winner: CellOwner) => void;
  setPeriodicGameOver: (over: boolean) => void;
  incrementPeriodicScore: (points: number) => void;
  setPeriodicCurrentElementFact: (fact: ElementFact | null) => void;
  setPeriodicShowElementFact: (show: boolean) => void;
  resetPeriodicGame: () => void;

  setActivationEnergy: (energy: number) => void;
  lowerActivationEnergy: (amount: number) => void;
  raiseActivationEnergy: (amount: number) => void;
  setReactionMode: (mode: ReactionMode) => void;
  setAnswerStartTime: (time: number) => void;
  addResponseTime: (time: number) => void;
  incrementConsecutiveSlowCorrect: () => void;
  resetConsecutiveSlowCorrect: () => void;
  incrementConsecutiveFastWrong: () => void;
  resetConsecutiveFastWrong: () => void;
  setExplosionIntensity: (intensity: number) => void;
  setExplosionShakeOptions: (shake: boolean) => void;
  triggerExplosionMode: () => void;
  exitExplosionMode: () => void;
  setIsCrystalMode: (val: boolean) => void;
  setCrystalInputAnswer: (answer: string) => void;
  triggerCrystalMode: () => void;
  exitCrystalMode: () => void;
  setChemistryLanguageStyle: (style: ChemistryLanguageStyle) => void;
  toggleChemistryLanguageStyle: () => void;
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

  isPhlogistonTrap: false,
  phlogistonIdentified: 0,
  unlockedRevolutions: [],
  currentRevolution: null,
  labCoatShields: 0,
  isPhlogistonSmoke: false,
  phlogistonTrapExplanation: '',

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

  setIsPhlogistonTrap: (val) => set({ isPhlogistonTrap: val }),
  incrementPhlogistonIdentified: () => set((state) => {
    const newCount = state.phlogistonIdentified + 1;
    const shouldAddShield = newCount % 3 === 0;
    return {
      phlogistonIdentified: newCount,
      ...(shouldAddShield ? { labCoatShields: state.labCoatShields + 1 } : {}),
    };
  }),
  unlockRevolution: (revolution) => set((state) => ({
    unlockedRevolutions: [...state.unlockedRevolutions, revolution],
    currentRevolution: revolution,
  })),
  setCurrentRevolution: (revolution) => set({ currentRevolution: revolution }),
  addLabCoatShield: () => set((state) => ({ labCoatShields: state.labCoatShields + 1 })),
  useLabCoatShield: () => set((state) => ({
    labCoatShields: Math.max(0, state.labCoatShields - 1),
  })),
  setIsPhlogistonSmoke: (val) => set({ isPhlogistonSmoke: val }),
  setPhlogistonTrapExplanation: (explanation) => set({ phlogistonTrapExplanation: explanation }),
  resetPhlogistonTrap: () => set({
    isPhlogistonTrap: false,
    isPhlogistonSmoke: false,
    phlogistonTrapExplanation: '',
  }),
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
    isPhlogistonTrap: false,
    phlogistonIdentified: 0,
    unlockedRevolutions: [],
    currentRevolution: null,
    labCoatShields: 0,
    isPhlogistonSmoke: false,
    phlogistonTrapExplanation: '',
    activationEnergy: 80,
    reactionMode: 'normal',
    answerStartTime: 0,
    answerResponseTimes: [],
    consecutiveSlowCorrect: 0,
    consecutiveFastWrong: 0,
    explosionIntensity: 0,
    explosionShakeOptions: false,
    isCrystalMode: false,
    crystalInputAnswer: '',
  }),

  periodicBoard: {},
  periodicPlayerCells: [],
  periodicAiCells: [],
  periodicProphecyCount: 0,
  periodicCurrentProphecy: null,
  periodicSelectedElementId: null,
  periodicIsProphecyMode: false,
  periodicAiThinking: false,
  periodicLastCapturedElement: null,
  periodicLastLostElement: null,
  periodicCompletedLines: [],
  periodicGameWinner: null,
  periodicGameOver: false,
  periodicScore: 0,
  periodicAnswerResult: null,
  periodicCurrentElementFact: null,
  periodicShowElementFact: false,

  activationEnergy: 80,
  reactionMode: 'normal',
  answerStartTime: 0,
  answerResponseTimes: [],
  consecutiveSlowCorrect: 0,
  consecutiveFastWrong: 0,
  explosionIntensity: 0,
  explosionShakeOptions: false,
  isCrystalMode: false,
  crystalInputAnswer: '',
  chemistryLanguageStyle: 'classic',

  initPeriodicGame: () => set({
    periodicBoard: {},
    periodicPlayerCells: [],
    periodicAiCells: [],
    periodicProphecyCount: 0,
    periodicCurrentProphecy: null,
    periodicSelectedElementId: null,
    periodicIsProphecyMode: false,
    periodicAiThinking: false,
    periodicLastCapturedElement: null,
    periodicLastLostElement: null,
    periodicCompletedLines: [],
    periodicGameWinner: null,
    periodicGameOver: false,
    periodicScore: 0,
    periodicAnswerResult: null,
    periodicCurrentElementFact: null,
    periodicShowElementFact: false,
  }),

  setPeriodicBoard: (board) => set({
    periodicBoard: board,
    periodicPlayerCells: Object.entries(board).filter((entry) => entry[1] === 'player').map((entry) => entry[0]),
    periodicAiCells: Object.entries(board).filter((entry) => entry[1] === 'ai').map((entry) => entry[0]),
  }),

  setPeriodicSelectedElement: (elementId) => set({ periodicSelectedElementId: elementId }),
  setPeriodicIsProphecyMode: (isProphecy) => set({ periodicIsProphecyMode: isProphecy }),
  setPeriodicCurrentProphecy: (prophecy) => set({ periodicCurrentProphecy: prophecy }),
  incrementPeriodicProphecyCount: () => set((state) => ({ periodicProphecyCount: state.periodicProphecyCount + 1 })),
  decrementPeriodicProphecyCount: () => set((state) => ({ periodicProphecyCount: Math.max(0, state.periodicProphecyCount - 1) })),
  setPeriodicAiThinking: (thinking) => set({ periodicAiThinking: thinking }),
  setPeriodicLastCapturedElement: (element) => set({ periodicLastCapturedElement: element }),
  setPeriodicLastLostElement: (element) => set({ periodicLastLostElement: element }),
  setPeriodicAnswerResult: (result) => set({ periodicAnswerResult: result }),
  addPeriodicCompletedLine: (line) => set((state) => ({
    periodicCompletedLines: [...state.periodicCompletedLines, line],
  })),
  setPeriodicGameWinner: (winner) => set({ periodicGameWinner: winner }),
  setPeriodicGameOver: (over) => set({ periodicGameOver: over }),
  incrementPeriodicScore: (points) => set((state) => ({ periodicScore: state.periodicScore + points })),
  setPeriodicCurrentElementFact: (fact) => set({ periodicCurrentElementFact: fact }),
  setPeriodicShowElementFact: (show) => set({ periodicShowElementFact: show }),
  resetPeriodicGame: () => set({
    periodicBoard: {},
    periodicPlayerCells: [],
    periodicAiCells: [],
    periodicProphecyCount: 0,
    periodicCurrentProphecy: null,
    periodicSelectedElementId: null,
    periodicIsProphecyMode: false,
    periodicAiThinking: false,
    periodicLastCapturedElement: null,
    periodicLastLostElement: null,
    periodicCompletedLines: [],
    periodicGameWinner: null,
    periodicGameOver: false,
    periodicScore: 0,
    periodicAnswerResult: null,
    periodicCurrentElementFact: null,
    periodicShowElementFact: false,
  }),

  setActivationEnergy: (energy) => set({
    activationEnergy: Math.max(0, Math.min(100, energy)),
  }),
  lowerActivationEnergy: (amount) => set((state) => ({
    activationEnergy: Math.max(0, state.activationEnergy - amount),
  })),
  raiseActivationEnergy: (amount) => set((state) => ({
    activationEnergy: Math.min(100, state.activationEnergy + amount),
  })),
  setReactionMode: (mode) => set({ reactionMode: mode }),
  setAnswerStartTime: (time) => set({ answerStartTime: time }),
  addResponseTime: (time) => set((state) => ({
    answerResponseTimes: [...state.answerResponseTimes.slice(-9), time],
  })),
  incrementConsecutiveSlowCorrect: () => set((state) => ({
    consecutiveSlowCorrect: state.consecutiveSlowCorrect + 1,
  })),
  resetConsecutiveSlowCorrect: () => set({ consecutiveSlowCorrect: 0 }),
  incrementConsecutiveFastWrong: () => set((state) => ({
    consecutiveFastWrong: state.consecutiveFastWrong + 1,
  })),
  resetConsecutiveFastWrong: () => set({ consecutiveFastWrong: 0 }),
  setExplosionIntensity: (intensity) => set({
    explosionIntensity: Math.max(0, Math.min(100, intensity)),
  }),
  setExplosionShakeOptions: (shake) => set({ explosionShakeOptions: shake }),
  triggerExplosionMode: () => set({
    reactionMode: 'explosion',
    explosionShakeOptions: true,
    explosionIntensity: 80,
  }),
  exitExplosionMode: () => set({
    reactionMode: 'normal',
    explosionShakeOptions: false,
    explosionIntensity: 0,
  }),
  setIsCrystalMode: (val) => set({ isCrystalMode: val }),
  setCrystalInputAnswer: (answer) => set({ crystalInputAnswer: answer }),
  triggerCrystalMode: () => set({
    reactionMode: 'crystal',
    isCrystalMode: true,
    crystalInputAnswer: '',
  }),
  exitCrystalMode: () => set({
    reactionMode: 'normal',
    isCrystalMode: false,
    crystalInputAnswer: '',
  }),
  setChemistryLanguageStyle: (style) => set({ chemistryLanguageStyle: style }),
  toggleChemistryLanguageStyle: () => set((state) => ({
    chemistryLanguageStyle: state.chemistryLanguageStyle === 'classic' ? 'modern' : 'classic',
  })),
}));
