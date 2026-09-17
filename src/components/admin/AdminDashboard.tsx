import React from 'react';
import { motion } from 'motion/react';
import {
  Gamepad2,
  Newspaper,
  Mail,
  Users,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Target,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: 'grape' | 'coral' | 'sun' | 'sky' | 'lime';
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendUp = true,
  color,
  onClick
}) => {
  const colorClasses = {
    grape: 'border-grape bg-grape/10 text-grape',
    coral: 'border-coral bg-coral/10 text-coral',
    sun: 'border-sun bg-sun/10 text-sun',
    sky: 'border-sky bg-sky/10 text-sky',
    lime: 'border-lime bg-lime/10 text-lime'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={!onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`group relative overflow-hidden rounded-2xl border-2 ${colorClasses[color]} p-6 shadow-soft transition-all hover:shadow-lift hover:-translate-y-1 cursor-pointer ${onClick ? '' : 'cursor-default'}`}
      style={{ '--card-color': `var(--color-${color})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--card-color)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-ink/50">{title}</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-ink">{value}</p>
          {trend && (
            <p className="mt-2 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide">
              <span className={`text-${trendUp ? 'lime' : 'coral'}`}>
                {trendUp ? '▲' : '▼'} {trend}
              </span>
              <span className="text-inksoft">vs last period</span>
            </p>
          )}
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--card-color)]/10">
          {React.cloneElement(icon as React.ReactElement, { size: 28, className: `text-${color}` })}
        </div>
      </div>
      {onClick && (
        <div className="absolute inset-0 flex items-end justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={16} className="text-ink/50 group-hover:text-ink transition-colors" />
        </div>
      )}
    </motion.button>
  );
};

interface QuickActionProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: 'grape' | 'coral' | 'sun' | 'sky' | 'lime';
  onClick: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ label, description, icon, color, onClick }) => {
  const colorClasses = {
    grape: 'border-grape bg-grape/10 hover:bg-grape/20 text-grape',
    coral: 'border-coral bg-coral/10 hover:bg-coral/20 text-coral',
    sun: 'border-sun bg-sun/10 hover:bg-sun/20 text-sun',
    sky: 'border-sky bg-sky/10 hover:bg-sky/20 text-sky',
    lime: 'border-lime bg-lime/10 hover:bg-lime/20 text-lime'
  };

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`group relative overflow-hidden rounded-2xl border-2 ${colorClasses[color]} p-5 shadow-soft transition-all hover:shadow-lift hover:-translate-y-1 cursor-pointer`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-${color})]/10">
          {React.cloneElement(icon as React.ReactElement, { size: 24, className: `text-${color}` })}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">{label}</p>
          <p className="mt-1 text-sm font-medium text-inksoft">{description}</p>
        </div>
        <ExternalLink size={18} className="text-ink/30 group-hover:text-ink transition-colors" />
      </div>
    </motion.button>
  );
};

export const AdminDashboard: React.FC<{
  onNavigate: (tab: string) => void;
}> = ({ onNavigate }) => {
  const { games, news, jobs, subscribers, contactMessages } = useStudio();

  const stats = [
    {
      title: 'Games on Shelf',
      value: games.length,
      icon: <Gamepad2 />,
      trend: '+2 this month',
      trendUp: true,
      color: 'coral' as const,
      onClick: () => onNavigate('games')
    },
    {
      title: 'Published Stories',
      value: news.filter(n => n.published).length,
      icon: <Newspaper />,
      trend: '+1 this week',
      trendUp: true,
      color: 'grape' as const,
      onClick: () => onNavigate('news')
    },
    {
      title: 'Open Roles',
      value: jobs.filter(j => j.status === 'open').length,
      icon: <Briefcase />,
      trend: '3 openings',
      trendUp: true,
      color: 'sky' as const,
      onClick: () => onNavigate('news')
    },
    {
      title: 'Subscribers',
      value: subscribers.length,
      icon: <Mail />,
      trend: '+12 this week',
      trendUp: true,
      color: 'sun' as const,
      onClick: () => onNavigate('subscribers')
    },
    {
      title: 'Unread Messages',
      value: contactMessages.filter(m => m.status === 'unread').length,
      icon: <MessageSquare />,
      trend: 'Needs attention',
      trendUp: false,
      color: 'lime' as const,
      onClick: () => onNavigate('content')
    },
    {
      title: 'Wishlist Adds (7d)',
      value: '247',
      icon: <Target />,
      trend: '+18%',
      trendUp: true,
      color: 'grape' as const
    }
  ];

  const quickActions = [
    {
      label: 'Add New Game',
      description: 'Create a new world for the shelf',
      icon: <Gamepad2 />,
      color: 'coral' as const,
      onClick: () => onNavigate('games')
    },
    {
      label: 'Write Devlog',
      description: 'Share behind-the-scenes stories',
      icon: <Newspaper />,
      color: 'grape' as const,
      onClick: () => onNavigate('news')
    },
    {
      label: 'Post Job Opening',
      description: 'Grow the studio team',
      icon: <Briefcase />,
      color: 'sky' as const,
      onClick: () => onNavigate('news')
    },
    {
      label: 'Manage Subscribers',
      description: 'View and export newsletter list',
      icon: <Mail />,
      color: 'sun' as const,
      onClick: () => onNavigate('subscribers')
    },
    {
      label: 'Review Messages',
      description: 'Check contact form submissions',
      icon: <MessageSquare />,
      color: 'lime' as const,
      onClick: () => onNavigate('content')
    },
    {
      label: 'Update Homepage',
      description: 'Feature games, tweak copy, adjust bands',
      icon: <Target />,
      color: 'grape' as const,
      onClick: () => onNavigate('content')
    }
  ];

  const recentGames = games.slice(0, 3);
  const recentNews = news.slice(0, 3);
  const unreadMessages = contactMessages.filter(m => m.status === 'unread').slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border-2 border-ink bg-gradient-to-r from-grape via-grape/80 to-coral p-8 text-white"
      >
        <div className="absolute inset-0 bg-dots opacity-10" aria-hidden="true" />
        <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">Welcome back, Commander</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight">
              Studio Command Center
            </h2>
            <p className="mt-3 max-w-xl text-lg font-medium opacity-90">
              Manage games, stories, and community from one place. Everything saves to this browser — no backend required.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 rounded-xl border-2 border-white/20 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-wide lg:flex">
              <TrendingUp size={16} /> 2.4k wishlists this month
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-xl border-2 border-white/20 bg-white/10">
              <Gamepad2 size={22} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} style={{ transitionDelay: `${i * 50}ms` }} />
        ))}
      </div>

      {/* Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink">Quick Actions</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {quickActions.map((action, i) => (
            <QuickAction key={action.label} {...action} style={{ transitionDelay: `${i * 50}ms` }} />
          ))}
        </div>
      </section>

      {/* Recent Activity & Tables */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Recent Games */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 space-y-4 rounded-2xl border-2 border-ink bg-cream p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">Recent Games</h3>
            <button
              onClick={() => onNavigate('games')}
              className="text-sm font-bold uppercase tracking-wider text-grape hover:text-grapedeep cursor-pointer"
            >
              View all
            </button>
          </div>
          {recentGames.length === 0 ? (
            <p className="text-center text-sm font-medium text-inksoft py-8">No games yet. Add your first world!</p>
          ) : (
            <div className="space-y-3">
              {recentGames.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center gap-4 rounded-xl border-2 border-ink/10 bg-paper p-3 transition-all hover:border-ink/30 hover:bg-cream cursor-pointer"
                >
                  <img
                    src={game.heroImage}
                    alt=""
                    className="h-12 w-16 flex-shrink-0 rounded-lg border-2 border-ink/10 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-extrabold uppercase text-ink truncate">{game.title}</p>
                    <p className="text-xs font-medium text-inksoft">{game.genre} · {game.status}</p>
                  </div>
                  <span className="rounded-full bg-grape/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-grape">
                    {game.featured ? 'Featured' : 'Standard'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Recent News */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 rounded-2xl border-2 border-ink bg-cream p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">Latest Stories</h3>
            <button
              onClick={() => onNavigate('news')}
              className="text-sm font-bold uppercase tracking-wider text-grape hover:text-grapedeep cursor-pointer"
            >
              View all
            </button>
          </div>
          {recentNews.length === 0 ? (
            <p className="text-center text-sm font-medium text-inksoft py-8">No stories yet. Write your first devlog!</p>
          ) : (
            <div className="space-y-3">
              {recentNews.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center gap-3 rounded-xl border-2 border-ink/10 bg-paper p-3 transition-all hover:border-ink/30 hover:bg-cream cursor-pointer"
                >
                  <img
                    src={article.coverImage}
                    alt=""
                    className="h-10 w-14 flex-shrink-0 rounded-lg border-2 border-ink/10 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink truncate">{article.title}</p>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-grape">{article.category}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                    article.published
                      ? 'bg-lime/10 text-lime'
                      : 'bg-sand text-inksoft'
                  }`}>
                    {article.published ? 'Live' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Unread Messages */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 rounded-2xl border-2 border-ink bg-cream p-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">Unread Messages</h3>
            <button
              onClick={() => onNavigate('content')}
              className="text-sm font-bold uppercase tracking-wider text-grape hover:text-grapedeep cursor-pointer"
            >
              View inbox
            </button>
          </div>
          {unreadMessages.length === 0 ? (
            <p className="text-center text-sm font-medium text-inksoft py-8">Inbox zero! 🎉</p>
          ) : (
            <div className="space-y-3">
              {unreadMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-xl border-2 border-coral/30 bg-coral/5 p-3"
                >
                  <p className="font-display text-sm font-extrabold uppercase text-ink">{msg.subject}</p>
                  <p className="mt-1 text-xs font-medium text-inksoft">{msg.name} · {msg.email}</p>
                  <p className="mt-2 text-sm font-medium text-inksoft line-clamp-2">{msg.message}</p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-coral">{msg.projectType} · {msg.budget}</p>
                </div>
              ))}
            </div>
          )}
        </motion.section>
      </div>

      {/* Studio Pulse */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border-2 border-ink bg-sun/30 p-6 shadow-soft"
      >
        <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">Studio Pulse</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border-2 border-ink bg-cream p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-inksoft">Total Wishlists</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-ink">12,847</p>
            <p className="mt-1 text-sm font-bold text-lime">+2.3% this week</p>
          </div>
          <div className="rounded-xl border-2 border-ink bg-cream p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-inksoft">Discord Members</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-ink">18,234</p>
            <p className="mt-1 text-sm font-bold text-grape">+156 this week</p>
          </div>
          <div className="rounded-xl border-2 border-ink bg-cream p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-inksoft">Newsletter Open Rate</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-ink">42.1%</p>
            <p className="mt-1 text-sm font-bold text-sky">Industry avg: 21%</p>
          </div>
          <div className="rounded-xl border-2 border-ink bg-cream p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-inksoft">Steam Page Views (30d)</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-ink">89.2k</p>
            <p className="mt-1 text-sm font-bold text-coral">+12% vs last month</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};