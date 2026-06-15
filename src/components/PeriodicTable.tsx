import React from 'react';
import type { Element, CellOwner } from '../../shared/types';

interface PeriodicTableProps {
  elements: Element[];
  board: Record<string, CellOwner>;
  selectedElementId: string | null;
  onElementClick: (element: Element) => void;
  completedLines: { type: 'row' | 'col'; index: number; owner: CellOwner }[];
  aiThinking: boolean;
  lastCapturedElement: Element | null;
  lastLostElement: Element | null;
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({
  elements,
  board,
  selectedElementId,
  onElementClick,
  completedLines,
  aiThinking,
  lastCapturedElement,
  lastLostElement,
}) => {
  const getCellOwner = (row: number, col: number): CellOwner => {
    return board[`${row}-${col}`] || null;
  };

  const isLineCompleted = (type: 'row' | 'col', index: number, owner: CellOwner): boolean => {
    return completedLines.some(line => line.type === type && line.index === index && line.owner === owner);
  };

  const isLastCaptured = (elementId: string): boolean => {
    return lastCapturedElement?.id === elementId;
  };

  const isLastLost = (elementId: string): boolean => {
    return lastLostElement?.id === elementId;
  };

  const rows = [0, 1, 2, 3];
  const cols = [0, 1, 2, 3];

  const getElementsByPosition = (row: number, col: number): Element | undefined => {
    return elements.find(e => e.row === row && e.col === col);
  };

  const getCellStyles = (element: Element, owner: CellOwner) => {
    const baseStyles = 'relative aspect-square rounded-lg border-2 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-1';
    
    let colorStyles = '';
    let animationStyles = '';
    
    if (owner === 'player') {
      colorStyles = 'bg-alchemy-emerald/30 border-alchemy-emerald shadow-lg shadow-alchemy-emerald/30';
    } else if (owner === 'ai') {
      colorStyles = 'bg-red-500/30 border-red-500 shadow-lg shadow-red-500/30';
    } else {
      colorStyles = 'bg-alchemy-copper/10 border-alchemy-copper/50 hover:border-alchemy-flame hover:bg-alchemy-flame/10';
    }

    if (selectedElementId === element.id) {
      animationStyles = ' ring-4 ring-alchemy-flame ring-opacity-75 scale-105';
    }

    if (isLastCaptured(element.id)) {
      animationStyles += ' animate-cell-capture';
    }

    if (isLastLost(element.id)) {
      animationStyles += ' animate-cell-lost';
    }

    const rowCompleted = isLineCompleted('row', element.row, owner);
    const colCompleted = isLineCompleted('col', element.col, owner);
    if (rowCompleted || colCompleted) {
      colorStyles = owner === 'player' 
        ? 'bg-alchemy-emerald/60 border-alchemy-emerald shadow-2xl shadow-alchemy-emerald/50 animate-line-complete'
        : 'bg-red-500/60 border-red-500 shadow-2xl shadow-red-500/50 animate-line-complete';
    }

    return `${baseStyles} ${colorStyles} ${animationStyles}`;
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-display text-alchemy-copper">元素周期表</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-alchemy-emerald/50 border border-alchemy-emerald"></div>
            <span className="text-alchemy-emerald">你的领地</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500/50 border border-red-500"></div>
            <span className="text-red-400">AI领地</span>
          </div>
        </div>
      </div>

      {aiThinking && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="text-center">
            <div className="text-4xl animate-spin mb-2">🤖</div>
            <p className="text-alchemy-copper font-display">AI正在思考...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {rows.map(row => (
          cols.map(col => {
            const element = getElementsByPosition(row, col);
            if (!element) {
              return <div key={`${row}-${col}`} className="aspect-square rounded-lg bg-transparent" />;
            }
            
            const owner = getCellOwner(row, col);
            return (
              <button
                key={element.id}
                className={getCellStyles(element, owner)}
                onClick={() => !aiThinking && onElementClick(element)}
                disabled={aiThinking}
                title={`${element.name} (${element.symbol}) - ${element.category}`}
              >
                <span className="text-xs text-alchemy-copperDark absolute top-0.5 left-1">
                  {element.atomicNumber}
                </span>
                <span className="text-lg md:text-2xl font-bold" style={{ color: element.color }}>
                  {element.symbol}
                </span>
                <span className="text-xs text-alchemy-copperDark truncate w-full text-center">
                  {element.name}
                </span>
                
                {owner === 'player' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-alchemy-emerald border-2 border-alchemy-darkBrown flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                )}
                
                {owner === 'ai' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-alchemy-darkBrown flex items-center justify-center">
                    <span className="text-xs">✗</span>
                  </div>
                )}

                {selectedElementId === element.id && !owner && (
                  <div className="absolute inset-0 rounded-lg border-4 border-alchemy-flame animate-pulse"></div>
                )}
              </button>
            );
          })
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 bg-alchemy-copper/10 rounded-lg">
          <div className="text-alchemy-copperDark">你的领地</div>
          <div className="text-xl font-bold text-alchemy-emerald">
            {Object.values(board).filter(v => v === 'player').length}
          </div>
        </div>
        <div className="p-2 bg-alchemy-copper/10 rounded-lg">
          <div className="text-alchemy-copperDark">AI领地</div>
          <div className="text-xl font-bold text-red-400">
            {Object.values(board).filter(v => v === 'ai').length}
          </div>
        </div>
        <div className="p-2 bg-alchemy-copper/10 rounded-lg">
          <div className="text-alchemy-copperDark">空白格子</div>
          <div className="text-xl font-bold text-alchemy-copper">
            {elements.length - Object.values(board).filter(v => v !== null).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodicTable;
