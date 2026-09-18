import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cx } from '../ui';

type Tone = 'success' | 'error' | 'info';

interface ToastEntry {
  id: number;
  tone: Tone;
  message: string;
}

interface ToastContextValue {
  push: (message: string, tone?: Tone) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const push = useCallback((message: string, tone: Tone = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, tone, message }].slice(-4));
    window.setTimeout(() => setToasts((prev) => prev.filter((entry) => entry.id !== id)), 4200);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cx(
              'pointer-events-auto flex animate-pop items-start gap-3 rounded-2xl border-2 border-ink px-4 py-3 text-xs font-bold shadow-sticker-sm',
              toast.tone === 'success' && 'bg-lime text-ink',
              toast.tone === 'error' && 'bg-coral text-white',
              toast.tone === 'info' && 'bg-sky text-ink'
            )}
          >
            {toast.tone === 'success' && <CheckCircle2 size={15} className="mt-0.5 shrink-0" />}
            {toast.tone === 'error' && <AlertTriangle size={15} className="mt-0.5 shrink-0" />}
            {toast.tone === 'info' && <Info size={15} className="mt-0.5 shrink-0" />}
            <span className="flex-1 leading-relaxed">{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((entry) => entry.id !== toast.id))}
              className="shrink-0 opacity-70 transition-opacity hover:opacity-100 cursor-pointer"
              aria-label="Dismiss"
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside a ToastProvider');
  return context;
};
