import React, { useRef, useEffect, useState } from 'react';
import { Gamepad2, RotateCcw, Trophy, Star, Sparkles, Flame } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { soundFX } from '../../utils/audio';

interface Obstacle {
  x: number;
  width: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

interface Collectible {
  x: number;
  y: number;
  type: 'coin' | 'xp';
  collected: boolean;
}

export const CyberRunnerGame: React.FC = () => {
  const { spendToken, awardGameReward, updateRunnerHighScore, stats } = useGame();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [xpCollected, setXpCollected] = useState(0);

  const gameStateRef = useRef({
    playerY: 150,
    velocity: 0,
    gravity: 0.45,
    jumpPower: -7.5,
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    score: 0,
    coinsEarned: 0,
    xpEarned: 0,
    isPlaying: false,
    gameOver: false,
    frame: 0,
  });

  const handleStart = () => {
    if (!spendToken(1)) return;

    gameStateRef.current = {
      playerY: 150,
      velocity: 0,
      gravity: 0.45,
      jumpPower: -7.5,
      obstacles: [],
      collectibles: [],
      score: 0,
      coinsEarned: 0,
      xpEarned: 0,
      isPlaying: true,
      gameOver: false,
      frame: 0,
    };

    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setCoinsCollected(0);
    setXpCollected(0);
  };

  const jump = () => {
    if (!gameStateRef.current.isPlaying || gameStateRef.current.gameOver) return;
    gameStateRef.current.velocity = gameStateRef.current.jumpPower;
    soundFX.playJump();
  };

  // Keyboard controls (Space or Arrow Up)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameStateRef.current.isPlaying && !gameStateRef.current.gameOver) {
          jump();
        } else if (!gameStateRef.current.isPlaying || gameStateRef.current.gameOver) {
          handleStart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stats.tokens]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let animationId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const state = gameStateRef.current;

      if (state.isPlaying && !state.gameOver) {
        state.frame++;

        // 1. Update Player Physics
        state.velocity += state.gravity;
        state.playerY += state.velocity;

        // Ground / Ceiling Collisions
        if (state.playerY > canvas.height - 24) {
          state.playerY = canvas.height - 24;
          endRun();
        }
        if (state.playerY < 10) {
          state.playerY = 10;
          state.velocity = 0;
        }

        // 2. Spawn Distraction Obstacles
        if (state.frame % 100 === 0) {
          const gap = 120;
          const minH = 40;
          const maxH = canvas.height - gap - minH;
          const topH = Math.floor(Math.random() * (maxH - minH)) + minH;
          const bottomH = canvas.height - topH - gap;

          state.obstacles.push({
            x: canvas.width,
            width: 44,
            topHeight: topH,
            bottomHeight: bottomH,
            passed: false,
          });

          // Spawn collectible in the gap
          const itemType = Math.random() < 0.6 ? 'coin' : 'xp';
          state.collectibles.push({
            x: canvas.width + 20,
            y: topH + gap / 2,
            type: itemType,
            collected: false,
          });
        }

        // 3. Move Obstacles & Check Collisions
        const playerRadius = 13;
        const playerX = 65;

        for (let i = 0; i < state.obstacles.length; i++) {
          const obs = state.obstacles[i];
          obs.x -= 3.2; // Speed

          // Score when passed
          if (!obs.passed && obs.x + obs.width < playerX) {
            obs.passed = true;
            state.score += 10;
            setScore(state.score);
          }

          // Hitbox collision check with top/bottom pillars
          const collideX = playerX + playerRadius > obs.x && playerX - playerRadius < obs.x + obs.width;
          const collideTop = state.playerY - playerRadius < obs.topHeight;
          const collideBottom = state.playerY + playerRadius > canvas.height - obs.bottomHeight;

          if (collideX && (collideTop || collideBottom)) {
            endRun();
          }
        }

        // 4. Move Collectibles & Check Pickups
        for (let i = 0; i < state.collectibles.length; i++) {
          const col = state.collectibles[i];
          col.x -= 3.2;

          if (!col.collected) {
            const dist = Math.hypot(playerX - col.x, state.playerY - col.y);
            if (dist < playerRadius + 12) {
              col.collected = true;
              if (col.type === 'coin') {
                soundFX.playCoin();
                state.coinsEarned += 5;
                setCoinsCollected(state.coinsEarned);
              } else {
                state.xpEarned += 15;
                setXpCollected(state.xpEarned);
              }
            }
          }
        }

        // Cleanup offscreen objects
        state.obstacles = state.obstacles.filter((o) => o.x > -60);
        state.collectibles = state.collectibles.filter((c) => c.x > -60 && !c.collected);
      }

      // 5. Render Scene
      renderScene(ctx, canvas, state);

      animationId = requestAnimationFrame(loop);
    };

    const endRun = () => {
      const state = gameStateRef.current;
      state.gameOver = true;
      state.isPlaying = false;
      setIsPlaying(false);
      setGameOver(true);
      soundFX.playGameOver();

      // Final rewards award: base run XP + collected XP + coins
      const finalXp = state.score + state.xpEarned;
      const finalCoins = state.coinsEarned + Math.floor(state.score / 15);

      updateRunnerHighScore(state.score);

      if (finalXp > 0 || finalCoins > 0) {
        awardGameReward(finalXp, finalCoins, 'Cyber Runner', `Score: ${state.score}`);
      }
    };

    animationId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationId);
  }, []);

  const renderScene = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, state: typeof gameStateRef.current) => {
    // Background gradient (Deep Cyber Space)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#0c0822');
    bgGrad.addColorStop(1, '#150f38');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines for cyber effect
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Draw Obstacles (Red Distraction Pillars)
    state.obstacles.forEach((obs) => {
      // Top Laser Pillar
      const gradTop = ctx.createLinearGradient(obs.x, 0, obs.x + obs.width, 0);
      gradTop.addColorStop(0, '#e11d48');
      gradTop.addColorStop(0.5, '#fb7185');
      gradTop.addColorStop(1, '#be123c');
      ctx.fillStyle = gradTop;
      ctx.shadowColor = 'rgba(244, 63, 94, 0.6)';
      ctx.shadowBlur = 10;
      ctx.fillRect(obs.x, 0, obs.width, obs.topHeight);

      // Bottom Laser Pillar
      ctx.fillRect(obs.x, canvas.height - obs.bottomHeight, obs.width, obs.bottomHeight);
      ctx.shadowBlur = 0;
    });

    // Draw Collectibles
    state.collectibles.forEach((c) => {
      if (c.collected) return;
      ctx.save();
      ctx.translate(c.x, c.y);

      if (c.type === 'coin') {
        // Gold Coin
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 0);
      } else {
        // Purple XP Star
        ctx.fillStyle = '#c084fc';
        ctx.shadowColor = 'rgba(192, 132, 252, 0.8)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('XP', 0, 0);
      }
      ctx.restore();
    });

    // Draw Player Hero (Glowing Neon Warrior Orb with Jet Trail)
    const playerX = 65;
    const playerY = state.playerY;

    // Jet trail particles
    ctx.fillStyle = 'rgba(168, 85, 247, 0.5)';
    ctx.beginPath();
    ctx.arc(playerX - 16, playerY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Player body
    ctx.fillStyle = '#8b5cf6';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(playerX, playerY, 13, 0, Math.PI * 2);
    ctx.fill();

    // Player inner highlight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(playerX + 3, playerY - 3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-purple-400" />
            <span>Cyber Runner: Distraction Dodger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tap or Press Space to glide! Dodge red distraction lasers and gather coins and XP stars!
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-bold bg-[#130f2b] px-4 py-2 rounded-xl border border-[#2c2259]">
          <span className="text-purple-300">Score: {score}</span>
          <span className="text-amber-300">Coins: +{coinsCollected}</span>
          <span className="text-emerald-300">High: {stats.runner_high_score}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-6 backdrop-blur-xl shadow-glass flex flex-col items-center select-none">
        {/* Canvas Game Area */}
        <div
          onClick={jump}
          className="relative rounded-2xl overflow-hidden border-2 border-[#382b6b] cursor-pointer shadow-neon-purple-sm"
        >
          <canvas
            ref={canvasRef}
            width={640}
            height={340}
            className="w-full max-w-[640px] h-[340px] block"
          />

          {/* Overlay Start Screen */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-300 shadow-neon-purple">
                <Gamepad2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Cyber Quest: Run!</h3>
              <p className="text-xs text-slate-300 max-w-xs">
                Press Spacebar or Click/Tap anywhere to jump. Avoid red laser pillars!
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStart();
                }}
                className="py-3 px-8 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-neon-purple"
              >
                Launch Runner (1 Token)
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3 animate-fadeIn">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                Run Over
              </span>
              <h3 className="text-3xl font-black text-white">Score: {score}</h3>
              <div className="flex items-center space-x-3 text-xs font-bold">
                <span className="text-purple-300 bg-purple-500/20 px-3 py-1 rounded-lg">
                  +{score + xpCollected} Total XP
                </span>
                <span className="text-amber-300 bg-amber-500/20 px-3 py-1 rounded-lg">
                  +{coinsCollected + Math.floor(score / 15)} Coins Earned
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStart();
                }}
                className="py-2.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-neon-purple flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again (1 Token)</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-4">
          💡 <em>Pro-Tip:</em> Complete real-world tasks and focus sessions to keep recharging Arcade Tokens!
        </p>
      </div>
    </div>
  );
};
