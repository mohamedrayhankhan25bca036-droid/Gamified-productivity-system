import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { TasksView } from './views/TasksView';
import { FocusTimerView } from './views/FocusTimerView';
import { GamesView } from './views/GamesView';
import { AchievementsView } from './views/AchievementsView';
import { RewardsStoreView } from './views/RewardsStoreView';
import { StatisticsView } from './views/StatisticsView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';
import { LevelUpModal } from './components/LevelUpModal';
import { ToastContainer } from './components/ToastContainer';
import { Menu, X, Gamepad2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <TasksView />;
      case 'focus_timer':
        return <FocusTimerView />;
      case 'games':
        return <GamesView />;
      case 'achievements':
        return <AchievementsView />;
      case 'rewards_store':
        return <RewardsStoreView />;
      case 'statistics':
        return <StatisticsView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b0918] text-slate-100 selection:bg-purple-600 selection:text-white">
      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-xs h-full">
            <Sidebar onLogout={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile Header Bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#110d29] border-b border-[#281f4f] sticky top-0 z-30">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-base text-white">ProductivityQuest</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[#1a143b] text-slate-300 hover:text-white border border-[#2e235a]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* View Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1550px] w-full mx-auto">
          {renderView()}
        </main>
      </div>

      {/* Level Up Modal (FR-DASH-05) */}
      <LevelUpModal />

      {/* In-app Toast Notifications (FR-NOTIF-01) */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <MainContent />
    </GameProvider>
  );
}

export default App;
