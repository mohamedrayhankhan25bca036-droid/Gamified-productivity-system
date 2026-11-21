import React from 'react';
import { Trophy, ArrowRight, Star, Flame, Calendar, Target, Lock, Check } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const AchievementsWidget: React.FC = () => {
  const { achievements, setActiveTab } = useGame();

  const getBadgeStyle = (badgeColor: string, unlocked: boolean) => {
    if (!unlocked) {
      return {
        bg: 'from-slate-700/60 to-slate-800/80',
        border: 'border-slate-600/40',
        shadow: '',
        text: 'text-slate-500',
        iconColor: 'text-slate-400',
      };
    }
    switch (badgeColor) {
      case 'gold':
        return {
          bg: 'from-amber-500 to-yellow-400',
          border: 'border-amber-300',
          shadow: 'shadow-neon-gold',
          text: 'text-amber-300',
          iconColor: 'text-amber-950',
        };
      case 'flame':
        return {
          bg: 'from-orange-600 to-amber-500',
          border: 'border-orange-400',
          shadow: 'shadow-neon-flame',
          text: 'text-orange-300',
          iconColor: 'text-white',
        };
      case 'purple':
        return {
          bg: 'from-purple-600 to-indigo-600',
          border: 'border-purple-400',
          shadow: 'shadow-neon-purple-sm',
          text: 'text-purple-300',
          iconColor: 'text-white',
        };
      case 'cyan':
        return {
          bg: 'from-violet-600 to-fuchsia-600',
          border: 'border-violet-300',
          shadow: 'shadow-[0_0_15px_rgba(139,92,246,0.5)]',
          text: 'text-violet-300',
          iconColor: 'text-white',
        };
      default:
        return {
          bg: 'from-purple-600 to-indigo-600',
          border: 'border-purple-400',
          shadow: 'shadow-neon-purple-sm',
          text: 'text-purple-300',
          iconColor: 'text-white',
        };
    }
  };

  const getIcon = (iconName: string, unlocked: boolean) => {
    if (!unlocked) return <Lock className="w-5 h-5" />;
    switch (iconName) {
      case 'star':
        return <Star className="w-5 h-5 fill-current" />;
      case 'flame':
        return <Flame className="w-5 h-5 fill-current" />;
      case 'calendar':
        return <Calendar className="w-5 h-5" />;
      case 'target':
        return <Target className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  const displayList = achievements.slice(0, 5);

  return (
    <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-5 backdrop-blur-xl shadow-glass flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#281f4e]">
        <div className="flex items-center space-x-2.5">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-base md:text-lg text-white tracking-tight">
            Your Achievements
          </h3>
        </div>
        <button
          onClick={() => setActiveTab('achievements')}
          className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hexagonal Badges Row */}
      <div className="grid grid-cols-5 gap-2 items-center justify-items-center py-2">
        {displayList.map((ach) => {
          const style = getBadgeStyle(ach.badge_color, ach.unlocked);
          return (
            <div
              key={ach.id}
              onClick={() => setActiveTab('achievements')}
              className="flex flex-col items-center group cursor-pointer"
              title={`${ach.name}: ${ach.description}`}
            >
              {/* Hexagon Shape Container */}
              <div className="relative mb-2 flex items-center justify-center">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 clip-hexagon bg-gradient-to-tr ${style.bg} flex items-center justify-center ${style.shadow} ${style.iconColor} group-hover:scale-110 transition-transform duration-300 border ${style.border}`}
                >
                  {getIcon(ach.icon, ach.unlocked)}
                </div>
              </div>

              {/* Title label */}
              <span className="text-[11px] font-semibold text-slate-300 text-center tracking-tight truncate max-w-[70px]">
                {ach.name}
              </span>

              {/* Checkmark or lock tag underneath */}
              <div className="mt-0.5">
                {ach.unlocked ? (
                  <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
