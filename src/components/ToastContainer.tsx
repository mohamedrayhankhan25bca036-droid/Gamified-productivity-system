import React from 'react';
import { Sparkles, Trophy, Star, Gift, CheckCircle, Info, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { ToastMessage } from '../types';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useGame();

  if (toasts.length === 0) return null;

  const getToastIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'xp':
        return <Star className="w-5 h-5 text-amber-400 fill-amber-400" />;
      case 'coin':
        return <span className="font-black text-amber-400 text-sm">$</span>;
      case 'level_up':
        return <Sparkles className="w-5 h-5 text-purple-300" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'quest':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'reward':
        return <Gift className="w-5 h-5 text-pink-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getToastBorder = (type: ToastMessage['type']) => {
    switch (type) {
      case 'xp':
      case 'coin':
        return 'border-amber-500/40 bg-[#1e1738]/95 shadow-neon-gold';
      case 'level_up':
        return 'border-purple-500/60 bg-[#251747]/95 shadow-neon-purple';
      case 'achievement':
        return 'border-yellow-500/50 bg-[#22183d]/95 shadow-neon-gold';
      case 'quest':
        return 'border-emerald-500/40 bg-[#14232e]/95 shadow-neon-green';
      case 'reward':
        return 'border-pink-500/40 bg-[#2a133b]/95 shadow-[0_0_15px_rgba(236,72,153,0.4)]';
      default:
        return 'border-indigo-500/30 bg-[#161233]/95';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start space-x-3 p-3.5 rounded-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${getToastBorder(
            toast.type
          )}`}
        >
          <div className="flex-shrink-0 mt-0.5">{getToastIcon(toast.type)}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">
              {toast.title}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-snug">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
