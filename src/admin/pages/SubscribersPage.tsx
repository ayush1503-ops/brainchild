import React, { useState, useEffect } from 'react';
import { Mail, Download, Search, Filter, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { subscribersApi } from '../utils/api';
import { notify } from '../utils/toast';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';

interface SubscriberItem {
  id: string;
  email: string;
  name?: string;
  interests: string[];
  status: 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED';
  subscribedAt: string;
}

export const SubscribersPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState<SubscriberItem | null>(null);

  const loadSubscribers = async () => {
    setIsLoading(true);
    try {
      const res = await subscribersApi.getAll({
        search: search || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined
      });
      setSubscribers(res.data.subscribers || res.data);
    } catch (err: any) {
      notify(err.response?.data?.error || 'Failed to load subscribers', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, [search, statusFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await subscribersApi.delete(deleteTarget.id);
      notify('Subscriber removed', 'success');
      setDeleteTarget(null);
      loadSubscribers();
    } catch (err: any) {
      notify(err.response?.data?.error || 'Failed to remove subscriber', 'error');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Email', 'Name', 'Interests', 'Status', 'Subscribed At'];
    const rows = subscribers.map(s => [
      s.id,
      `"${s.email}"`,
      `"${s.name || ''}"`,
      `"${(s.interests || []).join('; ')}"`,
      s.status,
      new Date(s.subscribedAt).toISOString()
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brainchild_subscribers_${Date.now()}.csv`;
    link.click();
    notify('Subscribers CSV exported', 'success');
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(subscribers, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brainchild_subscribers_${Date.now()}.json`;
    link.click();
    notify('Subscribers JSON exported', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink flex items-center gap-2">
            <Mail className="text-grape" /> Newsletter Subscribers
          </h1>
          <p className="text-sm font-medium text-inksoft">
            Manage mailing list subscriptions, interest tags, and data exports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl border-2 border-ink bg-cream px-3 py-2 text-xs font-bold text-ink hover:bg-sand cursor-pointer shadow-sticker-sm"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 rounded-xl border-2 border-ink bg-cream px-3 py-2 text-xs font-bold text-ink hover:bg-sand cursor-pointer shadow-sticker-sm"
          >
            <Download size={14} /> Export JSON
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-cream p-4 rounded-2xl border-2 border-ink shadow-sticker-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-inksoft" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search subscribers by email or name..."
            className="w-full rounded-xl border-2 border-ink/15 bg-paper px-4 py-2 pl-9 text-xs font-semibold text-ink placeholder-inksoft focus:border-grape focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-inksoft" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-xl border-2 border-ink/15 bg-paper px-3 py-2 text-xs font-bold text-ink focus:border-grape focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="UNSUBSCRIBED">Unsubscribed</option>
            <option value="BOUNCED">Bounced</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border-2 border-ink bg-cream overflow-hidden shadow-sticker-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead className="border-b-2 border-ink bg-sand/50 text-[10px] uppercase tracking-wider text-inksoft">
              <tr>
                <th className="p-4">Subscriber</th>
                <th className="p-4">Interests</th>
                <th className="p-4">Status</th>
                <th className="p-4">Subscribed Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y border-ink/10">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-inksoft">Loading subscribers...</td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-inksoft">No subscribers found.</td>
                </tr>
              ) : (
                subscribers.map(sub => (
                  <tr key={sub.id} className="hover:bg-sand/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-ink">{sub.name || 'Anonymous Fleet Member'}</p>
                        <p className="text-[10px] text-inksoft">{sub.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(sub.interests || []).map((interest, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-paper text-[10px] font-bold text-inksoft border border-ink/10">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                        sub.status === 'ACTIVE' ? 'bg-moss/10 text-moss border-moss/20' :
                        sub.status === 'UNSUBSCRIBED' ? 'bg-coral/10 text-coral border-coral/20' :
                        'bg-paper text-inksoft border-ink/10'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4 text-inksoft">
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setDeleteTarget(sub)}
                        className="p-1.5 rounded-lg border border-coral/30 bg-coral/10 text-coral hover:bg-coral hover:text-white transition-colors cursor-pointer"
                        title="Remove Subscriber"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Remove Subscriber"
        message={`Are you sure you want to remove "${deleteTarget?.email}" from the newsletter list?`}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
