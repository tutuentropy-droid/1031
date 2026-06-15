import React, { useState, useEffect, useMemo } from 'react';
import type { Question } from '../../shared/types';
import { useGameStore } from '@/store/gameStore';
import { BookOpen, CheckCircle, XCircle, Zap, Flame, ShieldAlert, Snowflake, Send, Sparkles } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onAnswer: (index: number) => void;
  onChainReactionConfirm?: (correctIndex: number) => void;
  onPhlogistonIdentify?: () => void;
  onCrystalAnswerSubmit?: (textAnswer: string) => void;
  disabled?: boolean;
  selectedIndex?: number | null;
  correctIndex?: number;
  showExplanation?: boolean;
  explanation?: string;
  isChainReactionMode?: boolean;
  isCatalystUsed?: boolean;
  isPhlogistonTrapMode?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  onChainReactionConfirm,
  onPhlogistonIdentify,
  onCrystalAnswerSubmit,
  disabled = false,
  selectedIndex = null,
  correctIndex = -1,
  showExplanation = false,
  explanation = '',
  isChainReactionMode = false,
  isCatalystUsed = false,
  isPhlogistonTrapMode = false,
}) => {
  const {
    gameStatus,
    isPhlogistonTrap,
    phlogistonTrapExplanation,
    explosionShakeOptions,
    explosionIntensity,
    isCrystalMode,
    crystalInputAnswer,
    chemistryLanguageStyle,
    setCrystalInputAnswer,
  } = useGameStore();

  const [optionOffsets, setOptionOffsets] = useState<{ x: number; y: number; rot: number }[]>([]);
  const [crystalInput, setCrystalInput] = useState('');
  const [crystalSubmitted, setCrystalSubmitted] = useState(false);

  useEffect(() => {
    if (explosionShakeOptions && question.options) {
      const intensity = explosionIntensity / 100;
      const offsets = question.options.map(() => ({
        x: (Math.random() - 0.5) * 40 * intensity,
        y: (Math.random() - 0.5) * 20 * intensity,
        rot: (Math.random() - 0.5) * 12 * intensity,
      }));
      setOptionOffsets(offsets);

      const interval = setInterval(() => {
        const newOffsets = question.options.map(() => ({
          x: (Math.random() - 0.5) * 40 * intensity,
          y: (Math.random() - 0.5) * 20 * intensity,
          rot: (Math.random() - 0.5) * 12 * intensity,
        }));
        setOptionOffsets(newOffsets);
      }, 180);

      return () => clearInterval(interval);
    } else {
      setOptionOffsets([]);
    }
  }, [explosionShakeOptions, explosionIntensity, question.options]);

  useEffect(() => {
    setCrystalInput(crystalInputAnswer || '');
    setCrystalSubmitted(false);
  }, [question.id, crystalInputAnswer]);

  const effectiveDescription = useMemo(() => {
    if (chemistryLanguageStyle === 'modern' && question.descriptionModern) {
      return question.descriptionModern;
    }
    return question.description;
  }, [question, chemistryLanguageStyle]);

  const effectiveOptions = useMemo(() => {
    if (chemistryLanguageStyle === 'modern' && question.optionsModern) {
      return question.optionsModern;
    }
    return question.options;
  }, [question, chemistryLanguageStyle]);

  const effectiveExplanation = useMemo(() => {
    if (showExplanation) {
      if (chemistryLanguageStyle === 'modern' && question.explanationModern) {
        return question.explanationModern;
      }
      return explanation || question.explanation;
    }
    return '';
  }, [showExplanation, explanation, question, chemistryLanguageStyle]);

  const keywords = useMemo(() => {
    return question.answerKeywords || [effectiveOptions[question.correctIndex]];
  }, [question.answerKeywords, effectiveOptions, question.correctIndex]);

  const handleCrystalSubmit = () => {
    if (disabled || crystalSubmitted || !crystalInput.trim()) return;
    setCrystalSubmitted(true);
    setCrystalInputAnswer(crystalInput);
    onCrystalAnswerSubmit?.(crystalInput.trim());
  };

  const isCrystalCorrect = useMemo(() => {
    if (!crystalSubmitted || !onCrystalAnswerSubmit) return null;
    const input = crystalInput.toLowerCase().trim();
    return keywords.some(kw =>
      input.includes(kw.toLowerCase()) ||
      kw.toLowerCase().includes(input) ||
      effectiveOptions[question.correctIndex].toLowerCase().includes(input) ||
      input.includes(effectiveOptions[question.correctIndex].toLowerCase())
    );
  }, [crystalSubmitted, crystalInput, keywords, effectiveOptions, question.correctIndex, onCrystalAnswerSubmit]);

  const uiLabels = chemistryLanguageStyle === 'modern'
    ? {
        title: isCrystalMode ? 'Crystal Formulation' : 'Reaction Challenge',
        subtitle: isCrystalMode ? 'Slow and steady - write the answer precisely' : 'Choose the correct answer',
        phlogistonTitle: 'Phlogiston Trap!',
        phlogistonSubtitle: 'Identify the historical fallacy!',
        crystalTitle: 'Crystallization Mode',
        crystalSubtitle: 'Molecules slowing down - type the correct answer',
        crystalPlaceholder: 'Enter answer here...',
        crystalSubmit: 'Confirm Answer',
        identifyButton: "This is Phlogiston Fallacy!",
      }
    : {
        title: isCrystalMode ? '结晶配题' : '配方配平挑战',
        subtitle: isCrystalMode ? '慢而稳——精确书写答案' : '选择正确的答案来维持反应炉的温度',
        phlogistonTitle: '🔥 燃素说陷阱！',
        phlogistonSubtitle: '这道题暗藏燃素谬误——仔细辨别，戳破历史谎言！',
        crystalTitle: '💎 结晶模式',
        crystalSubtitle: '分子正在减速结晶——输入正确答案关键词',
        crystalPlaceholder: '在此输入答案...',
        crystalSubmit: '确认答案',
        identifyButton: '这是燃素谬误！',
      };

  const getOptionStyle = (index: number) => {
    if (gameStatus !== 'answered' && gameStatus !== 'chainReaction') {
      return explosionShakeOptions
        ? 'border-red-400 bg-red-500/10 shadow-md shadow-red-500/30'
        : 'hover:border-alchemy-flame hover:shadow-lg hover:shadow-alchemy-flame/20';
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
              {effectiveDescription}
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
                  {effectiveOptions[question.correctIndex]}
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

  const headerBg = isCrystalMode
    ? 'bg-blue-400/20'
    : isPhlogistonTrapMode
      ? 'bg-purple-500/20'
      : explosionShakeOptions
        ? 'bg-red-500/20'
        : isCatalystUsed
          ? 'bg-yellow-400/30'
          : 'bg-alchemy-copper/20';

  const headerIcon = isCrystalMode
    ? <Snowflake className="w-6 h-6 text-blue-500 animate-pulse" />
    : isPhlogistonTrapMode
      ? <Flame className="w-6 h-6 text-purple-600 animate-pulse" />
      : explosionShakeOptions
        ? <Sparkles className="w-6 h-6 text-red-500 animate-pulse" />
        : isCatalystUsed
          ? <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
          : <BookOpen className="w-6 h-6 text-alchemy-copper" />;

  const borderClass = explosionShakeOptions
    ? 'border-red-500 explosion-danger-border'
    : isCrystalMode
      ? 'border-blue-400 crystal-mode-border'
      : isPhlogistonTrapMode
        ? 'border-purple-500 phlogiston-trap-border'
        : isCatalystUsed
          ? 'border-yellow-400 catalyst-active-border'
          : 'border-alchemy-copperDark';

  return (
    <div className="w-full max-w-2xl mx-auto fade-in-up">
      <div className={`parchment-bg rounded-lg p-6 md:p-8 shadow-2xl border-4 noise-overlay ${borderClass}`}>
        <div className="flex items-start gap-3 mb-6">
          <div className={`p-2 rounded-lg ${headerBg}`}>
            {headerIcon}
          </div>
          <div>
            <h3 className="text-lg font-display mb-1" style={{
              color: explosionShakeOptions ? '#DC2626' : isCrystalMode ? '#2563EB' : isPhlogistonTrapMode ? '#7C3AED' : isCatalystUsed ? '#CA8A04' : '#5C4A1F'
            }}>
              {explosionShakeOptions ? '💥 爆炸危险！' : isCrystalMode ? uiLabels.crystalTitle : isPhlogistonTrapMode ? uiLabels.phlogistonTitle : isCatalystUsed ? '⚛️ 催化剂自动应答' : uiLabels.title}
            </h3>
            <p className="text-sm" style={{
              color: explosionShakeOptions ? 'rgba(220,38,38,0.7)' : isCrystalMode ? 'rgba(37,99,235,0.7)' : 'rgba(92,74,31,0.7)'
            }}>
              {explosionShakeOptions ? '选项正在飞散！快抓住正确答案！' : isCrystalMode ? uiLabels.crystalSubtitle : isPhlogistonTrapMode ? uiLabels.phlogistonSubtitle : isCatalystUsed ? '催化剂量子已消耗，自动选择正确答案' : uiLabels.subtitle}
            </p>
          </div>
        </div>

        <div className="scroll-decoration pt-4 mb-6">
          <p className="text-lg md:text-xl font-semibold text-alchemy-darkBrown leading-relaxed">
            {effectiveDescription}
          </p>
        </div>

        {isCrystalMode ? (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={crystalInput}
                onChange={(e) => setCrystalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCrystalSubmit()}
                disabled={disabled || crystalSubmitted}
                placeholder={uiLabels.crystalPlaceholder}
                className={`w-full p-4 pr-12 rounded-lg border-2 text-lg font-medium bg-blue-50 text-alchemy-darkBrown
                  ${crystalSubmitted
                    ? (isCrystalCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10')
                    : 'border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300'}
                  focus:outline-none transition-all
                  ${disabled || crystalSubmitted ? 'cursor-not-allowed opacity-80' : 'cursor-text'}`}
                style={{
                  backdropFilter: 'blur(4px)',
                }}
              />
              {crystalSubmitted && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isCrystalCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
              )}
            </div>

            {!crystalSubmitted && (
              <div className="flex items-center justify-between text-xs text-alchemy-brown/60 px-1">
                <span>💡 提示：答案是选项中的关键词</span>
                <span className="font-mono">{crystalInput.length} 字</span>
              </div>
            )}

            {crystalSubmitted && (
              <div className={`p-3 rounded-lg border ${isCrystalCorrect
                ? 'bg-green-500/10 border-green-400/50 text-green-700'
                : 'bg-red-500/10 border-red-400/50 text-red-700'
                }`}>
                <div className="flex items-center gap-2 text-sm font-medium">
                  {isCrystalCorrect ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>完美结晶！答案匹配！</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>结晶失败...正确答案关键词：{keywords.join(' / ')}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {!crystalSubmitted && (
              <button
                onClick={handleCrystalSubmit}
                disabled={disabled || !crystalInput.trim()}
                className={`w-full py-3 px-6 rounded-lg font-display text-lg flex items-center justify-center gap-2 transition-all duration-300
                  ${disabled || !crystalInput.trim()
                    ? 'bg-blue-300/40 text-blue-500/60 cursor-not-allowed border border-blue-400/20'
                    : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-400 hover:to-blue-600 hover:scale-[1.02] shadow-lg shadow-blue-500/30'
                  }`}
              >
                <Send className="w-5 h-5" />
                {uiLabels.crystalSubmit}
              </button>
            )}

            <div className="mt-2 p-3 bg-blue-400/5 rounded-lg border border-blue-400/20">
              <p className="text-xs text-blue-600/80 text-center font-display">
                ❄️ 结晶模式：冷静思考，准确输入答案关键词即可得分翻倍
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {effectiveOptions.map((option, index) => {
              const offset = optionOffsets[index] || { x: 0, y: 0, rot: 0 };
              const isExplosion = explosionShakeOptions;
              return (
                <div
                  key={index}
                  className="transition-all duration-150 ease-out"
                  style={isExplosion ? {
                    transform: `translate(${offset.x}px, ${offset.y}px) rotate(${offset.rot}deg)`,
                  } : {}}
                >
                  <button
                    onClick={() => !disabled && onAnswer(index)}
                    disabled={disabled}
                    className={`option-card w-full text-left p-4 rounded-lg border-2 border-alchemy-copper/50 bg-alchemy-parchment/50 transition-all duration-300 flex items-center gap-3 min-h-[60px]
                      ${getOptionStyle(index)}
                      ${isExplosion ? 'explosion-option' : ''}
                      ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm flex-shrink-0
                      ${isExplosion ? 'bg-red-400/40 text-red-800' : 'bg-alchemy-copper/30 text-alchemy-darkBrown'}
                    `}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 text-alchemy-darkBrown font-medium">{option}</span>
                    {getOptionIcon(index)}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {isPhlogistonTrapMode && gameStatus !== 'answered' && !isCrystalMode && (
          <div className="mt-4">
            <button
              onClick={() => onPhlogistonIdentify?.()}
              disabled={disabled}
              className={`w-full py-3 px-6 rounded-lg font-display text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                disabled
                  ? 'bg-purple-500/20 text-purple-500/40 cursor-not-allowed border border-purple-500/20'
                  : 'bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-500 hover:to-purple-700 hover:scale-105 shadow-lg shadow-purple-500/30'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
              {uiLabels.identifyButton}
            </button>
          </div>
        )}

        {showExplanation && effectiveExplanation && !isPhlogistonTrap && (
          <div className="mt-6 p-4 bg-alchemy-copper/20 rounded-lg border border-alchemy-copper/50 fade-in-up stagger-2">
            <h4 className="font-display text-alchemy-brown mb-2 flex items-center gap-2">
              <span>📜</span> {chemistryLanguageStyle === 'modern' ? 'Explanation' : '历史解析'}
            </h4>
            <p className="text-alchemy-darkBrown/80 leading-relaxed">{effectiveExplanation}</p>
          </div>
        )}

        {showExplanation && isPhlogistonTrap && phlogistonTrapExplanation && (
          <div className="mt-6 p-4 bg-purple-500/20 rounded-lg border border-purple-500/50 fade-in-up stagger-2">
            <h4 className="font-display text-purple-700 mb-2 flex items-center gap-2">
              <span>🔥</span> {chemistryLanguageStyle === 'modern' ? 'Phlogiston Fallacy' : '燃素谬误揭露'}
            </h4>
            <p className="text-alchemy-darkBrown/80 leading-relaxed">{phlogistonTrapExplanation}</p>
          </div>
        )}

        {showExplanation && question.historicalContext && !isPhlogistonTrap && (
          <div className="mt-4 p-4 bg-alchemy-flame/10 rounded-lg border border-alchemy-flame/30 fade-in-up stagger-3">
            <h4 className="font-display text-alchemy-flame mb-2 flex items-center gap-2">
              <span>🏛️</span> {chemistryLanguageStyle === 'modern' ? 'Historical Context' : '历史背景'}
            </h4>
            <p className="text-alchemy-darkBrown/80 leading-relaxed italic">{question.historicalContext}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
