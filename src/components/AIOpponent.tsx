import React from 'react';
import { Bot, Brain, Zap, Trophy } from 'lucide-react';

interface AIOpponentProps {
  aiName: string;
  aiAvatar: string;
  aiThinking: boolean;
  aiCells: number;
  playerCells: number;
}

const AIOpponent: React.FC<AIOpponentProps> = ({
  aiName,
  aiAvatar,
  aiThinking,
  aiCells,
  playerCells,
}) => {
  const getAIStatus = () => {
    if (aiThinking) {
      return (
        <div className="flex items-center gap-2 text-alchemy-flame">
          <Brain className="w-4 h-4 animate-pulse" />
          <span className="text-sm">思考中...</span>
        </div>
      );
    }
    if (aiCells > playerCells) {
      return (
        <div className="flex items-center gap-2 text-red-400">
          <Zap className="w-4 h-4" />
          <span className="text-sm">领先中</span>
        </div>
      );
    }
    if (aiCells < playerCells) {
      return (
        <div className="flex items-center gap-2 text-alchemy-copper">
          <Trophy className="w-4 h-4" />
          <span className="text-sm">追赶中</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-alchemy-copperDark">
        <Bot className="w-4 h-4" />
        <span className="text-sm">势均力敌</span>
      </div>
    );
  };

  return (
    <div className="p-4 bg-red-900/20 rounded-xl border-2 border-red-500/30">
      <div className="flex items-center gap-4">
        <div className={`relative w-16 h-16 rounded-full bg-red-500/30 flex items-center justify-center ${aiThinking ? 'animate-pulse' : ''}`}>
          <span className="text-3xl">{aiAvatar}</span>
          {aiThinking && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-alchemy-flame rounded-full flex items-center justify-center animate-bounce">
              <Brain className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-red-400" />
            <h4 className="font-display text-lg text-red-400">{aiName}</h4>
          </div>
          {getAIStatus()}
          <div className="mt-2 flex items-center gap-4 text-sm">
            <div>
              <span className="text-alchemy-copperDark">领地：</span>
              <span className="text-red-400 font-bold">{aiCells}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-alchemy-copperDark italic">
        "元素的奥秘，只有最强者才能掌握！"
      </div>
    </div>
  );
};

export default AIOpponent;
