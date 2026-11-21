import React from 'react';
import { BarChart3, Shield } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const LevelProgressWidget: React.FC = () => {
  const { stats } = useGame();

  const currentLevel = stats.level;
  const nextLevel = currentLevel + 1;
  const xpPercent = Math.min(100, Math.round((stats.current_xp / stats.next_level_xp) * 100));

  return (
    <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-5 backdrop-blur-xl shadow-glass flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center space-x-2.5 pb-3 mb-2 border-b border-[#281f4e]">
        <BarChart3 className="w-5 h-5 text-purple-400" />
        <h3 className="font-bold text-base md:text-lg text-white tracking-tight">
          Level Progress
        </h3>
      </div>

      {/* Level Transition & Badge */}
      <div className="flex items-center justify-between my-2">
        <div className="text-sm md:text-base font-extrabold text-white tracking-tight">
          Level {currentLevel} <span className="text-purple-400 mx-1">→</span> Level {nextLevel}
        </div>

        {/* Next Level Shield Badge */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-600 border border-purple-400/60 shadow-neon-purple-sm flex items-center justify-center text-white font-extrabold text-base">
          {nextLevel}
        </div>
      </div>

      {/* Progress Track */}
      <div className="space-y-2 mt-2">
        <div className="w-full h-3 bg-[#0e0a24] rounded-full overflow-hidden p-[1.5px] border border-[#2b2157]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-400 shadow-neon-purple transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          />
        </div>

        {/* Progress numbers */}
        <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
          <span>{stats.current_xp.toLocaleString()} / {stats.next_level_xp.toLocaleString()} XP</span>
          <span className="text-purple-300">{xpPercent}%</span>
        </div>
      </div>
    </div>
  );
};
