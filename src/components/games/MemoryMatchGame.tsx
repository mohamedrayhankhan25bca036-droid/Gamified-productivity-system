import React, { useState, useEffect } from 'react';
import {
  Brain,
  RotateCcw,
  Sparkles,
  Trophy,
  Swords,
  Shield,
  Crown,
  Flame,
  Star,
  Zap,
  Gem,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { soundFX } from '../../utils/audio';

interface CardItem {
  id: number;
  pairId: number;
  iconName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ICONS = [
  { name: 'Swords', icon: Swords, color: '#f43f5e' },
  { name: 'Shield', icon: Shield, color: '#06b6d4' },
  { name: 'Crown', icon: Crown, color: '#eab308' },
  { name: 'Flame', icon: Flame, color: '#f97316' },
  { name: 'Star', icon: Star, color: '#a855f7' },
  { name: 'Zap', icon: Zap, color: '#3b82f6' },
  { name: 'Gem', icon: Gem, color: '#10b981' },
  { name: 'Sparkles', icon: Sparkles, color: '#ec4899' },
];

export const MemoryMatchGame: React.FC = () => {
  const { spendToken, awardGameReward, updateMemoryBestScore, stats } = useGame();

  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(1);

  // Initialize randomized cards
  const initializeDeck = () => {
    const deck: CardItem[] = [];
    ICONS.forEach((item, index) => {
      // 2 of each
      deck.push({ id: index * 2, pairId: index, iconName: item.name, isFlipped: false, isMatched: false });
      deck.push({ id: index * 2 + 1, pairId: index, iconName: item.name, isFlipped: false, isMatched: false });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setSeconds(0);
    setCombo(1);
    setGameOver(false);
  };

  const handleStartGame = () => {
    if (!spendToken(1)) return;
    initializeDeck();
    setIsPlaying(true);
  };

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && !gameOver) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, gameOver]);

  // Card Flip Click
  const handleCardClick = (index: number) => {
    if (!isPlaying || gameOver) return;
    if (flippedIndices.length >= 2) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    soundFX.playCardFlip();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (newCards[firstIdx].pairId === newCards[secondIdx].pairId) {
        // MATCH!
        soundFX.playCardMatch();
        newCards[firstIdx].isMatched = true;
        newCards[secondIdx].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        setCombo((c) => c + 1);

        // Check if all matched
        if (newCards.every((c) => c.isMatched)) {
          handleVictory(moves + 1, seconds);
        }
      } else {
        // NO MATCH -> flip back after delay
        setCombo(1);
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 850);
      }
    }
  };

  const handleVictory = (finalMoves: number, timeTaken: number) => {
    setGameOver(true);
    soundFX.playBossDefeat();

    // Reward calculation based on efficiency
    const baseCoins = 80;
    const speedBonus = Math.max(10, 80 - timeTaken);
    const totalCoins = baseCoins + speedBonus;
    const xpBonus = 150 + Math.max(0, (20 - finalMoves) * 10);

    const score = Math.max(100, 1000 - finalMoves * 20 - timeTaken * 10);
    updateMemoryBestScore(score);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#a855f7', '#fbbf24'],
    });

    awardGameReward(xpBonus, totalCoins, 'Rune Memory Matrix', `Solved in ${finalMoves} moves & ${timeTaken}s`);
  };

  const renderIcon = (name: string) => {
    const found = ICONS.find((i) => i.name === name);
    if (!found) return null;
    const IconComp = found.icon;
    return <IconComp className="w-8 h-8" style={{ color: found.color }} />;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            <span>Rune Memory Matrix</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sharpen your mental clarity and memory! Find matching rune pairs to win XP & gold coins.
          </p>
        </div>

        {isPlaying && (
          <div className="flex items-center space-x-4 text-xs font-bold bg-[#130f2b] px-4 py-2 rounded-xl border border-[#2c2259]">
            <span className="text-purple-300">Moves: {moves}</span>
            <span className="text-amber-300">Time: {seconds}s</span>
            {combo > 1 && <span className="text-emerald-400 animate-pulse">{combo}x Combo!</span>}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-6 backdrop-blur-xl shadow-glass flex flex-col items-center">
        {!isPlaying ? (
          <div className="text-center py-8 space-y-4 max-w-md">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center mx-auto shadow-neon-purple">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white">Sharpen Your Working Memory</h3>
            <p className="text-xs text-slate-300">
              Flip 16 mystical rune cards to discover pairs. Fast completion yields bonus coins & high score rankings!
            </p>
            <button
              onClick={handleStartGame}
              className="py-3 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-neon-purple transform hover:scale-105 active:scale-95"
            >
              Play Matrix (Cost: 1 Token)
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-5">
            {/* 4x4 Grid of Cards */}
            <div className="grid grid-cols-4 gap-3">
              {cards.map((card, idx) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 select-none transform ${
                    card.isFlipped || card.isMatched
                      ? 'bg-[#1b143d] border-2 border-purple-500 shadow-neon-purple-sm rotate-0'
                      : 'bg-gradient-to-br from-[#1b1542] to-[#120d29] hover:border-purple-400/60 border border-[#2b2053] hover:scale-105'
                  }`}
                >
                  {card.isFlipped || card.isMatched ? (
                    renderIcon(card.iconName)
                  ) : (
                    <span className="text-xl font-black text-purple-400/40">✦</span>
                  )}
                </div>
              ))}
            </div>

            {/* Victory Message */}
            {gameOver && (
              <div className="p-4 rounded-xl bg-purple-600/25 border border-purple-400 text-center animate-fadeIn space-y-2">
                <h4 className="text-lg font-black text-white">🎉 MATRIX CLEARED!</h4>
                <p className="text-xs text-slate-300">
                  Completed in {moves} moves and {seconds} seconds. XP and coins added to your balance!
                </p>
                <button
                  onClick={handleStartGame}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-neon-purple"
                >
                  Play Again (1 Token)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
