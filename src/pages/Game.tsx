import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { api } from '@/utils/api';
import AlchemyFurnace from '@/components/AlchemyFurnace';
import QuestionCard from '@/components/QuestionCard';
import CatalystPanel from '@/components/CatalystPanel';
import type { SubmitAnswerResponse } from '../../shared/types';
import { Home, RotateCcw, Trophy, HelpCircle } from 'lucide-react';

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
  } = useGameStore();

  const [loading, setLoading] = useState(true);
  const [shakeScreen, setShakeScreen] = useState(false);
  const lavoisierTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerLavoisierSpeech = useCallback(() => {
    if (lavoisierTimerRef.current) clearTimeout(lavoisierTimerRef.current);
    setShowLavoisierSpeech(true);
    lavoisierTimerRef.current = setTimeout(() => setShowLavoisierSpeech(false), 2500);
  }, [setShowLavoisierSpeech]);

  const loadFirstQuestion = useCallback(async () => {
    if (!selectedChemist) return;
    
    try {
      setLoading(true);
      const question = await api.getQuestion(selectedChemist.id);
      setCurrentQuestion(question);
      setGameStatus('playing');
    } catch (error) {
      console.error('Failed to load question:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedChemist, setCurrentQuestion, setGameStatus]);

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
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setLastAnswerResult(null);
        setGameStatus(isChainReaction ? 'chainReaction' : 'playing');
      }
    } catch (error) {
      console.error('Failed to load next question:', error);
    }
  }, [selectedChemist, isChainReaction, setCurrentQuestion, setSelectedAnswer, setLastAnswerResult, setGameStatus]);

  const handleRestart = () => {
    resetGame();
    navigate('/');
  };

  const handleRetry = async () => {
    if (!selectedChemist) return;
    
    try {
      setLoading(true);
      const question = await api.getQuestion(selectedChemist.id);
      setCurrentQuestion(question);
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
    <div className={`min-h-screen bg-gradient-to-b from-alchemy-darkBrown via-alchemy-brown to-alchemy-darkBrown py-6 px-4 noise-overlay ${shakeScreen ? 'animate-shake' : ''} ${isChainReaction ? 'chain-reaction-bg' : ''}`}>
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="fade-in-up">
            <AlchemyFurnace />
            <div className="mt-6">
              <CatalystPanel />
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
                disabled={gameStatus !== 'playing' && gameStatus !== 'chainReaction'}
                selectedIndex={selectedAnswer}
                correctIndex={lastAnswerResult?.correctIndex}
                showExplanation={gameStatus === 'answered'}
                explanation={lastAnswerResult?.explanation}
                isChainReactionMode={gameStatus === 'chainReaction'}
                isCatalystUsed={isCatalystActive && gameStatus === 'answered'}
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

            {gameStatus === 'answered' && lastAnswerResult && !lastAnswerResult.shouldUnlock && (
              <div className="mt-4 text-center fade-in-up stagger-2">
                <p className="text-alchemy-copperLight text-sm">
                  3秒后自动进入下一题...
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
