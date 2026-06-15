import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { api } from '@/utils/api';
import AlchemyFurnace from '@/components/AlchemyFurnace';
import QuestionCard from '@/components/QuestionCard';
import CatalystPanel from '@/components/CatalystPanel';
import PhlogistonTrapPanel from '@/components/PhlogistonTrapPanel';
import ActivationEnergyGraph from '@/components/ActivationEnergyGraph';
import ChemistryLanguageToggle from '@/components/ChemistryLanguageToggle';
import {
  shouldActivatePhlogistonTrap,
  getRandomPhlogistonDescription,
  getPhlogistonExplanation,
  getPhlogistonDescriptionIndex,
  getRevolutionForMilestone,
} from '@/components/PhlogistonTrapPanel';
import type { SubmitAnswerResponse, Question } from '../../shared/types';
import { Home, RotateCcw, Trophy, HelpCircle, Shield, Gauge, Timer } from 'lucide-react';

const FAST_ANSWER_THRESHOLD = 2500;
const SLOW_ANSWER_THRESHOLD = 8000;
const CONSECUTIVE_SLOW_FOR_CRYSTAL = 3;
const CONSECUTIVE_FAST_WRONG_FOR_EXPLOSION = 2;
const HIGH_TEMP_THRESHOLD = 75;
const LOW_TEMP_THRESHOLD = 30;

const Game: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedChemist,
    currentQuestion,
    temperature,
    gameStatus,
    selectedAnswer,
    lastAnswerResult,
    unlockedFacts,
    score,
    questionsAnswered,
    correctAnswers,
    catalystQuanta,
    consecutiveCorrect,
    isChainReaction,
    isCatalystActive,
    isPhlogistonTrap,
    phlogistonIdentified,
    labCoatShields,
    isPhlogistonSmoke,
    currentRevolution,
    activationEnergy,
    reactionMode,
    answerStartTime,
    consecutiveSlowCorrect,
    consecutiveFastWrong,
    isCrystalMode,
    chemistryLanguageStyle,
    setCurrentQuestion,
    setTemperature,
    setGameStatus,
    setSelectedAnswer,
    setIsSmoking,
    setLastAnswerResult,
    unlockFact,
    incrementScore,
    incrementQuestionsAnswered,
    resetGame,
    incrementConsecutiveCorrect,
    resetConsecutiveCorrect,
    setIsChainReaction,
    setIsCatalystActive,
    setShowLavoisierSpeech,
    setIsPhlogistonTrap,
    incrementPhlogistonIdentified,
    unlockRevolution,
    setCurrentRevolution,
    useLabCoatShield: consumeLabCoatShield,
    setIsPhlogistonSmoke,
    setPhlogistonTrapExplanation,
    resetPhlogistonTrap,
    setAnswerStartTime,
    addResponseTime,
    lowerActivationEnergy,
    raiseActivationEnergy,
    incrementConsecutiveSlowCorrect,
    resetConsecutiveSlowCorrect,
    incrementConsecutiveFastWrong,
    resetConsecutiveFastWrong,
    setExplosionIntensity,
    triggerExplosionMode,
    exitExplosionMode,
    triggerCrystalMode,
    exitCrystalMode,
    setCrystalInputAnswer,
  } = useGameStore();

  const [loading, setLoading] = useState(true);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [phlogistonTrapDesc, setPhlogistonTrapDesc] = useState<string | null>(null);
  const [explosionOverlay, setExplosionOverlay] = useState(false);
  const [crystalOverlay, setCrystalOverlay] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const lavoisierTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopElapsedTimer = useCallback(() => {
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  }, []);

  const startElapsedTimer = useCallback(() => {
    stopElapsedTimer();
    setElapsedTime(0);
    elapsedTimerRef.current = setInterval(() => {
      setElapsedTime((t) => t + 100);
    }, 100);
  }, [stopElapsedTimer]);

  useEffect(() => {
    return () => stopElapsedTimer();
  }, [stopElapsedTimer]);

  const triggerLavoisierSpeech = useCallback(() => {
    if (lavoisierTimerRef.current) clearTimeout(lavoisierTimerRef.current);
    setShowLavoisierSpeech(true);
    lavoisierTimerRef.current = setTimeout(() => setShowLavoisierSpeech(false), 2500);
  }, [setShowLavoisierSpeech]);

  const maybeApplyPhlogistonTrap = useCallback((question: Question): Question => {
    resetPhlogistonTrap();
    setPhlogistonTrapDesc(null);
    if (shouldActivatePhlogistonTrap()) {
      const trapDesc = getRandomPhlogistonDescription();
      setPhlogistonTrapDesc(trapDesc);
      setIsPhlogistonTrap(true);
      const trapQuestion: Question = {
        ...question,
        description: `⚠️ ${trapDesc}`,
        explanation: getPhlogistonExplanation(getPhlogistonDescriptionIndex(trapDesc)),
      };
      return trapQuestion;
    }
    return question;
  }, [resetPhlogistonTrap, setIsPhlogistonTrap]);

  const maybeSwitchToNextMode = useCallback((responseTime: number, isCorrect: boolean) => {
    const isFast = responseTime < FAST_ANSWER_THRESHOLD;
    const isSlow = responseTime > SLOW_ANSWER_THRESHOLD;
    const isHighTemp = temperature > HIGH_TEMP_THRESHOLD;
    const isLowTemp = temperature < LOW_TEMP_THRESHOLD;

    if (reactionMode === 'explosion') {
      exitExplosionMode();
      setExplosionIntensity(0);
    }

    if (reactionMode === 'crystal') {
      exitCrystalMode();
    }

    if (!isCorrect && isFast) {
      incrementConsecutiveFastWrong();
      resetConsecutiveSlowCorrect();
      if (consecutiveFastWrong + 1 >= CONSECUTIVE_FAST_WRONG_FOR_EXPLOSION || isHighTemp) {
        triggerExplosionMode();
        setExplosionOverlay(true);
        setTimeout(() => setExplosionOverlay(false), 1800);
      }
    } else if (isCorrect) {
      resetConsecutiveFastWrong();
      if (isSlow) {
        incrementConsecutiveSlowCorrect();
        if (consecutiveSlowCorrect + 1 >= CONSECUTIVE_SLOW_FOR_CRYSTAL || isLowTemp) {
          triggerCrystalMode();
          setCrystalOverlay(true);
          setTimeout(() => setCrystalOverlay(false), 1800);
        }
      } else {
        resetConsecutiveSlowCorrect();
      }
    } else {
      resetConsecutiveFastWrong();
      resetConsecutiveSlowCorrect();
    }
  }, [
    temperature,
    reactionMode,
    consecutiveFastWrong,
    consecutiveSlowCorrect,
    exitExplosionMode,
    exitCrystalMode,
    setExplosionIntensity,
    incrementConsecutiveFastWrong,
    resetConsecutiveSlowCorrect,
    triggerExplosionMode,
    resetConsecutiveFastWrong,
    incrementConsecutiveSlowCorrect,
    triggerCrystalMode,
  ]);

  const updateActivationEnergy = useCallback((isCorrect: boolean, responseTime: number) => {
    const isFast = responseTime < FAST_ANSWER_THRESHOLD;
    const isSlow = responseTime > SLOW_ANSWER_THRESHOLD;
    const tempModifier = (temperature - 50) / 50;

    if (isCorrect) {
      let reduction = 8;
      if (isSlow) reduction += 5;
      if (consecutiveCorrect >= 2) reduction += 4;
      if (tempModifier > 0.3) reduction += Math.round(tempModifier * 3);
      lowerActivationEnergy(reduction);
    } else {
      let increase = 12;
      if (isFast) increase += 6;
      if (tempModifier < -0.3) increase += Math.round(Math.abs(tempModifier) * 3);
      raiseActivationEnergy(increase);
    }
  }, [temperature, consecutiveCorrect, lowerActivationEnergy, raiseActivationEnergy]);

  const loadFirstQuestion = useCallback(async () => {
    if (!selectedChemist) return;

    try {
      setLoading(true);
      const question = await api.getQuestion(selectedChemist.id);
      const processedQuestion = maybeApplyPhlogistonTrap(question);
      setCurrentQuestion(processedQuestion);
      setGameStatus('playing');
      setAnswerStartTime(Date.now());
      startElapsedTimer();
    } catch (error) {
      console.error('Failed to load question:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedChemist, setCurrentQuestion, setGameStatus, setAnswerStartTime, maybeApplyPhlogistonTrap, startElapsedTimer]);

  useEffect(() => {
    if (!selectedChemist) {
      navigate('/');
      return;
    }
    loadFirstQuestion();
  }, [selectedChemist, navigate, loadFirstQuestion]);

  useEffect(() => {
    if (isChainReaction && gameStatus === 'playing' && currentQuestion) {
      setGameStatus('chainReaction');
      triggerLavoisierSpeech();
    }
  }, [isChainReaction, gameStatus, currentQuestion, setGameStatus, triggerLavoisierSpeech]);

  const processModeTransition = useCallback((isCorrect: boolean, responseTime: number) => {
    addResponseTime(responseTime);
    updateActivationEnergy(isCorrect, responseTime);
    maybeSwitchToNextMode(responseTime, isCorrect);
  }, [addResponseTime, updateActivationEnergy, maybeSwitchToNextMode]);

  const loadNextQuestion = useCallback(async (result?: SubmitAnswerResponse) => {
    try {
      let nextQuestion = result?.nextQuestion;
      if (!nextQuestion && selectedChemist) {
        nextQuestion = await api.getQuestion(selectedChemist.id);
      }
      if (nextQuestion) {
        const processedQuestion = maybeApplyPhlogistonTrap(nextQuestion);
        setCurrentQuestion(processedQuestion);
        setSelectedAnswer(null);
        setLastAnswerResult(null);
        setCrystalInputAnswer('');
        setGameStatus(isChainReaction ? 'chainReaction' : 'playing');
        setAnswerStartTime(Date.now());
        startElapsedTimer();
      }
    } catch (error) {
      console.error('Failed to load next question:', error);
    }
  }, [selectedChemist, isChainReaction, setCurrentQuestion, setSelectedAnswer, setLastAnswerResult, setCrystalInputAnswer, setGameStatus, setAnswerStartTime, maybeApplyPhlogistonTrap, startElapsedTimer]);

  const handleCrystalAnswerSubmit = useCallback((textAnswer: string) => {
    if (!currentQuestion || gameStatus !== 'playing' || !isCrystalMode) return;
    stopElapsedTimer();

    const responseTime = Date.now() - answerStartTime;

    const keywords = currentQuestion.answerKeywords || [currentQuestion.options[currentQuestion.correctIndex]];
    const normalizedInput = textAnswer.toLowerCase().trim();
    const isCorrect = keywords.some(kw =>
      normalizedInput.includes(kw.toLowerCase()) ||
      kw.toLowerCase().includes(normalizedInput) ||
      currentQuestion.options[currentQuestion.correctIndex].toLowerCase().includes(normalizedInput) ||
      normalizedInput.includes(currentQuestion.options[currentQuestion.correctIndex].toLowerCase())
    );

    const baseScore = 100;
    const crystalBonus = isCorrect ? 50 : 0;

    setSelectedAnswer(currentQuestion.correctIndex);
    setGameStatus('answered');

    if (isCorrect) {
      incrementScore(baseScore + crystalBonus);
      incrementQuestionsAnswered(true);
      incrementConsecutiveCorrect();
      setTemperature(Math.min(100, temperature + 18));
      if (consecutiveCorrect + 1 >= 3) {
        triggerLavoisierSpeech();
      }

      setLastAnswerResult({
        isCorrect: true,
        correctIndex: currentQuestion.correctIndex,
        explanation: currentQuestion.explanation,
        newTemperature: Math.min(100, temperature + 18),
        shouldUnlock: false,
        gameOver: false,
      });

      processModeTransition(true, responseTime);
    } else {
      incrementQuestionsAnswered(false);
      resetConsecutiveCorrect();
      const newTemp = Math.max(0, temperature - 28);
      setTemperature(newTemp);
      setIsSmoking(true);
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 500);
      setTimeout(() => setIsSmoking(false), 3000);

      setLastAnswerResult({
        isCorrect: false,
        correctIndex: currentQuestion.correctIndex,
        explanation: currentQuestion.explanation,
        newTemperature: newTemp,
        shouldUnlock: false,
        gameOver: newTemp <= 0,
      });

      processModeTransition(false, responseTime);

      if (newTemp <= 0) {
        setGameStatus('gameover');
        return;
      }
    }

    setTimeout(() => {
      loadNextQuestion();
    }, 3500);
  }, [
    currentQuestion,
    gameStatus,
    isCrystalMode,
    answerStartTime,
    stopElapsedTimer,
    temperature,
    consecutiveCorrect,
    setSelectedAnswer,
    setGameStatus,
    incrementScore,
    incrementQuestionsAnswered,
    incrementConsecutiveCorrect,
    setTemperature,
    triggerLavoisierSpeech,
    setLastAnswerResult,
    resetConsecutiveCorrect,
    setIsSmoking,
    processModeTransition,
    loadNextQuestion,
  ]);

  const handleAnswer = useCallback(async (index: number) => {
    if (!currentQuestion || (gameStatus !== 'playing' && gameStatus !== 'chainReaction')) return;
    stopElapsedTimer();

    const responseTime = Date.now() - answerStartTime;

    if (isPhlogistonTrap) {
      setSelectedAnswer(index);
      setGameStatus('answered');
      incrementScore(-50);
      incrementQuestionsAnswered(false);
      resetConsecutiveCorrect();
      processModeTransition(false, responseTime);

      if (labCoatShields > 0) {
        consumeLabCoatShield();
        setPhlogistonTrapExplanation('🛡️ 实验服护盾抵挡了燃素烟雾！但这道题确实是燃素谬误，你选错了答案。');
      } else {
        setIsPhlogistonSmoke(true);
        setShakeScreen(true);
        setTimeout(() => setShakeScreen(false), 500);
        setTimeout(() => setIsPhlogistonSmoke(false), 3000);
        setPhlogistonTrapExplanation('🔥 燃素烟雾笼罩了你的视野！你误选了答案——这道题是燃素谬误，应该点击"这是燃素谬误"！');
      }

      setTimeout(() => {
        loadNextQuestion();
      }, 4000);
      return;
    }

    const usingCatalyst = isCatalystActive;

    if (usingCatalyst) {
      setSelectedAnswer(currentQuestion.correctIndex);
      setGameStatus('answered');
      setTemperature(temperature);
      incrementQuestionsAnswered(true);
      setIsCatalystActive(false);
      processModeTransition(true, responseTime);

      setLastAnswerResult({
        isCorrect: true,
        correctIndex: currentQuestion.correctIndex,
        explanation: currentQuestion.explanation,
        newTemperature: temperature,
        shouldUnlock: false,
        gameOver: false,
      });

      setTimeout(() => {
        loadNextQuestion();
      }, 3000);
      return;
    }

    setSelectedAnswer(index);
    setGameStatus('answered');

    try {
      const result: SubmitAnswerResponse = await api.submitAnswer({
        questionId: currentQuestion.id,
        selectedIndex: index,
        currentTemperature: temperature,
        responseTime,
      });

      setLastAnswerResult(result);
      setTemperature(result.newTemperature);
      incrementQuestionsAnswered(result.isCorrect);

      if (result.isCorrect) {
        incrementScore(100);
        incrementConsecutiveCorrect();
        if (consecutiveCorrect + 1 >= 3) {
          triggerLavoisierSpeech();
        }
      } else {
        resetConsecutiveCorrect();
        setIsSmoking(true);
        setShakeScreen(true);
        setTimeout(() => setShakeScreen(false), 500);
        setTimeout(() => setIsSmoking(false), 3000);
      }

      processModeTransition(result.isCorrect, responseTime);

      if (result.shouldUnlock && result.unlockedFact) {
        unlockFact(result.unlockedFact);
        setTimeout(() => {
          navigate('/unlock');
        }, 2500);
        return;
      }

      if (result.gameOver) {
        setGameStatus('gameover');
        return;
      }

      setTimeout(() => {
        loadNextQuestion(result);
      }, 3000);

    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  }, [currentQuestion, gameStatus, answerStartTime, stopElapsedTimer, isPhlogistonTrap, temperature, isCatalystActive, consecutiveCorrect, labCoatShields, navigate, setCurrentQuestion, setTemperature, setGameStatus, setSelectedAnswer, setIsSmoking, setLastAnswerResult, unlockFact, incrementScore, incrementQuestionsAnswered, incrementConsecutiveCorrect, resetConsecutiveCorrect, setIsCatalystActive, triggerLavoisierSpeech, consumeLabCoatShield, setIsPhlogistonSmoke, setPhlogistonTrapExplanation, processModeTransition, loadNextQuestion]);

  const handleChainReactionConfirm = useCallback(async (correctIndex: number) => {
    if (!currentQuestion || gameStatus !== 'chainReaction') return;
    stopElapsedTimer();

    const responseTime = Date.now() - answerStartTime;

    setSelectedAnswer(correctIndex);
    setGameStatus('answered');

    try {
      const result: SubmitAnswerResponse = await api.submitAnswer({
        questionId: currentQuestion.id,
        selectedIndex: correctIndex,
        currentTemperature: temperature,
        responseTime,
      });

      setLastAnswerResult(result);
      setTemperature(result.newTemperature);
      incrementQuestionsAnswered(true);
      incrementScore(200);
      incrementConsecutiveCorrect();
      processModeTransition(true, responseTime);

      setIsChainReaction(false);

      if (result.shouldUnlock && result.unlockedFact) {
        unlockFact(result.unlockedFact);
        setTimeout(() => {
          navigate('/unlock');
        }, 2500);
        return;
      }

      if (result.gameOver) {
        setGameStatus('gameover');
        return;
      }

      setTimeout(() => {
        loadNextQuestion(result);
      }, 3000);

    } catch (error) {
      console.error('Failed to submit chain reaction answer:', error);
    }
  }, [currentQuestion, gameStatus, answerStartTime, stopElapsedTimer, temperature, navigate, setTemperature, setGameStatus, setSelectedAnswer, setLastAnswerResult, unlockFact, incrementScore, incrementQuestionsAnswered, incrementConsecutiveCorrect, setIsChainReaction, processModeTransition, loadNextQuestion]);

  const handlePhlogistonIdentify = useCallback(() => {
    if (!isPhlogistonTrap || gameStatus !== 'playing') return;
    stopElapsedTimer();

    const responseTime = Date.now() - answerStartTime;

    setGameStatus('answered');
    incrementScore(150);
    incrementQuestionsAnswered(true);
    incrementConsecutiveCorrect();
    incrementPhlogistonIdentified();
    processModeTransition(true, responseTime);

    const descIndex = phlogistonTrapDesc ? getPhlogistonDescriptionIndex(phlogistonTrapDesc) : 0;
    setPhlogistonTrapExplanation(getPhlogistonExplanation(descIndex));

    const newIdentified = phlogistonIdentified + 1;
    if (newIdentified % 3 === 0) {
      const revolution = getRevolutionForMilestone(newIdentified);
      if (revolution) {
        unlockRevolution(revolution);
      }
    }

    if (consecutiveCorrect + 1 >= 3) {
      triggerLavoisierSpeech();
    }

    setTimeout(() => {
      loadNextQuestion();
    }, 4000);
  }, [isPhlogistonTrap, gameStatus, answerStartTime, stopElapsedTimer, phlogistonTrapDesc, phlogistonIdentified, consecutiveCorrect, setGameStatus, incrementScore, incrementQuestionsAnswered, incrementConsecutiveCorrect, incrementPhlogistonIdentified, setPhlogistonTrapExplanation, unlockRevolution, triggerLavoisierSpeech, loadNextQuestion, processModeTransition]);

  const handleRestart = () => {
    stopElapsedTimer();
    resetGame();
    navigate('/');
  };

  const handleRetry = async () => {
    if (!selectedChemist) return;

    try {
      setLoading(true);
      const question = await api.getQuestion(selectedChemist.id);
      const processedQuestion = maybeApplyPhlogistonTrap(question);
      setCurrentQuestion(processedQuestion);
      setTemperature(50);
      setSelectedAnswer(null);
      setLastAnswerResult(null);
      setCrystalInputAnswer('');
      exitExplosionMode();
      exitCrystalMode();
      resetConsecutiveFastWrong();
      resetConsecutiveSlowCorrect();
      setGameStatus('playing');
      setAnswerStartTime(Date.now());
      startElapsedTimer();
    } catch (error) {
      console.error('Failed to load question:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedChemist) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-alchemy-darkBrown">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚗️</div>
          <p className="text-alchemy-copper font-display text-xl">正在准备炼金配方...</p>
        </div>
      </div>
    );
  }

  const formatElapsed = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${s}.${Math.floor((ms % 1000) / 100)}s`;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-alchemy-darkBrown via-alchemy-brown to-alchemy-darkBrown py-6 px-4 noise-overlay relative ${shakeScreen ? 'animate-shake' : ''} ${isChainReaction ? 'chain-reaction-bg' : ''} ${reactionMode === 'crystal' ? 'crystal-global-bg' : ''}`}>
      {isPhlogistonSmoke && (
        <div className="phlogiston-smoke-overlay">
          <div className="phlogiston-smoke-text">
            🔥 燃素烟雾笼罩！ 🔥
          </div>
        </div>
      )}

      {explosionOverlay && (
        <div className="explosion-danger-overlay">
          <div className="explosion-danger-content">
            <div className="text-7xl mb-2 animate-explosion-pulse">💥</div>
            <div className="explosion-danger-title">爆炸危险！</div>
            <div className="explosion-danger-subtitle">选项正在飞散 — 快抓准！</div>
          </div>
        </div>
      )}

      {crystalOverlay && (
        <div className="crystal-mode-overlay">
          <div className="crystal-mode-content">
            <div className="text-7xl mb-2 animate-crystal-spin">💎</div>
            <div className="crystal-mode-title">结晶模式启动</div>
            <div className="crystal-mode-subtitle">冷静思考 · 精准输入 · 双倍奖励</div>
          </div>
        </div>
      )}

      {currentRevolution && gameStatus === 'answered' && (
        <div className="revolution-unlock-overlay" onClick={() => setCurrentRevolution(null)}>
          <div className="revolution-unlock-card" onClick={(e) => e.stopPropagation()}>
            <div className="text-6xl mb-4 animate-bounce">{currentRevolution.icon}</div>
            <h3 className="text-2xl font-display text-purple-700 mb-2">🏛️ 历史革命解锁！</h3>
            <h4 className="text-xl font-display text-alchemy-darkBrown mb-2">{currentRevolution.title}</h4>
            <p className="text-sm text-alchemy-brown mb-1">{currentRevolution.year}年</p>
            <p className="text-alchemy-darkBrown/80 leading-relaxed mt-3 text-sm">{currentRevolution.content}</p>
            <button
              onClick={() => setCurrentRevolution(null)}
              className="mt-4 px-6 py-2 brass-button rounded-lg text-alchemy-darkBrown font-display"
            >
              继续炼金
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 brass-button rounded-lg text-alchemy-darkBrown font-display text-sm transition-transform hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>返回首页</span>
          </button>

          <div className="text-center flex-1 min-w-[200px]">
            <h2 className="text-xl md:text-2xl font-display text-alchemy-copper">
              {selectedChemist.avatar} {selectedChemist.name}的炼金实验室
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            <ChemistryLanguageToggle />
            <div className="text-right">
              <div className="text-sm text-alchemy-copperDark">得分</div>
              <div className="text-xl font-display text-alchemy-flame">{score}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-alchemy-copperDark">正确率</div>
              <div className="text-xl font-display text-alchemy-copper">
                {questionsAnswered > 0
                  ? `${Math.round((correctAnswers / questionsAnswered) * 100)}%`
                  : '--%'
                }
              </div>
            </div>
            {gameStatus === 'playing' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-alchemy-copper/10 rounded-full border border-alchemy-copper/30">
                <Timer className="w-4 h-4 text-alchemy-flame" />
                <span className={`font-mono font-bold text-sm ${
                  elapsedTime < FAST_ANSWER_THRESHOLD ? 'text-red-500' :
                  elapsedTime > SLOW_ANSWER_THRESHOLD ? 'text-blue-400' : 'text-alchemy-copper'
                }`}>
                  {formatElapsed(elapsedTime)}
                </span>
              </div>
            )}
            {unlockedFacts.length > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 bg-alchemy-emerald/20 rounded-full border border-alchemy-emerald/50">
                <Trophy className="w-4 h-4 text-alchemy-emerald" />
                <span className="text-alchemy-emerald font-bold">{unlockedFacts.length}</span>
              </div>
            )}
            {labCoatShields > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-400/20 rounded-full border border-blue-400/50">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-bold">{labCoatShields}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="fade-in-up space-y-4">
            <AlchemyFurnace />
            <div>
              <ActivationEnergyGraph />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="parchment-bg rounded-lg p-3 shadow-lg border-2 border-alchemy-copper/40 noise-overlay">
                <div className="flex items-center gap-2 text-xs font-display text-alchemy-brown mb-1">
                  <Gauge className="w-3.5 h-3.5" />
                  {chemistryLanguageStyle === 'modern' ? 'Avg Response' : '平均答题速度'}
                </div>
                <div className="text-xl font-display text-alchemy-flame font-mono">
                  {(() => {
                    const times = useGameStore.getState().answerResponseTimes;
                    if (times.length === 0) return '--s';
                    const avg = times.reduce((a, b) => a + b, 0) / times.length;
                    return `${(avg / 1000).toFixed(1)}s`;
                  })()}
                </div>
              </div>
              <div className="parchment-bg rounded-lg p-3 shadow-lg border-2 border-alchemy-copper/40 noise-overlay">
                <div className="flex items-center gap-2 text-xs font-display text-alchemy-brown mb-1">
                  <SparklesIcon />
                  {chemistryLanguageStyle === 'modern' ? 'Status' : '反应状态'}
                </div>
                <div className={`text-sm font-bold ${
                  reactionMode === 'explosion' ? 'text-red-500' :
                  reactionMode === 'crystal' ? 'text-blue-500' :
                  activationEnergy < 30 ? 'text-emerald-500' : 'text-alchemy-copperDark'
                }`}>
                  {reactionMode === 'explosion'
                    ? (chemistryLanguageStyle === 'modern' ? '⚠️ Explosive!' : '⚠️ 易爆态')
                    : reactionMode === 'crystal'
                      ? (chemistryLanguageStyle === 'modern' ? '💎 Crystallizing' : '💎 结晶中')
                      : activationEnergy < 30
                        ? (chemistryLanguageStyle === 'modern' ? '⚡ Catalyzed' : '⚡ 催化态')
                        : (chemistryLanguageStyle === 'modern' ? '🔬 Steady' : '🔬 稳态')}
                </div>
              </div>
            </div>

            <CatalystPanel />
            <PhlogistonTrapPanel />
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2 brass-button rounded-lg text-alchemy-darkBrown font-display text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                重新开始
              </button>
            </div>
          </div>

          <div className="fade-in-up stagger-1">
            {currentQuestion && gameStatus !== 'gameover' && (
              <QuestionCard
                question={currentQuestion}
                onAnswer={handleAnswer}
                onChainReactionConfirm={handleChainReactionConfirm}
                onPhlogistonIdentify={handlePhlogistonIdentify}
                onCrystalAnswerSubmit={handleCrystalAnswerSubmit}
                disabled={gameStatus !== 'playing' && gameStatus !== 'chainReaction'}
                selectedIndex={selectedAnswer}
                correctIndex={lastAnswerResult?.correctIndex}
                showExplanation={gameStatus === 'answered'}
                explanation={lastAnswerResult?.explanation}
                isChainReactionMode={gameStatus === 'chainReaction'}
                isCatalystUsed={isCatalystActive && gameStatus === 'answered'}
                isPhlogistonTrapMode={isPhlogistonTrap}
              />
            )}

            {gameStatus === 'gameover' && (
              <div className="parchment-bg rounded-lg p-8 shadow-2xl border-4 border-red-500 noise-overlay text-center max-w-lg mx-auto animate-unlock">
                <div className="text-6xl mb-4">💨</div>
                <h3 className="text-3xl font-display text-red-600 mb-4">反应炉熄灭了！</h3>
                <p className="text-alchemy-darkBrown mb-6 text-lg">
                  温度降至0°C，炼金反应被迫终止。
                  <br />
                  不要气馁，再来一次吧！
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-alchemy-copper/20 rounded-lg">
                  <div>
                    <div className="text-sm text-alchemy-brown">答题数</div>
                    <div className="text-2xl font-display text-alchemy-flame">{questionsAnswered}</div>
                  </div>
                  <div>
                    <div className="text-sm text-alchemy-brown">正确数</div>
                    <div className="text-2xl font-display text-alchemy-emerald">{correctAnswers}</div>
                  </div>
                  <div>
                    <div className="text-sm text-alchemy-brown">得分</div>
                    <div className="text-2xl font-display text-alchemy-flame">{score}</div>
                  </div>
                  <div>
                    <div className="text-sm text-alchemy-brown">催化剂</div>
                    <div className="text-2xl font-display text-yellow-400">⚛️ {catalystQuanta}</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRetry}
                    className="brass-button px-6 py-3 rounded-lg text-alchemy-darkBrown font-display text-lg flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    再来一次
                  </button>
                  <button
                    onClick={handleRestart}
                    className="px-6 py-3 rounded-lg border-2 border-alchemy-copper text-alchemy-copper font-display text-lg flex items-center gap-2 hover:bg-alchemy-copper/10 transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    返回首页
                  </button>
                </div>
              </div>
            )}

            {gameStatus === 'answered' && lastAnswerResult && !lastAnswerResult.shouldUnlock && !isPhlogistonTrap && (
              <div className="mt-4 text-center fade-in-up stagger-2">
                <p className="text-alchemy-copperLight text-sm">
                  3秒后自动进入下一题...
                </p>
              </div>
            )}

            {gameStatus === 'answered' && isPhlogistonTrap && (
              <div className="mt-4 text-center fade-in-up stagger-2">
                <p className="text-purple-600 text-sm">
                  4秒后自动进入下一题...
                </p>
              </div>
            )}

            {gameStatus === 'answered' && lastAnswerResult?.shouldUnlock && (
              <div className="mt-4 text-center fade-in-up stagger-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-alchemy-emerald/20 rounded-full border border-alchemy-emerald/50 animate-pulse">
                  <Trophy className="w-5 h-5 text-alchemy-emerald" />
                  <span className="text-alchemy-emerald font-display">🎉 解锁冷知识中...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-start gap-2 p-4 bg-alchemy-copper/10 rounded-lg border border-alchemy-copper/30 max-w-3xl text-left">
            <HelpCircle className="w-5 h-5 text-alchemy-copper flex-shrink-0 mt-0.5" />
            <div className="text-sm text-alchemy-copperDark space-y-1.5">
              <p className="font-semibold text-alchemy-copper">{chemistryLanguageStyle === 'modern' ? '🎮 Game Tips:' : '游戏提示：'}</p>
              <p>{chemistryLanguageStyle === 'modern' ? 'Correct +15°C, Wrong -25°C. Reach 100°C to unlock fun facts!' : '答对 +15°C，答错 -25°C 并冒烟。满 100°C 解锁冷知识！'}</p>
              <p className="mt-1 font-semibold text-alchemy-flame">⚗️ {chemistryLanguageStyle === 'modern' ? 'Catalyst Combo:' : '催化剂连击系统：'}</p>
              <p>{chemistryLanguageStyle === 'modern' ? 'Every 2 correct → 1 Catalyst | Use catalyst → Auto-correct (preserve temp)' : '每 2 次正确 → 积累 1 催化剂量子 | 消耗量子 → 自动正确(不加分，仅保温度)'}</p>
              <p>{chemistryLanguageStyle === 'modern' ? '3 consecutive correct → <span className="font-bold text-alchemy-flame">Chain Reaction</span> → Double score next question! ⚛️' : (<>连续 3 次正确不消耗 → <span className="text-alchemy-flame font-bold">链式反应</span> → 下一题双倍得分！⚛️</>)}</p>
              <p className="mt-1 font-semibold text-purple-600">🔥 {chemistryLanguageStyle === 'modern' ? 'Phlogiston Trap Mode:' : '燃素说陷阱模式：'}</p>
              <p>{chemistryLanguageStyle === 'modern' ? 'Random phlogiston fallacy questions → Click "This is Phlogiston Fallacy" +150pts' : '随机出现燃素谬误题 → 点击<span className="text-purple-600 font-bold">"这是燃素谬误"</span> +150分'}</p>
              <p>{chemistryLanguageStyle === 'modern' ? 'Wrong choice → -50pts + 3s smoke | Identify 3 times → Unlock historical revolution + 🛡️ Lab Coat Shield' : '误选答案 → -50分 + 燃素烟雾3秒 | 每识破3次 → 解锁历史革命 + 🛡️实验服护盾'}</p>
              <p className="mt-1 font-semibold text-red-500">💥 {chemistryLanguageStyle === 'modern' ? 'Explosion Danger (Kinetics):' : '爆炸危险（反应动力学）：'}</p>
              <p>{chemistryLanguageStyle === 'modern' ? '2x fast wrong answers OR high temp → options shake and shift! Stay calm!' : '连续快错 2 次 或 高温 → 选项抖动移位！小心瞄准！'}</p>
              <p className="mt-1 font-semibold text-blue-500">💎 {chemistryLanguageStyle === 'modern' ? 'Crystal Mode (Kinetics):' : '结晶模式（反应动力学）：'}</p>
              <p>{chemistryLanguageStyle === 'modern' ? '3x slow correct answers OR low temp → Fill-in-the-blank mode! Double rewards!' : '连续慢对 3 次 或 低温 → 填空题模式！冷静答题双倍奖励！'}</p>
              <p className="mt-1 font-semibold text-alchemy-emerald">📈 {chemistryLanguageStyle === 'modern' ? 'Activation Energy:' : '活化能曲线：'}</p>
              <p>{chemistryLanguageStyle === 'modern' ? 'Correct → Lower Ea (easier reactions) | Wrong → Raise Ea. Monitor the energy diagram!' : '答对 → 活化能降低（反应易进行）| 答错 → 活化能升高。随时看能量曲线图！'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L14.5 9.5 21 12 14.5 14.5 12 21 9.5 14.5 3 12 9.5 9.5 12 3z" />
    </svg>
  );
}

export default Game;
