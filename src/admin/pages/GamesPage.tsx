import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Filter, MoreVertical, Edit2, Trash2, Copy, Eye,
  ExternalLink, Flag, Star, Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { gamesApi } from '../utils/api';
import { Game } from '../types';
import { notify } from '../utils/toast';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'IN_DEVELOPMENT', label: 'In Development' },
  { value: 'EARLY_ACCESS', label: 'Early Access' },
  { value: 'WISHLIST_NOW', label: 'Wishlist Now' },
  { value: 'AVAILABLE_NOW', label: 'Available Now' }
];

const STATUS_BADGES: Record<string, string> = {
  IN_DEVELOPMENT: 'bg-grape text-white',
  EARLY_ACCESS: 'bg-sun text-ink',
  WISHLIST_NOW: 'bg-coral text-white',
  AVAILABLE_NOW: 'bg-lime text-ink'
};

export const GamesPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<PaginationParams['sortBy']>('createdAt');
  const [sortOrder, setSortOrder] = useState<PaginationParams['sortOrder']>('desc');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const res = await gamesApi.getAll({ page: pagination.page, limit: pagination.limit, sortBy, sortOrder, search: search || undefined });
      setGames(res.data.games);
      setPagination(res.data.pagination);
    } catch (error) {
      notify('Failed to load games', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchGames(); }, [pagination.page, sortBy, sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(p => ({ ...p, page: 1 }));
    fetchGames();
  };

  const handleStatusChange = async (game: Game, published: boolean) => {
    try {
      await gamesApi.publish(game.id, published);
      notify(published ? 'Game published' : 'Game unpublished', 'success');
      fetchGames();
    } catch {
      notify('Failed to update game', 'error');
    }
  };

  const handleFeaturedChange = async (game: Game, featured: boolean) => {
    try {
      await gamesApi.featured(game.id, featured);
      notify(featured ? 'Game featured' : 'Game unfeatured', 'success');
      fetchGames();
    } catch {
      notify('Failed to update featured status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this game permanently?')) return;
    setDeletingId(id);
    try {
      await gamesApi.delete(id);
      notify('Game deleted', 'success');
      fetchGames();
    } catch {
      notify('Failed to delete game', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await gamesApi.duplicate(id);
      notify('Game duplicated', 'success');
      fetchGames();
    } catch {
      notify('Failed to duplicate game', 'error');
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink">Games</h1>
          <p className="mt-1 text-sm font-medium text-inksoft">Manage your game catalog</p>
        </div>
        <Link to="/admin/games/new" className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-coral px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white shadow-sticker hover:-translate-y-0.5 hover:bg-coraldeep transition-all">
          <Plus size={16} /> Add Game
        </Link>
      </div>

      <div className="rounded-2xl border-2 border-ink/10 bg-cream shadow-soft">
        <div className="border-b-2 border-ink/10 p-4">
          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-inksoft" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search games..."
                className="w-full rounded-xl border-2 border-ink/15 bg-cream px-4 py-2.5 pl-11 text-sm font-semibold text-ink placeholder-inksoft/60 focus:border-grape focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); fetchGames(); }}
              className="rounded-xl border-2 border-ink/15 bg-cream px-4 py-2.5 text-sm font-semibold text-ink focus:border-grape focus:outline-none"
            >
              {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" role="grid">
            <thead>
              <tr className="border-b-2 border-ink/10 bg-sand/50 text-left text-[10px] font-extrabold uppercase tracking-wider text-inksoft">
                <th className="px-4 py-3">Game</th>
                <th className="px-4 py-3 hidden md:table-cell">Price</th>
                <th className="px-4 py-3 hidden lg:table-cell">Status</th>
                <th className="px-4 py-3 hidden xl:table-cell">Release</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {isLoading && games.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center"><Loader2 className="animate-spin h-8 w-8 mx-auto text-grape" /></td></tr>
              ) : games.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-inksoft">No games found</td></tr>
              ) : (
                games.map(game => (
                  <tr key={game.id} className="hover:bg-sand/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/admin/games/${game.id}`} className="flex items-center gap-3">
                        {game.heroImage && <img src={game.heroImage} alt="" className="h-10 w-14 rounded-lg border-2 border-ink/10 object-cover" />}
                        <div>
                          <p className="font-semibold text-ink">{game.title}</p>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-inksoft">{game.genre}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell font-mono text-sm font-bold text-ink">{game.price}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className={`inline-flex items-center gap-1 rounded-full border-2 border-ink px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider ${STATUS_BADGES[game.status]}`}>
                        {game.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell text-sm font-medium text-inksoft">{game.releaseYear}</td>
                    <td className="px-4 py-3">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={game.featured}
                          onChange={e => handleFeaturedChange(game, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className={`relative h-5 w-10 rounded-full border-2 border-ink transition-colors peer-checked:bg-grape peer-checked:border-grape ${game.featured ? 'bg-grape' : 'bg-cream'}`}>
                          <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full border-2 border-ink bg-white transition-transform ${game.featured ? 'translate-x-5' : ''}`} />
                        </div>
                      </label>
                    </td>
                    <td className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-inksoft">{formatDate(game.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/admin/games/${game.id}`} className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink/15 bg-cream text-ink hover:bg-sun transition-colors" title="Edit"><Edit2 size={14} /></Link>
                        <Link to={`/admin/games/${game.id}`} className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink/15 bg-cream text-ink hover:bg-sun transition-colors" title="View"><Eye size={14} /></Link>
                        <button onClick={() => handleDuplicate(game.id)} className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink/15 bg-cream text-ink hover:bg-sun transition-colors" title="Duplicate"><Copy size={14} /></button>
                        <button onClick={() => handleDelete(game.id)} disabled={deletingId === game.id} className="grid h-9 w-9 place-items-center rounded-lg border-2 border-ink/15 bg-cream text-coral hover:bg-coral hover:text-white transition-colors disabled:opacity-50" title="Delete">
                          {deletingId === game.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t-2 border-ink/10 px-4 py-3">
            <p className="text-sm font-medium text-inksoft">Page {pagination.page} of {pagination.totalPages} · {pagination.total} games</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))} disabled={pagination.page === 1} className="rounded-lg border-2 border-ink/15 bg-cream px-3 py-1.5 text-sm font-bold disabled:opacity-50">Prev</button>
              <button onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))} disabled={pagination.page === pagination.totalPages} className="rounded-lg border-2 border-ink/15 bg-cream px-3 py-1.5 text-sm font-bold disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};