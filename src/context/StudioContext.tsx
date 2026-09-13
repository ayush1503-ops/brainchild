import React, { createContext, useContext, useState, useEffect } from 'react';
import { Game, Article, Job, ContactMessage, NewsletterSubscriber, PageRoute } from '../types';
import { INITIAL_GAMES, INITIAL_NEWS, INITIAL_JOBS } from '../data/initialData';
import { toggleAmbientSound, playUiClick } from '../utils/sound';

interface StudioContextType {
  currentRoute: PageRoute;
  setCurrentRoute: (route: PageRoute) => void;
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;
  selectedJob: Job | null;
  setSelectedJob: (job: Job | null) => void;
  isApplyingJob: boolean;
  setIsApplyingJob: (applying: boolean) => void;
  isCmsOpen: boolean;
  setIsCmsOpen: (open: boolean) => void;
  isAudioActive: boolean;
  toggleAudio: () => void;

  // Wishlist & playful toasts
  wishlist: string[];
  toggleWishlist: (gameId: string) => void;
  isWishlisted: (gameId: string) => boolean;
  toast: { id: number; text: string } | null;
  notify: (text: string) => void;
  
  // CMS Collections & Mutations
  games: Game[];
  addGame: (game: Omit<Game, 'id'>) => void;
  updateGame: (game: Game) => void;
  deleteGame: (id: string) => void;

  news: Article[];
  addArticle: (article: Omit<Article, 'id'>) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;

  jobs: Job[];
  addJob: (job: Omit<Job, 'id'>) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;

  subscribers: NewsletterSubscriber[];
  subscribeNewsletter: (name: string, email: string, interests: string[]) => { success: boolean; message: string };
  exportSubscribersCSV: () => void;
  exportSubscribersJSON: () => void;

  contactMessages: ContactMessage[];
  submitContact: (data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => { success: boolean; message: string };
  markContactStatus: (id: string, status: ContactMessage['status']) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRouteState] = useState<PageRoute>('home');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyingJob, setIsApplyingJob] = useState(false);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bc_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('bc_wishlist', JSON.stringify(wishlist));
    } catch { /* ignored */ }
  }, [wishlist]);

  const notify = (text: string) => {
    const id = Date.now();
    setToast({ id, text });
    window.setTimeout(() => {
      setToast((prev) => (prev && prev.id === id ? null : prev));
    }, 3200);
  };

  const isWishlisted = (gameId: string) => wishlist.includes(gameId);

  // Persistent collections
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const saved = localStorage.getItem('bc_games');
      return saved ? JSON.parse(saved) : INITIAL_GAMES;
    } catch {
      return INITIAL_GAMES;
    }
  });

  const toggleWishlist = (gameId: string) => {
    setWishlist((prev) => {
      const has = prev.includes(gameId);
      const game = games.find((g) => g.id === gameId);
      const label = game ? game.title : 'Game';
      window.setTimeout(() => {
        notify(has ? `${label} removed from your wishlist` : `${label} added to your wishlist ♥`);
      }, 0);
      return has ? prev.filter((id) => id !== gameId) : [...prev, gameId];
    });
  };

  const [news, setNews] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('bc_news');
      return saved ? JSON.parse(saved) : INITIAL_NEWS;
    } catch {
      return INITIAL_NEWS;
    }
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem('bc_jobs');
      return saved ? JSON.parse(saved) : INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  });

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    try {
      const saved = localStorage.getItem('bc_subscribers');
      return saved ? JSON.parse(saved) : [
        { id: 'sub-1', email: 'pilot.orion@nebula.io', name: 'Commander Orion', interests: ['Aetherbound', 'Beta Testing'], subscribedAt: '2026-08-14' },
        { id: 'sub-2', email: 'mira.design@celestial.dev', name: 'Mira Vance', interests: ['Devlogs', 'Studio News'], subscribedAt: '2026-09-02' }
      ];
    } catch {
      return [];
    }
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem('bc_contacts');
      return saved ? JSON.parse(saved) : [
        {
          id: 'msg-1',
          name: 'Harrison Gray',
          email: 'h.gray@venturegames.co',
          company: 'Venture Games Publishing',
          subject: 'Co-publishing inquiry for Asian territories',
          projectType: 'Publishing Partnership',
          budget: '$500k+',
          message: 'Loved your physics demonstration at GDC. We would love to discuss physical distribution and localization opportunities for Aetherbound.',
          createdAt: '2026-09-08',
          status: 'unread'
        }
      ];
    } catch {
      return [];
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bc_games', JSON.stringify(games));
    } catch { /* ignored */ }
  }, [games]);

  useEffect(() => {
    try {
      localStorage.setItem('bc_news', JSON.stringify(news));
    } catch { /* ignored */ }
  }, [news]);

  useEffect(() => {
    try {
      localStorage.setItem('bc_jobs', JSON.stringify(jobs));
    } catch { /* ignored */ }
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem('bc_subscribers', JSON.stringify(subscribers));
    } catch { /* ignored */ }
  }, [subscribers]);

  useEffect(() => {
    try {
      localStorage.setItem('bc_contacts', JSON.stringify(contactMessages));
    } catch { /* ignored */ }
  }, [contactMessages]);

  const setCurrentRoute = (route: PageRoute) => {
    playUiClick(500);
    setCurrentRouteState(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAudio = () => {
    const nextState = !isAudioActive;
    toggleAmbientSound(nextState);
    setIsAudioActive(nextState);
  };

  // CMS Game mutations
  const addGame = (gameData: Omit<Game, 'id'>) => {
    const newGame: Game = {
      ...gameData,
      id: `game-${Date.now()}`
    };
    setGames(prev => [newGame, ...prev]);
  };

  const updateGame = (updated: Game) => {
    setGames(prev => prev.map(g => (g.id === updated.id ? updated : g)));
    if (selectedGame?.id === updated.id) {
      setSelectedGame(updated);
    }
  };

  const deleteGame = (id: string) => {
    setGames(prev => prev.filter(g => g.id !== id));
    if (selectedGame?.id === id) {
      setSelectedGame(null);
    }
  };

  // CMS News mutations
  const addArticle = (articleData: Omit<Article, 'id'>) => {
    const newArticle: Article = {
      ...articleData,
      id: `article-${Date.now()}`
    };
    setNews(prev => [newArticle, ...prev]);
  };

  const updateArticle = (updated: Article) => {
    setNews(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    if (selectedArticle?.id === updated.id) {
      setSelectedArticle(updated);
    }
  };

  const deleteArticle = (id: string) => {
    setNews(prev => prev.filter(a => a.id !== id));
    if (selectedArticle?.id === id) {
      setSelectedArticle(null);
    }
  };

  // CMS Job mutations
  const addJob = (jobData: Omit<Job, 'id'>) => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const updateJob = (updated: Job) => {
    setJobs(prev => prev.map(j => (j.id === updated.id ? updated : j)));
    if (selectedJob?.id === updated.id) {
      setSelectedJob(updated);
    }
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    if (selectedJob?.id === id) {
      setSelectedJob(null);
    }
  };

  // Newsletter subscription
  const subscribeNewsletter = (name: string, email: string, interests: string[]) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    const exists = subscribers.some(s => s.email.toLowerCase() === cleanEmail);
    if (exists) {
      return { success: false, message: 'You are already registered for studio drops!' };
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      name: name.trim() || 'Explorer',
      interests: interests.length > 0 ? interests : ['General Studio Drops'],
      subscribedAt: new Date().toISOString().split('T')[0]
    };

    setSubscribers(prev => [newSub, ...prev]);
    return { success: true, message: 'Transmission confirmed! Welcome to the Brainchild fleet.' };
  };

  // Export Subscribers
  const exportSubscribersCSV = () => {
    const headers = ['ID', 'Email', 'Name', 'Interests', 'Subscribed At'];
    const rows = subscribers.map(s => [
      s.id,
      `"${s.email}"`,
      `"${s.name}"`,
      `"${s.interests.join('; ')}"`,
      s.subscribedAt
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `brainchild_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSubscribersJSON = () => {
    const jsonStr = JSON.stringify(subscribers, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `brainchild_subscribers_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Contact submissions
  const submitContact = (data: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const newMsg: ContactMessage = {
      ...data,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'unread'
    };
    setContactMessages(prev => [newMsg, ...prev]);
    return { success: true, message: 'Message received. We will get back to you soon.' };
  };

  const markContactStatus = (id: string, status: ContactMessage['status']) => {
    setContactMessages(prev => prev.map(m => (m.id === id ? { ...m, status } : m)));
  };

  return (
    <StudioContext.Provider
      value={{
        currentRoute,
        setCurrentRoute,
        selectedGame,
        setSelectedGame,
        selectedArticle,
        setSelectedArticle,
        selectedJob,
        setSelectedJob,
        isApplyingJob,
        setIsApplyingJob,
        isCmsOpen,
        setIsCmsOpen,
        isAudioActive,
        toggleAudio,
        wishlist,
        toggleWishlist,
        isWishlisted,
        toast,
        notify,
        games,
        addGame,
        updateGame,
        deleteGame,
        news,
        addArticle,
        updateArticle,
        deleteArticle,
        jobs,
        addJob,
        updateJob,
        deleteJob,
        subscribers,
        subscribeNewsletter,
        exportSubscribersCSV,
        exportSubscribersJSON,
        contactMessages,
        submitContact,
        markContactStatus
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
