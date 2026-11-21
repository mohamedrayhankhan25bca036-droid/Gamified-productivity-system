import React from 'react';
import { Header } from '../components/Header';
import { PlayerCard } from '../components/PlayerCard';
import { TodayTasks } from '../components/TodayTasks';
import { FocusTimer } from '../components/FocusTimer';
import { DailyQuestWidget } from '../components/DailyQuestWidget';
import { WeeklyChallengeWidget } from '../components/WeeklyChallengeWidget';
import { AchievementsWidget } from '../components/AchievementsWidget';
import { LevelProgressWidget } from '../components/LevelProgressWidget';
import { RewardStoreWidget } from '../components/RewardStoreWidget';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with greeting, tagline, date & fantasy banner */}
      <Header />

      {/* 2. Player Card: Avatar with crown, name, title, level, XP progress bar, coins, streak, daily goal */}
      <PlayerCard />

      {/* 3. Middle Section: Today's Tasks, Focus Timer, Daily Quest & Weekly Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Today's Tasks */}
        <div className="lg:col-span-4 min-h-[360px]">
          <TodayTasks />
        </div>

        {/* Focus Timer */}
        <div className="lg:col-span-5 min-h-[360px]">
          <FocusTimer />
        </div>

        {/* Daily Quest & Weekly Challenge */}
        <div className="lg:col-span-3 flex flex-col justify-between space-y-6 lg:space-y-0">
          <DailyQuestWidget />
          <WeeklyChallengeWidget />
        </div>
      </div>

      {/* 4. Bottom Row: Your Achievements, Level Progress, Reward Store */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <AchievementsWidget />
        <LevelProgressWidget />
        <RewardStoreWidget />
      </div>
    </div>
  );
};
