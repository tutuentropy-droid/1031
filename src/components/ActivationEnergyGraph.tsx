import React, { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TrendingDown, Zap, Snowflake, Flame } from 'lucide-react';

const ActivationEnergyGraph: React.FC = () => {
  const { activationEnergy, reactionMode, temperature, chemistryLanguageStyle } = useGameStore();

  const reactantEnergy = 20;
  const productEnergy = 10;
  const peakEnergy = reactantEnergy + activationEnergy * 0.7;
  const maxEnergy = 100;
  const graphHeight = 160;
  const graphWidth = 320;

  const pathD = useMemo(() => {
    const w = graphWidth;
    const h = graphHeight;
    const reactantY = h - (reactantEnergy / maxEnergy) * h;
    const productY = h - (productEnergy / maxEnergy) * h;
    const peakY = h - (peakEnergy / maxEnergy) * h;
    const startX = 10;
    const endX = w - 10;
    const peakX = w * 0.5;

    return `M ${startX} ${reactantY}
            C ${startX + (peakX - startX) * 0.4} ${reactantY},
              ${peakX - (peakX - startX) * 0.3} ${peakY},
              ${peakX} ${peakY}
            C ${peakX + (endX - peakX) * 0.3} ${peakY},
              ${endX - (endX - peakX) * 0.4} ${productY},
              ${endX} ${productY}`;
  }, [peakEnergy]);

  const activationLineD = useMemo(() => {
    const h = graphHeight;
    const w = graphWidth;
    const reactantY = h - (reactantEnergy / maxEnergy) * h;
    const peakY = h - (peakEnergy / maxEnergy) * h;
    const peakX = w * 0.5;
    return `M ${peakX} ${reactantY} L ${peakX} ${peakY}`;
  }, [peakEnergy]);

  const getBarColor = () => {
    if (activationEnergy < 30) return ['#10B981', '#34D399'];
    if (activationEnergy < 55) return ['#FBBF24', '#F59E0B'];
    if (activationEnergy < 80) return ['#F97316', '#EA580C'];
    return ['#EF4444', '#DC2626'];
  };

  const [barColorStart, barColorEnd] = getBarColor();

  const getModeIndicator = () => {
    if (reactionMode === 'explosion') {
      return {
        icon: <Flame className="w-4 h-4" />,
        text: chemistryLanguageStyle === 'classic' ? '⚠️ 爆炸危险！' : '⚠️ Explosion Risk!',
        color: 'text-red-500 bg-red-500/10 border-red-500/30',
      };
    }
    if (reactionMode === 'crystal') {
      return {
        icon: <Snowflake className="w-4 h-4" />,
        text: chemistryLanguageStyle === 'classic' ? '💎 结晶模式' : '💎 Crystal Mode',
        color: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
      };
    }
    if (activationEnergy < 30) {
      return {
        icon: <Zap className="w-4 h-4" />,
        text: chemistryLanguageStyle === 'classic' ? '⚡ 低活化能' : '⚡ Low Ea',
        color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      };
    }
    return null;
  };

  const modeIndicator = getModeIndicator();

  const labels = chemistryLanguageStyle === 'classic'
    ? { reactants: '反应物', products: '产物', activation: '活化能 Ea', title: '活化能曲线' }
    : { reactants: 'Reactants', products: 'Products', activation: 'Ea Barrier', title: 'Energy Diagram' };

  return (
    <div className="w-full parchment-bg rounded-lg p-4 shadow-xl border-2 border-alchemy-copper/50 noise-overlay">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-display text-alchemy-brown flex items-center gap-1.5">
          <TrendingDown className="w-4 h-4 text-alchemy-flame" />
          {labels.title}
        </h3>
        <div className={`text-xs font-display px-2 py-0.5 rounded-full border ${
          activationEnergy < 30 ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30' :
          activationEnergy < 55 ? 'text-yellow-600 bg-yellow-500/10 border-yellow-500/30' :
          activationEnergy < 80 ? 'text-orange-600 bg-orange-500/10 border-orange-500/30' :
          'text-red-600 bg-red-500/10 border-red-500/30'
        }`}>
          Ea: {activationEnergy.toFixed(0)} kJ/mol
        </div>
      </div>

      {modeIndicator && (
        <div className={`mb-2 text-xs font-display px-2 py-1 rounded-md border flex items-center gap-1 justify-center ${modeIndicator.color}`}>
          {modeIndicator.icon}
          <span>{modeIndicator.text}</span>
        </div>
      )}

      <svg
        viewBox={`0 0 ${graphWidth} ${graphHeight + 25}`}
        className="w-full h-auto"
        style={{ maxHeight: '200px' }}
      >
        <defs>
          <linearGradient id="reactionCurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={barColorStart} stopOpacity="0.9" />
            <stop offset="100%" stopColor={barColorEnd} stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="areaFillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={barColorStart} stopOpacity="0.25" />
            <stop offset="100%" stopColor={barColorEnd} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <line x1="10" y1={graphHeight + 0.5} x2={graphWidth - 10} y2={graphHeight + 0.5}
          stroke="#8B6914" strokeWidth="1.5" />

        <path
          d={`${pathD} L ${graphWidth - 10} ${graphHeight} L 10 ${graphHeight} Z`}
          fill="url(#areaFillGradient)"
        />

        <path
          d={pathD}
          fill="none"
          stroke="url(#reactionCurveGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          className="activation-curve-path"
        />

        <path
          d={activationLineD}
          fill="none"
          stroke={barColorStart}
          strokeWidth="2"
          strokeDasharray="4 3"
          opacity="0.8"
        />

        <circle cx={graphWidth * 0.5} cy={graphHeight - (peakEnergy / maxEnergy) * graphHeight}
          r="5" fill={barColorStart} stroke="#fff" strokeWidth="1.5"
          className="animate-pulse"
        />

        <rect x="5" y={graphHeight - 8} width="40" height="12" rx="2"
          fill="#10B981" opacity="0.6" />
        <text x="25" y={graphHeight - 12} textAnchor="middle"
          fontSize="9" fill="#064E3B" fontWeight="bold">
          {labels.reactants}
        </text>

        <rect x={graphWidth - 45} y={graphHeight - 2} width="40" height="12" rx="2"
          fill="#3B82F6" opacity="0.6" />
        <text x={graphWidth - 25} y={graphHeight - 6} textAnchor="middle"
          fontSize="9" fill="#1E3A8A" fontWeight="bold">
          {labels.products}
        </text>

        <text x={graphWidth * 0.5 + 8} y={graphHeight - ((reactantEnergy + peakEnergy) / 2 / maxEnergy) * graphHeight}
          fontSize="10" fill={barColorStart} fontWeight="bold"
          textAnchor="start">
          {labels.activation}
        </text>

        <text x="15" y={graphHeight + 18} fontSize="8" fill="#8B6914" opacity="0.6">
          反应坐标 →
        </text>
        <text x="5" y="12" fontSize="8" fill="#8B6914" opacity="0.6" transform={`rotate(-90, 5, 12)`}>
          E
        </text>
      </svg>

      <div className="mt-1 flex items-center justify-between text-[10px] text-alchemy-brown/70">
        <span>
          {chemistryLanguageStyle === 'classic' ? '温度影响：' : 'Temp effect: '}
          <span className={temperature > 70 ? 'text-red-500 font-bold' : temperature < 30 ? 'text-blue-400 font-bold' : 'text-alchemy-copperDark'}>
            {temperature}°C
          </span>
        </span>
        <span className={activationEnergy < 50 ? 'text-emerald-600' : 'text-alchemy-brown/70'}>
          {chemistryLanguageStyle === 'classic'
            ? (activationEnergy < 30 ? '✅ 反应极易进行' : activationEnergy < 55 ? '⚠️ 中等难度' : activationEnergy < 80 ? '🔥 反应受阻' : '💥 高度危险！')
            : (activationEnergy < 30 ? '✅ Spontaneous' : activationEnergy < 55 ? '⚠️ Moderate' : activationEnergy < 80 ? '🔥 Hindered' : '💥 Critical!')}
        </span>
      </div>
    </div>
  );
};

export default ActivationEnergyGraph;
