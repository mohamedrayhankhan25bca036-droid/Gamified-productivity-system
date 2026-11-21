import React, { useState, useEffect, useRef } from 'react';
import { Clock, Info, RotateCcw, Play, Pause, SkipForward, Star } from 'lucide-react';
import { TimerMode } from '../types';
import { useGame } from '../context/GameContext';

export const FocusTimer: React.FC = () => {
  const { settings, completeFocusSession } = useGame();
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro_minutes * 60);
  const [totalDuration, setTotalDuration] = useState(settings.pomodoro_minutes * 60);

  // Accurate timestamp reference (FR-TIMER-03)
  const targetTimeRef = useRef<number | null>(null);

  // Update duration when mode or settings change
  useEffect(() => {
    let minutes = settings.pomodoro_minutes;
    if (mode === 'short_break') minutes = settings.short_break_minutes;
    if (mode === 'long_break') minutes = settings.long_break_minutes;

    const seconds = minutes * 60;
    setTotalDuration(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
    targetTimeRef.current = null;
  }, [mode, settings.pomodoro_minutes, settings.short_break_minutes, settings.long_break_minutes]);

  // Timer interval with timestamp checking
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      if (!targetTimeRef.current) {
        targetTimeRef.current = Date.now() + timeLeft * 1000;
      }

      interval = setInterval(() => {
        if (!targetTimeRef.current) return;
        const now = Date.now();
        const remaining = Math.round((targetTimeRef.current - now) / 1000);

        if (remaining <= 0) {
          setTimeLeft(0);
          setIsRunning(false);
          targetTimeRef.current = null;
          // Award XP and complete session
          completeFocusSession(mode, totalDuration);
        } else {
          setTimeLeft(remaining);
        }
      }, 250);
    } else {
      targetTimeRef.current = null;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, totalDuration, completeFocusSession]);

  const handleTogglePlay = () => {
    if (!isRunning) {
      targetTimeRef.current = Date.now() + timeLeft * 1000;
      setIsRunning(true);
    } else {
      setIsRunning(false);
      targetTimeRef.current = null;
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    targetTimeRef.current = null;
    let minutes = settings.pomodoro_minutes;
    if (mode === 'short_break') minutes = settings.short_break_minutes;
    if (mode === 'long_break') minutes = settings.long_break_minutes;
    setTimeLeft(minutes * 60);
  };

  const handleSkip = () => {
    setIsRunning(false);
    targetTimeRef.current = null;
    // Rotate mode: pomodoro -> short_break -> pomodoro
    if (mode === 'pomodoro') {
      setMode('short_break');
    } else if (mode === 'short_break') {
      setMode('pomodoro');
    } else {
      setMode('pomodoro');
    }
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Circular progress math
  const progressRatio = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-5 backdrop-blur-xl shadow-glass flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#281f4e]">
        <div className="flex items-center space-x-2.5">
          <Clock className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-base md:text-lg text-white tracking-tight">
            Focus Timer
          </h3>
        </div>
        <div className="text-slate-400 hover:text-slate-200 cursor-pointer" title="Pomodoro: 25m Focus, 5m Short Break, 15m Long Break">
          <Info className="w-4 h-4" />
        </div>
      </div>

      {/* Mode Selectors */}
      <div className="flex items-center justify-center space-x-2 my-2">
        <button
          onClick={() => setMode('pomodoro')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            mode === 'pomodoro'
              ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-neon-purple-sm'
              : 'bg-[#1b153b] text-slate-400 hover:text-white border border-[#312560]'
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => setMode('short_break')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            mode === 'short_break'
              ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-neon-purple-sm'
              : 'bg-[#1b153b] text-slate-400 hover:text-white border border-[#312560]'
          }`}
        >
          Short Break
        </button>
        <button
          onClick={() => setMode('long_break')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            mode === 'long_break'
              ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-neon-purple-sm'
              : 'bg-[#1b153b] text-slate-400 hover:text-white border border-[#312560]'
          }`}
        >
          Long Break
        </button>
      </div>

      {/* Circular Progress Display */}
      <div className="relative flex items-center justify-center my-3">
        <svg className="w-44 h-44 transform -rotate-90">
          {/* Background Ring */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="#211947"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Progress Ring with Neon Purple Glow */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="url(#purpleGradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-linear drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]"
          />
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-white tracking-wider font-mono drop-shadow">
            {formattedTime}
          </span>
          <span className="text-[11px] font-semibold text-purple-300/80 uppercase tracking-widest mt-0.5">
            {mode === 'pomodoro' ? 'Focus Time' : mode === 'short_break' ? 'Short Break' : 'Long Break'}
          </span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-center space-x-5 my-1">
        {/* Reset button */}
        <button
          onClick={handleReset}
          className="w-10 h-10 rounded-full bg-[#1b153b] hover:bg-[#251e50] border border-[#342766] flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Play/Pause main button */}
        <button
          onClick={handleTogglePlay}
          className="w-13 h-13 p-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-neon-purple transition-all duration-200 transform hover:scale-105 active:scale-95"
          title={isRunning ? 'Pause' : 'Start'}
        >
          {isRunning ? (
            <Pause className="w-6 h-6 fill-white" />
          ) : (
            <Play className="w-6 h-6 fill-white ml-0.5" />
          )}
        </button>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="w-10 h-10 rounded-full bg-[#1b153b] hover:bg-[#251e50] border border-[#342766] flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95"
          title="Skip to next session"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Completion XP Note */}
      <div className="flex items-center justify-center space-x-1.5 pt-3 border-t border-[#281f4e] text-xs font-semibold text-amber-400">
        <Star className="w-3.5 h-3.5 fill-amber-400" />
        <span>+50 XP on completion</span>
      </div>
    </div>
  );
};
