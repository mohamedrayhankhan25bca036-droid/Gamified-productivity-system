import React, { useState, useRef } from 'react';
import { Sparkles, Trophy, Shield, Coins, Star, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { soundFX } from '../../utils/audio';

interface Wedge {
  label: string;
  sublabel: string;
  type: 'coins' | 'xp' | 'freeze' | 'tokens';
  amount: number;
  color: string;
  textColor: string;
}

const WEDGES: Wedge[] = [
  { label: '+100', sublabel: 'Coins', type: 'coins', amount: 100, color: '#f59e0b', textColor: '#451a03' },
  { label: '+150', sublabel: 'XP', type: 'xp', amount: 150, color: '#8b5cf6', textColor: '#ffffff' },
  { label: 'FREEZE', sublabel: 'Shield', type: 'freeze', amount: 1, color: '#06b6d4', textColor: '#083344' },
  { label: 'JACKPOT', sublabel: '+300 Coins', type: 'coins', amount: 300, color: '#eab308', textColor: '#422006' },
  { label: '+75', sublabel: 'XP', type: 'xp', amount: 75, color: '#a855f7', textColor: '#ffffff' },
  { label: '+50', sublabel: 'Coins', type: 'coins', amount: 50, color: '#f97316', textColor: '#431407' },
  { label: '+2 TOKENS', sublabel: 'Arcade', type: 'tokens', amount: 2, color: '#10b981', textColor: '#022c22' },
  { label: 'BOOST', sublabel: '+200 XP', type: 'xp', amount: 200, color: '#ec4899', textColor: '#ffffff' },
];

export const WheelOfFortune: React.FC = () => {
  const { spendToken, awardGameReward, addStreakFreeze, stats } = useGame();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningWedge, setWinningWedge] = useState<Wedge | null>(null);

  const numWedges = WEDGES.length;
  const sliceAngle = 360 / numWedges;

  const handleSpin = () => {
    if (isSpinning) return;
    if (!spendToken(1)) return;

    setIsSpinning(true);
    setWinningWedge(null);

    // Pick random target wedge
    const winningIndex = Math.floor(Math.random() * numWedges);
    const extraSpins = 5 + Math.floor(Math.random() * 3); // 5 to 7 full revolutions
    
    // Calculate final angle pointing at winningIndex at top (270 degrees or 0 depending on offset)
    const targetAngle = extraSpins * 360 + (360 - (winningIndex * sliceAngle + sliceAngle / 2));
    const finalRotation = rotation + targetAngle;

    setRotation(finalRotation);

    // Audio click ticks during spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      soundFX.playWheelClick();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 120);

    // Finish spin after animation duration (3.5s)
    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      const prize = WEDGES[winningIndex];
      setWinningWedge(prize);

      // Award prize
      soundFX.playAchievement();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: [prize.color, '#fbbf24', '#ffffff'],
      });

      if (prize.type === 'coins') {
        awardGameReward(0, prize.amount, 'Mythic Fortune Wheel', `Won ${prize.amount} Coins!`);
      } else if (prize.type === 'xp') {
        awardGameReward(prize.amount, 0, 'Mythic Fortune Wheel', `Won +${prize.amount} XP!`);
      } else if (prize.type === 'freeze') {
        addStreakFreeze(1);
      } else if (prize.type === 'tokens') {
        awardGameReward(0, 0, 'Mythic Fortune Wheel', 'Won +2 Arcade Tokens!');
      }
    }, 3600);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          <span>Mythic Fortune Wheel</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Spin the wheel of destiny! Win coins, streak freeze shields, bonus XP, or jackpot tokens.
        </p>
      </div>

      <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-6 backdrop-blur-xl shadow-glass flex flex-col items-center relative overflow-hidden">
        {/* Pointer Triangle Marker */}
        <div className="relative z-20 -mb-5 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400 drop-shadow-[0_4px_10px_rgba(251,191,36,0.8)]" />
        </div>

        {/* Wheel Container */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 my-4">
          <div
            className="w-full h-full rounded-full border-4 border-amber-400 shadow-neon-gold overflow-hidden transition-transform ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: isSpinning ? '3.5s' : '0s',
              transitionTimingFunction: 'cubic-bezier(0.15, 0.95, 0.35, 1)',
            }}
          >
            {/* SVG Wedges */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {WEDGES.map((w, i) => {
                const startAngle = (i * sliceAngle * Math.PI) / 180;
                const endAngle = (((i + 1) * sliceAngle) * Math.PI) / 180;
                const x1 = 50 + 50 * Math.cos(startAngle);
                const y1 = 50 + 50 * Math.sin(startAngle);
                const x2 = 50 + 50 * Math.cos(endAngle);
                const y2 = 50 + 50 * Math.sin(endAngle);

                const midAngle = ((i + 0.5) * sliceAngle * Math.PI) / 180;
                const textX = 50 + 32 * Math.cos(midAngle);
                const textY = 50 + 32 * Math.sin(midAngle);

                return (
                  <g key={i}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                      fill={w.color}
                      stroke="#1e1840"
                      strokeWidth="0.8"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill={w.textColor}
                      fontSize="4.2"
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${(i + 0.5) * sliceAngle + 90}, ${textX}, ${textY})`}
                    >
                      {w.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-[#120c29] border-4 border-amber-400 flex items-center justify-center shadow-lg">
              <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <div className="mt-4 flex flex-col items-center space-y-3">
          <button
            onClick={handleSpin}
            disabled={isSpinning || stats.tokens < 1}
            className={`py-3.5 px-8 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-200 transform ${
              isSpinning || stats.tokens < 1
                ? 'bg-[#181335] text-slate-500 border border-[#2b2157] cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-amber-950 shadow-neon-gold hover:scale-105 active:scale-95'
            }`}
          >
            {isSpinning ? 'Spinning Destiny...' : 'SPIN WHEEL (1 Token)'}
          </button>

          <span className="text-xs text-slate-400">
            Available Tokens: <strong className="text-purple-300">{stats.tokens}</strong>
          </span>
        </div>

        {/* Winning Result Display */}
        {winningWedge && (
          <div className="mt-6 p-4 rounded-xl bg-purple-600/20 border border-purple-400/50 text-center animate-bounce">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
              Prize Unlocked!
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {winningWedge.label} {winningWedge.sublabel}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
