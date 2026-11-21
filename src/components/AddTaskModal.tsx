import React, { useState } from 'react';
import { X, Sparkles, PlusCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { TaskCategory, TaskPriority, TaskRecurrence } from '../types';

interface AddTaskModalProps {
  onClose: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose }) => {
  const { addTask } = useGame();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'custom'>('medium');
  const [customXp, setCustomXp] = useState(25);
  const [category, setCategory] = useState<TaskCategory>('Study');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [recurrence, setRecurrence] = useState<TaskRecurrence>('none');
  const [dueDate, setDueDate] = useState('2026-11-20');

  const getXpValue = () => {
    switch (difficulty) {
      case 'easy':
        return 15;
      case 'medium':
        return 25;
      case 'hard':
        return 40;
      case 'custom':
        return customXp;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      xp_value: getXpValue(),
      category,
      priority,
      recurrence,
      due_date: dueDate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#181335] border border-[#3b2d6e] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2b2157] relative z-10">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-extrabold text-white">Create New Quest Task</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#251e50] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Complete Operating Systems Assignment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#110d29] border border-[#312560] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add key notes, steps, or resources..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#110d29] border border-[#312560] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm resize-none"
            />
          </div>

          {/* Difficulty / XP Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Quest Difficulty & XP
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setDifficulty('easy')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  difficulty === 'easy'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-neon-green'
                    : 'bg-[#110d29] border-[#312560] text-slate-400 hover:text-white'
                }`}
              >
                Easy (+15 XP)
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('medium')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  difficulty === 'medium'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-neon-gold'
                    : 'bg-[#110d29] border-[#312560] text-slate-400 hover:text-white'
                }`}
              >
                Medium (+25 XP)
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('hard')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  difficulty === 'hard'
                    ? 'bg-purple-600/30 border-purple-400 text-purple-300 shadow-neon-purple-sm'
                    : 'bg-[#110d29] border-[#312560] text-slate-400 hover:text-white'
                }`}
              >
                Hard (+40 XP)
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('custom')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  difficulty === 'custom'
                    ? 'bg-indigo-600/30 border-indigo-400 text-indigo-300 shadow-neon-purple-sm'
                    : 'bg-[#110d29] border-[#312560] text-slate-400 hover:text-white'
                }`}
              >
                Custom
              </button>
            </div>
            {difficulty === 'custom' && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs text-slate-400">Custom XP:</span>
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={customXp}
                  onChange={(e) => setCustomXp(Number(e.target.value))}
                  className="w-24 px-2 py-1 rounded-lg bg-[#110d29] border border-[#312560] text-white text-xs font-bold"
                />
              </div>
            )}
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 rounded-xl bg-[#110d29] border border-[#312560] text-white text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="Study">Study</option>
                <option value="Work">Work</option>
                <option value="Health">Health</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-xl bg-[#110d29] border border-[#312560] text-white text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Recurrence & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Recurrence
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as TaskRecurrence)}
                className="w-full px-3 py-2 rounded-xl bg-[#110d29] border border-[#312560] text-white text-sm focus:outline-none focus:border-purple-500"
              >
                <option value="none">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#110d29] border border-[#312560] text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#2b2157]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#251e50] text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-neon-purple flex items-center space-x-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Quest Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
