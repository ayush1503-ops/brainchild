import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Copy,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  Star,
  Flag,
  MoreVertical
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { Game, GameCategory } from '../../types';

const GAME_STATUSES = ['In Development', 'Early Access', 'Wishlist Now', 'Available Now'] as const;
const GAME_CATEGORIES: GameCategory[] = ['Action', 'Puzzle', 'Racing', 'Adventure', 'Sports', 'RPG', 'Horror', 'Indie'];

const inputCls = 'w-full rounded-xl border-2 border-ink/15 bg-cream px-3.5 py-2.5 text-sm font-semibold text-ink placeholder-inksoft/60 focus:border-grape focus:outline-none';
const labelCls = 'text-[10px] font-extrabold uppercase tracking-widest text-inksoft';
const btnPrimary = 'inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-coral px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sticker-sm transition-all hover:-translate-y-0.5 hover:bg-coraldeep cursor-pointer';
const btnSecondary = 'inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-cream px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5 hover:bg-sand cursor-pointer';
const btnDanger = 'inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-cream px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-coral transition-all hover:-translate-y-0.5 hover:bg-coral hover:text-white cursor-pointer';

export const AdminGames: React.FC = () => {
  const { games, addGame, updateGame, deleteGame, notify } = useStudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingGame, setEditingGame] = useState<Partial<Game> | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Game; direction: 'asc' | 'desc' }>({ key: 'title', direction: 'asc' });

  const filteredGames = games
    .filter((g) => {
      const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || g.categories?.includes(categoryFilter as GameCategory);
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (key: keyof Game) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const saveGame = () => {
    if (!editingGame?.title) return;
    if (editingGame.id) {
      const existing = games.find(g => g.id === editingGame.id);
      if (existing) {
        updateGame({ ...existing, ...editingGame } as Game);
        notify('Game updated ✓');
      }
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
      notify('New game added to the shelf 🎉');
    }
    setEditingGame(null);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}" from the shelf? This cannot be undone.`)) {
      deleteGame(id);
      notify('Game removed from shelf');
    }
  };

  const handleDuplicate = (game: Game) => {
    addGame({
      ...game,
      id: `game-${Date.now()}`,
      slug: `${game.slug}-copy`,
      title: `${game.title} (Copy)`,
      featured: false
    });
    notify('Game duplicated');
  };

  const StatusBadge: React.FC<{ status: Game['status'] }> = ({ status }) => {
    const colors: Record<Game['status'], string> = {
      'In Development': 'bg-grape/10 text-grape border-grape/20',
      'Early Access': 'bg-sun text-ink border-sun/20',
      'Wishlist Now': 'bg-coral/10 text-coral border-coral/20',
      'Available Now': 'bg-lime text-ink border-lime/20'
    };
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const CategoryBadge: React.FC<{ categories?: GameCategory[] }> = ({ categories }) => (
    <div className="flex flex-wrap gap-1">
      {categories?.slice(0, 3).map((cat) => (
        <span key={cat} className="rounded-full bg-sand px-2 py-0.5 text-[10px] font-bold text-inksoft">{cat}</span>
      ))}
      {categories && categories.length > 3 && (
        <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-bold text-inksoft">+{categories.length - 3}</span>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">Games Management</h2>
          <p className="text-sm font-medium text-inksoft">Manage your studio's game portfolio</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setEditingGame({})}
            className={btnPrimary}
          >
            <Plus size={14} /> Add Game
          </button>
          <div className="flex items-center gap-2 border-2 border-ink/10 bg-cream rounded-xl px-3 py-1.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-ink text-white' : 'text-inksoft hover:text-ink'}`}
              aria-label="Grid view"
            >
              <Gamepad2 size={14} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-ink text-white' : 'text-inksoft hover:text-ink'}`}
              aria-label="Table view"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 rounded-2xl border-2 border-ink/10 bg-cream p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-inksoft" />
          <input
            type="text"
            placeholder="Search games by title, genre, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputCls} pl-10`}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${inputCls} w-auto`}
          >
            <option value="all">All Statuses</option>
            {GAME_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`${inputCls} w-auto`}
          >
            <option value="all">All Categories</option>
            {GAME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Games Grid/Table */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-2xl border-2 border-ink/10 bg-cream shadow-sticker-sm transition-all hover:shadow-sticker"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={game.heroImage}
                    alt={game.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <StatusBadge status={game.status} />
                    {game.featured && (
                      <span className="flex items-center gap-1 rounded-full bg-sun px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-ink">
                        <Star size={10} /> Featured
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink truncate">{game.title}</h3>
                  <p className="text-sm font-medium text-inksoft truncate">{game.subtitle}</p>
                  <CategoryBadge categories={game.categories} />
                  <div className="flex items-center justify-between pt-2 border-t border-ink/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-inksoft">{game.releaseYear}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingGame(game)}
                        className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink/10 bg-paper text-inksoft hover:border-ink hover:text-ink hover:bg-sand transition-colors"
                        aria-label={`Edit ${game.title}`}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(game)}
                        className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink/10 bg-paper text-inksoft hover:border-sun hover:text-sun hover:bg-sand transition-colors"
                        aria-label={`Duplicate ${game.title}`}
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(game.id, game.title)}
                        className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink/10 bg-paper text-coral hover:border-coral hover:bg-coral/10 transition-colors"
                        aria-label={`Delete ${game.title}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredGames.length === 0 && (
              <div className="col-span-full rounded-2xl border-2 border-dashed border-ink/20 bg-cream/60 p-12 text-center">
                <Gamepad2 size={48} className="mx-auto mb-4 text-ink/20" />
                <p className="text-lg font-semibold text-inksoft">No games found</p>
                <p className="mt-1 text-sm text-ink/50">Try adjusting your search or filters</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border-2 border-ink bg-cream overflow-hidden shadow-sticker-sm"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2 border-ink bg-sun/30">
                  <tr>
                    {[
                      { key: 'heroImage', label: '' },
                      { key: 'title', label: 'Title' },
                      { key: 'genre', label: 'Genre' },
                      { key: 'categories', label: 'Categories' },
                      { key: 'status', label: 'Status' },
                      { key: 'releaseYear', label: 'Release' },
                      { key: 'featured', label: 'Featured' },
                      { key: 'actions', label: 'Actions' }
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-widest text-inksoft cursor-pointer hover:text-ink"
                        onClick={() => col.key !== 'heroImage' && col.key !== 'actions' && handleSort(col.key as keyof Game)}
                      >
                        <div className="flex items-center gap-1">
                          <span>{col.label}</span>
                          {sortConfig.key === col.key && (
                            <span>{sortConfig.direction === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />}</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {filteredGames.map((game) => (
                    <tr key={game.id} className="hover:bg-sand/50 transition-colors">
                      <td className="px-4 py-3">
                        <img src={game.heroImage} alt="" className="h-12 w-16 rounded-lg border-2 border-ink/10 object-cover" />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-display text-sm font-extrabold uppercase text-ink">{game.title}</p>
                        <p className="text-xs font-medium text-inksoft truncate max-w-xs">{game.subtitle}</p>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-inksoft">{game.genre}</td>
                      <td className="px-4 py-3"><CategoryBadge categories={game.categories} /></td>
                      <td className="px-4 py-3"><StatusBadge status={game.status} /></td>
                      <td className="px-4 py-3 text-sm font-medium text-inksoft">{game.releaseYear}</td>
                      <td className="px-4 py-3">
                        {game.featured ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sun px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-ink">
                            <Star size={10} /> Yes
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-ink/30">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingGame(game)}
                            className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink/10 bg-paper text-inksoft hover:border-ink hover:text-ink hover:bg-sand transition-colors"
                            aria-label={`Edit ${game.title}`}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDuplicate(game)}
                            className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink/10 bg-paper text-inksoft hover:border-sun hover:text-sun hover:bg-sand transition-colors"
                            aria-label={`Duplicate ${game.title}`}
                          >
                            <Copy size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(game.id, game.title)}
                            className="grid h-8 w-8 place-items-center rounded-lg border-2 border-ink/10 bg-paper text-coral hover:border-coral hover:bg-coral/10 transition-colors"
                            aria-label={`Delete ${game.title}`}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredGames.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-inksoft">
                        No games found. Try adjusting your search or filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {editingGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
            onClick={() => setEditingGame(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[28px] border-2 border-ink bg-paper shadow-lift"
            >
              <div className="sticky top-0 flex items-center justify-between border-b-2 border-ink bg-sun px-6 py-4">
                <div>
                  <div className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
                    {editingGame.id ? 'Edit Game' : 'Create New Game'}
                  </div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-ink/60">
                    {editingGame.id ? 'Changes save to browser storage' : 'All fields are optional except title'}
                  </div>
                </div>
                <button
                  onClick={() => setEditingGame(null)}
                  className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-cream text-ink shadow-sticker-sm transition-all hover:bg-coral hover:text-white cursor-pointer"
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1 sm:col-span-2">
                    <label className={labelCls}>Title *</label>
                    <input
                      className={inputCls}
                      value={editingGame.title || ''}
                      onChange={(e) => setEditingGame({ ...editingGame, title: e.target.value })}
                      placeholder="AETHERBOUND"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Subtitle</label>
                    <input className={inputCls} value={editingGame.subtitle || ''} onChange={(e) => setEditingGame({ ...editingGame, subtitle: e.target.value })} placeholder="Echoes of Zero" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Genre</label>
                    <input className={inputCls} value={editingGame.genre || ''} onChange={(e) => setEditingGame({ ...editingGame, genre: e.target.value })} placeholder="Sky-Island Adventure" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Status</label>
                    <select className={inputCls} value={editingGame.status || 'In Development'} onChange={(e) => setEditingGame({ ...editingGame, status: e.target.value as Game['status'] })}>
                      {GAME_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Release Window</label>
                    <input className={inputCls} value={editingGame.releaseYear || ''} onChange={(e) => setEditingGame({ ...editingGame, releaseYear: e.target.value })} placeholder="Q4 2026" />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Price Label</label>
                    <input className={inputCls} value={editingGame.price || ''} onChange={(e) => setEditingGame({ ...editingGame, price: e.target.value })} placeholder="$24.99 / Wishlist free" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className={labelCls}>Platforms (comma separated)</label>
                    <input className={inputCls} value={editingGame.platforms?.join(', ') || ''} onChange={(e) => setEditingGame({ ...editingGame, platforms: e.target.value.split(',').map(p => p.trim()) })} placeholder="PC (Steam), PlayStation 5, Xbox Series X|S" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className={labelCls}>Categories</label>
                    <select
                      className={inputCls}
                      multiple
                      value={editingGame.categories || []}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, (o: HTMLOptionElement) => o.value);
                        setEditingGame({ ...editingGame, categories: selected as GameCategory[] });
                      }}
                    >
                      {GAME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <p className="text-[10px] font-medium text-inksoft">Hold Ctrl/Cmd to select multiple</p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className={labelCls}>Hero Image Path</label>
                    <input className={inputCls} value={editingGame.heroImage || ''} onChange={(e) => setEditingGame({ ...editingGame, heroImage: e.target.value })} placeholder="/src/assets/images/art_week_wide.jpg" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className={labelCls}>Short Description</label>
                    <textarea className={inputCls} rows={2} value={editingGame.description || ''} onChange={(e) => setEditingGame({ ...editingGame, description: e.target.value })} placeholder="A one-sentence hook for cards and previews." />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className={labelCls}>Long Description</label>
                    <textarea className={inputCls} rows={3} value={editingGame.longDescription || ''} onChange={(e) => setEditingGame({ ...editingGame, longDescription: e.target.value })} placeholder="Full description for the game detail page." />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className={labelCls}>Dev Story</label>
                    <textarea className={inputCls} rows={3} value={editingGame.devStory || ''} onChange={(e) => setEditingGame({ ...editingGame, devStory: e.target.value })} placeholder="Behind-the-scenes story for the game page." />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className={labelCls}>Tags (comma separated)</label>
                    <input className={inputCls} value={editingGame.tags?.join(', ') || ''} onChange={(e) => setEditingGame({ ...editingGame, tags: e.target.value.split(',').map(t => t.trim()) })} placeholder="Sky Islands, Grapple, Exploration, Feel-Good" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className={labelCls}>Features (one per line)</label>
                    <textarea className={inputCls} rows={3} value={editingGame.features?.join('\n') || ''} onChange={(e) => setEditingGame({ ...editingGame, features: e.target.value.split('\n').map(f => f.trim()).filter(Boolean) })} placeholder="Momentum-based tether grappling\nHand-painted shrines and villages" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingGame.featured}
                      onChange={(e) => setEditingGame({ ...editingGame, featured: e.target.checked })}
                      className="h-4 w-4 rounded border-2 border-ink text-coral focus:ring-2 focus:ring-coral"
                    />
                    Feature on homepage hero
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t-2 border-ink">
                  <button onClick={() => setEditingGame(null)} className={btnSecondary}>
                    Cancel
                  </button>
                  <button onClick={saveGame} className={btnPrimary}>
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    {editingGame.id ? 'Save Changes' : 'Create Game'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};