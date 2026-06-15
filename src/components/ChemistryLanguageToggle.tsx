import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { FlaskConical, Scroll } from 'lucide-react';

const ChemistryLanguageToggle: React.FC = () => {
  const { chemistryLanguageStyle, toggleChemistryLanguageStyle } = useGameStore();

  const isModern = chemistryLanguageStyle === 'modern';

  return (
    <button
      onClick={toggleChemistryLanguageStyle}
      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 transition-all duration-300 overflow-hidden
        ${isModern
          ? 'bg-gradient-to-r from-slate-700 to-slate-800 border-slate-500 text-slate-100 hover:from-slate-600 hover:to-slate-700'
          : 'bg-gradient-to-r from-amber-100 to-amber-200 border-amber-600 text-amber-900 hover:from-amber-50 hover:to-amber-100'
        }`}
      title={isModern ? '切换到经典化学语言' : 'Switch to Modern Chemistry'}
    >
      <div className={`transition-transform duration-300 ${isModern ? 'text-cyan-300' : 'text-amber-700'}`}>
        {isModern ? (
          <FlaskConical className="w-4 h-4" />
        ) : (
          <Scroll className="w-4 h-4" />
        )}
      </div>
      <span className="text-xs font-display font-bold whitespace-nowrap">
        {isModern ? '现代化学' : 'Classical'}
      </span>
      <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${isModern ? 'bg-cyan-400/30' : 'bg-amber-600/30'}`}>
        <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300 ${isModern ? 'left-4 bg-cyan-300' : 'left-0.5 bg-amber-600'}`} />
      </div>
    </button>
  );
};

export default ChemistryLanguageToggle;
