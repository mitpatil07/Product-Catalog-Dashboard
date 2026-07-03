import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-100 bg-emerald-50/90 dark:border-emerald-950/30 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300';
      case 'error':
        return 'border-rose-100 bg-rose-50/90 dark:border-rose-950/30 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300';
      case 'warning':
        return 'border-amber-100 bg-amber-50/90 dark:border-amber-950/30 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300';
      case 'info':
      default:
        return 'border-blue-100 bg-blue-50/90 dark:border-blue-950/30 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg pointer-events-auto animate-slide-in transition-all ${getToastStyles(
              toast.type
            )}`}
            role="alert"
          >
            <div className="flex-shrink-0 mt-0.5">{getToastIcon(toast.type)}</div>
            <div className="flex-grow text-sm font-medium pr-2 leading-relaxed">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-0.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
