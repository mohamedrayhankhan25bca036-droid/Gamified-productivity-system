import React, { useState } from 'react';
import {
  Gamepad2,
  Swords,
  Sparkles,
  Brain,
  Shield,
  Coins,
  Plus,
  Trophy,
  Flame,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { BossBattleGame } from '../components/games/BossBattleGame';
import { WheelOfFortune } from '../components/games/WheelOfFortune';
import { MemoryMatchGame } from '../components/games/MemoryMatchGame';
import { CyberRunnerGame } from '../components/games/CyberRunnerGame';

export const GamesView: React.FC = () => {
  const { stats, buyTokensWithCoins } = useGame();
  const [selectedGame, setSelectedGame] = useState<'boss' | 'wheel' | 'memory' | 'runner'>('boss');

  const gameTabs = [
    { id: 'boss', label: 'Dungeon Boss Raid', icon: Swords, color: 'text-rose-400' },
    { id: 'wheel', label: 'Mythic Wheel', icon: Sparkles, color: 'text-amber-400' },
    { id: 'memory', label: 'Rune Memory Matrix', icon: Brain, color: 'text-cyan-400' },
    { id: 'runner', label: 'Cyber Runner', icon: Gamepad2, color: 'text-purple-400' },
  ] as const;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-purple-400" />
            <span>Productivity Arcade & Quest Arena</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Play rewarding mini-games to unwind and earn real XP, coins, and streak protections!
          </p>
        </div>

        {/* Tokens & Shields Wallet Pill */}
        <div className="flex items-center space-x-3">
          {/* Streak Freezes count */}
          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#171233] border border-[#312560] text-xs">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300 font-bold">{stats.streak_freezes} Freezes</span>
          </div>

          {/* Arcade Tokens */}
          <div className="flex items-center space-x-2.5 px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/40 text-xs font-bold text-white shadow-neon-purple-sm">
            <span className="text-sm">🎟️</span>
            <span>{stats.tokens} Arcade Tokens</span>
            <button
              onClick={() => buyTokensWithCoins(1)}
              className="ml-2 px-2 py-0.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-[10px] flex items-center gap-1 transition-all"
              title="Buy 1 Token for 50 Coins"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
              <span>50$</span>
            </button>
          </div>
        </div>
      </div>

      {/* Game Mode Tabs Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-b border-[#261f49]">
        {gameTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedGame === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedGame(tab.id)}
              className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-neon-purple'
                  : 'bg-[#151031] text-slate-400 hover:text-white border border-[#2c2259]'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Game Area */}
      <div>
        {selectedGame === 'boss' && <BossBattleGame />}
        {selectedGame === 'wheel' && <WheelOfFortune />}
        {selectedGame === 'memory' && <MemoryMatchGame />}
        {selectedGame === 'runner' && <CyberRunnerGame />}
      </div>
    </div>
  );
};
