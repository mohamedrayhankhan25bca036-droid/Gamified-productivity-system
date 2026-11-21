import React from 'react';
import { Crown, Sparkles, Star, Award, ArrowUpCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const LevelUpModal: React.FC = () => {
  const { levelUpModal, closeLevelUpModal, user } = useGame();

  if (!levelUpModal || !levelUpModal.show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-gradient-to-b from-[#22164f] to-[#120c29] border-2 border-purple-500 rounded-3xl p-7 shadow-neon-purple-lg text-center relative overflow-hidden animate-scaleUp">
        {/* Fantasy particle glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-fuchsia-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Crown & Star Icon header */}
        <div className="relative z-10 flex justify-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 via-purple-500 to-indigo-500 p-1 shadow-neon-gold animate-bounce">
              <div className="w-full h-full rounded-full bg-[#170e3b] flex items-center justify-center">
                <Crown className="w-12 h-12 text-amber-400 fill-amber-400" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-1.5 rounded-full border-2 border-white shadow-neon-purple">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
          </div>
        </div>

        {/* Level Up Announcement */}
        <div className="relative z-10 space-y-2 mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 font-extrabold text-xs uppercase tracking-widest">
            Level Ascension
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-lg">
            LEVEL UP!
          </h2>
          <p className="text-sm text-slate-300 font-medium">
            You have unlocked greater heights on your productivity quest!
          </p>
        </div>

        {/* Level Transition Pill */}
        <div className="relative z-10 bg-[#150f33] border border-[#3b2b73] rounded-2xl p-4 mb-6 shadow-inner flex items-center justify-around">
          <div className="text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Previous</span>
            <div className="text-2xl font-black text-slate-300">Level {levelUpModal.oldLevel}</div>
          </div>

          <ArrowUpCircle className="w-7 h-7 text-purple-400 animate-pulse" />

          <div className="text-center">
            <span className="text-[11px] font-bold text-amber-400 uppercase">Ascended To</span>
            <div className="text-3xl font-black text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
              Level {levelUpModal.newLevel}
            </div>
          </div>
        </div>

        {/* Title & Excess XP Info */}
        <div className="relative z-10 text-xs text-slate-300 space-y-1 mb-6">
          <div>
            New Rank Title: <span className="font-bold text-purple-300">{user.title}</span>
          </div>
          <div>
            Carried-over Excess XP: <span className="font-bold text-emerald-400">+{levelUpModal.excessXp} XP</span>
          </div>
        </div>

        {/* Claim / Continue Button */}
        <button
          onClick={closeLevelUpModal}
          className="relative z-10 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-purple-600 to-indigo-600 hover:from-amber-300 hover:via-purple-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-neon-purple transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Claim Glory & Continue
        </button>
      </div>
    </div>
  );
};
