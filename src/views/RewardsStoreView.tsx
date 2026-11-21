import React, { useState } from 'react';
import {
  Store,
  Plus,
  Gamepad2,
  Popcorn,
  Pizza,
  Coffee,
  Sparkles,
  History,
  CheckCircle2,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const RewardsStoreView: React.FC = () => {
  const {
    rewards,
    redemptions,
    stats,
    redeemReward,
    claimOrUseRedemption,
    addCustomReward,
    deleteReward,
  } = useGame();

  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCost, setCustomCost] = useState(150);
  const [customIcon, setCustomIcon] = useState('sparkles');

  const getRewardIcon = (icon: string) => {
    switch (icon.toLowerCase()) {
      case 'gamepad':
        return <Gamepad2 className="w-7 h-7 text-indigo-400" />;
      case 'popcorn':
        return <Popcorn className="w-7 h-7 text-red-400" />;
      case 'pizza':
        return <Pizza className="w-7 h-7 text-amber-400" />;
      case 'coffee':
        return <Coffee className="w-7 h-7 text-emerald-400" />;
      default:
        return <Sparkles className="w-7 h-7 text-purple-400" />;
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    addCustomReward(customName.trim(), customIcon, Number(customCost));
    setCustomName('');
    setShowAddCustom(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Store className="w-8 h-8 text-purple-400" />
            <span>Reward Store</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Exchange your hard-earned gold coins for real-world personal treats.
          </p>
        </div>

        {/* Coin Balance Pill */}
        <div className="flex items-center space-x-3 px-5 py-2.5 rounded-2xl bg-[#171233] border border-[#312560] shadow-glass">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-neon-gold">
            <span className="text-amber-950 font-black text-xs">$</span>
          </div>
          <div>
            <div className="text-lg font-black text-white">{stats.coins.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Available Coins</div>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {rewards.map((reward) => {
          const canAfford = stats.coins >= reward.cost_coins;
          return (
            <div
              key={reward.id}
              className="rounded-2xl p-5 bg-[#171233]/90 border border-[#312560] hover:border-purple-500/50 shadow-glass flex flex-col justify-between transition-all duration-200 group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#100d26] border border-[#271e4d] flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getRewardIcon(reward.icon)}
                  </div>

                  {/* Coin Cost Pill */}
                  <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-[#100d26] border border-[#30245e]">
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-[9px] font-black text-amber-950">
                      $
                    </div>
                    <span className="text-xs font-bold text-amber-300">
                      {reward.cost_coins}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-white mb-1">
                  {reward.name}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Category: {reward.category || 'General'}
                </p>
              </div>

              {/* Redeem Button (FR-REWARD-02, FR-REWARD-03) */}
              <button
                onClick={() => redeemReward(reward.id)}
                disabled={!canAfford}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                  canAfford
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-neon-purple active:scale-95'
                    : 'bg-[#120f26] text-slate-500 cursor-not-allowed border border-[#231b45]'
                }`}
              >
                <span>{canAfford ? 'Redeem Treat' : `Need ${reward.cost_coins - stats.coins} more`}</span>
              </button>
            </div>
          );
        })}

        {/* Add Custom Reward Card */}
        <div
          onClick={() => setShowAddCustom(true)}
          className="rounded-2xl p-5 border-2 border-dashed border-[#342766] hover:border-purple-400 bg-purple-600/5 hover:bg-purple-600/10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[190px]"
        >
          <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-300 mb-2">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-white">Create Custom Treat</span>
          <p className="text-xs text-slate-400 mt-1">Design your personal reward</p>
        </div>
      </div>

      {/* Custom Reward Modal */}
      {showAddCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#181335] border border-[#3b2d6e] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Create Personal Reward</h3>
            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reward Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon Nap, Boba Tea, Weekend Outing"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#110d29] border border-[#312560] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Coin Cost
                </label>
                <input
                  type="number"
                  min="20"
                  max="5000"
                  value={customCost}
                  onChange={(e) => setCustomCost(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#110d29] border border-[#312560] text-white text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Icon
                </label>
                <select
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#110d29] border border-[#312560] text-white text-sm"
                >
                  <option value="sparkles">Sparkles</option>
                  <option value="gamepad">Gamepad</option>
                  <option value="popcorn">Popcorn</option>
                  <option value="pizza">Pizza</option>
                  <option value="coffee">Coffee</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-neon-purple"
                >
                  Save Reward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Redemption History (FR-REWARD-05, FR-REWARD-06: Claimed / Used status) */}
      <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-5 backdrop-blur-xl shadow-glass mt-8">
        <h3 className="font-bold text-lg text-white flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-purple-400" />
          <span>Redemption Vault & History</span>
        </h3>

        {redemptions.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            No rewards claimed yet. Complete quests, build streaks, and treat yourself!
          </p>
        ) : (
          <div className="space-y-3">
            {redemptions.map((red) => (
              <div
                key={red.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#110d29] border border-[#271e4d]"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1a143b] flex items-center justify-center">
                    {getRewardIcon(red.reward_icon)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{red.reward_name}</h4>
                    <p className="text-xs text-slate-400">
                      Redeemed for {red.cost} coins on {new Date(red.redeemed_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Status Toggle (Claimed vs Used) */}
                <button
                  onClick={() => claimOrUseRedemption(red.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    red.status === 'used'
                      ? 'bg-slate-700/40 text-slate-400 border border-slate-600/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-neon-green'
                  }`}
                >
                  {red.status === 'used' ? '✓ Used' : 'Claimed (Ready to Use)'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
