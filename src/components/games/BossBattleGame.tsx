import React, { useState, useEffect } from 'react';
import {
  Swords,
  Shield,
  Zap,
  Sparkles,
  Heart,
  RotateCcw,
  Trophy,
  Flame,
  Award,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundFX } from '../../utils/audio';

interface Boss {
  id: string;
  name: string;
  title: string;
  maxHp: number;
  avatar: string;
  attackPower: number;
  xpReward: number;
  coinReward: number;
  description: string;
}

const BOSSES: Boss[] = [
  {
    id: 'boss-1',
    name: 'Sloth Golem',
    title: 'Harbinger of Inertia',
    maxHp: 450,
    avatar: '🗿',
    attackPower: 35,
    xpReward: 120,
    coinReward: 80,
    description: 'A heavy creature of lethargy that tries to delay your tasks with sluggish mud.',
  },
  {
    id: 'boss-2',
    name: 'Procrastination Wyrm',
    title: 'Consumer of Deadlines',
    maxHp: 750,
    avatar: '🐉',
    attackPower: 55,
    xpReward: 250,
    coinReward: 160,
    description: 'Whispers "Just watch one more episode..." as it breathes distraction flames.',
  },
  {
    id: 'boss-3',
    name: 'Chronos the Deadline Titan',
    title: 'The Inevitable Hour',
    maxHp: 1200,
    avatar: '⏳',
    attackPower: 80,
    xpReward: 500,
    coinReward: 350,
    description: 'The ultimate boss representing looming last-minute panic and crunch.',
  },
];

export const BossBattleGame: React.FC = () => {
  const { stats, spendToken, awardGameReward, recordBossKill, addStreakFreeze } = useGame();

  const [selectedBossIndex, setSelectedBossIndex] = useState(0);
  const [inBattle, setInBattle] = useState(false);
  const [bossHp, setBossHp] = useState(BOSSES[0].maxHp);

  // Player combat stats scaled by player level and streak
  const playerMaxHp = 200 + stats.level * 25 + stats.current_streak * 10;
  const [playerHp, setPlayerHp] = useState(playerMaxHp);
  const [playerMana, setPlayerMana] = useState(100);
  const [focusEnergy, setFocusEnergy] = useState(0); // 0-100 for Ultimate

  const [battleLogs, setBattleLogs] = useState<string[]>([]);
  const [isDefending, setIsDefending] = useState(false);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);
  const [bossShake, setBossShake] = useState(false);
  const [playerShake, setPlayerShake] = useState(false);

  const currentBoss = BOSSES[selectedBossIndex];

  const startBattle = () => {
    if (!spendToken(1)) return;

    setInBattle(true);
    setBossHp(currentBoss.maxHp);
    setPlayerHp(playerMaxHp);
    setPlayerMana(100);
    setFocusEnergy(20);
    setBattleResult(null);
    setIsDefending(false);
    setBattleLogs([`⚔️ You challenged ${currentBoss.name}! Channel your focus and strike!`]);
  };

  const handlePlayerAttack = () => {
    if (battleResult || !inBattle) return;

    soundFX.playSlash();
    setBossShake(true);
    setTimeout(() => setBossShake(false), 300);

    // Damage calculation with critical chance
    const isCrit = Math.random() < 0.25;
    const baseDmg = 45 + stats.level * 5;
    const damage = Math.round(isCrit ? baseDmg * 1.8 : baseDmg);

    const nextBossHp = Math.max(0, bossHp - damage);
    setBossHp(nextBossHp);

    setFocusEnergy((prev) => Math.min(100, prev + 25));
    setPlayerMana((prev) => Math.min(100, prev + 15));

    const logText = isCrit
      ? `💥 CRITICAL SLASH! You dealt ${damage} massive damage to ${currentBoss.name}!`
      : `⚔️ You slashed ${currentBoss.name} for ${damage} damage.`;

    setBattleLogs((prev) => [logText, ...prev]);

    if (nextBossHp <= 0) {
      handleVictory();
    } else {
      setTimeout(bossTurn, 600);
    }
  };

  const handleCastSpell = () => {
    if (battleResult || !inBattle || playerMana < 35) return;

    soundFX.playSpell();
    setBossShake(true);
    setTimeout(() => setBossShake(false), 400);

    setPlayerMana((prev) => prev - 35);
    const magicDmg = Math.round(75 + stats.level * 8 + Math.random() * 20);
    const nextBossHp = Math.max(0, bossHp - magicDmg);
    setBossHp(nextBossHp);

    setFocusEnergy((prev) => Math.min(100, prev + 35));

    setBattleLogs((prev) => [
      `⚡ FOCUS LIGHTNING! Radiant mana dealt ${magicDmg} arcane damage!`,
      ...prev,
    ]);

    if (nextBossHp <= 0) {
      handleVictory();
    } else {
      setTimeout(bossTurn, 650);
    }
  };

  const handleDefend = () => {
    if (battleResult || !inBattle) return;

    setIsDefending(true);
    setPlayerMana((prev) => Math.min(100, prev + 30));
    setPlayerHp((prev) => Math.min(playerMaxHp, prev + 25)); // slight heal on guard

    setBattleLogs((prev) => [
      `🛡️ Iron Discipline! Guard raised: 75% damage reduction and healed +25 HP.`,
      ...prev,
    ]);

    setTimeout(bossTurn, 600);
  };

  const handleUltimate = () => {
    if (battleResult || !inBattle || focusEnergy < 100) return;

    soundFX.playSpell();
    soundFX.playSlash();
    setBossShake(true);
    setTimeout(() => setBossShake(false), 500);

    setFocusEnergy(0);
    const ultimateDmg = Math.round(180 + stats.level * 18);
    const nextBossHp = Math.max(0, bossHp - ultimateDmg);
    setBossHp(nextBossHp);

    setBattleLogs((prev) => [
      `🌟 LIMIT BREAK: ULTRA FOCUS OVERDRIVE! Unleashed ${ultimateDmg} annihilating damage!`,
      ...prev,
    ]);

    if (nextBossHp <= 0) {
      handleVictory();
    } else {
      setTimeout(bossTurn, 700);
    }
  };

  const bossTurn = () => {
    if (bossHp <= 0) return;

    soundFX.playMonsterHit();
    setPlayerShake(true);
    setTimeout(() => setPlayerShake(false), 300);

    let incomingDmg = Math.round(currentBoss.attackPower * (0.8 + Math.random() * 0.4));
    if (isDefending) {
      incomingDmg = Math.round(incomingDmg * 0.25);
      setIsDefending(false);
    }

    const nextPlayerHp = Math.max(0, playerHp - incomingDmg);
    setPlayerHp(nextPlayerHp);

    setBattleLogs((prev) => [
      `👹 ${currentBoss.name} attacked you for ${incomingDmg} damage!`,
      ...prev,
    ]);

    if (nextPlayerHp <= 0) {
      handleDefeat();
    }
  };

  const handleVictory = () => {
    soundFX.playBossDefeat();
    setBattleResult('victory');
    recordBossKill();

    let bonusItem = '';
    if (selectedBossIndex >= 1) {
      addStreakFreeze(1);
      bonusItem = '+1 Streak Freeze Shield';
    }

    awardGameReward(
      currentBoss.xpReward,
      currentBoss.coinReward,
      'Dungeon Boss Raid',
      bonusItem || `Defeated ${currentBoss.name}`
    );

    setBattleLogs((prev) => [
      `🏆 VICTORY! You vanquished ${currentBoss.name}! Rewarded +${currentBoss.xpReward} XP & +${currentBoss.coinReward} Coins!`,
      ...prev,
    ]);
  };

  const handleDefeat = () => {
    soundFX.playGameOver();
    setBattleResult('defeat');
    setBattleLogs((prev) => [
      `💀 DEFEAT! ${currentBoss.name} wore down your willpower. Regroup and try again!`,
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header and Boss Select */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Swords className="w-6 h-6 text-purple-400" />
            <span>Boss Raid: The Dungeon of Distractions</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Spend 1 Arcade Token to battle monsters. Your stats scale with your real-life Level & Streak!
          </p>
        </div>

        {/* Boss Selection Tabs */}
        {!inBattle && (
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {BOSSES.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedBossIndex(idx);
                  setBossHp(b.maxHp);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedBossIndex === idx
                    ? 'bg-purple-600 text-white shadow-neon-purple-sm'
                    : 'bg-[#120e29] text-slate-400 hover:text-white border border-[#2b2157]'
                }`}
              >
                <span>{b.avatar}</span>
                <span>{b.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Battle Arena Container */}
      <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-6 backdrop-blur-xl shadow-glass relative overflow-hidden">
        {/* Ambient Arena Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

        {!inBattle ? (
          /* Pre-Battle Overview Card */
          <div className="max-w-xl mx-auto text-center py-6 space-y-5">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 p-1 mx-auto shadow-neon-purple animate-pulse-slow">
              <div className="w-full h-full rounded-full bg-[#150f33] flex items-center justify-center text-5xl">
                {currentBoss.avatar}
              </div>
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">
                {currentBoss.title}
              </span>
              <h3 className="text-2xl font-black text-white mt-1">{currentBoss.name}</h3>
              <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
                {currentBoss.description}
              </p>
            </div>

            {/* Boss Stats & Rewards */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
              <div className="p-2.5 rounded-xl bg-[#110d29] border border-[#271e4d]">
                <span className="text-[10px] text-slate-400 block font-semibold">HEALTH</span>
                <span className="font-extrabold text-rose-400 text-sm">{currentBoss.maxHp} HP</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#110d29] border border-[#271e4d]">
                <span className="text-[10px] text-slate-400 block font-semibold">REWARD XP</span>
                <span className="font-extrabold text-purple-300 text-sm">+{currentBoss.xpReward} XP</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#110d29] border border-[#271e4d]">
                <span className="text-[10px] text-slate-400 block font-semibold">REWARD COINS</span>
                <span className="font-extrabold text-amber-300 text-sm">+{currentBoss.coinReward} Coins</span>
              </div>
            </div>

            <button
              onClick={startBattle}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-base shadow-neon-purple transition-all transform hover:scale-105 active:scale-95"
            >
              Enter Dungeon (Cost: 1 Token)
            </button>
          </div>
        ) : (
          /* Active Combat Screen */
          <div className="space-y-6">
            {/* Health Bars: Boss vs Player */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Boss Status */}
              <div
                className={`p-4 rounded-xl bg-[#110d29] border border-rose-500/30 transition-transform ${
                  bossShake ? 'animate-bounce scale-95' : ''
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl">{currentBoss.avatar}</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">{currentBoss.name}</h4>
                    <span className="text-[11px] text-slate-400">{currentBoss.title}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-rose-300 font-bold mb-1">
                  <span>Boss Health</span>
                  <span>{bossHp} / {currentBoss.maxHp}</span>
                </div>
                <div className="w-full h-3 bg-[#0d0922] rounded-full overflow-hidden border border-[#2b1f54]">
                  <div
                    className="h-full bg-gradient-to-r from-rose-600 to-red-400 transition-all duration-300"
                    style={{ width: `${Math.max(0, (bossHp / currentBoss.maxHp) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Player Status */}
              <div
                className={`p-4 rounded-xl bg-[#110d29] border border-purple-500/30 transition-transform ${
                  playerShake ? 'animate-bounce scale-95' : ''
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-400">
                    <img src={stats ? '/assets/avatar.png' : ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Rayhan (Level {stats.level})</h4>
                    <span className="text-[11px] text-purple-300 font-semibold">
                      Discipline Shield Active
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-emerald-300 font-bold mb-1">
                  <span>Your HP</span>
                  <span>{playerHp} / {playerMaxHp}</span>
                </div>
                <div className="w-full h-3 bg-[#0d0922] rounded-full overflow-hidden border border-[#2b1f54] mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${Math.max(0, (playerHp / playerMaxHp) * 100)}%` }}
                  />
                </div>

                {/* Mana & Focus meters */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                  <div>
                    <div className="flex justify-between text-indigo-300 mb-0.5">
                      <span>Mana</span>
                      <span>{playerMana}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0d0922] rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${playerMana}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-amber-300 mb-0.5">
                      <span>Limit Break</span>
                      <span>{focusEnergy}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0d0922] rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${focusEnergy}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Combat Actions */}
            {!battleResult ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={handlePlayerAttack}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-bold text-xs shadow-neon-purple flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Swords className="w-4 h-4" />
                  <span>Sword Strike</span>
                </button>

                <button
                  onClick={handleCastSpell}
                  disabled={playerMana < 35}
                  className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                    playerMana >= 35
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-neon-purple-sm active:scale-95'
                      : 'bg-[#130f28] text-slate-500 border border-[#261d4b] cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Focus Blast (35 MP)</span>
                </button>

                <button
                  onClick={handleDefend}
                  className="py-3 px-4 rounded-xl bg-[#1d1742] hover:bg-[#251e50] border border-purple-500/40 text-purple-300 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Shield className="w-4 h-4" />
                  <span>Iron Guard (-75%)</span>
                </button>

                <button
                  onClick={handleUltimate}
                  disabled={focusEnergy < 100}
                  className={`py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 transition-all ${
                    focusEnergy >= 100
                      ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 text-amber-950 shadow-neon-gold animate-pulse active:scale-95'
                      : 'bg-[#130f28] text-slate-500 border border-[#261d4b] cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Limit Break (100%)</span>
                </button>
              </div>
            ) : (
              /* Battle End Summary */
              <div className="p-5 rounded-xl bg-[#110d29] border border-[#3b2d6e] text-center space-y-3">
                <h4
                  className={`text-2xl font-black ${
                    battleResult === 'victory' ? 'text-amber-300' : 'text-rose-400'
                  }`}
                >
                  {battleResult === 'victory' ? '🏆 VICTORY ACHIEVED!' : '💀 YOU WERE DEFEATED!'}
                </h4>
                <p className="text-xs text-slate-300">
                  {battleResult === 'victory'
                    ? `You shattered ${currentBoss.name}! Rewards have been credited to your hero profile.`
                    : 'Do not despair! Recharge your focus, complete a task in real life, and return.'}
                </p>
                <button
                  onClick={() => setInBattle(false)}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-neon-purple"
                >
                  Return to Dungeon Hub
                </button>
              </div>
            )}

            {/* Combat Log Box */}
            <div className="p-3.5 rounded-xl bg-[#0f0b24] border border-[#231a47] max-h-40 overflow-y-auto font-mono text-xs space-y-1">
              {battleLogs.map((log, i) => (
                <div key={i} className="text-slate-300 leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
