import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory data store with file persistence
const DB_FILE = path.join(__dirname, 'data_store.json');

const initialDatabase = {
  user: {
    id: 'user-rayhan',
    name: 'Rayhan Khaan',
    email: 'rayhan.khaan@quest.dev',
    avatar: '/assets/avatar.png',
    title: 'Productivity Warrior',
    timezone: 'UTC+5:30',
    created_at: '2026-11-01T00:00:00.000Z',
  },
  stats: {
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
  },
  tasks: [
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
  ],
  quests: [
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
  ],
  achievements: [
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
  ],
  rewards: [
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
  ],
  redemptions: [
    {
      id: 'red-1',
      user_id: 'user-rayhan',
      reward_id: 'rew-1',
      reward_name: '30 min Gaming',
      reward_icon: 'gamepad',
      cost: 100,
      redeemed_at: '2026-11-19T20:00:00.000Z',
      status: 'used',
    },
  ],
  sessions: [],
  transactions: [],
  settings: {
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
  },
};

let db = initialDatabase;
if (fs.existsSync(DB_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error loading DB file, fallback to initial:', err);
  }
}

const saveDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Failed to save DB:', err);
  }
};

// 7.2 Proposed REST API Endpoints
// Auth
app.post('/api/auth/register', (req, res) => {
  const { name, email } = req.body;
  res.json({ token: 'mock-jwt-token-12345', user: { name, email, level: 1, xp: 0, coins: 0 } });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ token: 'mock-jwt-token-12345', user: db.user });
});

app.post('/api/auth/refresh', (req, res) => {
  res.json({ token: 'mock-refreshed-jwt-token' });
});

// Dashboard Aggregated
app.get('/api/dashboard', (req, res) => {
  res.json({
    user: db.user,
    stats: db.stats,
    today_tasks: db.tasks.slice(0, 5),
    daily_quest: db.quests.find((q) => q.type === 'daily'),
    weekly_challenge: db.quests.find((q) => q.type === 'weekly'),
    achievements_preview: db.achievements.slice(0, 5),
    rewards_preview: db.rewards.slice(0, 3),
  });
});

// Tasks
app.get('/api/tasks', (req, res) => {
  res.json(db.tasks);
});

app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: `task-${Date.now()}`,
    user_id: db.user.id,
    is_completed: false,
    ...req.body,
  };
  db.tasks.push(newTask);
  saveDb();
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const index = db.tasks.findIndex((t) => t.id === req.params.id);
  if (index !== -1) {
    db.tasks[index] = { ...db.tasks[index], ...req.body };
    saveDb();
    res.json(db.tasks[index]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  db.tasks = db.tasks.filter((t) => t.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

app.post('/api/tasks/:id/complete', (req, res) => {
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (task) {
    task.is_completed = true;
    task.completed_at = new Date().toISOString();
    db.stats.current_xp += task.xp_value;
    db.stats.coins += task.coins_value;
    saveDb();
    res.json({ success: true, task, stats: db.stats });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.post('/api/tasks/:id/undo', (req, res) => {
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (task) {
    task.is_completed = false;
    task.completed_at = null;
    db.stats.current_xp = Math.max(0, db.stats.current_xp - task.xp_value);
    db.stats.coins = Math.max(0, db.stats.coins - task.coins_value);
    saveDb();
    res.json({ success: true, task, stats: db.stats });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Focus Timer Sessions
app.get('/api/focus/sessions', (req, res) => {
  res.json(db.sessions);
});

app.post('/api/focus/sessions', (req, res) => {
  const session = {
    id: `sess-${Date.now()}`,
    ...req.body,
  };
  db.sessions.unshift(session);
  saveDb();
  res.status(201).json(session);
});

// Quests & Achievements
app.get('/api/quests', (req, res) => {
  res.json(db.quests);
});

app.get('/api/achievements', (req, res) => {
  res.json(db.achievements);
});

// Rewards
app.get('/api/rewards', (req, res) => {
  res.json(db.rewards);
});

app.post('/api/rewards/:id/redeem', (req, res) => {
  const reward = db.rewards.find((r) => r.id === req.params.id);
  if (!reward) return res.status(404).json({ error: 'Reward not found' });
  if (db.stats.coins < reward.cost_coins) {
    return res.status(400).json({ error: 'Insufficient coins' });
  }
  db.stats.coins -= reward.cost_coins;
  const redemption = {
    id: `red-${Date.now()}`,
    user_id: db.user.id,
    reward_id: reward.id,
    reward_name: reward.name,
    cost: reward.cost_coins,
    redeemed_at: new Date().toISOString(),
    status: 'claimed',
  };
  db.redemptions.unshift(redemption);
  saveDb();
  res.json({ success: true, redemption, coins: db.stats.coins });
});

// Stats, Profile, Settings
app.get('/api/stats', (req, res) => {
  res.json({ stats: db.stats, transactions: db.transactions });
});

app.get('/api/profile', (req, res) => {
  res.json(db.user);
});

app.patch('/api/profile', (req, res) => {
  db.user = { ...db.user, ...req.body };
  saveDb();
  res.json(db.user);
});

app.get('/api/settings', (req, res) => {
  res.json(db.settings);
});

app.patch('/api/settings', (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  saveDb();
  res.json(db.settings);
});

// Serve frontend static files if built
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`ProductivityQuest Server running at http://localhost:${PORT}`);
});
