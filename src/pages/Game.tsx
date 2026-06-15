import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { api } from '@/utils/api';
import AlchemyFurnace from '@/components/AlchemyFurnace';
import QuestionCard from '@/components/QuestionCard';
import CatalystPanel from '@/components/CatalystPanel';
import PhlogistonTrapPanel from '@/components/PhlogistonTrapPanel';
import {
  shouldActivatePhlogistonTrap,
  getRandomPhlogistonDescription,
  getPhlogistonExplanation,
  getPhlogistonDescriptionIndex,
  getRevolutionForMilestone,
} from '@/components/PhlogistonTrapPanel';
import type { SubmitAnswerResponse, Question } from '../../shared/types';
import { Home, RotateCcw, Trophy, HelpCircle, Shield } from 'lucide-react';

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
    showLavoisierSpeech,
    isPhlogistonTrap,
    phlogistonIdentified,
    labCoatShields,
    isPhlogistonSmoke,
    unlockedRevolutions,
    currentRevolution,
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
    useLabCoatShield,
    setIsPhlogistonSmoke,
    setPhlogistonTrapExplanation,
    resetPhlogistonTrap,
  } = useGameStore();

  const [loading, setLoading] = useState(true);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [phlogistonTrapDesc, setPhlogistonTrapDesc] = useState<string | null>(null);
  const lavoisierTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const loadFirstQuestion = useCallback(async () => {
    if (!selectedChemist) return;
    
    try {
      setLoading(true);
      const question = await api.getQuestion(selectedChemist.id);
      const processedQuestion = maybeApplyPhlogistonTrap(question);
      setCurrentQuestion(processedQuestion);
      setGameStatus('playing');
    } catch (error) {
      console.error('Failed to load question:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedChemist, setCurrentQuestion, setGameStatus, maybeApplyPhlogistonTrap]);

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

  const handleAnswer = useCallback(async (index: number) => {
    if (!currentQuestion || (gameStatus !== 'playing' && gameStatus !== 'chainReaction')) return;

    if (isPhlogistonTrap) {
      setSelectedAnswer(index);
      setGameStatus('answered');
      incrementScore(-50);
      incrementQuestionsAnswered(false);
      resetConsecutiveCorrect();

      if (labCoatShields > 0) {
        useLabCoatShield();
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
  }, [currentQuestion, gameStatus, temperature, isCatalystActive, consecutiveCorrect, navigate, setCurrentQuestion, setTemperature, setGameStatus, setSelectedAnswer, setIsSmoking, setLastAnswerResult, unlockFact, incrementScore, incrementQuestionsAnswered, incrementConsecutiveCorrect, resetConsecutiveCorrect, setIsCatalystActive, triggerLavoisierSpeech]);

  const handleChainReactionConfirm = useCallback(async (correctIndex: number) => {
    if (!currentQuestion || gameStatus !== 'chainReaction') return;

    setSelectedAnswer(correctIndex);
    setGameStatus('answered');

    try {
      const result: SubmitAnswerResponse = await api.submitAnswer({
        questionId: currentQuestion.id,
        selectedIndex: correctIndex,
        currentTemperature: temperature,
      });

      setLastAnswerResult(result);
      setTemperature(result.newTemperature);
      incrementQuestionsAnswered(true);
      incrementScore(200);
      incrementConsecutiveCorrect();

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
  }, [currentQuestion, gameStatus, temperature, navigate, setTemperature, setGameStatus, setSelectedAnswer, setLastAnswerResult, unlockFact, incrementScore, incrementQuestionsAnswered, incrementConsecutiveCorrect, setIsChainReaction]);

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
        setGameStatus(isChainReaction ? 'chainReaction' : 'playing');
      }
    } catch (error) {
      console.error('Failed to load next question:', error);
    }
  }, [selectedChemist, isChainReaction, setCurrentQuestion, setSelectedAnswer, setLastAnswerResult, setGameStatus, maybeApplyPhlogistonTrap]);

  const handlePhlogistonIdentify = useCallback(() => {
    if (!isPhlogistonTrap || gameStatus !== 'playing') return;

    setGameStatus('answered');
    incrementScore(150);
    incrementQuestionsAnswered(true);
    incrementConsecutiveCorrect();
    incrementPhlogistonIdentified();

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
  }, [isPhlogistonTrap, gameStatus, phlogistonTrapDesc, phlogistonIdentified, consecutiveCorrect, setGameStatus, incrementScore, incrementQuestionsAnswered, incrementConsecutiveCorrect, incrementPhlogistonIdentified, setPhlogistonTrapExplanation, unlockRevolution, triggerLavoisierSpeech, loadNextQuestion]);

  const handleRestart = () => {
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
      setGameStatus('playing');
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

  return (
    <div className={`min-h-screen bg-gradient-to-b from-alchemy-darkBrown via-alchemy-brown to-alchemy-darkBrown py-6 px-4 noise-overlay relative ${shakeScreen ? 'animate-shake' : ''} ${isChainReaction ? 'chain-reaction-bg' : ''}`}>
      {isPhlogistonSmoke && (
        <div className="phlogiston-smoke-overlay">
          <div className="phlogiston-smoke-text">
            🔥 燃素烟雾笼罩！ 🔥
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
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 brass-button rounded-lg text-alchemy-darkBrown font-display text-sm transition-transform hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>返回首页</span>
          </button>

          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-display text-alchemy-copper">
              {selectedChemist.avatar} {selectedChemist.name}的炼金实验室
            </h2>
          </div>

          <div className="flex items-center gap-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="fade-in-up">
            <AlchemyFurnace />
            <div className="mt-6">
              <CatalystPanel />
            </div>
            <div className="mt-4">
              <PhlogistonTrapPanel />
            </div>
            <div className="mt-4 flex justify-center gap-4">
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
          <div className="inline-flex items-start gap-2 p-4 bg-alchemy-copper/10 rounded-lg border border-alchemy-copper/30 max-w-xl">
            <HelpCircle className="w-5 h-5 text-alchemy-copper flex-shrink-0 mt-0.5" />
            <div className="text-left text-sm text-alchemy-copperDark">
              <p className="font-semibold text-alchemy-copper">游戏提示：</p>
              <p>答对 +15°C，答错 -25°C 并冒烟。满 100°C 解锁冷知识！</p>
              <p className="mt-1 font-semibold text-alchemy-flame">⚗️ 催化剂连击系统：</p>
              <p>每 2 次正确 → 积累 1 催化剂量子 | 消耗量子 → 自动正确(不加分，仅保温度)</p>
              <p>连续 3 次正确不消耗 → <span className="text-alchemy-flame font-bold">链式反应</span> → 下一题双倍得分！⚛️</p>
              <p className="mt-1 font-semibold text-purple-600">🔥 燃素说陷阱模式：</p>
              <p>随机出现燃素谬误题 → 点击<span className="text-purple-600 font-bold">"这是燃素谬误"</span> +150分</p>
              <p>误选答案 → -50分 + 燃素烟雾3秒 | 每识破3次 → 解锁历史革命 + 🛡️实验服护盾</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
