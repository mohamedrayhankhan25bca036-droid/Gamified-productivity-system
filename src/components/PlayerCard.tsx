import React from 'react';
import { Crown, Star, Flame, Target, Sparkles, Gamepad2 } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const PlayerCard: React.FC = () => {
  const { user, stats, setActiveTab } = useGame();

  const xpPercent = Math.min(100, Math.round((stats.current_xp / stats.next_level_xp) * 100));

  return (
    <div className="relative w-full rounded-2xl bg-[#171233]/90 border border-[#312560] p-6 mb-7 backdrop-blur-xl shadow-glass overflow-hidden">
      {/* Subtle purple backdrop ambient light */}
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Avatar & Identity */}
        <div className="flex items-center space-x-5 w-full lg:w-auto">
          {/* Avatar with Crown Badge */}
          <div className="relative flex-shrink-0">
            <div className="absolute -top-2.5 -left-1.5 z-20 bg-amber-400 text-amber-950 p-1 rounded-full shadow-neon-gold border border-amber-200">
              <Crown className="w-3.5 h-3.5 fill-amber-950" />
            </div>
            <div className="w-20 h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-indigo-500 shadow-neon-purple">
              <img
                src={user.avatar || '/assets/avatar.png'}
                alt={user.name}
                className="w-full h-full rounded-full object-cover bg-[#100d26]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                }}
              />
            </div>
          </div>

          {/* User Name, Title & Level Badge */}
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              {user.name}
            </h2>
            <p className="text-xs md:text-sm font-medium text-slate-300">
              {user.title}
            </p>
            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-neon-purple-sm">
                <Star className="w-3 h-3 fill-current" />
                <span>Level {stats.level}</span>
              </span>
              <button
                onClick={() => setActiveTab('games')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-300 text-xs font-bold transition-all shadow-neon-gold"
                title="Play Games & Raids"
              >
                <span>🎟️ {stats.tokens} Tokens</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center: XP Progress Bar */}
        <div className="flex-1 w-full max-w-xl px-0 lg:px-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-300 tracking-wide">
              XP Progress
            </span>
          </div>

          {/* Progress Track */}
          <div className="relative w-full h-3.5 bg-[#0e0a24] rounded-full overflow-hidden p-[2px] border border-[#2b2157]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-400 shadow-neon-purple transition-all duration-500 ease-out"
              style={{ width: `${xpPercent}%` }}
            />
          </div>

          {/* Progress values */}
          <div className="flex justify-between items-center mt-2 text-xs font-semibold text-slate-300">
            <span>
              {stats.current_xp.toLocaleString()} / {stats.next_level_xp.toLocaleString()} XP
            </span>
            <span className="text-purple-300 font-bold">{xpPercent}%</span>
          </div>
        </div>

        {/* Right: Quick Stats (Coins, Streak, Daily Goal) */}
        <div className="flex items-center justify-around lg:justify-end space-x-6 md:space-x-8 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-[#281f4f]">
          {/* Coins */}
          <div className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-neon-gold group-hover:scale-105 transition-transform">
              <span className="text-amber-950 font-black text-sm">$</span>
            </div>
            <div>
              <div className="text-lg md:text-xl font-extrabold text-white tracking-tight">
                {stats.coins.toLocaleString()}
              </div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Coins
              </div>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-neon-flame group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="text-lg md:text-xl font-extrabold text-white tracking-tight">
                {stats.current_streak} Days
              </div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Streak
              </div>
            </div>
          </div>

          {/* Daily Goal */}
          <div className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.45)] group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg md:text-xl font-extrabold text-white tracking-tight">
                {stats.daily_goal_percent}%
              </div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Daily Goal
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
