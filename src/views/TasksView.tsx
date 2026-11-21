import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  Plus,
  Trash2,
  Check,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { AddTaskModal } from '../components/AddTaskModal';
import { TaskCategory, TaskPriority } from '../types';

export const TasksView: React.FC = () => {
  const { tasks, toggleTask, deleteTask } = useGame();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredTasks = tasks.filter((task) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    // Status filter
    if (statusFilter === 'completed' && !task.is_completed) return false;
    if (statusFilter === 'today') {
      if (task.due_date !== '2026-11-20') return false;
    }
    if (statusFilter === 'upcoming') {
      if (task.due_date <= '2026-11-20' && !task.is_completed) return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

    // Priority filter
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

    return true;
  });

  const completedCount = tasks.filter((t) => t.is_completed).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-purple-400" />
            <span>Task Quests & Habits</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your daily tasks, earn XP, and level up your discipline.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-neon-purple flex items-center space-x-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Quest Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-4 backdrop-blur-xl shadow-glass space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search quests by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#100d26] border border-[#2e235a] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
            {(['all', 'today', 'upcoming', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                  statusFilter === tab
                    ? 'bg-purple-600 text-white shadow-neon-purple-sm'
                    : 'bg-[#100d26] text-slate-400 hover:text-white border border-[#2e235a]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Priority dropdown filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#251d4e]">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#100d26] border border-[#2e235a] text-slate-200 text-xs focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Study">Study</option>
              <option value="Work">Work</option>
              <option value="Health">Health</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-[#100d26] border border-[#2e235a] text-slate-200 text-xs focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <div className="ml-auto text-xs font-semibold text-purple-300">
            Showing {filteredTasks.length} of {tasks.length} tasks ({completedCount} completed)
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl bg-[#171233]/70 border border-[#2b2053] p-12 text-center">
            <Sparkles className="w-12 h-12 text-purple-400/60 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Quests Found</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
              No tasks match your current filter criteria. Create a new quest or adjust filters.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.is_completed;
            return (
              <div
                key={task.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all duration-200 gap-3 ${
                  isDone
                    ? 'bg-[#120f26]/80 border-[#261e47] text-slate-400'
                    : 'bg-[#171233]/90 hover:bg-[#1e1742] border-[#312560] text-white shadow-glass hover:border-purple-500/40'
                }`}
              >
                {/* Left check & info */}
                <div
                  onClick={() => toggleTask(task.id)}
                  className="flex items-start space-x-4 cursor-pointer select-none flex-1"
                >
                  <div
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-neon-green'
                        : 'border-2 border-slate-500 hover:border-purple-400 bg-transparent'
                    }`}
                  >
                    {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="space-y-1">
                    <h3
                      className={`text-base font-bold transition-colors ${
                        isDone ? 'line-through text-slate-500 font-normal' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#110d29] border border-[#2c2157] text-purple-300">
                        {task.category}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          task.priority === 'High'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : task.priority === 'Medium'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-700/40 text-slate-400 border border-slate-600/30'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>Due {task.due_date}</span>
                      </span>
                      {task.recurrence !== 'none' && (
                        <span className="text-[11px] font-medium text-indigo-300 bg-indigo-500/15 px-1.5 py-0.5 rounded">
                          ↻ {task.recurrence}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right badges & delete */}
                <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#281f4f]">
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-lg ${
                      isDone
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    +{task.xp_value} XP
                  </span>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete quest task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};
