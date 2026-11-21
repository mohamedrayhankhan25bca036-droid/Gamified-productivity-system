import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  PlayerStats,
  Task,
  FocusSession,
  Quest,
  Achievement,
  Reward,
  RewardRedemption,
  Transaction,
  UserSettings,
  ToastMessage,
  TaskPriority,
  TaskCategory,
  TaskRecurrence,
  TimerMode,
} from '../types';
import { soundFX } from '../utils/audio';

interface GameContextType {
  user: User;
  stats: PlayerStats;
  tasks: Task[];
  quests: Quest[];
  achievements: Achievement[];
  rewards: Reward[];
  redemptions: RewardRedemption[];
  sessions: FocusSession[];
  transactions: Transaction[];
  settings: UserSettings;
  toasts: ToastMessage[];
  levelUpModal: { show: boolean; newLevel: number; oldLevel: number; excessXp: number } | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  // Actions
  toggleTask: (taskId: string) => void;
  addTask: (task: { title: string; xp_value: number; description?: string; category: TaskCategory; priority: TaskPriority; recurrence: TaskRecurrence; due_date: string }) => void;
  deleteTask: (taskId: string) => void;
  editTask: (taskId: string, updates: Partial<Task>) => void;
  completeFocusSession: (mode: TimerMode, durationSeconds: number, taskId?: string) => void;
  redeemReward: (rewardId: string) => { success: boolean; message: string };
  claimOrUseRedemption: (redemptionId: string) => void;
  addCustomReward: (name: string, icon: string, cost_coins: number, category?: string) => void;
  deleteReward: (rewardId: string) => void;
  dismissToast: (id: string) => void;
  closeLevelUpModal: () => void;
  updateProfile: (name: string, title: string, avatar: string) => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  resetAllData: () => void;
  exportCsvData: () => void;
  // Game Zone Integration
  spendToken: (cost?: number) => boolean;
  buyTokensWithCoins: (count?: number) => boolean;
  awardGameReward: (xp: number, coins: number, sourceGame: string, bonusDescription?: string) => void;
  recordBossKill: () => void;
  updateRunnerHighScore: (score: number) => void;
  updateMemoryBestScore: (score: number) => void;
  addStreakFreeze: (count?: number) => void;
}

const STORAGE_KEY = 'PRODUCTIVITY_QUEST_DATA_V2';

const INITIAL_USER: User = {
  id: 'user-rayhan',
  name: 'Rayhan Khaan',
  email: 'rayhan.khaan@quest.dev',
  avatar: '/assets/avatar.png',
  title: 'Productivity Warrior',
  timezone: 'UTC+5:30',
  created_at: '2026-11-01T00:00:00.000Z',
};

const INITIAL_STATS: PlayerStats = {
  user_id: 'user-rayhan',
  level: 7,
  current_xp: 3420,
  next_level_xp: 5000,
  total_xp: 28420,
  coins: 1250,
  current_streak: 12,
  longest_streak: 16,
  daily_goal_percent: 86,
  last_active_date: '2026-11-20',
  tokens: 5, // 5 arcade tokens ready to play!
  streak_freezes: 1,
  boss_kills: 2,
  runner_high_score: 140,
  memory_best_score: 850,
};

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    user_id: 'user-rayhan',
    title: 'Attend OS Class',
    description: 'Operating systems lecture on memory paging and virtual memory',
    xp_value: 20,
    coins_value: 20,
    category: 'Study',
    priority: 'High',
    due_date: '2026-11-20',
    is_completed: true,
    completed_at: '2026-11-20T09:30:00.000Z',
    recurrence: 'daily',
  },
  {
    id: 'task-2',
    user_id: 'user-rayhan',
    title: 'Complete ML Practical',
    description: 'Implement backpropagation neural network notebook',
    xp_value: 40,
    coins_value: 40,
    category: 'Study',
    priority: 'High',
    due_date: '2026-11-20',
    is_completed: true,
    completed_at: '2026-11-20T11:15:00.000Z',
    recurrence: 'none',
  },
  {
    id: 'task-3',
    user_id: 'user-rayhan',
    title: 'Study for 1 Hour',
    description: 'Algorithms and Data Structures review',
    xp_value: 30,
    coins_value: 30,
    category: 'Study',
    priority: 'Medium',
    due_date: '2026-11-20',
    is_completed: true,
    completed_at: '2026-11-20T13:45:00.000Z',
    recurrence: 'daily',
  },
  {
    id: 'task-4',
    user_id: 'user-rayhan',
    title: 'Go to Gym (30 mins)',
    description: 'Chest & core workout routine',
    xp_value: 25,
    coins_value: 25,
    category: 'Health',
    priority: 'Medium',
    due_date: '2026-11-20',
    is_completed: false,
    completed_at: null,
    recurrence: 'daily',
  },
  {
    id: 'task-5',
    user_id: 'user-rayhan',
    title: 'Read 10 Pages',
    description: 'Atomic Habits by James Clear',
    xp_value: 15,
    coins_value: 15,
    category: 'Personal',
    priority: 'Low',
    due_date: '2026-11-20',
    is_completed: false,
    completed_at: null,
    recurrence: 'daily',
  },
];

const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest-daily',
    type: 'daily',
    title: 'Complete 5 tasks today',
    target_count: 5,
    current_count: 3,
    xp_reward: 100,
    is_completed: false,
    rewarded: false,
  },
  {
    id: 'quest-weekly',
    type: 'weekly',
    title: 'Stay productive for 7 days',
    target_count: 7,
    current_count: 5,
    xp_reward: 300,
    is_completed: false,
    rewarded: false,
  },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    name: 'First Task',
    description: 'Complete your first ever productivity quest',
    icon: 'star',
    badge_color: 'gold',
    condition_type: 'task_count',
    condition_value: 1,
    xp_reward: 50,
    coins_reward: 50,
    unlocked: true,
    unlocked_at: '2026-11-01T10:00:00.000Z',
  },
  {
    id: 'ach-2',
    name: '3-Day Streak',
    description: 'Maintain your productivity streak for 3 consecutive days',
    icon: 'flame',
    badge_color: 'flame',
    condition_type: 'streak_days',
    condition_value: 3,
    xp_reward: 100,
    coins_reward: 75,
    unlocked: true,
    unlocked_at: '2026-11-04T12:00:00.000Z',
  },
  {
    id: 'ach-3',
    name: 'Week Warrior',
    description: 'Achieve a 7-day uninterrupted streak',
    icon: 'calendar',
    badge_color: 'purple',
    condition_type: 'streak_days',
    condition_value: 7,
    xp_reward: 250,
    coins_reward: 150,
    unlocked: true,
    unlocked_at: '2026-11-08T18:00:00.000Z',
  },
  {
    id: 'ach-4',
    name: 'Focus Master',
    description: 'Complete 10 focused Pomodoro sessions',
    icon: 'target',
    badge_color: 'cyan',
    condition_type: 'focus_count',
    condition_value: 10,
    xp_reward: 200,
    coins_reward: 100,
    unlocked: true,
    unlocked_at: '2026-11-15T16:20:00.000Z',
  },
  {
    id: 'ach-5',
    name: 'Task Slayer',
    description: 'Complete 50 tasks across all categories',
    icon: 'lock',
    badge_color: 'emerald',
    condition_type: 'task_count',
    condition_value: 50,
    xp_reward: 500,
    coins_reward: 300,
    unlocked: false,
    unlocked_at: null,
  },
  {
    id: 'ach-6',
    name: 'Dragon Slayer',
    description: 'Vanquish a Boss in the Dungeon Raid',
    icon: 'swords',
    badge_color: 'flame',
    condition_type: 'game_wins',
    condition_value: 1,
    xp_reward: 350,
    coins_reward: 200,
    unlocked: true,
    unlocked_at: '2026-11-18T14:30:00.000Z',
  },
  {
    id: 'ach-7',
    name: 'Arcade Legend',
    description: 'Score over 200 in Cyber Runner or solve Memory Matrix under 30s',
    icon: 'gamepad',
    badge_color: 'purple',
    condition_type: 'game_wins',
    condition_value: 5,
    xp_reward: 400,
    coins_reward: 250,
    unlocked: false,
    unlocked_at: null,
  },
];

const INITIAL_REWARDS: Reward[] = [
  {
    id: 'rew-1',
    user_id: 'user-rayhan',
    name: '30 min Gaming',
    icon: 'gamepad',
    cost_coins: 100,
    is_active: true,
    category: 'Entertainment',
  },
  {
    id: 'rew-2',
    user_id: 'user-rayhan',
    name: 'Movie Night',
    icon: 'popcorn',
    cost_coins: 300,
    is_active: true,
    category: 'Entertainment',
  },
  {
    id: 'rew-3',
    user_id: 'user-rayhan',
    name: 'Favourite Snack',
    icon: 'pizza',
    cost_coins: 150,
    is_active: true,
    category: 'Food',
  },
  {
    id: 'rew-4',
    user_id: 'user-rayhan',
    name: 'Streak Freeze Shield',
    icon: 'shield',
    cost_coins: 250,
    is_active: true,
    category: 'Protection',
  },
  {
    id: 'rew-5',
    user_id: 'user-rayhan',
    name: '5x Arcade Game Tokens',
    icon: 'sparkles',
    cost_coins: 200,
    is_active: true,
    category: 'Gaming',
  },
];

const INITIAL_SETTINGS: UserSettings = {
  pomodoro_minutes: 25,
  short_break_minutes: 5,
  long_break_minutes: 15,
  sessions_before_long_break: 4,
  sound_enabled: true,
  sound_volume: 0.6,
  notifications_enabled: true,
  timezone: 'UTC+5:30',
  daily_goal_tasks_target: 5,
  theme_accent: 'purple',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_USER`);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [stats, setStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_STATS`);
    return saved ? { ...INITIAL_STATS, ...JSON.parse(saved) } : INITIAL_STATS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_TASKS`);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_QUESTS`);
    return saved ? JSON.parse(saved) : INITIAL_QUESTS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ACHIEVEMENTS`);
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_REWARDS`);
    return saved ? JSON.parse(saved) : INITIAL_REWARDS;
  });

  const [redemptions, setRedemptions] = useState<RewardRedemption[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_REDEMPTIONS`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'red-1',
        user_id: 'user-rayhan',
        reward_id: 'rew-1',
        reward_name: '30 min Gaming',
        reward_icon: 'gamepad',
        cost: 100,
        redeemed_at: '2026-11-19T20:00:00.000Z',
        status: 'used',
      }
    ];
  });

  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_SESSIONS`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'sess-1',
        user_id: 'user-rayhan',
        mode: 'pomodoro',
        duration_planned: 1500,
        duration_actual: 1500,
        completed: true,
        xp_awarded: 50,
        started_at: '2026-11-20T10:00:00.000Z',
        ended_at: '2026-11-20T10:25:00.000Z',
      }
    ];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_TRANSACTIONS`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'tx-1',
        user_id: 'user-rayhan',
        type: 'XP',
        amount: 20,
        source: 'task',
        description: 'Completed Attend OS Class',
        created_at: '2026-11-20T09:30:00.000Z',
      },
      {
        id: 'tx-2',
        user_id: 'user-rayhan',
        type: 'COIN',
        amount: 20,
        source: 'task',
        description: 'Completed Attend OS Class',
        created_at: '2026-11-20T09:30:00.000Z',
      },
      {
        id: 'tx-3',
        user_id: 'user-rayhan',
        type: 'XP',
        amount: 50,
        source: 'session',
        description: 'Completed 25m Focus Session',
        created_at: '2026-11-20T10:25:00.000Z',
      }
    ];
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_SETTINGS`);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [levelUpModal, setLevelUpModal] = useState<{ show: boolean; newLevel: number; oldLevel: number; excessXp: number } | null>(null);

  // Sync settings with audio singleton
  useEffect(() => {
    soundFX.enabled = settings.sound_enabled;
    soundFX.volume = settings.sound_volume;
  }, [settings.sound_enabled, settings.sound_volume]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_USER`, JSON.stringify(user));
    localStorage.setItem(`${STORAGE_KEY}_STATS`, JSON.stringify(stats));
    localStorage.setItem(`${STORAGE_KEY}_TASKS`, JSON.stringify(tasks));
    localStorage.setItem(`${STORAGE_KEY}_QUESTS`, JSON.stringify(quests));
    localStorage.setItem(`${STORAGE_KEY}_ACHIEVEMENTS`, JSON.stringify(achievements));
    localStorage.setItem(`${STORAGE_KEY}_REWARDS`, JSON.stringify(rewards));
    localStorage.setItem(`${STORAGE_KEY}_REDEMPTIONS`, JSON.stringify(redemptions));
    localStorage.setItem(`${STORAGE_KEY}_SESSIONS`, JSON.stringify(sessions));
    localStorage.setItem(`${STORAGE_KEY}_TRANSACTIONS`, JSON.stringify(transactions));
    localStorage.setItem(`${STORAGE_KEY}_SETTINGS`, JSON.stringify(settings));
  }, [user, stats, tasks, quests, achievements, rewards, redemptions, sessions, transactions, settings]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const checkLevelUp = (currentXp: number, currentLevel: number): { newLevel: number; newXp: number; leveledUp: boolean; excessXp: number } => {
    let lvl = currentLevel;
    let xp = currentXp;
    let leveledUp = false;
    let excess = 0;

    const threshold = 5000;
    while (xp >= threshold) {
      excess = xp - threshold;
      lvl += 1;
      xp = excess;
      leveledUp = true;
    }

    return { newLevel: lvl, newXp: xp, leveledUp, excessXp: excess };
  };

  const getTitleForLevel = (level: number): string => {
    if (level < 3) return 'Novice Explorer';
    if (level < 6) return 'Apprentice Adventurer';
    if (level < 10) return 'Productivity Warrior';
    if (level < 15) return 'Master of Discipline';
    if (level < 20) return 'Grandmaster Task Slayer';
    return 'Mythic Champion';
  };

  const awardXpAndCoins = (xpAmount: number, coinAmount: number, source: 'task' | 'session' | 'quest' | 'achievement' | 'game', desc: string) => {
    setStats((prev) => {
      const targetXp = prev.current_xp + xpAmount;
      const { newLevel, newXp, leveledUp, excessXp } = checkLevelUp(targetXp, prev.level);

      if (leveledUp) {
        soundFX.playLevelUp();
        confetti({
          particleCount: 130,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#ec4899', '#fbbf24', '#3b82f6', '#10b981'],
        });
        setLevelUpModal({
          show: true,
          oldLevel: prev.level,
          newLevel,
          excessXp,
        });
        addToast({
          type: 'level_up',
          title: 'LEVEL UP!',
          message: `Congratulations! You ascended to Level ${newLevel}!`,
          amount: newLevel,
        });
      }

      const newTitle = getTitleForLevel(newLevel);
      if (newTitle !== user.title) {
        setUser((u) => ({ ...u, title: newTitle }));
      }

      return {
        ...prev,
        level: newLevel,
        current_xp: newXp,
        total_xp: prev.total_xp + xpAmount,
        coins: Math.max(0, prev.coins + coinAmount),
      };
    });

    const newTx: Transaction[] = [];
    if (xpAmount !== 0) {
      newTx.push({
        id: `tx-${Date.now()}-xp`,
        user_id: user.id,
        type: 'XP',
        amount: xpAmount,
        source,
        description: desc,
        created_at: new Date().toISOString(),
      });
    }
    if (coinAmount !== 0) {
      newTx.push({
        id: `tx-${Date.now()}-coin`,
        user_id: user.id,
        type: 'COIN',
        amount: coinAmount,
        source,
        description: desc,
        created_at: new Date().toISOString(),
      });
    }

    if (newTx.length > 0) {
      setTransactions((prev) => [...newTx, ...prev]);
    }
  };

  const updateDailyGoal = (updatedTasks: Task[]) => {
    const total = updatedTasks.length;
    const completed = updatedTasks.filter((t) => t.is_completed).length;
    const baseTaskPercent = total > 0 ? (completed / total) * 70 : 0;
    const focusBoost = 16;
    const calculatedGoal = Math.min(100, Math.round(baseTaskPercent + focusBoost));

    setStats((prev) => ({
      ...prev,
      daily_goal_percent: calculatedGoal,
    }));
  };

  // Toggle task completion (Awards XP, coins, AND 1 Arcade Token!)
  const toggleTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const willBeCompleted = !task.is_completed;
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          is_completed: willBeCompleted,
          completed_at: willBeCompleted ? new Date().toISOString() : null,
        };
      }
      return t;
    });

    setTasks(updatedTasks);
    updateDailyGoal(updatedTasks);

    if (willBeCompleted) {
      soundFX.playTaskComplete();
      soundFX.playCoin();
      awardXpAndCoins(task.xp_value, task.coins_value, 'task', `Completed task: ${task.title}`);
      
      // Award 1 Game Token per completed task!
      setStats((prev) => ({
        ...prev,
        tokens: prev.tokens + 1,
      }));

      addToast({
        type: 'xp',
        title: 'Task Completed!',
        message: `+${task.xp_value} XP, +${task.coins_value} Coins, & +1 Arcade Token!`,
        amount: task.xp_value,
      });

      // Update quests
      setQuests((prevQuests) =>
        prevQuests.map((q) => {
          if (q.type === 'daily' && !q.is_completed) {
            const nextCount = q.current_count + 1;
            const completedNow = nextCount >= q.target_count;
            if (completedNow && !q.rewarded) {
              soundFX.playAchievement();
              setTimeout(() => {
                awardXpAndCoins(q.xp_reward, 50, 'quest', `Completed Daily Quest: ${q.title}`);
                addToast({
                  type: 'quest',
                  title: 'Daily Quest Complete!',
                  message: `All 5 tasks done! +${q.xp_reward} Bonus XP!`,
                  amount: q.xp_reward,
                });
              }, 400);
            }
            return {
              ...q,
              current_count: nextCount,
              is_completed: completedNow,
              rewarded: completedNow || q.rewarded,
            };
          }
          return q;
        })
      );

      checkAchievementsOnTaskComplete(updatedTasks);
    } else {
      awardXpAndCoins(-task.xp_value, -task.coins_value, 'task', `Unchecked task: ${task.title}`);
      setStats((prev) => ({
        ...prev,
        tokens: Math.max(0, prev.tokens - 1),
      }));
      addToast({
        type: 'info',
        title: 'Task Unchecked',
        message: `-${task.xp_value} XP, -${task.coins_value} Coins, -1 Token reversed`,
      });

      setQuests((prevQuests) =>
        prevQuests.map((q) => {
          if (q.type === 'daily') {
            const nextCount = Math.max(0, q.current_count - 1);
            return {
              ...q,
              current_count: nextCount,
              is_completed: nextCount >= q.target_count,
            };
          }
          return q;
        })
      );
    }
  };

  const checkAchievementsOnTaskComplete = (updatedTasks: Task[]) => {
    const completedCount = updatedTasks.filter((t) => t.is_completed).length;
    setAchievements((prevAch) =>
      prevAch.map((ach) => {
        if (!ach.unlocked && ach.condition_type === 'task_count' && completedCount >= ach.condition_value) {
          soundFX.playAchievement();
          addToast({
            type: 'achievement',
            title: `Achievement Unlocked: ${ach.name}!`,
            message: `${ach.description} (+${ach.xp_reward} XP, +${ach.coins_reward} Coins)`,
            amount: ach.xp_reward,
          });
          awardXpAndCoins(ach.xp_reward, ach.coins_reward, 'achievement', `Achievement: ${ach.name}`);
          return { ...ach, unlocked: true, unlocked_at: new Date().toISOString() };
        }
        return ach;
      })
    );
  };

  const addTask = (newTaskData: {
    title: string;
    xp_value: number;
    description?: string;
    category: TaskCategory;
    priority: TaskPriority;
    recurrence: TaskRecurrence;
    due_date: string;
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      user_id: user.id,
      title: newTaskData.title,
      description: newTaskData.description || '',
      xp_value: newTaskData.xp_value,
      coins_value: newTaskData.xp_value,
      category: newTaskData.category,
      priority: newTaskData.priority,
      due_date: newTaskData.due_date,
      is_completed: false,
      completed_at: null,
      recurrence: newTaskData.recurrence,
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    updateDailyGoal(updated);
    addToast({
      type: 'info',
      title: 'Task Created',
      message: `"${newTask.title}" added (+${newTask.xp_value} XP)`,
    });
  };

  const deleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    updateDailyGoal(updated);
    addToast({
      type: 'info',
      title: 'Task Deleted',
      message: 'Task removed from your quest list',
    });
  };

  const editTask = (taskId: string, updates: Partial<Task>) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
    setTasks(updated);
    updateDailyGoal(updated);
  };

  // Focus Timer Session Completion (Awards +50 XP and +2 Game Tokens!)
  const completeFocusSession = (mode: TimerMode, durationSeconds: number, taskId?: string) => {
    const isPomodoro = mode === 'pomodoro';
    const xpAward = isPomodoro ? 50 : 0;
    const coinsAward = isPomodoro ? 25 : 0;

    const newSession: FocusSession = {
      id: `sess-${Date.now()}`,
      user_id: user.id,
      task_id: taskId,
      mode,
      duration_planned: durationSeconds,
      duration_actual: durationSeconds,
      completed: true,
      xp_awarded: xpAward,
      started_at: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      ended_at: new Date().toISOString(),
    };

    setSessions((prev) => [newSession, ...prev]);

    if (isPomodoro) {
      soundFX.playTimerComplete();
      awardXpAndCoins(xpAward, coinsAward, 'session', `Completed ${Math.round(durationSeconds / 60)}m Focus Session`);
      
      // Award 2 Tokens for completing deep focus!
      setStats((prev) => ({
        ...prev,
        tokens: prev.tokens + 2,
      }));

      addToast({
        type: 'xp',
        title: 'Focus Session Completed!',
        message: `Masterful focus! +${xpAward} XP, +${coinsAward} Coins, & +2 Arcade Tokens!`,
        amount: xpAward,
      });

      const totalPomodoros = sessions.filter((s) => s.mode === 'pomodoro' && s.completed).length + 1;
      setAchievements((prevAch) =>
        prevAch.map((ach) => {
          if (!ach.unlocked && ach.condition_type === 'focus_count' && totalPomodoros >= ach.condition_value) {
            soundFX.playAchievement();
            awardXpAndCoins(ach.xp_reward, ach.coins_reward, 'achievement', `Achievement: ${ach.name}`);
            addToast({
              type: 'achievement',
              title: `Achievement Unlocked: ${ach.name}!`,
              message: ach.description,
            });
            return { ...ach, unlocked: true, unlocked_at: new Date().toISOString() };
          }
          return ach;
        })
      );
    }
  };

  // Reward Redemption
  const redeemReward = (rewardId: string): { success: boolean; message: string } => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return { success: false, message: 'Reward not found' };

    if (stats.coins < reward.cost_coins) {
      addToast({
        type: 'info',
        title: 'Insufficient Coins',
        message: `You need ${reward.cost_coins - stats.coins} more coins to claim "${reward.name}"!`,
      });
      return {
        success: false,
        message: `Insufficient coins. You have ${stats.coins} but need ${reward.cost_coins}.`,
      };
    }

    // Check special items like Streak Freeze or 5x Game Tokens
    if (reward.name.includes('Streak Freeze')) {
      setStats((prev) => ({
        ...prev,
        streak_freezes: prev.streak_freezes + 1,
        coins: prev.coins - reward.cost_coins,
      }));
    } else if (reward.name.includes('Tokens')) {
      setStats((prev) => ({
        ...prev,
        tokens: prev.tokens + 5,
        coins: prev.coins - reward.cost_coins,
      }));
    } else {
      setStats((prev) => ({
        ...prev,
        coins: prev.coins - reward.cost_coins,
      }));
    }

    const newRedemption: RewardRedemption = {
      id: `red-${Date.now()}`,
      user_id: user.id,
      reward_id: reward.id,
      reward_name: reward.name,
      reward_icon: reward.icon,
      cost: reward.cost_coins,
      redeemed_at: new Date().toISOString(),
      status: 'claimed',
    };

    setRedemptions((prev) => [newRedemption, ...prev]);

    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}-rew`,
        user_id: user.id,
        type: 'COIN',
        amount: -reward.cost_coins,
        source: 'reward',
        reference_id: reward.id,
        description: `Redeemed reward: ${reward.name}`,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    soundFX.playCoin();
    addToast({
      type: 'reward',
      title: 'Reward Redeemed!',
      message: `Enjoy your "${reward.name}"! (-${reward.cost_coins} coins)`,
    });

    return { success: true, message: `Redeemed ${reward.name} successfully!` };
  };

  const claimOrUseRedemption = (redemptionId: string) => {
    setRedemptions((prev) =>
      prev.map((r) => {
        if (r.id === redemptionId) {
          const nextStatus = r.status === 'claimed' ? 'used' : 'claimed';
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  const addCustomReward = (name: string, icon: string, cost_coins: number, category = 'Custom') => {
    const newRew: Reward = {
      id: `rew-${Date.now()}`,
      user_id: user.id,
      name,
      icon,
      cost_coins,
      is_active: true,
      category,
    };
    setRewards((prev) => [...prev, newRew]);
    addToast({
      type: 'info',
      title: 'New Reward Created',
      message: `"${name}" added to Reward Store for ${cost_coins} coins`,
    });
  };

  const deleteReward = (rewardId: string) => {
    setRewards((prev) => prev.filter((r) => r.id !== rewardId));
  };

  const closeLevelUpModal = () => {
    setLevelUpModal(null);
  };

  const updateProfile = (name: string, title: string, avatar: string) => {
    setUser((prev) => ({ ...prev, name, title, avatar }));
    addToast({
      type: 'info',
      title: 'Profile Updated',
      message: 'Your hero profile has been updated.',
    });
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addToast({
      type: 'info',
      title: 'Settings Saved',
      message: 'Your preferences have been updated.',
    });
  };

  const resetAllData = () => {
    setUser(INITIAL_USER);
    setStats(INITIAL_STATS);
    setTasks(INITIAL_TASKS);
    setQuests(INITIAL_QUESTS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setRewards(INITIAL_REWARDS);
    setRedemptions([]);
    setSessions([]);
    setTransactions([]);
    setSettings(INITIAL_SETTINGS);
    localStorage.clear();
    addToast({
      type: 'info',
      title: 'Data Reset',
      message: 'All quest data has been reset to defaults.',
    });
  };

  const exportCsvData = () => {
    const rows = [
      ['Date', 'Type', 'Amount', 'Source', 'Description'],
      ...transactions.map((t) => [
        t.created_at,
        t.type,
        t.amount.toString(),
        t.source,
        `"${t.description.replace(/"/g, '""')}"`,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ProductivityQuest_Stats_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'info',
      title: 'CSV Exported',
      message: 'Your statistics ledger has been downloaded.',
    });
  };

  // Game Zone System Integration
  const spendToken = (cost = 1): boolean => {
    if (stats.tokens < cost) {
      addToast({
        type: 'info',
        title: 'Need Arcade Tokens',
        message: `You need ${cost} Token to play! Complete a task (+1) or focus session (+2) to earn tokens!`,
      });
      return false;
    }
    setStats((prev) => ({
      ...prev,
      tokens: prev.tokens - cost,
    }));
    return true;
  };

  const buyTokensWithCoins = (count = 1): boolean => {
    const cost = count * 50; // 50 coins per token
    if (stats.coins < cost) {
      addToast({
        type: 'info',
        title: 'Insufficient Coins',
        message: `Need ${cost} coins to buy ${count} token(s). You have ${stats.coins}.`,
      });
      return false;
    }

    setStats((prev) => ({
      ...prev,
      coins: prev.coins - cost,
      tokens: prev.tokens + count,
    }));

    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}-tokenbuy`,
        user_id: user.id,
        type: 'COIN',
        amount: -cost,
        source: 'game',
        description: `Purchased ${count} Arcade Token(s)`,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    soundFX.playCoin();
    addToast({
      type: 'coin',
      title: 'Tokens Purchased',
      message: `+${count} Arcade Token(s) acquired! (-${cost} coins)`,
    });
    return true;
  };

  const awardGameReward = (xp: number, coins: number, sourceGame: string, bonusDescription?: string) => {
    if (xp > 0 || coins > 0) {
      awardXpAndCoins(xp, coins, 'game', `Game Reward: ${sourceGame} (${bonusDescription || 'Victory'})`);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#a855f7', '#fbbf24', '#10b981'],
      });
      addToast({
        type: 'xp',
        title: `${sourceGame} Reward!`,
        message: `+${xp} XP & +${coins} Coins earned! ${bonusDescription ? `(${bonusDescription})` : ''}`,
        amount: xp,
      });
    }
  };

  const recordBossKill = () => {
    setStats((prev) => ({
      ...prev,
      boss_kills: prev.boss_kills + 1,
    }));

    // Unlock Dragon Slayer achievement if not unlocked
    setAchievements((prevAch) =>
      prevAch.map((ach) => {
        if (ach.id === 'ach-6' && !ach.unlocked) {
          soundFX.playAchievement();
          awardXpAndCoins(ach.xp_reward, ach.coins_reward, 'achievement', 'Unlocked Dragon Slayer');
          return { ...ach, unlocked: true, unlocked_at: new Date().toISOString() };
        }
        return ach;
      })
    );
  };

  const updateRunnerHighScore = (score: number) => {
    if (score > stats.runner_high_score) {
      setStats((prev) => ({ ...prev, runner_high_score: score }));
      if (score >= 200) {
        setAchievements((prevAch) =>
          prevAch.map((ach) => {
            if (ach.id === 'ach-7' && !ach.unlocked) {
              soundFX.playAchievement();
              awardXpAndCoins(ach.xp_reward, ach.coins_reward, 'achievement', 'Arcade Legend unlocked');
              return { ...ach, unlocked: true, unlocked_at: new Date().toISOString() };
            }
            return ach;
          })
        );
      }
    }
  };

  const updateMemoryBestScore = (score: number) => {
    if (score > stats.memory_best_score) {
      setStats((prev) => ({ ...prev, memory_best_score: score }));
    }
  };

  const addStreakFreeze = (count = 1) => {
    setStats((prev) => ({
      ...prev,
      streak_freezes: prev.streak_freezes + count,
    }));
    addToast({
      type: 'reward',
      title: 'Streak Freeze Shield Acquired!',
      message: `You now have ${stats.streak_freezes + count} Streak Freeze(s) protecting your streak!`,
    });
  };

  return (
    <GameContext.Provider
      value={{
        user,
        stats,
        tasks,
        quests,
        achievements,
        rewards,
        redemptions,
        sessions,
        transactions,
        settings,
        toasts,
        levelUpModal,
        activeTab,
        setActiveTab,
        toggleTask,
        addTask,
        deleteTask,
        editTask,
        completeFocusSession,
        redeemReward,
        claimOrUseRedemption,
        addCustomReward,
        deleteReward,
        dismissToast,
        closeLevelUpModal,
        updateProfile,
        updateSettings,
        resetAllData,
        exportCsvData,
        spendToken,
        buyTokensWithCoins,
        awardGameReward,
        recordBossKill,
        updateRunnerHighScore,
        updateMemoryBestScore,
        addStreakFreeze,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
