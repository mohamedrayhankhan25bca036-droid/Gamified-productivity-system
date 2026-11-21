import React from 'react';
import { Store, ArrowRight, Gamepad2, Popcorn, Pizza, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const RewardStoreWidget: React.FC = () => {
  const { rewards, redeemReward, setActiveTab, stats } = useGame();

  const getRewardIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'gamepad':
        return <Gamepad2 className="w-6 h-6 text-indigo-400" />;
      case 'popcorn':
        return <Popcorn className="w-6 h-6 text-red-400" />;
      case 'pizza':
        return <Pizza className="w-6 h-6 text-amber-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-purple-400" />;
    }
  };

  const previewRewards = rewards.slice(0, 3);

  return (
    <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-5 backdrop-blur-xl shadow-glass flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#281f4e]">
        <div className="flex items-center space-x-2.5">
          <Store className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-base md:text-lg text-white tracking-tight">
            Reward Store
          </h3>
        </div>
        <button
          onClick={() => setActiveTab('rewards_store')}
          className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>View Store</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-3 gap-3 my-1">
        {previewRewards.map((reward) => {
          const canAfford = stats.coins >= reward.cost_coins;
          return (
            <div
              key={reward.id}
              onClick={() => redeemReward(reward.id)}
              className="group flex flex-col items-center justify-between p-3 rounded-xl bg-[#1c163d]/80 hover:bg-[#251e50] border border-[#342766] hover:border-purple-500/50 transition-all duration-200 cursor-pointer text-center relative overflow-hidden"
              title={`Click to redeem for ${reward.cost_coins} coins`}
            >
              {/* Reward Icon */}
              <div className="w-10 h-10 rounded-lg bg-[#140f2e] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                {getRewardIcon(reward.icon)}
              </div>

              {/* Title */}
              <span className="text-xs font-semibold text-slate-200 mb-2 truncate max-w-full">
                {reward.name}
              </span>

              {/* Coin Cost Pill */}
              <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#100d26] border border-[#30245e]">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-[9px] font-black text-amber-950">
                  $
                </div>
                <span className="text-xs font-bold text-amber-300">
                  {reward.cost_coins}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
