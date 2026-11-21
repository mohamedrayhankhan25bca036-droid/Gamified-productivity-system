import React, { useState } from 'react';
import { ClipboardList, Check, Plus, Trash2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { AddTaskModal } from './AddTaskModal';

export const TodayTasks: React.FC = () => {
  const { tasks, toggleTask, deleteTask } = useGame();
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter tasks for today
  const todayTasks = tasks.slice(0, 5); // default 5 shown on dashboard
  const completedCount = tasks.filter((t) => t.is_completed).length;
  const totalCount = tasks.length;

  return (
    <div className="rounded-2xl bg-[#171233]/90 border border-[#312560] p-5 backdrop-blur-xl shadow-glass flex flex-col justify-between h-full">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-[#281f4e]">
          <div className="flex items-center space-x-2.5">
            <ClipboardList className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base md:text-lg text-white tracking-tight">
              Today's Tasks
            </h3>
          </div>
          <span className="text-xs md:text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            {completedCount} / {totalCount} Completed
          </span>
        </div>

        {/* Task List */}
        <div className="space-y-2.5">
          {todayTasks.map((task) => {
            const isDone = task.is_completed;
            return (
              <div
                key={task.id}
                className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 border ${
                  isDone
                    ? 'bg-[#120f26]/80 border-[#261e47] text-slate-400'
                    : 'bg-[#1c163d]/70 hover:bg-[#221c4a] border-[#342766] text-white hover:border-purple-500/50'
                }`}
              >
                {/* Left: Custom Checkbox & Title */}
                <div
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center space-x-3.5 flex-1 cursor-pointer select-none"
                >
                  {/* Styled Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-neon-green scale-105'
                        : 'border-2 border-slate-500 hover:border-purple-400 bg-transparent'
                    }`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  {/* Task Title */}
                  <span
                    className={`text-sm font-medium transition-all duration-200 ${
                      isDone
                        ? 'line-through text-slate-500 font-normal'
                        : 'text-slate-100 group-hover:text-white'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                {/* Right: XP Badge */}
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-md transition-all ${
                      isDone
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    +{task.xp_value} XP
                  </span>

                  {/* Quick delete on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-1"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Button */}
      <div className="pt-4 mt-2">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-2.5 px-4 rounded-xl border border-purple-500/40 bg-purple-600/15 hover:bg-purple-600/25 text-purple-300 hover:text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-neon-purple-sm active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};
