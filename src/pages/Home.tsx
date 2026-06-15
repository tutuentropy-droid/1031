import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Chemist } from '../../shared/types';
import { api } from '@/utils/api';
import { useGameStore } from '@/store/gameStore';
import { FlaskConical, Flame, Table2, Sparkles, Atom, Swords } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { selectChemist, resetGame } = useGameStore();
  const [chemists, setChemists] = useState<Chemist[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    resetGame();
    loadChemists();
  }, [resetGame]);

  const loadChemists = async () => {
    try {
      const data = await api.getChemists();
      setChemists(data);
    } catch (error) {
      console.error('Failed to load chemists:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChemistIcon = (id: string) => {
    switch (id) {
      case 'boyle': return <FlaskConical className="w-12 h-12" />;
      case 'lavoisier': return <Flame className="w-12 h-12" />;
      case 'mendeleev': return <Table2 className="w-12 h-12" />;
      default: return <Sparkles className="w-12 h-12" />;
    }
  };

  const handleSelectChemist = (chemist: Chemist) => {
    selectChemist(chemist);
    navigate('/game');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚗️</div>
          <p className="text-alchemy-copper font-display text-xl">正在召唤炼金术士...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-alchemy-darkBrown via-alchemy-brown to-alchemy-darkBrown py-8 px-4 noise-overlay">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 fade-in-up">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl animate-float">⚗️</span>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-alchemy-copper text-shadow-glow">
              炼金失控反应炉
            </h1>
            <span className="text-5xl animate-float stagger-2">🔥</span>
          </div>
          <p className="text-xl text-alchemy-copperLight font-body max-w-2xl mx-auto mt-4">
            穿越化学史，与伟大的炼金术士一起探索元素的奥秘。
            <br />
            <span className="text-alchemy-flame">答对升温，答错降温，温度满格解锁化学史冷知识！</span>
          </p>
        </div>

        <div className="mb-8 text-center fade-in-up stagger-1">
          <h2 className="text-2xl font-display text-alchemy-copperLight mb-2">选择你的炼金导师</h2>
          <p className="text-alchemy-copperDark">每位导师都有独特的化学史题目等待你挑战</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {chemists.map((chemist, index) => (
            <div
              key={chemist.id}
              className={`fade-in-up stagger-${index + 1}`}
            >
              <button
                onClick={() => handleSelectChemist(chemist)}
                onMouseEnter={() => setHoveredId(chemist.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`w-full h-full p-6 rounded-xl border-4 transition-all duration-500 transform ${
                  hoveredId === chemist.id
                    ? 'border-alchemy-flame scale-105 shadow-2xl shadow-alchemy-flame/30 -translate-y-2'
                    : 'border-alchemy-copper hover:border-alchemy-copperLight'
                } bg-gradient-to-b from-alchemy-copper/20 to-alchemy-darkBrown/50 backdrop-blur-sm group`}
              >
                <div className="relative">
                  <div className={`absolute -top-2 -right-2 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                    hoveredId === chemist.id ? 'bg-alchemy-flame scale-110' : 'bg-alchemy-copper/50'
                  }`}>
                    <span className="text-3xl">{chemist.avatar}</span>
                  </div>

                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                    hoveredId === chemist.id
                      ? 'bg-alchemy-flame/30 text-alchemy-flame'
                      : 'bg-alchemy-copper/30 text-alchemy-copper'
                  }`}>
                    {getChemistIcon(chemist.id)}
                  </div>

                  <h3 className="text-2xl font-display font-bold text-alchemy-copperLight mb-2 group-hover:text-alchemy-flame transition-colors">
                    {chemist.name}
                  </h3>
                  
                  <p className="text-alchemy-flame text-sm mb-3 font-display">
                    {chemist.era}
                  </p>
                  
                  <p className="text-alchemy-copperDark text-sm leading-relaxed">
                    {chemist.description}
                  </p>

                  <div className={`mt-6 py-3 px-4 rounded-lg transition-all duration-300 ${
                    hoveredId === chemist.id
                      ? 'bg-alchemy-flame/20 border border-alchemy-flame/50'
                      : 'bg-alchemy-copper/10 border border-alchemy-copper/30'
                  }`}>
                    <span className={`font-display text-sm transition-colors ${
                      hoveredId === chemist.id ? 'text-alchemy-flame' : 'text-alchemy-copperLight'
                    }`}>
                      点击开始挑战 →
                    </span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center fade-in-up stagger-4">
          <div className="inline-flex items-center gap-4 p-4 bg-alchemy-copper/10 rounded-xl border border-alchemy-copper/30">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span className="text-alchemy-copperLight">答对 +15°C</span>
            </div>
            <div className="w-px h-8 bg-alchemy-copper/30" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">❌</span>
              <span className="text-alchemy-copperLight">答错 -25°C</span>
            </div>
            <div className="w-px h-8 bg-alchemy-copper/30" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              <span className="text-alchemy-copperLight">满100°C解锁冷知识</span>
            </div>
          </div>
        </div>

        <div className="mt-16 fade-in-up stagger-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display text-alchemy-copperLight mb-2">⚔️ 全新游戏模式</h2>
            <p className="text-alchemy-copperDark">与AI对战，争夺元素周期表的领地！</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/periodic-table')}
              className="w-full p-6 rounded-xl border-4 border-alchemy-flame bg-gradient-to-r from-alchemy-flame/20 to-alchemy-copper/20 hover:from-alchemy-flame/30 hover:to-alchemy-copper/30 transition-all duration-500 transform hover:scale-102 group"
            >
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-alchemy-flame/30 flex items-center justify-center group-hover:bg-alchemy-flame/50 transition-colors">
                    <Atom className="w-10 h-10 text-alchemy-flame animate-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-alchemy-emerald rounded-full flex items-center justify-center">
                    <Swords className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="text-2xl font-display text-alchemy-flame mb-2 group-hover:text-alchemy-flameLight transition-colors">
                    元素周期表争夺战
                  </h3>
                  <p className="text-alchemy-copperDark mb-3">
                    答对题目占据元素格子，答错被AI抢走。占据整行或整列获得「元素预言权」，
                    可指定下一题的化学家类型。在对战中学习元素发现的趣闻！
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-alchemy-emerald">
                      <span>🎯</span> 策略对战
                    </span>
                    <span className="flex items-center gap-1 text-alchemy-flame">
                      <span>🔮</span> 预言权系统
                    </span>
                    <span className="flex items-center gap-1 text-alchemy-copper">
                      <span>📚</span> 元素趣闻
                    </span>
                  </div>
                </div>
                
                <div className="text-alchemy-flame text-3xl group-hover:translate-x-2 transition-transform">
                  →
                </div>
              </div>
            </button>
          </div>
        </div>

        <footer className="mt-12 text-center text-alchemy-copperDark/60 text-sm fade-in-up stagger-5">
          <p>在游戏中学习化学史，感受科学发现的伟大时刻</p>
          <p className="mt-1">🧪 ⚗️ 🔥 📊</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
