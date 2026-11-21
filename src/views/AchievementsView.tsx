import React from 'react';
import { Trophy, Star, Flame, Calendar, Target, Lock, Check, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const AchievementsView: React.FC = () => {
  const { achievements } = useGame();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const getIcon = (iconName: string, unlocked: boolean) => {
    if (!unlocked) return <Lock className="w-6 h-6 text-slate-500" />;
    switch (iconName) {
      case 'star':
        return <Star className="w-6 h-6 text-amber-950 fill-amber-950" />;
      case 'flame':
        return <Flame className="w-6 h-6 text-white fill-white" />;
      case 'calendar':
        return <Calendar className="w-6 h-6 text-white" />;
      case 'target':
        return <Target className="w-6 h-6 text-white" />;
      case 'coins':
        return <span className="font-black text-amber-950 text-base">$</span>;
      default:
        return <Trophy className="w-6 h-6 text-white" />;
    }
  };

  const getStyle = (badgeColor: string, unlocked: boolean) => {
    if (!unlocked) {
      return {
        bg: 'from-slate-800 to-slate-900',
        border: 'border-slate-700/60',
        shadow: '',
      };
    }
    switch (badgeColor) {
      case 'gold':
        return {
          bg: 'from-amber-400 to-yellow-500',
          border: 'border-amber-300',
          shadow: 'shadow-neon-gold',
        };
      case 'flame':
        return {
          bg: 'from-orange-500 to-amber-500',
          border: 'border-orange-400',
          shadow: 'shadow-neon-flame',
        };
      case 'purple':
        return {
          bg: 'from-purple-600 to-indigo-600',
          border: 'border-purple-400',
          shadow: 'shadow-neon-purple-sm',
        };
      case 'cyan':
        return {
          bg: 'from-violet-600 to-fuchsia-600',
          border: 'border-violet-300',
          shadow: 'shadow-neon-purple',
        };
      default:
        return {
          bg: 'from-purple-600 to-indigo-600',
          border: 'border-purple-400',
          shadow: 'shadow-neon-purple-sm',
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            <span>Hall of Achievements</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Unlock milestones, earn prestige badges, and reap bountiful XP rewards.
          </p>
        </div>

        {/* Counter Pill */}
        <div className="px-4 py-2 rounded-xl bg-[#171233] border border-[#312560] text-sm font-bold text-slate-200">
          Unlocked: <span className="text-amber-400 font-extrabold">{unlockedCount}</span> / {achievements.length}
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((ach) => {
          const style = getStyle(ach.badge_color, ach.unlocked);
          return (
            <div
              key={ach.id}
              className={`rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                ach.unlocked
                  ? 'bg-[#181338]/90 border-[#3d2e6e] shadow-glass hover:border-purple-500/50'
                  : 'bg-[#120f26]/60 border-[#241c42] opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start space-x-4 mb-3">
                  {/* Hexagon Badge */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-14 h-14 clip-hexagon bg-gradient-to-tr ${style.bg} flex items-center justify-center ${style.shadow} border ${style.border}`}
                    >
                      {getIcon(ach.icon, ach.unlocked)}
                    </div>
                  </div>

                  {/* Name & Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-base font-extrabold truncate ${
                          ach.unlocked ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        {ach.name}
                      </h3>
                      {ach.unlocked && (
                        <div className="flex items-center space-x-1 text-emerald-400 text-xs font-bold">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Unlocked</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Rewards & Unlock Date */}
              <div className="pt-3 border-t border-[#281f4f] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    +{ach.xp_reward} XP
                  </span>
                  <span className="font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    +{ach.coins_reward} Coins
                  </span>
                </div>

                {ach.unlocked_at && (
                  <span className="text-[11px] text-slate-500">
                    {new Date(ach.unlocked_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
