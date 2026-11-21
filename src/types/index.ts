export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  timezone: string;
  created_at: string;
}

export interface PlayerStats {
  user_id: string;
  level: number;
  current_xp: number;
  next_level_xp: number;
  total_xp: number;
  coins: number;
  current_streak: number;
  longest_streak: number;
  daily_goal_percent: number;
  last_active_date: string;
  tokens: number; // Arcade & quest game tokens
  streak_freezes: number; // Streak protection shields
  boss_kills: number;
  runner_high_score: number;
  memory_best_score: number;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskCategory = 'Study' | 'Work' | 'Health' | 'Personal' | 'Other';
export type TaskRecurrence = 'none' | 'daily' | 'weekly';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  xp_value: number;
  coins_value: number;
  category: TaskCategory;
  priority: TaskPriority;
  due_date: string;
  is_completed: boolean;
  completed_at?: string | null;
  recurrence: TaskRecurrence;
}

export type TimerMode = 'pomodoro' | 'short_break' | 'long_break';

export interface FocusSession {
  id: string;
  user_id: string;
  task_id?: string;
  task_title?: string;
  mode: TimerMode;
  duration_planned: number; // in seconds
  duration_actual: number;
  completed: boolean;
  xp_awarded: number;
  started_at: string;
  ended_at: string;
}

export interface Quest {
  id: string;
  type: 'daily' | 'weekly';
  title: string;
  target_count: number;
  current_count: number;
  xp_reward: number;
  is_completed: boolean;
  rewarded: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge_color: 'gold' | 'flame' | 'purple' | 'cyan' | 'emerald';
  condition_type: 'task_count' | 'streak_days' | 'focus_count' | 'coins_earned' | 'level_reached' | 'game_wins';
  condition_value: number;
  xp_reward: number;
  coins_reward: number;
  unlocked: boolean;
  unlocked_at?: string | null;
}

export interface Reward {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  cost_coins: number;
  is_active: boolean;
  category?: string;
}

export interface RewardRedemption {
  id: string;
  user_id: string;
  reward_id: string;
  reward_name: string;
  reward_icon: string;
  cost: number;
  redeemed_at: string;
  status: 'claimed' | 'used';
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'XP' | 'COIN';
  amount: number;
  source: 'task' | 'session' | 'quest' | 'achievement' | 'reward' | 'game';
  reference_id?: string;
  description: string;
  created_at: string;
}

export interface UserSettings {
  pomodoro_minutes: number;
  short_break_minutes: number;
  long_break_minutes: number;
  sessions_before_long_break: number;
  sound_enabled: boolean;
  sound_volume: number;
  notifications_enabled: boolean;
  timezone: string;
  daily_goal_tasks_target: number;
  theme_accent: string;
}

export interface ToastMessage {
  id: string;
  type: 'xp' | 'coin' | 'level_up' | 'achievement' | 'quest' | 'reward' | 'info';
  title: string;
  message: string;
  amount?: number;
}
