import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { api } from '@/utils/api';
import PeriodicTable from '@/components/PeriodicTable';
import QuestionCard from '@/components/QuestionCard';
import ElementFunFact from '@/components/ElementFunFact';
import ProphecySelector from '@/components/ProphecySelector';
import AIOpponent from '@/components/AIOpponent';
import type { Element, Question, Chemist, CellOwner, ProphecyType, SubmitPeriodicAnswerResponse, ElementFact } from '../../shared/types';
import { Home, RotateCcw, Trophy, HelpCircle, Sparkles, ArrowRight } from 'lucide-react';

const PeriodicTableGame: React.FC = () => {
  const navigate = useNavigate();
  const {
    periodicBoard,
    periodicSelectedElementId,
    periodicIsProphecyMode,
    periodicProphecyCount,
    periodicCurrentProphecy,
    periodicAiThinking,
    periodicCompletedLines,
    periodicGameOver,
    periodicGameWinner,
    periodicScore,
    periodicAnswerResult,
    periodicCurrentElementFact,
    periodicShowElementFact,
    periodicLastCapturedElement,
    periodicLastLostElement,
    initPeriodicGame,
    setPeriodicBoard,
    setPeriodicSelectedElement,
    setPeriodicIsProphecyMode,
    setPeriodicCurrentProphecy,
    incrementPeriodicProphecyCount,
    decrementPeriodicProphecyCount,
    setPeriodicAiThinking,
    setPeriodicAnswerResult,
    addPeriodicCompletedLine,
    setPeriodicGameWinner,
    setPeriodicGameOver,
    incrementPeriodicScore,
    setPeriodicCurrentElementFact,
    setPeriodicShowElementFact,
    resetPeriodicGame,
    setCurrentQuestion,
    setSelectedAnswer,
    setGameStatus,
    setLastAnswerResult,
    setPeriodicLastCapturedElement,
    setPeriodicLastLostElement,
    gameStatus,
    currentQuestion,
    selectedAnswer,
  } = useGameStore();

  const [elements, setElements] = useState<Element[]>([]);
  const [chemists, setChemists] = useState<Chemist[]>([]);
  const [loading, setLoading] = useState(true);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [aiName] = useState('元素守护者');
  const [aiAvatar] = useState('🤖');

  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [elementsData, chemistsData] = await Promise.all([
        api.getElements(),
        api.getChemists(),
        api.resetPeriodicGame(),
      ]);
      setElements(elementsData);
      setChemists(chemistsData);
      initPeriodicGame();
      setGameStatus('idle');
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  }, [initPeriodicGame, setGameStatus]);

  useEffect(() => {
    loadInitialData();
    return () => {
      if (aiTimerRef.current) {
        clearTimeout(aiTimerRef.current);
      }
    };
  }, [loadInitialData]);

  const loadQuestionForElement = useCallback(async (element: Element) => {
    try {
      let chemistId = element.chemistId;
      
      if (periodicCurrentProphecy && periodicCurrentProphecy !== 'random') {
        chemistId = periodicCurrentProphecy;
        setPeriodicCurrentProphecy(null);
      } else if (periodicCurrentProphecy === 'random') {
        const randomChemist = chemists[Math.floor(Math.random() * chemists.length)];
        chemistId = randomChemist.id;
        setPeriodicCurrentProphecy(null);
      }

      const question = await api.getQuestion(chemistId);
      setCurrentQuestion(question);
      setSelectedAnswer(null);
      setLastAnswerResult(null);
      setGameStatus('playing');
    } catch (error) {
      console.error('Failed to load question:', error);
    }
  }, [periodicCurrentProphecy, chemists, setCurrentQuestion, setSelectedAnswer, setLastAnswerResult, setGameStatus, setPeriodicCurrentProphecy]);

  const handleElementClick = useCallback((element: Element) => {
    const key = `${element.row}-${element.col}`;
    if (periodicBoard[key] || gameStatus === 'answered' || periodicAiThinking) {
      return;
    }

    if (gameStatus === 'playing' && periodicSelectedElementId === element.id) {
      return;
    }

    setPeriodicSelectedElement(element.id);
    loadQuestionForElement(element);
  }, [periodicBoard, gameStatus, periodicAiThinking, periodicSelectedElementId, setPeriodicSelectedElement, loadQuestionForElement]);

  const showElementFact = useCallback(async (element: Element) => {
    try {
      const fact = await api.getElementFact(element.id);
      setPeriodicCurrentElementFact(fact);
      setPeriodicShowElementFact(true);
    } catch (error) {
      console.error('Failed to load element fact:', error);
    }
  }, [setPeriodicCurrentElementFact, setPeriodicShowElementFact]);

  const handleAnswer = useCallback(async (index: number) => {
    if (!currentQuestion || gameStatus !== 'playing' || !periodicSelectedElementId) return;

    const element = elements.find(e => e.id === periodicSelectedElementId);
    if (!element) return;

    setSelectedAnswer(index);
    setGameStatus('answered');

    try {
      const result: SubmitPeriodicAnswerResponse = await api.submitPeriodicAnswer({
        questionId: currentQuestion.id,
        selectedIndex: index,
        elementId: periodicSelectedElementId,
      });

      if (!result.isCorrect) {
        setPeriodicAiThinking(true);
        await new Promise(resolve => setTimeout(resolve, 1200));
        setPeriodicAiThinking(false);
      }

      setPeriodicAnswerResult(result);
      setPeriodicBoard(result.newBoardState);

      if (result.isCorrect) {
        incrementPeriodicScore(100);
        setShakeScreen(false);
        
        if (result.capturedElement) {
          setPeriodicLastCapturedElement(result.capturedElement);
          setPeriodicLastLostElement(null);
          showElementFact(result.capturedElement);
        }

        if (result.lineCompleted && result.lineCompleted.owner === 'player') {
          addPeriodicCompletedLine(result.lineCompleted);
          incrementPeriodicProphecyCount();
        }
      } else {
        setShakeScreen(true);
        setTimeout(() => setShakeScreen(false), 500);

        if (result.lostElement) {
          setPeriodicLastLostElement(result.lostElement);
          setPeriodicLastCapturedElement(null);
        }

        if (result.lineCompleted && result.lineCompleted.owner === 'ai') {
          addPeriodicCompletedLine(result.lineCompleted);
        }
      }

      if (result.gameOver) {
        setPeriodicGameOver(true);
        setPeriodicGameWinner(result.winner);
        return;
      }

      setTimeout(() => {
        setPeriodicAnswerResult(null);
        setPeriodicSelectedElement(null);
        setSelectedAnswer(null);
        setLastAnswerResult(null);
        setGameStatus('idle');
      }, 4000);

    } catch (error) {
      console.error('Failed to submit answer:', error);
      setPeriodicAiThinking(false);
    }
  }, [currentQuestion, gameStatus, periodicSelectedElementId, elements, setSelectedAnswer, setGameStatus, setPeriodicAnswerResult, setPeriodicBoard, setPeriodicAiThinking, incrementPeriodicScore, showElementFact, addPeriodicCompletedLine, incrementPeriodicProphecyCount, setPeriodicLastCapturedElement, setPeriodicLastLostElement, setPeriodicGameOver, setPeriodicGameWinner, setPeriodicSelectedElement, setLastAnswerResult]);

  const handleSelectProphecy = useCallback((chemistId: ProphecyType) => {
    setPeriodicCurrentProphecy(chemistId === 'random' ? 'random' : chemistId);
    setPeriodicIsProphecyMode(false);
    decrementPeriodicProphecyCount();
  }, [setPeriodicCurrentProphecy, setPeriodicIsProphecyMode, decrementPeriodicProphecyCount]);

  const handleStartProphecy = useCallback(() => {
    if (periodicProphecyCount > 0) {
      setPeriodicIsProphecyMode(true);
    }
  }, [periodicProphecyCount, setPeriodicIsProphecyMode]);

  const handleCancelProphecy = useCallback(() => {
    setPeriodicIsProphecyMode(false);
  }, [setPeriodicIsProphecyMode]);

  const handleCloseElementFact = useCallback(() => {
    setPeriodicShowElementFact(false);
    setPeriodicCurrentElementFact(null);
  }, [setPeriodicShowElementFact, setPeriodicCurrentElementFact]);

  const handleRestart = async () => {
    try {
      await api.resetPeriodicGame();
    } catch (error) {
      console.error('Failed to reset periodic game:', error);
    }
    resetPeriodicGame();
    navigate('/');
  };

  const handleRetry = async () => {
    try {
      await api.resetPeriodicGame();
    } catch (error) {
      console.error('Failed to reset periodic game:', error);
    }
    resetPeriodicGame();
    loadInitialData();
  };

  const playerCells = Object.values(periodicBoard).filter(v => v === 'player').length;
  const aiCells = Object.values(periodicBoard).filter(v => v === 'ai').length;

  const getSelectedElement = (): Element | undefined => {
    return elements.find(e => e.id === periodicSelectedElementId);
  };

  const getCurrentElementForFact = (): Element | undefined => {
    if (!periodicCurrentElementFact) return undefined;
    return elements.find(e => e.id === periodicCurrentElementFact.elementId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-alchemy-darkBrown">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚗️</div>
          <p className="text-alchemy-copper font-display text-xl">正在准备元素周期表...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-alchemy-darkBrown via-alchemy-brown to-alchemy-darkBrown py-6 px-4 noise-overlay ${shakeScreen ? 'animate-shake' : ''}`}>
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
              ⚗️ 元素周期表争夺战
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-alchemy-copperDark">得分</div>
              <div className="text-xl font-display text-alchemy-flame">{periodicScore}</div>
            </div>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="p-2 rounded-lg bg-alchemy-copper/20 hover:bg-alchemy-copper/40 transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-alchemy-copper" />
            </button>
          </div>
        </div>

        {showInstructions && (
          <div className="mb-6 p-4 bg-alchemy-copper/10 rounded-xl border border-alchemy-copper/30 fade-in-up">
            <h3 className="font-display text-lg text-alchemy-copper mb-2">📖 游戏规则</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-alchemy-copperDark">
              <div className="flex items-start gap-2">
                <span className="text-alchemy-emerald">1.</span>
                <p>点击空白格子，回答与该元素相关化学家的问题</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-alchemy-emerald">2.</span>
                <p>答对可以占据该格子，答错AI会抢走一个空白格子</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-alchemy-emerald">3.</span>
                <p>占据整行或整列获得<span className="text-alchemy-flame font-bold">元素预言权</span></p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-alchemy-emerald">4.</span>
                <p>预言权可指定下一题的化学家类型来源</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-alchemy-emerald">5.</span>
                <p>先完成整行/整列，或占据更多格子者获胜</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-alchemy-emerald">6.</span>
                <p>每占据一个元素，解锁该元素的发现趣闻</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-3 space-y-6">
            <div className="fade-in-up">
              <AIOpponent
                aiName={aiName}
                aiAvatar={aiAvatar}
                aiThinking={periodicAiThinking}
                aiCells={aiCells}
                playerCells={playerCells}
              />
            </div>

            <div className="fade-in-up stagger-1">
              <ProphecySelector
                chemists={chemists}
                prophecyCount={periodicProphecyCount}
                isProphecyMode={periodicIsProphecyMode}
                onSelectProphecy={handleSelectProphecy}
                onCancel={handleCancelProphecy}
                onOpenProphecy={handleStartProphecy}
              />
            </div>

            <div className="fade-in-up stagger-2">
              {currentQuestion && !periodicGameOver && (
                <div className="mb-4">
                  {getSelectedElement() && (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-alchemy-copper/10 rounded-lg border border-alchemy-copper/30">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: getSelectedElement()?.color + '40' }}>
                        <span className="text-2xl font-bold" style={{ color: getSelectedElement()?.color }}>
                          {getSelectedElement()?.symbol}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-alchemy-copperDark">正在挑战</p>
                        <p className="font-display text-alchemy-copper">
                          {getSelectedElement()?.name} ({getSelectedElement()?.atomicNumber})
                        </p>
                      </div>
                      {periodicCurrentProphecy && (
                        <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-alchemy-flame/20 rounded-full">
                          <Sparkles className="w-4 h-4 text-alchemy-flame" />
                          <span className="text-sm text-alchemy-flame">预言生效中</span>
                        </div>
                      )}
                    </div>
                  )}
                  <QuestionCard
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    onChainReactionConfirm={() => {}}
                    disabled={gameStatus !== 'playing'}
                    selectedIndex={selectedAnswer}
                    correctIndex={periodicAnswerResult?.correctIndex}
                    showExplanation={gameStatus === 'answered'}
                    explanation={periodicAnswerResult?.explanation}
                    isChainReactionMode={false}
                    isCatalystUsed={false}
                  />
                </div>
              )}

              {!currentQuestion && !periodicGameOver && (
                <div className="text-center py-8 p-6 bg-alchemy-copper/10 rounded-xl border-2 border-dashed border-alchemy-copper/30">
                  <div className="text-4xl mb-3">👆</div>
                  <p className="text-alchemy-copper font-display text-lg mb-2">选择一个元素开始挑战</p>
                  <p className="text-alchemy-copperDark text-sm">点击周期表中的空白格子回答问题</p>
                </div>
              )}

              {gameStatus === 'answered' && periodicAnswerResult && !periodicGameOver && (
                <div className="mt-4 text-center fade-in-up">
                  {periodicAnswerResult.isCorrect ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-alchemy-emerald/20 rounded-full border border-alchemy-emerald/50">
                      <Trophy className="w-5 h-5 text-alchemy-emerald" />
                      <span className="text-alchemy-emerald font-display">
                        🎉 答对了！成功占据 {periodicAnswerResult.capturedElement?.name}！
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full border border-red-500/50">
                      <span className="text-red-400 font-display">
                        😢 答错了！AI抢走了 {periodicAnswerResult.lostElement?.name}！
                      </span>
                    </div>
                  )}
                  {periodicAnswerResult.lineCompleted && (
                    <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-alchemy-flame/20 rounded-full border border-alchemy-flame/50 animate-pulse">
                      <Sparkles className="w-5 h-5 text-alchemy-flame" />
                      <span className="text-alchemy-flame font-display">
                        🔮 恭喜完成{periodicAnswerResult.lineCompleted.type === 'row' ? '一行' : '一列'}！获得预言权！
                      </span>
                    </div>
                  )}
                  <p className="mt-3 text-alchemy-copperDark text-sm">3秒后继续...</p>
                </div>
              )}
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

          <div className="lg:col-span-2 fade-in-up stagger-3">
            <div className="sticky top-6">
              <PeriodicTable
                elements={elements}
                board={periodicBoard}
                selectedElementId={periodicSelectedElementId}
                onElementClick={handleElementClick}
                completedLines={periodicCompletedLines}
                aiThinking={periodicAiThinking}
                lastCapturedElement={periodicLastCapturedElement}
                lastLostElement={periodicLastLostElement}
              />

              {periodicAnswerResult?.capturedElement && (
                <div className="mt-4 p-4 bg-alchemy-emerald/10 rounded-xl border border-alchemy-emerald/30 fade-in-up">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-alchemy-emerald" />
                    <h4 className="font-display text-alchemy-emerald">已解锁元素趣闻</h4>
                  </div>
                  <button
                    onClick={() => showElementFact(periodicAnswerResult!.capturedElement!)}
                    className="w-full text-left p-3 bg-alchemy-emerald/5 rounded-lg hover:bg-alchemy-emerald/10 transition-colors flex items-center justify-between group"
                  >
                    <span className="text-alchemy-copper">
                      {periodicAnswerResult.capturedElement.name} 的发现故事
                    </span>
                    <ArrowRight className="w-4 h-4 text-alchemy-emerald group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {periodicGameOver && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="parchment-bg rounded-2xl p-8 max-w-lg w-full shadow-2xl border-4 border-alchemy-copper animate-unlock text-center">
              <div className="text-6xl mb-4">
                {periodicGameWinner === 'player' ? '🏆' : periodicGameWinner === 'ai' ? '🤖' : '🤝'}
              </div>
              <h3 className="text-3xl font-display text-alchemy-darkBrown mb-4">
                {periodicGameWinner === 'player' && '恭喜你获胜！'}
                {periodicGameWinner === 'ai' && 'AI获胜！'}
                {periodicGameWinner === null && '平局！'}
              </h3>
              <p className="text-alchemy-brown mb-6 text-lg">
                {periodicGameWinner === 'player' && '你成功掌握了元素周期表的奥秘！'}
                {periodicGameWinner === 'ai' && '别气馁，再来一次挑战AI吧！'}
                {periodicGameWinner === null && '势均力敌，旗鼓相当！'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-alchemy-copper/20 rounded-lg">
                <div>
                  <div className="text-sm text-alchemy-brown">你的领地</div>
                  <div className="text-2xl font-display text-alchemy-emerald">{playerCells}</div>
                </div>
                <div>
                  <div className="text-sm text-alchemy-brown">AI领地</div>
                  <div className="text-2xl font-display text-red-500">{aiCells}</div>
                </div>
                <div>
                  <div className="text-sm text-alchemy-brown">得分</div>
                  <div className="text-2xl font-display text-alchemy-flame">{periodicScore}</div>
                </div>
                <div>
                  <div className="text-sm text-alchemy-brown">预言权</div>
                  <div className="text-2xl font-display text-alchemy-copper">{periodicCompletedLines.filter(l => l.owner === 'player').length}次</div>
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
          </div>
        )}

        {periodicShowElementFact && periodicCurrentElementFact && getCurrentElementForFact() && (
          <ElementFunFact
            fact={periodicCurrentElementFact}
            element={getCurrentElementForFact()!}
            onClose={handleCloseElementFact}
          />
        )}
      </div>
    </div>
  );
};

export default PeriodicTableGame;
