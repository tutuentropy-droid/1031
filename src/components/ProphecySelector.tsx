import React from 'react';
import { Sparkles, FlaskConical, Flame, Table2, Shuffle } from 'lucide-react';
import type { Chemist, ProphecyType } from '../../shared/types';

interface ProphecySelectorProps {
  chemists: Chemist[];
  prophecyCount: number;
  isProphecyMode: boolean;
  onSelectProphecy: (chemistId: ProphecyType) => void;
  onCancel: () => void;
  onOpenProphecy?: () => void;
}

const ProphecySelector: React.FC<ProphecySelectorProps> = ({
  chemists,
  prophecyCount,
  isProphecyMode,
  onSelectProphecy,
  onCancel,
  onOpenProphecy,
}) => {
  const getChemistIcon = (id: string) => {
    switch (id) {
      case 'boyle': return <FlaskConical className="w-8 h-8" />;
      case 'lavoisier': return <Flame className="w-8 h-8" />;
      case 'mendeleev': return <Table2 className="w-8 h-8" />;
      default: return <Sparkles className="w-8 h-8" />;
    }
  };

  if (!isProphecyMode) {
    return (
      <div className="p-4 bg-alchemy-copper/10 rounded-xl border border-alchemy-copper/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-alchemy-flame/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-alchemy-flame" />
            </div>
            <div>
              <h4 className="font-display text-alchemy-copper">元素预言权</h4>
              <p className="text-sm text-alchemy-copperDark">占据整行或整列获得预言权</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-display text-alchemy-flame">
              {prophecyCount}
            </span>
            <span className="text-sm text-alchemy-copperDark">次</span>
          </div>
        </div>
        
        {prophecyCount > 0 && (
          <button
            onClick={onOpenProphecy}
            className="w-full mt-3 py-2 brass-button rounded-lg text-alchemy-darkBrown font-display text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            使用预言权 ({prophecyCount}次可用)
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="parchment-bg rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border-4 border-alchemy-flame animate-unlock">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-alchemy-flame/20 mb-4">
            <Sparkles className="w-8 h-8 text-alchemy-flame animate-pulse" />
          </div>
          <h3 className="text-2xl font-display text-alchemy-darkBrown mb-2">🔮 元素预言权</h3>
          <p className="text-alchemy-brown">选择下一题的化学家来源，掌控你的命运！</p>
        </div>

        <div className="scroll-decoration h-1 w-full mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chemists.map((chemist) => (
            <button
              key={chemist.id}
              onClick={() => onSelectProphecy(chemist.id as ProphecyType)}
              className="p-4 rounded-xl border-2 border-alchemy-copper/50 bg-alchemy-copper/10 hover:border-alchemy-flame hover:bg-alchemy-flame/10 transition-all duration-300 text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-alchemy-copper/30 rounded-lg group-hover:bg-alchemy-flame/30 transition-colors">
                  {getChemistIcon(chemist.id)}
                </div>
                <div>
                  <h4 className="font-display text-lg text-alchemy-darkBrown group-hover:text-alchemy-flame transition-colors">
                    {chemist.name}
                  </h4>
                  <p className="text-sm text-alchemy-brown">{chemist.era}</p>
                </div>
              </div>
              <p className="text-sm text-alchemy-brown">{chemist.description}</p>
            </button>
          ))}

          <button
            onClick={() => onSelectProphecy('random')}
            className="p-4 rounded-xl border-2 border-alchemy-copper/50 bg-alchemy-copper/10 hover:border-alchemy-emerald hover:bg-alchemy-emerald/10 transition-all duration-300 text-left group col-span-1 md:col-span-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-alchemy-copper/30 rounded-lg group-hover:bg-alchemy-emerald/30 transition-colors">
                <Shuffle className="w-8 h-8 text-alchemy-copper group-hover:text-alchemy-emerald transition-colors" />
              </div>
              <div>
                <h4 className="font-display text-lg text-alchemy-darkBrown group-hover:text-alchemy-emerald transition-colors">
                  随机选择
                </h4>
                <p className="text-sm text-alchemy-brown">让命运来决定，从所有化学家中随机选择</p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border-2 border-alchemy-copper text-alchemy-copper font-display hover:bg-alchemy-copper/10 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProphecySelector;
