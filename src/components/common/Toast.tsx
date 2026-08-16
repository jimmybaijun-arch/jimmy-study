import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isSuccess = toast.type === 'success';

  return (
    <div
      id={`toast-${toast.id}`}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all transform translate-y-0 ${
        isSuccess
          ? 'bg-white text-stone-900 border-amber-300 shadow-amber-500/10'
          : 'bg-rose-50 text-rose-900 border-rose-200 shadow-rose-500/10'
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
      )}
      <span className="max-w-xs">{toast.text}</span>
      <button
        onClick={onDismiss}
        className="p-1 text-stone-400 hover:text-stone-600 rounded-lg transition-colors ml-auto"
        aria-label="關閉通知"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
