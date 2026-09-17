import React, { useState, useEffect } from 'react';
import { Settings, Shield, Download, Lock, CheckCircle2, AlertOctagon, RefreshCw, Activity, Server, FileText } from 'lucide-react';
import { settingsApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { notify } from '../utils/toast';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  createdAt: string;
  adminUser?: { name?: string; email: string; role: string };
}

export const SettingsPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const [settings, setSettings] = useState({
    siteName: 'Brainchild Games',
    contactEmail: 'hello@brainchild.games',
    maintenanceMode: false,
    enableRegistrations: false,
    requireMfa: false
  });

  const [overview, setOverview] = useState<any>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const loadSettings = async () => {
    if (!isSuperAdmin) return;
    setIsLoading(true);
    try {
      const res = await settingsApi.get();
      setSettings(res.data.settings);
      setOverview(res.data.systemOverview);
      setLogs(res.data.recentLogs || []);
    } catch (err: any) {
      notify(err.response?.data?.error || 'Failed to load settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [isSuperAdmin]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsApi.update(settings);
      notify('Studio settings updated successfully', 'success');
      loadSettings();
    } catch (err: any) {
      notify(err.response?.data?.error || 'Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadBackup = async () => {
    setIsExporting(true);
    try {
      const response = await settingsApi.exportBackup();
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `brainchild_database_backup_${Date.now()}.json`;
      link.click();
      notify('Database backup downloaded', 'success');
    } catch (err: any) {
      notify(err.response?.data?.error || 'Failed to download backup', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 text-center rounded-[28px] border-2 border-coral bg-coral/10 shadow-lift space-y-4">
        <div className="grid h-16 w-16 place-items-center rounded-2xl border-2 border-coral bg-cream mx-auto text-coral">
          <AlertOctagon size={32} />
        </div>
        <h2 className="font-display text-2xl font-extrabold uppercase text-ink">Access Restricted</h2>
        <p className="text-sm font-semibold text-inksoft leading-relaxed">
          System Security Settings and Data Backup tools are restricted to <strong className="text-coral">Super Admin</strong> accounts only. Your current role is <strong className="text-grape uppercase">{currentUser?.role}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink flex items-center gap-2">
          <Settings className="text-grape" /> Studio & Security Settings
        </h1>
        <p className="text-sm font-medium text-inksoft">
          Configure site metadata, security parameters, database backups, and view administrative audit logs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveSettings} className="rounded-2xl border-2 border-ink bg-cream p-6 shadow-sticker-sm space-y-5">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink border-b-2 border-ink/10 pb-3 flex items-center gap-2">
              <Shield className="text-grape" size={18} /> General & Security Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-inksoft">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full rounded-xl border-2 border-ink/15 bg-paper px-3 py-2 text-xs font-semibold text-ink"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-inksoft">Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full rounded-xl border-2 border-ink/15 bg-paper px-3 py-2 text-xs font-semibold text-ink"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t-2 border-ink/10">
              <div className="flex items-center justify-between p-3 rounded-xl border border-ink/10 bg-paper">
                <div>
                  <p className="text-xs font-bold text-ink">Maintenance Mode</p>
                  <p className="text-[10px] text-inksoft">Temporarily display maintenance banner on public website</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="h-5 w-5 rounded border-2 border-ink"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-ink/10 bg-paper">
                <div>
                  <p className="text-xs font-bold text-ink">Self Registration</p>
                  <p className="text-[10px] text-inksoft">Allow public admin registration (Disabled by default for security)</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableRegistrations}
                  onChange={e => setSettings({ ...settings, enableRegistrations: e.target.checked })}
                  className="h-5 w-5 rounded border-2 border-ink"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl border-2 border-ink bg-coral px-6 py-2.5 text-xs font-extrabold uppercase text-white shadow-sticker hover:bg-coraldeep cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>

          {/* Database Backup Section */}
          <div className="rounded-2xl border-2 border-ink bg-cream p-6 shadow-sticker-sm space-y-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink border-b-2 border-ink/10 pb-3 flex items-center gap-2">
              <Download className="text-grape" size={18} /> Database Backup & Recovery
            </h2>
            <p className="text-xs font-semibold text-inksoft leading-relaxed">
              Export a complete structured JSON snapshot of all published games, articles, categories, subscribers, website content, and admin accounts for disaster recovery and offline backup.
            </p>

            <button
              onClick={handleDownloadBackup}
              disabled={isExporting}
              className="flex items-center gap-2 rounded-xl border-2 border-ink bg-grape px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-sticker hover:bg-grapedeep cursor-pointer"
            >
              <Download size={16} />
              {isExporting ? 'Preparing Backup...' : 'Download Full Database Backup (JSON)'}
            </button>
          </div>
        </div>

        {/* System Overview & Audit Logs */}
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-ink bg-cream p-5 shadow-sticker-sm space-y-4">
            <h3 className="font-display text-base font-bold uppercase text-ink flex items-center gap-2 border-b-2 border-ink/10 pb-2">
              <Server size={16} className="text-coral" /> Security Overview
            </h3>

            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between py-1 border-b border-ink/10">
                <span className="text-inksoft">Database Protocol:</span>
                <span className="font-bold text-ink">Prisma Relational ORM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-ink/10">
                <span className="text-inksoft">Session Auth:</span>
                <span className="font-bold text-moss">HttpOnly Cookies (JWT)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-ink/10">
                <span className="text-inksoft">Password Encryption:</span>
                <span className="font-bold text-moss">Bcrypt (12 rounds)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-ink/10">
                <span className="text-inksoft">SQLi / XSS Defenses:</span>
                <span className="font-bold text-moss">ACTIVE</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-inksoft">Rate Limiters:</span>
                <span className="font-bold text-moss">ACTIVE (Auth & API)</span>
              </div>
            </div>
          </div>

          {/* Audit Activity Logs */}
          <div className="rounded-2xl border-2 border-ink bg-cream p-5 shadow-sticker-sm space-y-3">
            <h3 className="font-display text-base font-bold uppercase text-ink flex items-center gap-2 border-b-2 border-ink/10 pb-2">
              <Activity size={16} className="text-grape" /> Recent Audit Activity
            </h3>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <p className="text-xs text-inksoft text-center py-4">No recent activity recorded.</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-paper border border-ink/10 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[10px] uppercase text-grape">{log.action}</span>
                      <span className="text-[9px] text-inksoft">{new Date(log.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[11px] font-medium text-ink">
                      {log.adminUser?.name || log.adminUser?.email || 'Admin'} · <span className="text-inksoft">{log.entityType}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
