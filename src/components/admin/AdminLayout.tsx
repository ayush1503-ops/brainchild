import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Gamepad2,
  Newspaper,
  Users,
  Mail,
  Tags,
  FileText,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Brain
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { PageRoute } from '../../types';

type AdminTab = 'dashboard' | 'games' | 'news' | 'users' | 'subscribers' | 'categories' | 'content' | 'settings';

interface AdminTabConfig {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

export const AdminLayout: React.FC<{
  children: React.ReactNode;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onExitAdmin: () => void;
}> = ({ children, activeTab, onTabChange, onExitAdmin }) => {
  const { games, news, subscribers, contactMessages, jobs } = useStudio();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const tabs: AdminTabConfig[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'games', label: 'Games', icon: <Gamepad2 size={16} />, count: games.length },
    { id: 'news', label: 'News / Blog', icon: <Newspaper size={16} />, count: news.length },
    { id: 'users', label: 'Users', icon: <Users size={16} />, count: 1 },
    { id: 'subscribers', label: 'Subscribers', icon: <Mail size={16} />, count: subscribers.length },
    { id: 'categories', label: 'Categories', icon: <Tags size={16} /> },
    { id: 'content', label: 'Website Content', icon: <FileText size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> }
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-paper font-body text-ink antialiased">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: sidebarOpen ? 0 : -320 }}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r-2 border-ink bg-cream transition-transform duration-300 ease-in-out lg:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ transformOrigin: 'left' }}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between border-b-2 border-ink px-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl border-2 border-ink bg-sun shadow-sticker-sm">
                <Brain size={20} className="text-ink" />
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">Brainchild</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-coral">Admin</span>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink/15 bg-paper text-ink transition-all hover:border-ink hover:bg-sand lg:hidden"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Admin navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 rounded-xl border-2 px-3 py-3 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-ink bg-sun text-ink shadow-sticker-sm'
                    : 'border-ink/10 bg-cream text-inksoft hover:border-ink/30 hover:text-ink hover:bg-sand'
                }`}
              >
                <span className="flex-shrink-0">{tab.icon}</span>
                <span className="truncate">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-ink bg-sun px-1.5 text-[10px] font-extrabold text-ink">
                    {tab.count > 99 ? '99+' : tab.count}
                  </span>
                )}
              </button>
            ))}

            {/* Quick actions */}
            <div className="mt-6 border-t-2 border-ink/10 pt-4 space-y-2">
              <button
                onClick={() => {
                  onTabChange('games');
                  setMobileSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 rounded-xl border-2 border-ink bg-coral px-3 py-3 text-sm font-extrabold uppercase tracking-wider text-white shadow-sticker transition-all hover:-translate-y-0.5 hover:bg-coraldeep cursor-pointer"
              >
                <Plus size={16} />
                <span>Add New Game</span>
              </button>
              <button
                onClick={() => {
                  onTabChange('news');
                  setMobileSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 rounded-xl border-2 border-ink bg-grape px-3 py-3 text-sm font-extrabold uppercase tracking-wider text-white shadow-sticker transition-all hover:-translate-y-0.5 hover:bg-grapedeep cursor-pointer"
              >
                <Plus size={16} />
                <span>Write New Story</span>
              </button>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t-2 border-ink p-4">
            <button
              onClick={onExitAdmin}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-ink/15 bg-paper px-3 py-2.5 text-sm font-semibold text-inksoft transition-all hover:border-ink hover:text-ink hover:bg-sand cursor-pointer"
            >
              <ArrowUpRight size={14} />
              <span>Back to Website</span>
            </button>
            <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-widest text-ink/30">
              Brainchild Games Studio
              <br />
              Admin Panel v1.0
            </p>
          </div>
        </div>
      </motion.aside>

      {/* Mobile menu toggle button */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="fixed bottom-4 right-4 z-40 h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-coral text-white shadow-lift lg:hidden cursor-pointer"
        aria-label="Open admin menu"
      >
        <Brain size={22} />
      </button>

      {/* Main content */}
      <main
        className={`transition-all duration-300 lg:ml-72 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}
        style={{ transformOrigin: 'left' }}
      >
        <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper/80 py-4 shadow-soft backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
                  {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="mt-1 text-sm font-medium text-inksoft">
                  Manage your studio's content and data
                </p>
              </div>
              <button
                onClick={onExitAdmin}
                className="hidden items-center gap-2 rounded-xl border-2 border-ink bg-cream px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-ink shadow-sticker-sm transition-all hover:-translate-y-0.5 hover:bg-sun hover:text-ink sm:inline-flex cursor-pointer"
              >
                <ArrowUpRight size={14} />
                View Website
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
};

const Plus = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);