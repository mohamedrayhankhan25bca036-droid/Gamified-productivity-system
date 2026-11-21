import React from 'react';
import { Calendar } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const WeeklyChallengeWidget: React.FC = () => {
  const { quests } = useGame();
  const challenge = quests.find((q) => q.type === 'weekly') || {
    title: 'Stay productive for 7 days',
    target_count: 7,
    current_count: 5,
    xp_reward: 300,
    is_completed: false,
  };

  const progressPercent = Math.min(100, Math.round((challenge.current_count / challenge.target_count) * 100));

  return (
    <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-5 backdrop-blur-xl shadow-glass mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <Calendar className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-base text-white tracking-tight">
            Weekly Challenge
          </h3>
        </div>
        <span className="text-xs font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md">
          +{challenge.xp_reward} XP
        </span>
      </div>

      {/* Challenge Goal text */}
      <p className="text-xs md:text-sm font-medium text-slate-200 mb-3">
        {challenge.title}
      </p>

      {/* Progress Bar & Counter */}
      <div className="space-y-1.5">
        <div className="flex justify-end text-xs font-semibold text-slate-300">
          <span>{challenge.current_count} / {challenge.target_count}</span>
        </div>
        <div className="w-full h-2.5 bg-[#0e0a24] rounded-full overflow-hidden p-[1.5px] border border-[#2b2157]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-400 shadow-neon-purple transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
