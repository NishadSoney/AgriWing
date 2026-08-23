/**
 * @file components/common/Toast.tsx
 * @description Toast notification banner displayed at the bottom corner
 * for immediate feedback on user actions (e.g., booking created, pilot assigned).
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, showToast } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900/95 text-white px-4 py-3 rounded-xl border border-emerald-500/50 shadow-2xl backdrop-blur-md max-w-md animate-bounce-short">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <p className="text-sm font-medium text-slate-100 flex-1">{toastMessage}</p>
      <button
        onClick={() => showToast('')}
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
