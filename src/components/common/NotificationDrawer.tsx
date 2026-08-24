/**
 * @file components/common/NotificationDrawer.tsx
 * @description Slide-over notification panel showing real-time alerts for DGCA
 * airspace approvals, pest and disease NDVI detections, and pilot mission dispatches.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  X, 
  CheckCheck, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  Plane, 
  FileText, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { 
    isNotificationDrawerOpen, 
    setIsNotificationDrawerOpen, 
    alerts, 
    markAlertAsRead, 
    markAllAlertsAsRead,
    role,
    setRole,
    activeFarmer,
    setActiveFarmerTab,
    setActiveOperatorTab,
    setSelectedReportId
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  // Filter alerts relevant to active persona
  const filteredAlerts = alerts.filter(a => {
    if (role === 'operator') {
      return a.targetRole === 'operator' || a.targetRole === 'all';
    }
    return a.farmerId === activeFarmer.id || a.targetRole === 'all' || a.targetRole === 'farmer';
  });

  const unreadCount = filteredAlerts.filter(a => !a.read).length;

  const handleAction = (alertItem: typeof alerts[0]) => {
    markAlertAsRead(alertItem.id);
    setIsNotificationDrawerOpen(false);

    if (alertItem.relatedReportId) {
      setRole('farmer');
      setActiveFarmerTab('reports');
      setSelectedReportId(alertItem.relatedReportId);
    } else if (alertItem.relatedBookingId) {
      if (role === 'operator') {
        setActiveOperatorTab('missions');
      } else {
        setRole('farmer');
        setActiveFarmerTab('bookings');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Notifications &amp; Alerts</h3>
                <p className="text-xs text-slate-400">
                  {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAlertsAsRead}
                  className="px-2.5 py-1 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition flex items-center gap-1 font-medium"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Read all</span>
                </button>
              )}
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Persona Context Badge */}
          <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>
              Viewing for: <b className="text-slate-200 capitalize">{role === 'operator' ? 'Mission Control' : activeFarmer.name}</b>
            </span>
            <span className="text-[11px] font-mono text-emerald-400">LIVE FEED</span>
          </div>

          {/* Alert Cards List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-sm">
                <ShieldCheck className="w-10 h-10 text-emerald-500/40 mx-auto mb-3" />
                <p className="font-semibold text-slate-300">No active alerts</p>
                <p className="text-xs text-slate-500 mt-1">
                  Airspace, weather conditions, and mission statuses are normal.
                </p>
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isUrgent = alert.severity === 'urgent';
                const isWarning = alert.severity === 'warning';

                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      !alert.read
                        ? isUrgent
                          ? 'bg-rose-950/40 border-rose-500/40 shadow-sm'
                          : isWarning
                          ? 'bg-amber-950/30 border-amber-500/40 shadow-sm'
                          : 'bg-slate-800/60 border-emerald-500/30 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 opacity-75'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                        isUrgent
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isUrgent ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : isWarning ? (
                          <Plane className="w-4 h-4 -rotate-45" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-white truncate">{alert.title}</h4>
                          <span className="text-[10px] text-slate-500 shrink-0 font-mono">{alert.date}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.message}</p>

                        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                          {alert.relatedReportId ? (
                            <button
                              onClick={() => handleAction(alert)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Diagnostic</span>
                            </button>
                          ) : alert.relatedBookingId ? (
                            <button
                              onClick={() => handleAction(alert)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                            >
                              <Plane className="w-3.5 h-3.5 -rotate-45" />
                              <span>Track Booking</span>
                            </button>
                          ) : (
                            <span />
                          )}

                          {!alert.read && (
                            <button
                              onClick={() => markAlertAsRead(alert.id)}
                              className="text-[11px] text-slate-400 hover:text-white transition"
                            >
                              Dismiss
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Quick Status */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DGCA Green Airspace Verified</span>
            </div>
            <span className="font-mono">AGRI-IOT v1.0</span>
          </div>

        </div>
      </div>
    </div>
  );
};
