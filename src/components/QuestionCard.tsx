import React from 'react';
import type { Question } from '../../shared/types';
import { useGameStore } from '@/store/gameStore';
import { BookOpen, CheckCircle, XCircle, Zap } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onAnswer: (index: number) => void;
  onChainReactionConfirm?: (correctIndex: number) => void;
  disabled?: boolean;
  selectedIndex?: number | null;
  correctIndex?: number;
  showExplanation?: boolean;
  explanation?: string;
  isChainReactionMode?: boolean;
  isCatalystUsed?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  onChainReactionConfirm,
  disabled = false,
  selectedIndex = null,
  correctIndex = -1,
  showExplanation = false,
  explanation = '',
  isChainReactionMode = false,
  isCatalystUsed = false,
}) => {
  const { gameStatus } = useGameStore();

  const getOptionStyle = (index: number) => {
    if (gameStatus !== 'answered' && gameStatus !== 'chainReaction') {
      return 'hover:border-alchemy-flame hover:shadow-lg hover:shadow-alchemy-flame/20';
    }
    
    if (index === correctIndex) {
      return 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/30';
    }
    
    if (index === selectedIndex && index !== correctIndex) {
      return 'border-red-500 bg-red-500/20 shadow-lg shadow-red-500/30';
    }
    
    return 'opacity-50';
  };

  const getOptionIcon = (index: number) => {
    if (gameStatus !== 'answered' && gameStatus !== 'chainReaction') return null;
    
    if (index === correctIndex) {
      return <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />;
    }
    
    if (index === selectedIndex && index !== correctIndex) {
      return <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
    }
    
    return null;
  };

  if (isChainReactionMode) {
    return (
      <div className="w-full max-w-2xl mx-auto fade-in-up">
        <div className="parchment-bg rounded-lg p-6 md:p-8 shadow-2xl border-4 border-alchemy-flame noise-overlay chain-reaction-border">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-alchemy-flame/30 rounded-lg animate-pulse">
              <Zap className="w-6 h-6 text-alchemy-flame" />
            </div>
            <div>
              <h3 className="text-lg font-display text-alchemy-flame mb-1">⚛️ 链式反应!</h3>
              <p className="text-sm text-alchemy-brown/70">正确答案已揭示，确认吸收即可获得双倍得分</p>
            </div>
          </div>

          <div className="scroll-decoration pt-4 mb-6">
            <p className="text-lg md:text-xl font-semibold text-alchemy-darkBrown leading-relaxed">
              {question.description}
            </p>
          </div>

          <div className="p-4 bg-alchemy-flame/10 rounded-lg border-2 border-alchemy-flame/50 mb-6 chain-reaction-answer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-alchemy-flame/30 rounded-full">
                <CheckCircle className="w-6 h-6 text-alchemy-flame" />
              </div>
              <div>
                <div className="text-xs text-alchemy-flame font-display mb-1">正确答案 · 双倍得分 200pts</div>
                <div className="text-lg font-semibold text-alchemy-darkBrown">
                  {question.options[question.correctIndex]}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onChainReactionConfirm?.(question.correctIndex)}
            disabled={disabled}
            className="w-full py-3 px-6 brass-button rounded-lg text-alchemy-darkBrown font-display text-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 chain-reaction-button"
          >
            <Zap className="w-5 h-5" />
            吸收量子能量 · x2
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto fade-in-up">
      <div className={`parchment-bg rounded-lg p-6 md:p-8 shadow-2xl border-4 noise-overlay ${
        isCatalystUsed ? 'border-yellow-400 catalyst-active-border' : 'border-alchemy-copperDark'
      }`}>
        <div className="flex items-start gap-3 mb-6">
          <div className={`p-2 rounded-lg ${isCatalystUsed ? 'bg-yellow-400/30' : 'bg-alchemy-copper/20'}`}>
            {isCatalystUsed ? (
              <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
            ) : (
              <BookOpen className="w-6 h-6 text-alchemy-copper" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-display text-alchemy-brown mb-1">
              {isCatalystUsed ? '⚛️ 催化剂自动应答' : '配方配平挑战'}
            </h3>
            <p className="text-sm text-alchemy-brown/70">
              {isCatalystUsed ? '催化剂量子已消耗，自动选择正确答案' : '选择正确的答案来维持反应炉的温度'}
            </p>
          </div>
        </div>

        <div className="scroll-decoration pt-4 mb-6">
          <p className="text-lg md:text-xl font-semibold text-alchemy-darkBrown leading-relaxed">
            {question.description}
          </p>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !disabled && onAnswer(index)}
              disabled={disabled}
              className={`option-card w-full text-left p-4 rounded-lg border-2 border-alchemy-copper/50 bg-alchemy-parchment/50 transition-all duration-300 flex items-center gap-3 min-h-[60px] ${getOptionStyle(index)} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="w-8 h-8 flex items-center justify-center bg-alchemy-copper/30 rounded-full text-alchemy-darkBrown font-bold text-sm flex-shrink-0">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1 text-alchemy-darkBrown font-medium">{option}</span>
              {getOptionIcon(index)}
            </button>
          ))}
        </div>

        {showExplanation && explanation && (
          <div className="mt-6 p-4 bg-alchemy-copper/20 rounded-lg border border-alchemy-copper/50 fade-in-up stagger-2">
            <h4 className="font-display text-alchemy-brown mb-2 flex items-center gap-2">
              <span>📜</span> 历史解析
            </h4>
            <p className="text-alchemy-darkBrown/80 leading-relaxed">{explanation}</p>
          </div>
        )}

        {showExplanation && question.historicalContext && (
          <div className="mt-4 p-4 bg-alchemy-flame/10 rounded-lg border border-alchemy-flame/30 fade-in-up stagger-3">
            <h4 className="font-display text-alchemy-flame mb-2 flex items-center gap-2">
              <span>🏛️</span> 历史背景
            </h4>
            <p className="text-alchemy-darkBrown/80 leading-relaxed italic">{question.historicalContext}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
