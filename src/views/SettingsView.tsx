import React, { useState } from 'react';
import { Settings, Clock, Volume2, Bell, Globe, Target, ShieldAlert, Check } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useGame();
  const [pomodoroMinutes, setPomodoroMinutes] = useState(settings.pomodoro_minutes);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(settings.short_break_minutes);
  const [longBreakMinutes, setLongBreakMinutes] = useState(settings.long_break_minutes);
  const [soundEnabled, setSoundEnabled] = useState(settings.sound_enabled);
  const [soundVolume, setSoundVolume] = useState(settings.sound_volume);
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notifications_enabled);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [dailyGoalTarget, setDailyGoalTarget] = useState(settings.daily_goal_tasks_target);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      pomodoro_minutes: Number(pomodoroMinutes),
      short_break_minutes: Number(shortBreakMinutes),
      long_break_minutes: Number(longBreakMinutes),
      sound_enabled: soundEnabled,
      sound_volume: Number(soundVolume),
      notifications_enabled: notificationsEnabled,
      timezone,
      daily_goal_tasks_target: Number(dailyGoalTarget),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-purple-400" />
          <span>System Settings & Config</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Customize gamification rules, timer intervals, sounds, and goal targets.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Pomodoro Timer Config */}
        <div className="p-6 rounded-2xl bg-[#171233]/90 border border-[#312560] backdrop-blur-xl shadow-glass">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple-400" />
            <span>Focus Timer Durations (Minutes)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Focus Session (Pomodoro)
              </label>
              <input
                type="number"
                min="5"
                max="90"
                value={pomodoroMinutes}
                onChange={(e) => setPomodoroMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#100d26] border border-[#2e235a] text-white text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Short Break
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={shortBreakMinutes}
                onChange={(e) => setShortBreakMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#100d26] border border-[#2e235a] text-white text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Long Break
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={longBreakMinutes}
                onChange={(e) => setLongBreakMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#100d26] border border-[#2e235a] text-white text-sm font-bold"
              />
            </div>
          </div>
        </div>

        {/* Audio & Notifications Config */}
        <div className="p-6 rounded-2xl bg-[#171233]/90 border border-[#312560] backdrop-blur-xl shadow-glass grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sound settings */}
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 mb-3">
              <Volume2 className="w-5 h-5 text-amber-400" />
              <span>Audio & Game Chimes</span>
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-slate-300">Enable synthesized 8-bit sound fx</span>
              </label>

              {soundEnabled && (
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Volume</span>
                    <span>{Math.round(soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Goal & Timezone */}
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-rose-400" />
              <span>Daily Goal Target & Timezone</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Daily Tasks Target Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={dailyGoalTarget}
                  onChange={(e) => setDailyGoalTarget(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#100d26] border border-[#2e235a] text-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#100d26] border border-[#2e235a] text-white text-xs"
                >
                  <option value="UTC+5:30">UTC+5:30 (India Standard Time)</option>
                  <option value="UTC+0:00">UTC+0:00 (London, GMT)</option>
                  <option value="UTC-5:00">UTC-5:00 (New York, EST)</option>
                  <option value="UTC-8:00">UTC-8:00 (San Francisco, PST)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          {savedSuccess && (
            <span className="text-sm text-emerald-400 font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4 stroke-[3]" /> Settings applied!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-neon-purple transition-all"
          >
            Save All Preferences
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Data (FR-PROF-05) */}
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 backdrop-blur-xl mt-10">
        <h3 className="text-base font-extrabold text-rose-400 flex items-center gap-2 mb-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>Danger Zone: Reset Account Data</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          This will reset tasks, XP progress, coins, and focus logs back to the default demo state.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all data back to the default demo state?')) {
              resetAllData();
            }
          }}
          className="px-4 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/50 text-rose-200 text-xs font-bold transition-all"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
};
