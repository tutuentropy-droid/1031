import React from 'react';
import { X, BookOpen, Calendar, Sparkles } from 'lucide-react';
import type { ElementFact, Element } from '../../shared/types';

interface ElementFunFactProps {
  fact: ElementFact;
  element: Element;
  onClose: () => void;
}

const ElementFunFact: React.FC<ElementFunFactProps> = ({ fact, element, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="parchment-bg rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl border-4 border-alchemy-copper animate-unlock relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-alchemy-copper/20 hover:bg-alchemy-copper/40 transition-colors"
        >
          <X className="w-5 h-5 text-alchemy-darkBrown" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ backgroundColor: element.color + '40' }}>
            <span className="text-4xl font-bold" style={{ color: element.color }}>
              {element.symbol}
            </span>
          </div>
          <h3 className="text-2xl font-display text-alchemy-darkBrown mb-1">
            {element.name} ({element.symbol})
          </h3>
          <p className="text-alchemy-brown text-sm">原子序数 {element.atomicNumber} · {element.category}</p>
        </div>

        <div className="scroll-decoration h-1 w-full mb-6"></div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-alchemy-flame flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display text-lg text-alchemy-darkBrown mb-1">
                {fact.title}
              </h4>
              {fact.year && (
                <div className="flex items-center gap-1 text-alchemy-brown text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{fact.year}年</span>
                </div>
              )}
              <p className="text-alchemy-darkBrown leading-relaxed">
                {fact.content}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-alchemy-copper/20 rounded-xl">
            <BookOpen className="w-5 h-5 text-alchemy-copper flex-shrink-0" />
            <div className="text-sm text-alchemy-darkBrown">
              <p className="font-semibold">相关化学家</p>
              <p className="text-alchemy-brown">
                {fact.chemistId === 'boyle' && '罗伯特·波义耳 - 近代化学之父'}
                {fact.chemistId === 'lavoisier' && '安托万·拉瓦锡 - 现代化学之父'}
                {fact.chemistId === 'mendeleev' && '德米特里·门捷列夫 - 元素周期表发明者'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="brass-button px-8 py-3 rounded-lg text-alchemy-darkBrown font-display text-lg"
          >
            继续游戏
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElementFunFact;
