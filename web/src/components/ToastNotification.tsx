import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'error' | 'success' | 'info' | 'warning';
  title?: string;
  message: string;
  durationMs?: number;
}

type ToastListener = (toast: ToastMessage) => void;
const listeners = new Set<ToastListener>();

export const showToast = (toast: Omit<ToastMessage, 'id'>) => {
  const fullToast: ToastMessage = {
    ...toast,
    id: Math.random().toString(36).substring(2, 9)
  };
  listeners.forEach(fn => fn(fullToast));
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleNewToast: ToastListener = (toast) => {
      setToasts(prev => [...prev, toast]);
      const duration = toast.durationMs || (toast.type === 'error' ? 6000 : 3500);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, duration);
    };

    listeners.add(handleNewToast);
    return () => {
      listeners.delete(handleNewToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '400px',
      width: 'calc(100vw - 48px)'
    }}>
      {toasts.map(toast => {
        const isError = toast.type === 'error' || toast.type === 'warning';
        const isSuccess = toast.type === 'success';

        const bg = isError ? '#FFF3F1' : isSuccess ? '#F0FDF4' : '#F8FAFC';
        const border = isError ? '#FCA5A5' : isSuccess ? '#86EFAC' : '#CBD5E1';
        const text = isError ? '#991B1B' : isSuccess ? '#166534' : '#1E293B';
        const iconColor = isError ? '#DC2626' : isSuccess ? '#16A34A' : '#0284C7';

        return (
          <div
            key={toast.id}
            style={{
              backgroundColor: bg,
              border: `1px solid ${border}`,
              borderRadius: '10px',
              padding: '12px 16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'slideUp 0.25s ease-out'
            }}
          >
            <div style={{ flexShrink: 0, marginTop: '2px', color: iconColor }}>
              {isError ? <AlertCircle size={18} /> : isSuccess ? <CheckCircle size={18} /> : <Info size={18} />}
            </div>
            <div style={{ flex: 1 }}>
              {toast.title && (
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: text, marginBottom: '2px' }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: '0.84rem', color: text, lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                color: '#888',
                display: 'inline-flex',
                alignItems: 'center'
              }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
