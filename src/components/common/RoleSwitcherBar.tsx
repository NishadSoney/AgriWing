/**
 * @file components/common/RoleSwitcherBar.tsx
 * @description Top navigation bar providing universal persona switching between
 * Farmer Portal, Fleet Operator Mission Control, and Public Overview, along with
 * Hindi/English localization toggles and real-time alert indicators.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plane, UserCheck, ShieldAlert, Globe, Bell, Sparkles, Activity } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { role, setRole, language, setLanguage, alerts, activeFarmer } = useApp();

  // Filter unread notifications relevant to active persona
  const unreadAlerts = alerts.filter(a => !a.read && (
    role === 'operator' ? (a.targetRole === 'operator' || a.targetRole === 'all') :
    (a.farmerId === activeFarmer.id || a.targetRole === 'all')
  )).length;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 text-slate-100 shadow-sm w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* AgriWing Logo & Brand Header */}
        <div 
          onClick={() => setRole('public')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-900/30 group-hover:scale-105 transition-transform">
            <Plane className="w-5 h-5 text-white -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">AgriWing</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold rounded-md tracking-wider uppercase border border-emerald-500/20">
                Precision Ag
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">Enterprise Drone Spraying &amp; Analytics</p>
          </div>
        </div>

        {/* Persona Segmented Controller */}
        <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setRole('public')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'public'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'farmer'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1.5">
              <span>Farmer Portal</span>
              <span className="hidden sm:inline text-[10px] px-1.5 py-0.2 bg-slate-800 text-emerald-300 rounded font-normal border border-slate-700">
                {activeFarmer.name.split(' ')[0]}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole('operator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'operator'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <span>Mission Control</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
          </button>
        </div>

        {/* Global Toolbar: Language, Airspace Status & Unread Alerts */}
        <div className="flex items-center gap-2.5">
          {/* Airspace status badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/60 border border-slate-800 rounded-lg text-[11px] text-slate-400 font-mono">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>DGCA AIRSPACE: GREEN</span>
          </div>

          {/* Bilingual English / Hindi Switcher */}
          <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                language === 'en' ? 'bg-slate-800 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                language === 'hi' ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Unread Alerts Badge */}
          {unreadAlerts > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-medium">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>{unreadAlerts} New</span>
            </div>
          )}

          {/* Mode Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/50 px-2.5 py-1 rounded-lg border border-slate-800">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Live Workspace</span>
          </div>
        </div>

      </div>
    </header>
  );
};
