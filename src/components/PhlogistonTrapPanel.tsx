import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Shield, Flame, BookOpen } from 'lucide-react';

const PHLOGISTON_TRAP_CHANCE = 0.25;

const PHLOGISTON_DESCRIPTIONS = [
  '燃素是一种存在于可燃物中的无形物质，燃烧时燃素释放到空气中，灰烬是脱去燃素的物质',
  '金属煅烧后质量增加是因为燃素具有负质量，金属失去燃素后反而变重',
  '空气能助燃是因为空气能吸收燃素，当空气吸满燃素后便不能再助燃',
  '燃素说认为燃烧是分解过程，可燃物 = 燃素 + 灰烬',
  '石灰石煅烧变石灰是燃素转移的结果，木炭向石灰石注入了燃素',
  '燃素是一种弹性流体，能穿透一切孔隙，从可燃物中逸出',
];

const PHLOGISTON_EXPLANATIONS = [
  '燃素说已被拉瓦锡的氧化理论彻底推翻！燃烧是物质与氧气的化合反应，而非燃素的释放。1777年拉瓦锡用定量实验证明了这一点。',
  '燃素说的"负质量"荒谬之处在于：如果燃素有负质量，为什么有些燃烧产物反而变轻？氧化理论统一解释了这一切——金属煅烧增重是因为结合了氧气。',
  '空气助燃并非因为吸收燃素，而是因为空气中含有约21%的氧气。拉瓦锡通过密封实验证明：燃烧消耗的是氧气，而非释放燃素。',
  '燃烧绝不是分解过程！拉瓦锡证明燃烧是物质与氧气的化合反应。可燃物 + 氧气 → 氧化物，这才是化学真相。',
  '石灰石煅烧是分解反应：CaCO₃ → CaO + CO₂，与燃素毫无关系。木炭的作用是提供高温，而非转移什么"燃素"。',
  '根本不存在什么"弹性流体"燃素！所有燃烧现象都可以用氧化还原反应完美解释。燃素说是科学史上最著名的前科学理论之一。',
];

const HISTORICAL_REVOLUTIONS: { id: string; title: string; content: string; year: number; icon: string }[] = [
  {
    id: 'rev-1',
    title: '化学革命',
    content: '1777年，拉瓦锡发表《燃烧通论》，用定量实验推翻统治化学界百年的燃素说，建立氧化理论，标志着现代化学的诞生。他用天平精确测量反应前后物质质量，证明燃烧是与氧气的化合，开创了定量化学的新纪元。',
    year: 1777,
    icon: '⚖️',
  },
  {
    id: 'rev-2',
    title: '原子论的提出',
    content: '1803年，道尔顿提出原子论，认为一切物质由不可分割的原子组成，不同元素的原子质量和性质不同。这一理论将古希腊哲学猜想变为科学理论，为化学计量学和元素周期表的发现奠定了基础。',
    year: 1803,
    icon: '⚛️',
  },
  {
    id: 'rev-3',
    title: '元素周期表的发现',
    content: '1869年，门捷列夫发表元素周期表，按原子量排列元素，发现元素性质的周期性规律。他甚至预测了尚未发现的元素的性质，后来都被实验证实。周期表成为化学最重要的分类工具。',
    year: 1869,
    icon: '📋',
  },
  {
    id: 'rev-4',
    title: '放射性的发现',
    content: '1896年，贝克勒尔意外发现铀盐能使底片感光，揭开了放射性现象的面纱。居里夫妇随后深入研究，发现钋和镭。放射性研究最终导致原子核物理的诞生，彻底改变了人类对原子不可分的认知。',
    year: 1896,
    icon: '☢️',
  },
  {
    id: 'rev-5',
    title: 'DNA双螺旋结构',
    content: '1953年，沃森和克里克在《自然》杂志发表DNA双螺旋结构模型，揭示了遗传信息的存储和复制机制。这一发现开创了分子生物学时代，为基因工程和现代医学奠定了基础，被誉为20世纪最伟大的科学发现之一。',
    year: 1953,
    icon: '🧬',
  },
  {
    id: 'rev-6',
    title: '量子力学的诞生',
    content: '1925-1927年间，海森堡、薛定谔等人建立量子力学，揭示了微观世界的运动规律。量子力学从根本上改变了物理学，解释了原子结构、化学键和光谱，使化学从经验科学走向理论科学。',
    year: 1925,
    icon: '🌀',
  },
];

export function shouldActivatePhlogistonTrap(): boolean {
  return Math.random() < PHLOGISTON_TRAP_CHANCE;
}

export function getRandomPhlogistonDescription(): string {
  return PHLOGISTON_DESCRIPTIONS[Math.floor(Math.random() * PHLOGISTON_DESCRIPTIONS.length)];
}

export function getPhlogistonExplanation(index: number): string {
  return PHLOGISTON_EXPLANATIONS[index % PHLOGISTON_EXPLANATIONS.length];
}

export function getPhlogistonDescriptionIndex(description: string): number {
  const idx = PHLOGISTON_DESCRIPTIONS.indexOf(description);
  return idx >= 0 ? idx : 0;
}

export function getRevolutionForMilestone(milestone: number): typeof HISTORICAL_REVOLUTIONS[number] | null {
  const index = (milestone / 3 - 1) % HISTORICAL_REVOLUTIONS.length;
  if (index < 0 || index >= HISTORICAL_REVOLUTIONS.length) return null;
  return HISTORICAL_REVOLUTIONS[index];
}

const PhlogistonTrapPanel: React.FC = () => {
  const { phlogistonIdentified, labCoatShields, unlockedRevolutions, isPhlogistonSmoke } = useGameStore();

  const nextMilestone = Math.ceil((phlogistonIdentified + 1) / 3) * 3;
  const progressToNext = phlogistonIdentified % 3;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className={`parchment-bg rounded-lg p-4 shadow-xl border-2 noise-overlay transition-all duration-300 ${
        isPhlogistonSmoke ? 'border-purple-500 phlogiston-glow' : 'border-purple-700/60'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-display text-alchemy-brown flex items-center gap-2">
            <Flame className="w-4 h-4 text-purple-600" />
            燃素说陷阱
          </h3>
          {isPhlogistonSmoke && (
            <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/50 rounded text-xs font-display text-purple-600 animate-pulse">
              🔥 燃素烟雾中
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-14 h-14 rounded-md border-2 transition-all duration-500 flex flex-col items-center justify-center ${
                i < progressToNext
                  ? 'border-purple-500 bg-gradient-to-b from-purple-500/30 to-purple-500/10'
                  : 'border-alchemy-copper/30 bg-alchemy-darkBrown/30'
              }`}
            >
              <span className={`text-lg ${i < progressToNext ? 'opacity-100' : 'opacity-30'}`}>
                {i < progressToNext ? '🔥' : '·'}
              </span>
              <span className="text-[7px] text-alchemy-copper/60 mt-0.5">
                {i < progressToNext ? '已识破' : `第${i + 1}次`}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-alchemy-brown/70">
            识破: <span className="text-purple-600 font-bold">{phlogistonIdentified}</span>次
            {nextMilestone > phlogistonIdentified && (
              <span className="text-purple-600/60 ml-1">→ 里程碑 {nextMilestone}</span>
            )}
          </div>
        </div>

        <div className="w-full bg-alchemy-darkBrown/20 rounded-full h-1.5 overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-purple-500 to-purple-700"
            style={{ width: `${(progressToNext / 3) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-xs font-display text-alchemy-brown">实验服护盾</div>
              <div className="text-[10px] text-alchemy-brown/50">免疫一次燃素烟雾</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.max(labCoatShields, 1) }, (_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                  i < labCoatShields
                    ? 'border-blue-400 bg-blue-400/20 text-blue-400'
                    : 'border-alchemy-copper/20 bg-transparent text-alchemy-copper/20'
                }`}
              >
                🛡️
              </div>
            ))}
            <span className="text-xs text-alchemy-brown/70 ml-1">
              ×{labCoatShields}
            </span>
          </div>
        </div>

        {unlockedRevolutions.length > 0 && (
          <div className="mt-3 p-2 bg-alchemy-emerald/10 rounded-lg border border-alchemy-emerald/20">
            <div className="flex items-center gap-1 mb-1">
              <BookOpen className="w-3 h-3 text-alchemy-emerald" />
              <span className="text-[10px] font-display text-alchemy-emerald">
                已解锁历史革命 ×{unlockedRevolutions.length}
              </span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {unlockedRevolutions.map((rev) => (
                <span
                  key={rev.id}
                  className="text-sm px-1.5 py-0.5 bg-alchemy-emerald/10 rounded border border-alchemy-emerald/20"
                  title={rev.title}
                >
                  {rev.icon}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-2 text-[10px] text-alchemy-brown/50 text-center leading-tight">
          随机出现燃素说陷阱题 → 点击"这是燃素谬误"得分
          <br />
          误选正确答案 → 扣分 + 燃素烟雾3秒 | 每识破3次 → 解锁历史革命 + 🛡️护盾
        </div>
      </div>
    </div>
  );
};

export default PhlogistonTrapPanel;
