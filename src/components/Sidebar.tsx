import React from 'react';
import {
  Gamepad2,
  LayoutDashboard,
  CheckSquare,
  Clock,
  Trophy,
  Store,
  BarChart3,
  User,
  Settings,
  LogOut,
  Sparkles,
  Swords,
} from 'lucide-react';
import { useGame } from '../context/GameContext';

interface SidebarProps {
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const { activeTab, setActiveTab, stats } = useGame();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'focus_timer', label: 'Focus Timer', icon: Clock },
    { id: 'games', label: 'Quest Arcade', icon: Swords, badge: 'Play' },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'rewards_store', label: 'Rewards Store', icon: Store },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#0e0b1f]/95 border-r border-[#261f49] flex flex-col justify-between p-5 select-none relative z-20">
      <div>
        {/* Brand Logo Header */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center space-x-3 mb-8 cursor-pointer group px-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-violet-600 to-indigo-500 flex items-center justify-center shadow-neon-purple group-hover:scale-105 transition-transform duration-300">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
              <span>ProductivityQuest</span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 -mt-0.5 tracking-wide">
              Gamified Productivity System
            </p>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-neon-purple font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#1a153b]/80'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-300'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 font-black text-[10px] tracking-wider uppercase shadow-neon-gold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions: Settings & Logout */}
      <div className="pt-4 border-t border-[#261f49]/80 space-y-1.5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 text-left ${
                isActive
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-neon-purple font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-[#1a153b]/80'
              }`}
            >
              <Icon className="w-5 h-5 text-slate-400" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={onLogout || (() => setActiveTab('profile'))}
          className="w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
