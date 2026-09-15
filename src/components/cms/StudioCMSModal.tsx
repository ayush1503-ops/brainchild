import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Download, Gamepad2, Newspaper, Briefcase, Users, MessageSquare, Save, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { useStudio } from '../../context/StudioContext';
import { Game, Article, Job } from '../../types';

type Tab = 'games' | 'news' | 'jobs' | 'subscribers' | 'contacts';

const inputCls =
  'w-full rounded-xl border-2 border-ink/15 bg-cream px-3.5 py-2.5 text-sm font-semibold text-ink placeholder-inksoft/60 focus:border-grape focus:outline-none';
const labelCls = 'text-[10px] font-extrabold uppercase tracking-widest text-inksoft';
const btnSmall =
  'inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-cream px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5 hover:bg-sun cursor-pointer';

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
    exportSubscribersCSV,
    exportSubscribersJSON,
    contactMessages,
    markContactStatus,
    notify
  } = useStudio();

  const [tab, setTab] = useState<Tab>('games');
  const [editingGame, setEditingGame] = useState<Partial<Game> | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [editingJob, setEditingJob] = useState<Partial<Job> | null>(null);

  if (!isCmsOpen) return null;

  const close = () => setIsCmsOpen(false);

  /* ---------- games ---------- */
  const saveGame = () => {
    if (!editingGame?.title) return;
    if (editingGame.id) {
      updateGame({ ...(games.find((g) => g.id === editingGame.id) as Game), ...editingGame } as Game);
      notify('Game updated in the shelf ✓');
    } else {
      const base = games[0];
      addGame({
        slug: editingGame.title.toLowerCase().replace(/\s+/g, '-'),
        subtitle: editingGame.subtitle || 'A New World',
        genre: editingGame.genre || 'Indie Adventure',
        categories: editingGame.categories ?? ['Indie'],
        rating: editingGame.rating ?? 4.5,
        price: editingGame.price ?? 'Wishlist free',
        platforms: editingGame.platforms ?? ['PC (Steam)'],
        status: editingGame.status ?? 'In Development',
        releaseYear: editingGame.releaseYear ?? '2027',
        description: editingGame.description || 'A brand new world, fresh from the jam room.',
        longDescription: editingGame.longDescription || editingGame.description || 'A brand new world.',
        heroImage: editingGame.heroImage || base?.heroImage || '/src/assets/images/art_week_wide.jpg',
        screenshots: editingGame.screenshots ?? [editingGame.heroImage || base?.heroImage || '/src/assets/images/art_week_wide.jpg'],
        tags: editingGame.tags ?? ['New'],
        features: editingGame.features ?? ['Secret mechanics, TBD'],
        gameplayMechanics: editingGame.gameplayMechanics ?? [{ title: 'TBD', description: 'Prototyping in the jam room.' }],
        devStory: editingGame.devStory || 'Born in a jam week.',
        storeLinks: editingGame.storeLinks ?? [{ name: 'Steam', url: '#steam', badge: 'Wishlist' }],
        title: editingGame.title,
        featured: editingGame.featured ?? false
      });
      notify('New world added to the shelf 🎉');
    }
    setEditingGame(null);
  };

  /* ---------- news ---------- */
  const saveArticle = () => {
    if (!editingArticle?.title) return;
    if (editingArticle.id) {
      updateArticle({ ...(news.find((a) => a.id === editingArticle.id) as Article), ...editingArticle } as Article);
      notify('Story updated ✓');
    } else {
      addArticle({
        slug: editingArticle.title.toLowerCase().replace(/\s+/g, '-'),
        category: editingArticle.category ?? 'NEWS',
        date: editingArticle.date ?? 'SEPTEMBER 2026',
        readTime: editingArticle.readTime ?? '3 MIN READ',
        excerpt: editingArticle.excerpt || '',
        content: editingArticle.content || editingArticle.excerpt || '',
        coverImage: editingArticle.coverImage || '/src/assets/images/art_studio.jpg',
        author: editingArticle.author ?? { name: 'Studio Bot', role: 'Editor' },
        tags: editingArticle.tags ?? ['Studio'],
        title: editingArticle.title,
        featured: editingArticle.featured ?? false,
        published: editingArticle.published ?? true
      });
      notify('Story published 📰');
    }
    setEditingArticle(null);
  };

  /* ---------- jobs ---------- */
  const saveJob = () => {
    if (!editingJob?.title) return;
    if (editingJob.id) {
      updateJob({ ...(jobs.find((j) => j.id === editingJob.id) as Job), ...editingJob } as Job);
      notify('Role updated ✓');
    } else {
      addJob({
        department: editingJob.department ?? 'Engineering',
        location: editingJob.location ?? 'Montreal / Remote',
        type: editingJob.type ?? 'Full-time',
        experience: editingJob.experience ?? 'Senior',
        description: editingJob.description || 'Come build worlds with us.',
        responsibilities: editingJob.responsibilities ?? ['Make excellent things'],
        requirements: editingJob.requirements ?? ['Be curious and kind'],
        niceToHave: editingJob.niceToHave ?? [],
        perks: editingJob.perks ?? ['4-day work week', 'Profit sharing'],
        status: editingJob.status ?? 'open',
        postedDate: editingJob.postedDate ?? 'SEPTEMBER 2026',
        title: editingJob.title
      });
      notify('New role posted 💼');
    }
    setEditingJob(null);
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'games', label: 'Games', icon: <Gamepad2 size={14} />, count: games.length },
    { id: 'news', label: 'News', icon: <Newspaper size={14} />, count: news.length },
    { id: 'jobs', label: 'Jobs', icon: <Briefcase size={14} />, count: jobs.length },
    { id: 'subscribers', label: 'Subscribers', icon: <Users size={14} />, count: subscribers.length },
    { id: 'contacts', label: 'Inbox', icon: <MessageSquare size={14} />, count: contactMessages.length }
  ];

  return (
    <div className="fixed inset-0 z-[75] overflow-y-auto bg-ink/50 p-2 backdrop-blur-sm sm:p-6" onClick={close}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="mx-auto my-auto w-full max-w-5xl overflow-hidden rounded-[28px] border-2 border-ink bg-paper shadow-lift"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-ink bg-sun px-6 py-4">
          <div>
            <div className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">Studio CMS</div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-ink/60">
              Content manager · edits save to this browser
            </div>
          </div>
          <button
            onClick={close}
            className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-cream text-ink shadow-sticker-sm transition-all hover:bg-coral hover:text-white cursor-pointer"
            aria-label="Close CMS"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b-2 border-ink/10 bg-cream px-6 py-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                tab === t.id ? '-rotate-1 bg-grape text-white shadow-sticker-sm' : 'bg-paper text-inksoft hover:text-ink'
              }`}
            >
              {t.icon} {t.label}
              <span className="rounded-full bg-ink/10 px-1.5 text-[10px]">{t.count}</span>
            </button>
          ))}
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-6">
          {/* ------------ GAMES ------------ */}
          {tab === 'games' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setEditingGame({})} className={btnSmall}>
                  <Plus size={13} /> New game
                </button>
              </div>

              {editingGame && (
                <div className="space-y-3 rounded-2xl border-2 border-ink bg-cream p-5 shadow-sticker-sm">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className={labelCls}>Title *</label>
                      <input className={inputCls} value={editingGame.title || ''} onChange={(e) => setEditingGame({ ...editingGame, title: e.target.value })} placeholder="SKYFORGE" />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Subtitle</label>
                      <input className={inputCls} value={editingGame.subtitle || ''} onChange={(e) => setEditingGame({ ...editingGame, subtitle: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Genre</label>
                      <input className={inputCls} value={editingGame.genre || ''} onChange={(e) => setEditingGame({ ...editingGame, genre: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Status</label>
                      <select className={inputCls} value={editingGame.status || 'In Development'} onChange={(e) => setEditingGame({ ...editingGame, status: e.target.value as Game['status'] })}>
                        {['In Development', 'Early Access', 'Wishlist Now', 'Available Now'].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Release window</label>
                      <input className={inputCls} value={editingGame.releaseYear || ''} onChange={(e) => setEditingGame({ ...editingGame, releaseYear: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Price label</label>
                      <input className={inputCls} value={editingGame.price || ''} onChange={(e) => setEditingGame({ ...editingGame, price: e.target.value })} placeholder="$24.99 / Wishlist free" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className={labelCls}>Hero image path</label>
                      <input className={inputCls} value={editingGame.heroImage || ''} onChange={(e) => setEditingGame({ ...editingGame, heroImage: e.target.value })} placeholder="/src/assets/images/art_week_wide.jpg" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className={labelCls}>Short description</label>
                      <textarea className={inputCls} rows={2} value={editingGame.description || ''} onChange={(e) => setEditingGame({ ...editingGame, description: e.target.value })} />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-bold text-ink">
                    <input type="checkbox" checked={!!editingGame.featured} onChange={(e) => setEditingGame({ ...editingGame, featured: e.target.checked })} />
                    Feature on homepage
                  </label>
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveGame} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-coral px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sticker-sm cursor-pointer">
                      <Save size={13} /> Save
                    </button>
                    <button onClick={() => setEditingGame(null)} className={btnSmall}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {games.map((g) => (
                <div key={g.id} className="flex items-center gap-4 rounded-2xl border-2 border-ink/10 bg-cream p-3">
                  <img src={g.heroImage} alt="" className="h-14 w-20 rounded-xl border-2 border-ink/10 object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-sm font-extrabold uppercase text-ink">{g.title}</div>
                    <div className="truncate text-xs font-semibold text-inksoft">
                      {g.genre} · {g.status} · {g.releaseYear}
                    </div>
                  </div>
                  <button onClick={() => setEditingGame(g)} className={btnSmall} aria-label={`Edit ${g.title}`}>
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${g.title} from the shelf?`)) deleteGame(g.id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-cream px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-coral transition-all hover:-translate-y-0.5 hover:bg-coral hover:text-white cursor-pointer"
                    aria-label={`Delete ${g.title}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ------------ NEWS ------------ */}
          {tab === 'news' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setEditingArticle({})} className={btnSmall}>
                  <Plus size={13} /> New story
                </button>
              </div>

              {editingArticle && (
                <div className="space-y-3 rounded-2xl border-2 border-ink bg-cream p-5 shadow-sticker-sm">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1 sm:col-span-2">
                      <label className={labelCls}>Title *</label>
                      <input className={inputCls} value={editingArticle.title || ''} onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Category</label>
                      <select className={inputCls} value={editingArticle.category || 'NEWS'} onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as Article['category'] })}>
                        {['NEWS', 'DEVLOG', 'BEHIND THE SCENES', 'ANNOUNCEMENT', 'STUDIO', 'COMMUNITY'].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Date</label>
                      <input className={inputCls} value={editingArticle.date || ''} onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })} placeholder="SEPTEMBER 2026" />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Read time</label>
                      <input className={inputCls} value={editingArticle.readTime || ''} onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })} placeholder="4 MIN READ" />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Author name</label>
                      <input className={inputCls} value={editingArticle.author?.name || ''} onChange={(e) => setEditingArticle({ ...editingArticle, author: { name: e.target.value, role: editingArticle.author?.role || 'Studio' } })} />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className={labelCls}>Cover image path</label>
                      <input className={inputCls} value={editingArticle.coverImage || ''} onChange={(e) => setEditingArticle({ ...editingArticle, coverImage: e.target.value })} />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className={labelCls}>Excerpt</label>
                      <textarea className={inputCls} rows={2} value={editingArticle.excerpt || ''} onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })} />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className={labelCls}>Body (blank line = new paragraph, ### = heading)</label>
                      <textarea className={inputCls} rows={5} value={editingArticle.content || ''} onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveArticle} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-coral px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sticker-sm cursor-pointer">
                      <Save size={13} /> Save
                    </button>
                    <button onClick={() => setEditingArticle(null)} className={btnSmall}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {news.map((a) => (
                <div key={a.id} className="flex items-center gap-4 rounded-2xl border-2 border-ink/10 bg-cream p-3">
                  <img src={a.coverImage} alt="" className="h-14 w-20 rounded-xl border-2 border-ink/10 object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-extrabold text-ink">{a.title}</div>
                    <div className="text-xs font-semibold text-inksoft">
                      {a.category} · {a.date} · {a.published ? 'published' : 'draft'}
                    </div>
                  </div>
                  <button onClick={() => setEditingArticle(a)} className={btnSmall}>
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this story?')) deleteArticle(a.id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-cream px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-coral transition-all hover:-translate-y-0.5 hover:bg-coral hover:text-white cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ------------ JOBS ------------ */}
          {tab === 'jobs' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setEditingJob({})} className={btnSmall}>
                  <Plus size={13} /> New role
                </button>
              </div>

              {editingJob && (
                <div className="space-y-3 rounded-2xl border-2 border-ink bg-cream p-5 shadow-sticker-sm">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1 sm:col-span-2">
                      <label className={labelCls}>Role title *</label>
                      <input className={inputCls} value={editingJob.title || ''} onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Department</label>
                      <select className={inputCls} value={editingJob.department || 'Engineering'} onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value as Job['department'] })}>
                        {['Engineering', 'Art & Animation', 'Game Design', 'Production', 'Audio', 'Community'].map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Experience</label>
                      <select className={inputCls} value={editingJob.experience || 'Senior'} onChange={(e) => setEditingJob({ ...editingJob, experience: e.target.value as Job['experience'] })}>
                        {['Mid', 'Senior', 'Lead', 'Director'].map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Location</label>
                      <input className={inputCls} value={editingJob.location || ''} onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Status</label>
                      <select className={inputCls} value={editingJob.status || 'open'} onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value as Job['status'] })}>
                        <option value="open">open</option>
                        <option value="closed">closed</option>
                      </select>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className={labelCls}>Description</label>
                      <textarea className={inputCls} rows={2} value={editingJob.description || ''} onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveJob} className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-coral px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sticker-sm cursor-pointer">
                      <Save size={13} /> Save
                    </button>
                    <button onClick={() => setEditingJob(null)} className={btnSmall}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {jobs.map((j) => (
                <div key={j.id} className="flex items-center gap-4 rounded-2xl border-2 border-ink/10 bg-cream p-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold text-ink">{j.title}</div>
                    <div className="text-xs font-semibold text-inksoft">
                      {j.department} · {j.experience} · {j.status}
                    </div>
                  </div>
                  <button onClick={() => setEditingJob(j)} className={btnSmall}>
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this role?')) deleteJob(j.id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-cream px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-coral transition-all hover:-translate-y-0.5 hover:bg-coral hover:text-white cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ------------ SUBSCRIBERS ------------ */}
          {tab === 'subscribers' && (
            <div className="space-y-4">
              <div className="flex flex-wrap justify-end gap-2">
                <button onClick={exportSubscribersCSV} className={btnSmall}>
                  <Download size={13} /> CSV
                </button>
                <button onClick={exportSubscribersJSON} className={btnSmall}>
                  <Download size={13} /> JSON
                </button>
              </div>
              {subscribers.length === 0 && (
                <p className="rounded-2xl border-2 border-dashed border-ink/20 bg-cream/60 p-8 text-center text-sm font-semibold text-inksoft">
                  No subscribers yet — the drop form is waiting.
                </p>
              )}
              {subscribers.map((s) => (
                <div key={s.id} className="flex flex-col gap-1 rounded-2xl border-2 border-ink/10 bg-cream p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-ink">{s.name}</div>
                    <div className="text-xs font-semibold text-inksoft">{s.email}</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2 sm:pt-0">
                    {s.interests.map((i) => (
                      <span key={i} className="rounded-full bg-grape/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-grape">
                        {i}
                      </span>
                    ))}
                    <span className="rounded-full bg-sand px-2.5 py-0.5 text-[10px] font-bold text-inksoft">{s.subscribedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ------------ CONTACTS ------------ */}
          {tab === 'contacts' && (
            <div className="space-y-4">
              {contactMessages.length === 0 && (
                <p className="rounded-2xl border-2 border-dashed border-ink/20 bg-cream/60 p-8 text-center text-sm font-semibold text-inksoft">
                  Inbox zero. Suspicious. Enjoy it.
                </p>
              )}
              {contactMessages.map((m) => (
                <div key={m.id} className="space-y-2 rounded-2xl border-2 border-ink/10 bg-cream p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-ink">
                      <Mail size={14} className="text-coral" /> {m.name}
                      <span className="text-xs font-semibold text-inksoft">· {m.email}</span>
                    </div>
                    <select
                      value={m.status}
                      onChange={(e) => markContactStatus(m.id, e.target.value as typeof m.status)}
                      className="rounded-lg border-2 border-ink/15 bg-paper px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-inksoft focus:border-grape focus:outline-none"
                    >
                      <option value="unread">unread</option>
                      <option value="reviewed">reviewed</option>
                      <option value="archived">archived</option>
                    </select>
                  </div>
                  <div className="text-xs font-extrabold uppercase tracking-wider text-grape">{m.subject}</div>
                  <p className="text-sm font-medium leading-relaxed text-inksoft">{m.message}</p>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-inksoft">
                    {m.projectType} · {m.createdAt}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
