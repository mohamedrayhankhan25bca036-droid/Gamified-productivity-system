import React, { useState } from 'react';
import { Clock, Star, Play, Pause, RotateCcw, SkipForward, CheckCircle2, History, Link as LinkIcon } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { FocusTimer } from '../components/FocusTimer';

export const FocusTimerView: React.FC = () => {
  const { sessions, tasks } = useGame();
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  const completedSessions = sessions.filter((s) => s.completed);
  const totalMinutes = Math.round(
    completedSessions.reduce((acc, curr) => acc + curr.duration_actual, 0) / 60
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Clock className="w-8 h-8 text-purple-400" />
          <span>Focus Sanctum</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Harness the Pomodoro technique to enter deep flow and earn +50 XP per focus cycle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Timer Display */}
        <div className="lg:col-span-7">
          <FocusTimer />
        </div>

        {/* Task Linkage & Focus Stats */}
        <div className="lg:col-span-5 space-y-6">
          {/* Link to Task Card (FR-TIMER-07) */}
          <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-5 backdrop-blur-xl shadow-glass">
            <h3 className="font-bold text-base text-white flex items-center gap-2 mb-3">
              <LinkIcon className="w-4 h-4 text-purple-400" />
              <span>Link Focus to Quest Task</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Optionally assign this focus session to an active task to stay committed.
            </p>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#100d26] border border-[#2e235a] text-white text-sm focus:outline-none focus:border-purple-500"
            >
              <option value="">-- No specific task linked --</option>
              {tasks
                .filter((t) => !t.is_completed)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} (+{t.xp_value} XP)
                  </option>
                ))}
            </select>
          </div>

          {/* Focus Stats Summary */}
          <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-5 backdrop-blur-xl shadow-glass grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#110d29] border border-[#271e4d] text-center">
              <div className="text-2xl font-black text-purple-300">
                {completedSessions.length}
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                Completed Sessions
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#110d29] border border-[#271e4d] text-center">
              <div className="text-2xl font-black text-amber-300">
                {totalMinutes}m
              </div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                Total Focus Time
              </div>
            </div>
          </div>

          {/* Session History Log */}
          <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-5 backdrop-blur-xl shadow-glass">
            <h3 className="font-bold text-base text-white flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-purple-400" />
              <span>Recent Focus Sessions</span>
            </h3>

            {sessions.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No sessions completed yet.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {sessions.slice(0, 5).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#110d29] border border-[#251c4a] text-xs"
                  >
                    <div>
                      <span className="font-bold text-white capitalize">{s.mode.replace('_', ' ')}</span>
                      <p className="text-[10px] text-slate-400">
                        {new Date(s.ended_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      +{s.xp_awarded} XP
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
