import React, { useState } from 'react';
import { User, Crown, Shield, Mail, Key, Sparkles, Check } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const ProfileView: React.FC = () => {
  const { user, stats, updateProfile } = useGame();
  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title);
  const [avatar, setAvatar] = useState(user.avatar);
  const [email, setEmail] = useState(user.email);
  const [isSaved, setIsSaved] = useState(false);

  const avatarOptions = [
    { label: 'Rayhan (Anime Hero)', path: '/assets/avatar.png' },
    { label: 'Cyber Ninja', path: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80' },
    { label: 'Mage Scholar', path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { label: 'Shadow Knight', path: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, title, avatar);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <User className="w-8 h-8 text-purple-400" />
          <span>Hero Profile</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Customize your adventurer identity, avatar portrait, and titles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left: Avatar Preview Card */}
        <div className="p-6 rounded-2xl bg-[#171233]/90 border border-[#312560] backdrop-blur-xl shadow-glass flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="absolute -top-2.5 -left-1.5 z-20 bg-amber-400 text-amber-950 p-1 rounded-full shadow-neon-gold border border-amber-200">
              <Crown className="w-4 h-4 fill-amber-950" />
            </div>
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-indigo-500 shadow-neon-purple">
              <img
                src={avatar || '/assets/avatar.png'}
                alt={name}
                className="w-full h-full rounded-full object-cover bg-[#100d26]"
              />
            </div>
          </div>

          <h2 className="text-xl font-black text-white">{name}</h2>
          <p className="text-xs font-semibold text-purple-300 mt-0.5">{title}</p>
          <div className="mt-3 px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-200 text-xs font-bold">
            Level {stats.level}
          </div>

          <div className="w-full pt-4 mt-5 border-t border-[#291f52] grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 bg-[#100d26] rounded-xl border border-[#271e4d]">
              <span className="text-slate-400 block text-[10px]">COINS</span>
              <span className="font-bold text-amber-300">{stats.coins.toLocaleString()}</span>
            </div>
            <div className="p-2 bg-[#100d26] rounded-xl border border-[#271e4d]">
              <span className="text-slate-400 block text-[10px]">STREAK</span>
              <span className="font-bold text-orange-400">{stats.current_streak} Days</span>
            </div>
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-[#171233]/90 border border-[#312560] backdrop-blur-xl shadow-glass">
          <h3 className="text-lg font-bold text-white mb-4">Adventurer Credentials</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Hero Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100d26] border border-[#2e235a] text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Title / Rank
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100d26] border border-[#2e235a] text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Choose Avatar Portrait
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {avatarOptions.map((opt) => (
                  <button
                    key={opt.path}
                    type="button"
                    onClick={() => setAvatar(opt.path)}
                    className={`flex items-center space-x-3 p-2 rounded-xl border text-left transition-all ${
                      avatar === opt.path
                        ? 'border-purple-500 bg-purple-600/20 shadow-neon-purple-sm'
                        : 'border-[#2e235a] bg-[#100d26] hover:border-slate-500'
                    }`}
                  >
                    <img src={opt.path} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-xs font-medium text-slate-200 truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#100d26] border border-[#2e235a] text-slate-300 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    defaultValue="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#100d26] border border-[#2e235a] text-slate-300 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#291f52]">
              {isSaved ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Profile saved successfully!
                </span>
              ) : (
                <span />
              )}
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-neon-purple transition-all"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
