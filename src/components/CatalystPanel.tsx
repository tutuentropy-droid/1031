import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Zap } from 'lucide-react';

const MAX_DISPLAY_SLOTS = 5;

const CatalystPanel: React.FC = () => {
  const { catalystQuanta, consecutiveCorrect, isChainReaction, useCatalyst, isCatalystActive, gameStatus } = useGameStore();

  const canUseCatalyst = catalystQuanta > 0 && gameStatus === 'playing' && !isCatalystActive && !isChainReaction;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="parchment-bg rounded-lg p-4 shadow-xl border-2 border-alchemy-copperDark noise-overlay">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-display text-alchemy-brown flex items-center gap-2">
            <Zap className="w-4 h-4 text-alchemy-flame" />
            催化剂连击系统
          </h3>
          {isChainReaction && (
            <span className="px-2 py-0.5 bg-alchemy-flame/20 border border-alchemy-flame/50 rounded text-xs font-display text-alchemy-flame animate-pulse">
              ⚛️ 链式反应就绪
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          {Array.from({ length: MAX_DISPLAY_SLOTS }, (_, i) => {
            const isFilled = i < catalystQuanta;
            return (
              <div
                key={i}
                className={`relative flex-shrink-0 w-14 h-16 rounded-md border-2 transition-all duration-500 ${
                  isFilled
                    ? 'border-alchemy-flame bg-gradient-to-b from-alchemy-flame/30 to-alchemy-flame/10 catalyst-glow'
                    : 'border-alchemy-copper/30 bg-alchemy-darkBrown/30'
                }`}
              >
                <div className="absolute top-0.5 left-1.5 text-[8px] font-bold text-alchemy-copper/60">
                  {i + 1}
                </div>
                <div className="absolute top-0.5 right-1 text-[7px] text-alchemy-copper/40">
                  Ca
                </div>
                <div className={`absolute inset-0 flex items-center justify-center text-lg ${
                  isFilled ? 'text-alchemy-flame' : 'text-alchemy-copper/20'
                }`}>
                  {isFilled ? '⚛️' : '·'}
                </div>
                {isFilled && (
                  <div className="absolute bottom-0.5 left-0 right-0 text-center text-[7px] text-alchemy-flame/80">
                    量子
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-alchemy-brown/70">
            连击: <span className="text-alchemy-flame font-bold">{consecutiveCorrect}</span>/3
            {consecutiveCorrect >= 3 && <span className="text-alchemy-flame ml-1">⚛️ 链式反应!</span>}
          </div>
          <div className="text-xs text-alchemy-brown/70">
            存量: <span className="text-alchemy-flame font-bold">{catalystQuanta}</span>
          </div>
        </div>

        <div className="mt-3 w-full bg-alchemy-darkBrown/20 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              consecutiveCorrect >= 3
                ? 'bg-gradient-to-r from-alchemy-flame to-yellow-400'
                : 'bg-gradient-to-r from-alchemy-copper to-alchemy-flame'
            }`}
            style={{ width: `${Math.min(100, (consecutiveCorrect / 3) * 100)}%` }}
          />
        </div>

        <button
          onClick={useCatalyst}
          disabled={!canUseCatalyst}
          className={`mt-3 w-full py-2 px-3 rounded-lg font-display text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            canUseCatalyst
              ? 'brass-button text-alchemy-darkBrown hover:scale-105'
              : 'bg-alchemy-darkBrown/30 text-alchemy-copper/40 cursor-not-allowed border border-alchemy-copper/20'
          }`}
        >
          <Zap className="w-4 h-4" />
          {isCatalystActive ? '催化剂已激活' : `使用催化剂 (${catalystQuanta})`}
        </button>

        <div className="mt-2 text-[10px] text-alchemy-brown/50 text-center leading-tight">
          每2次正确回答 → +1催化剂量子 | 消耗量子 → 自动正确(不加分，仅保温度)
          <br />
          连续3次正确不消耗 → 链式反应 → 下一题双倍得分⚡
        </div>
      </div>
    </div>
  );
};

export default CatalystPanel;
