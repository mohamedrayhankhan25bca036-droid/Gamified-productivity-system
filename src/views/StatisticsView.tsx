import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Flame,
  Download,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useGame } from '../context/GameContext';

export const StatisticsView: React.FC = () => {
  const { stats, tasks, sessions, transactions, exportCsvData } = useGame();
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  // Daily Tasks Completion Data
  const taskChartData = [
    { day: 'Mon', completed: 4, planned: 5 },
    { day: 'Tue', completed: 5, planned: 5 },
    { day: 'Wed', completed: 3, planned: 4 },
    { day: 'Thu', completed: 5, planned: 5 },
    { day: 'Fri', completed: 6, planned: 6 },
    { day: 'Sat', completed: 4, planned: 5 },
    { day: 'Sun', completed: 3, planned: 5 },
  ];

  // Focus Minutes per Day
  const focusChartData = [
    { day: 'Mon', minutes: 75 },
    { day: 'Tue', minutes: 100 },
    { day: 'Wed', minutes: 50 },
    { day: 'Thu', minutes: 125 },
    { day: 'Fri', minutes: 150 },
    { day: 'Sat', minutes: 60 },
    { day: 'Sun', minutes: 90 },
  ];

  // XP Growth Trend Data
  const xpGrowthData = [
    { day: 'Nov 14', xp: 22000 },
    { day: 'Nov 15', xp: 23100 },
    { day: 'Nov 16', xp: 24450 },
    { day: 'Nov 17', xp: 25600 },
    { day: 'Nov 18', xp: 26800 },
    { day: 'Nov 19', xp: 27750 },
    { day: 'Nov 20', xp: stats.total_xp },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            <span>Productivity Analytics & Ledger</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track your focus consistency, level milestones, and XP progression.
          </p>
        </div>

        {/* CSV Export Button (FR-STAT-06) */}
        <button
          onClick={exportCsvData}
          className="px-4 py-2.5 rounded-xl bg-[#1d173d] hover:bg-[#271e54] border border-[#3b2d6e] text-purple-300 hover:text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#171233]/90 border border-[#312560] backdrop-blur-xl shadow-glass flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{tasks.length}</div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Total Quests</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#171233]/90 border border-[#312560] backdrop-blur-xl shadow-glass flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">
              {stats.current_streak} / {stats.longest_streak}
            </div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Current / Max Streak</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#171233]/90 border border-[#312560] backdrop-blur-xl shadow-glass flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{sessions.length}</div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Focus Cycles</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#171233]/90 border border-[#312560] backdrop-blur-xl shadow-glass flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{stats.total_xp.toLocaleString()}</div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Lifetime XP</div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Completed Bar Chart (FR-STAT-01) */}
        <div className="p-6 rounded-2xl bg-[#171233]/90 border border-[#312560] backdrop-blur-xl shadow-glass">
          <h3 className="font-bold text-base text-white mb-4">
            Tasks Completed vs Planned (Weekly)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#251e4d" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161136',
                    borderColor: '#372a69',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="planned" fill="#2d2257" radius={[4, 4, 0, 0]} name="Planned" />
                <Bar dataKey="completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Focus Time Minutes Bar Chart (FR-STAT-02) */}
        <div className="p-6 rounded-2xl bg-[#171233]/90 border border-[#312560] backdrop-blur-xl shadow-glass">
          <h3 className="font-bold text-base text-white mb-4">
            Focus Minutes Per Day
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#251e4d" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161136',
                    borderColor: '#372a69',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="minutes" fill="#ec4899" radius={[4, 4, 0, 0]} name="Minutes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* XP Progression Area Chart (FR-STAT-03) */}
        <div className="p-6 rounded-2xl bg-[#171233]/90 border border-[#312560] backdrop-blur-xl shadow-glass lg:col-span-2">
          <h3 className="font-bold text-base text-white mb-4">
            Cumulative XP Growth & Level Momentum
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={xpGrowthData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#251e4d" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161136',
                    borderColor: '#372a69',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke="#a855f7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#xpAreaGrad)"
                  name="Total XP"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transaction History Ledger (FR-GAME-06) */}
      <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-6 backdrop-blur-xl shadow-glass">
        <h3 className="font-bold text-lg text-white mb-4">
          XP & Coin Transaction Ledger
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#281f4f] text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 px-3">Date / Time</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">Amount</th>
                <th className="pb-3 px-3">Source</th>
                <th className="pb-3 px-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#231a44]">
              {transactions.slice(0, 8).map((tx) => (
                <tr key={tx.id} className="hover:bg-[#1a143d]/60">
                  <td className="py-3 px-3 text-slate-300 font-mono">
                    {new Date(tx.created_at).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        tx.type === 'XP'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold">
                    <span className={tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    </span>
                  </td>
                  <td className="py-3 px-3 uppercase text-slate-400 font-semibold text-[10px]">
                    {tx.source}
                  </td>
                  <td className="py-3 px-3 text-slate-200">{tx.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
