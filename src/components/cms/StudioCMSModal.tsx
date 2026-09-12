import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Download,
  Check,
  Gamepad2,
  Newspaper,
  Briefcase,
  Users,
  MessageSquare,
  Sparkles,
  Save,
  AlertCircle
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { Game, Article, Job } from '../../types';

export const StudioCMSModal: React.FC = () => {
  const {
    isCmsOpen,
    setIsCmsOpen,
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
    contacts,
    exportSubscribersCSV,
    exportSubscribersJSON
  } = useStudio();

  const [activeTab, setActiveTab] = useState<'games' | 'news' | 'jobs' | 'subscribers' | 'contacts'>('games');

  // Form states for creating/editing
  const [editingGame, setEditingGame] = useState<Partial<Game> | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [editingJob, setEditingJob] = useState<Partial<Job> | null>(null);

  if (!isCmsOpen) return null;

  // Handler for Game Save
  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame || !editingGame.title) return;

    if (editingGame.id) {
      updateGame(editingGame.id, editingGame);
    } else {
      const newGame: Game = {
        id: `game-${Date.now()}`,
        title: editingGame.title || 'Untitled Game',
        slug: (editingGame.title || 'game').toLowerCase().replace(/\s+/g, '-'),
        subtitle: editingGame.subtitle || 'ANOMALOUS EXPLORATION',
        genre: editingGame.genre || 'Sci-Fi Adventure',
        platforms: editingGame.platforms || ['PC (Steam)', 'PlayStation 5'],
        status: editingGame.status || 'In Development',
        releaseYear: editingGame.releaseYear || '2026',
        description: editingGame.description || '',
        longDescription: editingGame.longDescription || '',
        heroImage: editingGame.heroImage || '/src/assets/images/hero_game_1789202802877.jpg',
        screenshots: editingGame.screenshots || ['/src/assets/images/hero_game_1789202802877.jpg'],
        videoUrl: editingGame.videoUrl || '',
        tags: editingGame.tags || ['Sci-Fi', 'Exploration'],
        storeLinks: [{ name: 'Steam', url: 'https://store.steampowered.com' }],
        features: editingGame.features || ['Kinetic zero-g physics', 'Volumetric weather simulation'],
        gameplayMechanics: editingGame.gameplayMechanics || [
          { title: 'Horizon Anchor', description: 'Magnetically tether yourself to planetary fragments.' }
        ],
        devStory: editingGame.devStory || 'Prototyped over 18 months in Montreal.',
        featured: !!editingGame.featured
      };
      addGame(newGame);
    }
    setEditingGame(null);
  };

  // Handler for Article Save
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title) return;

    if (editingArticle.id) {
      updateArticle(editingArticle.id, editingArticle);
    } else {
      const newArt: Article = {
        id: `art-${Date.now()}`,
        title: editingArticle.title || 'New Dispatch',
        slug: (editingArticle.title || 'article').toLowerCase().replace(/\s+/g, '-'),
        date: new Date().toISOString().split('T')[0],
        category: (editingArticle.category as any) || 'DEVLOG',
        readTime: editingArticle.readTime || '4 MIN READ',
        author: editingArticle.author || { name: 'Studio Lead', role: 'Director' },
        coverImage: editingArticle.coverImage || '/src/assets/images/hero_game_1789202802877.jpg',
        excerpt: editingArticle.excerpt || '',
        content: editingArticle.content || '',
        tags: editingArticle.tags || ['Devlog', 'Engine'],
        featured: !!editingArticle.featured,
        published: true
      };
      addArticle(newArt);
    }
    setEditingArticle(null);
  };

  // Handler for Job Save
  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob || !editingJob.title) return;

    if (editingJob.id) {
      updateJob(editingJob.id, editingJob);
    } else {
      const newJobItem: Job = {
        id: `job-${Date.now()}`,
        title: editingJob.title || 'Senior Role',
        department: editingJob.department || 'Engineering',
        location: editingJob.location || 'Montreal / Remote',
        type: (editingJob.type as any) || 'Full-time (4-Day Week)',
        experience: (editingJob.experience as any) || 'Senior',
        description: editingJob.description || '',
        responsibilities: editingJob.responsibilities || ['Own technical gameplay systems.'],
        requirements: editingJob.requirements || ['5+ years in commercial game development.'],
        niceToHave: ['Experience shipping on modern consoles', 'Custom physics experience'],
        perks: ['4-day work week (36h)', '15% Studio revenue share pool'],
        status: 'open',
        postedDate: 'Just Now'
      };
      addJob(newJobItem);
    }
    setEditingJob(null);
  };

  return (
    <div
      id="studio-cms-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200 text-white"
    >
      <div className="relative w-full max-w-6xl max-h-[90vh] rounded-3xl bg-[#0f1118] border border-white/20 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Topbar */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#141724]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ff5722] flex items-center justify-center font-black text-black">
              BC
            </div>
            <div>
              <h2 className="text-lg font-display font-black uppercase tracking-tight">
                STUDIO CMS & TELEMETRY
              </h2>
              <div className="text-[10px] font-mono text-zinc-400">
                BRAINCHILD CONTENT ENGINE // FULL EDITORIAL CONTROL
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsCmsOpen(false)}
            className="p-2.5 rounded-full bg-white/10 hover:bg-[#ff5722] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 bg-[#12141e] overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('games');
              setEditingGame(null);
            }}
            className={`px-4 py-2.5 text-xs font-editorial font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'games'
                ? 'border-[#ff5722] text-[#ff5722]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Gamepad2 size={14} />
            <span>GAMES ({games.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('news');
              setEditingArticle(null);
            }}
            className={`px-4 py-2.5 text-xs font-editorial font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'news'
                ? 'border-[#ff5722] text-[#ff5722]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Newspaper size={14} />
            <span>ARTICLES & DEVLOGS ({news.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('jobs');
              setEditingJob(null);
            }}
            className={`px-4 py-2.5 text-xs font-editorial font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'border-[#ff5722] text-[#ff5722]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Briefcase size={14} />
            <span>CAREERS & VACANCIES ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-4 py-2.5 text-xs font-editorial font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'subscribers'
                ? 'border-[#ff5722] text-[#ff5722]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Users size={14} />
            <span>SUBSCRIBERS ({subscribers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2.5 text-xs font-editorial font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'contacts'
                ? 'border-[#ff5722] text-[#ff5722]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <MessageSquare size={14} />
            <span>CONTACT INBOX ({contacts.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: GAMES */}
          {activeTab === 'games' && (
            <div>
              {editingGame ? (
                <form onSubmit={handleSaveGame} className="space-y-4 max-w-2xl">
                  <h3 className="text-lg font-display font-bold text-white">
                    {editingGame.id ? 'EDIT GAME ENTRY' : 'ADD NEW EXPERIMENTAL WORLD'}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400">GAME TITLE</label>
                      <input
                        type="text"
                        required
                        value={editingGame.title || ''}
                        onChange={(e) => setEditingGame({ ...editingGame, title: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400">SUBTITLE / TAGLINE</label>
                      <input
                        type="text"
                        value={editingGame.subtitle || ''}
                        onChange={(e) => setEditingGame({ ...editingGame, subtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400">GENRE</label>
                      <input
                        type="text"
                        value={editingGame.genre || ''}
                        onChange={(e) => setEditingGame({ ...editingGame, genre: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400">STATUS</label>
                      <select
                        value={editingGame.status || 'In Development'}
                        onChange={(e) => setEditingGame({ ...editingGame, status: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                      >
                        <option value="Available Now">Available Now</option>
                        <option value="Wishlist Now">Wishlist Now</option>
                        <option value="In Development">In Development</option>
                        <option value="Alpha Testing">Alpha Testing</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400">RELEASE YEAR</label>
                      <input
                        type="text"
                        value={editingGame.releaseYear || ''}
                        onChange={(e) => setEditingGame({ ...editingGame, releaseYear: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400">SHORT DESCRIPTION</label>
                    <textarea
                      rows={2}
                      value={editingGame.description || ''}
                      onChange={(e) => setEditingGame({ ...editingGame, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400">LONG SYNOPSIS</label>
                    <textarea
                      rows={4}
                      value={editingGame.longDescription || ''}
                      onChange={(e) => setEditingGame({ ...editingGame, longDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingGame(null)}
                      className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-editorial uppercase"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-full bg-[#ff5722] hover:bg-[#f04814] text-xs font-editorial font-bold uppercase"
                    >
                      SAVE TO CATALOGUE
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-mono text-zinc-400 uppercase">
                      STUDIO CATALOGUE ({games.length} WORLDS)
                    </h3>
                    <button
                      onClick={() =>
                        setEditingGame({
                          title: '',
                          subtitle: '',
                          genre: 'Sci-Fi Exploration',
                          status: 'In Development',
                          releaseYear: '2026',
                          description: '',
                          longDescription: '',
                          heroImage: '/src/assets/images/hero_game_1789202802877.jpg',
                          screenshots: ['/src/assets/images/hero_game_1789202802877.jpg'],
                          features: ['Procedural Gravitational Shifts'],
                          platforms: ['PC (Steam)', 'PlayStation 5']
                        })
                      }
                      className="px-4 py-2 rounded-full bg-[#ff5722] text-white text-xs font-editorial font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>ADD NEW GAME</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {games.map((game) => (
                      <div
                        key={game.id}
                        className="p-4 rounded-2xl bg-[#141624] border border-white/10 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={game.heroImage}
                            alt=""
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <h4 className="text-sm font-display font-bold text-white truncate">
                              {game.title}
                            </h4>
                            <div className="text-[11px] font-mono text-[#ff5722]">
                              {game.genre} • {game.status}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setEditingGame(game)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete ${game.title}?`)) deleteGame(game.id);
                            }}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ARTICLES */}
          {activeTab === 'news' && (
            <div>
              {editingArticle ? (
                <form onSubmit={handleSaveArticle} className="space-y-4 max-w-2xl">
                  <h3 className="text-lg font-display font-bold text-white">
                    {editingArticle.id ? 'EDIT DISPATCH' : 'WRITE NEW DISPATCH / DEVLOG'}
                  </h3>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400">ARTICLE TITLE</label>
                    <input
                      type="text"
                      required
                      value={editingArticle.title || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                      className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400">CATEGORY</label>
                      <select
                        value={editingArticle.category || 'DEVLOG'}
                        onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                        className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                      >
                        <option value="DEVLOG">DEVLOG</option>
                        <option value="BEHIND THE SCENES">BEHIND THE SCENES</option>
                        <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                        <option value="STUDIO">STUDIO</option>
                        <option value="NEWS">NEWS</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400">ESTIMATED READ TIME</label>
                      <input
                        type="text"
                        value={editingArticle.readTime || '4 MIN READ'}
                        onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400">SHORT EXCERPT</label>
                    <textarea
                      rows={2}
                      value={editingArticle.excerpt || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                      className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400">MARKDOWN CONTENT</label>
                    <textarea
                      rows={6}
                      value={editingArticle.content || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                      className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingArticle(null)}
                      className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-editorial uppercase"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-full bg-[#ff5722] hover:bg-[#f04814] text-xs font-editorial font-bold uppercase"
                    >
                      PUBLISH DISPATCH
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-mono text-zinc-400 uppercase">
                      NEWS ARTICLES ({news.length})
                    </h3>
                    <button
                      onClick={() =>
                        setEditingArticle({
                          title: '',
                          category: 'DEVLOG',
                          readTime: '5 MIN READ',
                          excerpt: '',
                          content: '### New Chapter\n\nWrite your thoughts here...',
                          coverImage: '/src/assets/images/hero_game_1789202802877.jpg',
                          author: { name: 'Studio Writer', role: 'Editorial' }
                        })
                      }
                      className="px-4 py-2 rounded-full bg-[#ff5722] text-white text-xs font-editorial font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>NEW ARTICLE</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {news.map((art) => (
                      <div
                        key={art.id}
                        className="p-4 rounded-2xl bg-[#141624] border border-white/10 flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] font-mono text-[#ff5722]">
                            {art.category} • {art.date}
                          </div>
                          <h4 className="text-sm font-display font-bold text-white truncate">
                            {art.title}
                          </h4>
                          <div className="text-xs text-zinc-400 truncate font-sans">{art.excerpt}</div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setEditingArticle(art)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${art.title}"?`)) deleteArticle(art.id);
                            }}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: JOBS */}
          {activeTab === 'jobs' && (
            <div>
              {editingJob ? (
                <form onSubmit={handleSaveJob} className="space-y-4 max-w-2xl">
                  <h3 className="text-lg font-display font-bold text-white">
                    {editingJob.id ? 'EDIT VACANCY' : 'POST NEW EXPEDITION VACANCY'}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400">ROLE TITLE</label>
                      <input
                        type="text"
                        required
                        value={editingJob.title || ''}
                        onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400">DEPARTMENT</label>
                      <input
                        type="text"
                        value={editingJob.department || 'Engineering'}
                        onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400">LOCATION</label>
                      <input
                        type="text"
                        value={editingJob.location || 'Montreal / Remote'}
                        onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                        className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400">EXPERIENCE</label>
                      <input
                        type="text"
                        value={editingJob.experience || 'Senior'}
                        onChange={(e) => setEditingJob({ ...editingJob, experience: e.target.value as any })}
                        className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400">STATUS</label>
                      <select
                        value={editingJob.status || 'open'}
                        onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value as any })}
                        className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                      >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-zinc-400">JOB DESCRIPTION</label>
                    <textarea
                      rows={3}
                      value={editingJob.description || ''}
                      onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#090b10] border border-white/10 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingJob(null)}
                      className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-editorial uppercase"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-full bg-[#ff5722] hover:bg-[#f04814] text-xs font-editorial font-bold uppercase"
                    >
                      SAVE VACANCY
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-mono text-zinc-400 uppercase">
                      POSTED ROLES ({jobs.length})
                    </h3>
                    <button
                      onClick={() =>
                        setEditingJob({
                          title: '',
                          department: 'Engineering',
                          location: 'Montreal / Remote',
                          type: 'Full-time (4-Day Week)',
                          experience: 'Senior',
                          description: '',
                          status: 'open',
                          responsibilities: ['Architect systems'],
                          requirements: ['Experience with C++ / Unreal'],
                          perks: ['4-day week', 'Profit pool']
                        })
                      }
                      className="px-4 py-2 rounded-full bg-[#ff5722] text-white text-xs font-editorial font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>POST ROLE</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-4 rounded-2xl bg-[#141624] border border-white/10 flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[11px] font-mono">
                            <span className="text-[#ff5722]">{job.department}</span>
                            <span className="text-zinc-500">•</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                job.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
                              }`}
                            >
                              {job.status.toUpperCase()}
                            </span>
                          </div>
                          <h4 className="text-sm font-display font-bold text-white truncate">
                            {job.title}
                          </h4>
                          <div className="text-xs text-zinc-400 font-sans">{job.location}</div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setEditingJob(job)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${job.title}"?`)) deleteJob(job.id);
                            }}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-mono text-zinc-400 uppercase">
                    NEWSLETTER REGISTERED CONTACTS ({subscribers.length})
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans">
                    Player email frequencies registered from drops and footer signup.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportSubscribersCSV}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-editorial uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={13} />
                    <span>EXPORT CSV</span>
                  </button>
                  <button
                    onClick={exportSubscribersJSON}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-editorial uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={13} />
                    <span>EXPORT JSON</span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#141624] text-zinc-400 border-b border-white/10">
                    <tr>
                      <th className="p-3">NAME</th>
                      <th className="p-3">EMAIL FREQUENCY</th>
                      <th className="p-3">CHANNELS</th>
                      <th className="p-3">DATE REGISTERED</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#0e1017]">
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-white/5">
                        <td className="p-3 text-white font-sans">{sub.name || 'Anonymous Pilot'}</td>
                        <td className="p-3 text-[#22d3ee]">{sub.email}</td>
                        <td className="p-3 text-zinc-400">
                          {sub.interests?.join(', ') || 'All Drops'}
                        </td>
                        <td className="p-3 text-zinc-500">{sub.subscribedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT INBOX */}
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-mono text-zinc-400 uppercase">
                    STUDIO INBOX ({contacts.length} TRANSMISSIONS)
                  </h3>
                  <p className="text-xs text-zinc-500 font-sans">
                    Direct communications sent via the contact terminal.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-[#141624] border border-white/10 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2 text-xs">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="px-2 py-0.5 rounded bg-[#ff5722]/20 text-[#ff5722] font-bold">
                          {c.category}
                        </span>
                        <span className="text-white font-bold">{c.name}</span>
                        <span className="text-zinc-500">({c.email})</span>
                        {c.company && (
                          <span className="text-[#22d3ee]">@ {c.company}</span>
                        )}
                      </div>
                      <span className="text-zinc-500 font-mono text-[11px]">{c.createdAt}</span>
                    </div>

                    <div className="text-sm font-display font-bold text-white">
                      {c.subject}
                    </div>

                    <p className="text-xs text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap">
                      {c.message}
                    </p>

                    {c.budget && (
                      <div className="text-[11px] font-mono text-[#fbbf24]">
                        ESTIMATED BUDGET: {c.budget}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
