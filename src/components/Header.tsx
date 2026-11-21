import React from 'react';
import { Calendar } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const Header: React.FC = () => {
  const { user } = useGame();

  // FR-DASH-01: Time-based greeting (Morning/Afternoon/Evening)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Format today's date matching screenshot: "Thu, Nov 20, 2026"
  const getFormattedDate = () => {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  };

  const firstName = user.name.split(' ')[0] || 'Warrior';

  return (
    <header className="relative w-full rounded-2xl overflow-hidden mb-6 min-h-[140px] flex items-center justify-between px-7 py-6">
      {/* Background artwork: Fantasy castle + warrior banner */}
      <div 
        className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-80 pointer-events-none"
        style={{
          backgroundImage: `url('/assets/castle_banner.png')`,
          maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,1) 60%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,1) 60%)'
        }}
      />
      {/* Ambient gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0918] via-[#0f0b27]/80 to-transparent pointer-events-none" />

      {/* Greeting and subtitle */}
      <div className="relative z-10 max-w-xl">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2 drop-shadow-md">
          <span>{getGreeting()}, {firstName}!</span>
          <span className="inline-block hover:animate-bounce cursor-default">👋</span>
        </h1>
        <p className="text-slate-300 text-sm md:text-base mt-1.5 font-medium tracking-wide drop-shadow">
          Complete tasks, earn XP, level up, and build better habits.
        </p>
      </div>

      {/* Top right Date Pill */}
      <div className="relative z-10 flex items-center self-start">
        <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1d173d]/80 border border-[#372b66] backdrop-blur-md text-slate-200 text-xs md:text-sm font-semibold shadow-lg">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>{getFormattedDate()}</span>
        </div>
      </div>
    </header>
  );
};
