/**
 * @file components/operator/OperatorDashboard.tsx
 * @description Central dispatch and mission command hub for drone fleet operators.
 * 
 * Provides:
 * - Real-time queue for inbound farmer spray/scan bookings
 * - Pilot and aircraft dispatch modal triggers
 * - Flight telemetry ingest and aerial media uploads
 * - Direct launcher for the NDVI Crop Health Diagnostic Report Authoring Tool
 * - Hardware airworthiness and pilot roster oversight
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, Flight, CropHealthReport } from '../../types';
import { 
  Plane, 
  UserCheck, 
  FileText, 
  BarChart3, 
  Plus, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  ChevronRight,
  Eye
} from 'lucide-react';
import { AssignBookingModal } from './AssignBookingModal';
import { UploadFlightDataModal } from './UploadFlightDataModal';
import { ReportBuilderModal } from './ReportBuilderModal';
import { FleetAndPilotsManager } from './FleetAndPilotsManager';
import { AnalyticsAndCRM } from './AnalyticsAndCRM';
import { CropHealthReportViewer } from '../farmer/CropHealthReportViewer';

export const OperatorDashboard: React.FC = () => {
  const { bookings, flights, reports, pilots, drones } = useApp();

  const [activeTab, setActiveTab] = useState<'missions' | 'fleet' | 'reports_repo' | 'analytics'>('missions');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'scheduled' | 'completed'>('all');

  // Modals state
  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState<Booking | null>(null);
  const [selectedBookingForUpload, setSelectedBookingForUpload] = useState<string | null>(null);
  const [selectedFlightForReport, setSelectedFlightForReport] = useState<string | null>(null);
  const [reportToEdit, setReportToEdit] = useState<CropHealthReport | null>(null);
  const [viewingReportId, setViewingReportId] = useState<string | null>(null);

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const scheduledBookings = bookings.filter(b => b.status === 'scheduled');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const filteredBookings = bookings.filter(b => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-950/40">
                <Plane className="w-5 h-5 text-white -rotate-45" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Mission Control &amp; Fleet Operations</h1>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    HUB #1 CENTRAL INDIA
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Fleet telemetry, pilot dispatch, multispectral processing &amp; diagnostic report publishing
                </p>
              </div>
            </div>

            {/* Quick counters */}
            <div className="flex items-center gap-2 font-mono">
              <span className="px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-medium text-slate-300">
                🛸 {drones.filter(d => d.status === 'ready').length} Drones Ready
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-medium text-slate-300">
                👨‍✈️ {pilots.filter(p => p.status === 'available').length} Pilots Active
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/90 rounded-xl shadow-sm border border-slate-800 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pending Requests</span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>
              <p className="text-2xl font-bold text-amber-400 mt-1">{pendingBookings.length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Awaiting pilot &amp; drone assignment</p>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-xl shadow-sm border border-slate-800 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Scheduled Missions</span>
                <Plane className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-2xl font-bold text-sky-400 mt-1">{scheduledBookings.length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Ready for flight &amp; telemetry</p>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-xl shadow-sm border border-slate-800 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Completed Missions</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{completedBookings.length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Reports generated &amp; delivered</p>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-xl shadow-sm border border-slate-800 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Reports Published</span>
                <FileText className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-2xl font-bold text-teal-400 mt-1">{reports.length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">100% farmer feedback positive</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 mt-6">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: 'missions', label: `🎯 Missions & Dispatch (${bookings.length})`, icon: Plane },
            { id: 'fleet', label: `🛸 Fleet & Pilots Roster (${drones.length} / ${pilots.length})`, icon: ShieldCheck },
            { id: 'reports_repo', label: `📊 Health Reports Repository (${reports.length})`, icon: FileText },
            { id: 'analytics', label: '📈 Analytics & Farmer CRM', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                    : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Missions & Dispatch Queue */}
        {activeTab === 'missions' && (
          <div className="mt-6 space-y-4">
            
            {/* Filter Pill Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                {(['all', 'pending', 'scheduled', 'completed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setBookingFilter(filter)}
                    className={`px-3.5 py-1.5 rounded-lg font-bold capitalize transition ${
                      bookingFilter === filter
                        ? 'bg-slate-800 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter} ({
                      filter === 'all' ? bookings.length :
                      bookings.filter(b => b.status === filter).length
                    })
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-400">
                Showing {filteredBookings.length} booking missions
              </span>
            </div>

            {/* Missions Table */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Booking #</th>
                      <th className="p-4">Farmer &amp; Contact</th>
                      <th className="p-4">Field &amp; Area</th>
                      <th className="p-4">Service &amp; Chemical</th>
                      <th className="p-4">Assigned Pilot &amp; Drone</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Operator Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-4 font-mono font-bold text-white">{b.bookingNumber}</td>
                        <td className="p-4">
                          <p className="font-semibold text-white">{b.farmerName}</p>
                          <p className="text-slate-400 text-[11px] font-mono">{b.farmerPhone}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-slate-200">{b.fieldName}</p>
                          <p className="text-emerald-400 font-bold">{b.acres} Acres</p>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-teal-300 capitalize block">
                            {b.serviceType.replace(/_/g, ' ')}
                          </span>
                          <span className="text-slate-400 text-[11px]">{b.chemicalOrNutrientName}</span>
                        </td>
                        <td className="p-4">
                          {b.pilotName ? (
                            <div>
                              <p className="font-semibold text-white">{b.pilotName}</p>
                              <p className="text-slate-400 text-[11px]">{b.droneModel}</p>
                              <p className="text-teal-400 text-[10px]">{b.scheduledDate} ({b.scheduledTime})</p>
                            </div>
                          ) : (
                            <span className="text-amber-400 font-semibold italic">Unassigned</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            b.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : b.status === 'scheduled'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {b.status === 'pending' && (
                            <button
                              onClick={() => setSelectedBookingForAssign(b)}
                              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition"
                            >
                              Dispatch &amp; Assign
                            </button>
                          )}

                          {b.status === 'scheduled' && (
                            <button
                              onClick={() => setSelectedBookingForUpload(b.id)}
                              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1 ml-auto"
                            >
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Upload Flight Data</span>
                            </button>
                          )}

                          {b.status === 'completed' && (
                            <div className="flex items-center justify-end gap-2">
                              {b.flightId && (
                                <button
                                  onClick={() => setSelectedFlightForReport(b.flightId!)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition"
                                >
                                  Build Report
                                </button>
                              )}
                              <span className="text-[11px] text-emerald-400 font-semibold">✓ Completed</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Fleet & Pilots */}
        {activeTab === 'fleet' && <FleetAndPilotsManager />}

        {/* TAB 3: Reports Repository */}
        {activeTab === 'reports_repo' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Published Farmer Diagnostic Reports</h3>
                <p className="text-xs text-slate-400">View, edit, or regenerate crop reports</p>
              </div>
              <button
                onClick={() => {
                  setSelectedFlightForReport(flights[0]?.id || null);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-teal-400 text-xs font-bold">{rep.reportNumber}</span>
                        <h4 className="font-extrabold text-base text-white mt-0.5">{rep.fieldName}</h4>
                        <p className="text-xs text-slate-400">Farmer: {rep.farmerName} &bull; Crop: {rep.cropType}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                        rep.healthCategory === 'Optimal'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : rep.healthCategory === 'Mild Stress'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {rep.overallHealthScore}/100 ({rep.healthCategory})
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mt-3">
                      {rep.plainLanguageSummary}
                    </p>

                    <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                      <span>Operator Sign-off: </span>
                      <span className="text-slate-200 font-semibold">{rep.generatedByPilotOrOperator}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setViewingReportId(rep.id)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Farmer View</span>
                    </button>

                    <button
                      onClick={() => {
                        setReportToEdit(rep);
                        setSelectedFlightForReport(rep.flightId);
                      }}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition"
                    >
                      Edit Report Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Analytics & CRM */}
        {activeTab === 'analytics' && <AnalyticsAndCRM />}

      </div>

      {/* Operator Modals */}
      {selectedBookingForAssign && (
        <AssignBookingModal
          booking={selectedBookingForAssign}
          isOpen={!!selectedBookingForAssign}
          onClose={() => setSelectedBookingForAssign(null)}
        />
      )}

      {selectedBookingForUpload && (
        <UploadFlightDataModal
          bookingId={selectedBookingForUpload}
          isOpen={!!selectedBookingForUpload}
          onClose={() => setSelectedBookingForUpload(null)}
          onSuccessOpenReportBuilder={(flightId) => {
            setSelectedFlightForReport(flightId);
          }}
        />
      )}

      {selectedFlightForReport && (
        <ReportBuilderModal
          flightId={selectedFlightForReport}
          reportToEdit={reportToEdit}
          isOpen={!!selectedFlightForReport}
          onClose={() => {
            setSelectedFlightForReport(null);
            setReportToEdit(null);
          }}
        />
      )}

      {viewingReportId && (
        <CropHealthReportViewer
          reportId={viewingReportId}
          onClose={() => setViewingReportId(null)}
        />
      )}

    </div>
  );
};
