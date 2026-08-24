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
  Eye,
  Search,
  Activity,
  Sparkles
} from 'lucide-react';
import { AssignBookingModal } from './AssignBookingModal';
import { UploadFlightDataModal } from './UploadFlightDataModal';
import { ReportBuilderModal } from './ReportBuilderModal';
import { FleetAndPilotsManager } from './FleetAndPilotsManager';
import { AnalyticsAndCRM } from './AnalyticsAndCRM';
import { CropHealthReportViewer } from '../farmer/CropHealthReportViewer';

export const OperatorDashboard: React.FC = () => {
  const { 
    bookings, 
    flights, 
    reports, 
    pilots, 
    drones,
    activeOperatorTab,
    setActiveOperatorTab 
  } = useApp();

  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'scheduled' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    const matchesFilter = bookingFilter === 'all' || b.status === bookingFilter;
    const matchesSearch = !searchQuery.trim() || 
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.fieldName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-950/40">
                <Plane className="w-6 h-6 text-white -rotate-45" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Mission Control &amp; Fleet Operations</h1>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    HUB #1 CENTRAL INDIA
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Fleet telemetry, pilot dispatch, multispectral processing &amp; diagnostic report publishing
                </p>
              </div>
            </div>

            {/* Quick counters */}
            <div className="flex items-center gap-2.5 font-mono">
              <span className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 shadow-sm">
                <span>🛸</span>
                <b className="text-emerald-400">{drones.filter(d => d.status === 'ready').length}</b>
                <span>Drones Ready</span>
              </span>
              <span className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 shadow-sm">
                <span>👨‍✈️</span>
                <b className="text-teal-400">{pilots.filter(p => p.status === 'available').length}</b>
                <span>Pilots Active</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div 
              onClick={() => {
                setActiveOperatorTab('missions');
                setBookingFilter('pending');
              }}
              className="p-4 bg-slate-950/60 hover:bg-slate-950/90 rounded-2xl border border-slate-800/80 hover:border-amber-500/30 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Pending Requests</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-1.5">{pendingBookings.length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Awaiting pilot &amp; drone assignment</p>
            </div>

            <div 
              onClick={() => {
                setActiveOperatorTab('missions');
                setBookingFilter('scheduled');
              }}
              className="p-4 bg-slate-950/60 hover:bg-slate-950/90 rounded-2xl border border-slate-800/80 hover:border-sky-500/30 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Scheduled Missions</span>
                <Plane className="w-4 h-4 text-sky-400 -rotate-45" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-sky-400 mt-1.5">{scheduledBookings.length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Ready for flight &amp; telemetry</p>
            </div>

            <div 
              onClick={() => {
                setActiveOperatorTab('missions');
                setBookingFilter('completed');
              }}
              className="p-4 bg-slate-950/60 hover:bg-slate-950/90 rounded-2xl border border-slate-800/80 hover:border-emerald-500/30 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Completed Missions</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1.5">{completedBookings.length}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Reports generated &amp; delivered</p>
            </div>

            <div 
              onClick={() => setActiveOperatorTab('reports_repo')}
              className="p-4 bg-slate-950/60 hover:bg-slate-950/90 rounded-2xl border border-slate-800/80 hover:border-teal-500/30 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Published Reports</span>
                <FileText className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-teal-400 mt-1.5">{reports.length}</p>
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
            const isCurrent = activeOperatorTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveOperatorTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
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

        {/* Tab 1: Missions Dispatch Queue */}
        {activeOperatorTab === 'missions' && (
          <div className="mt-6 space-y-4">
            
            {/* Action & Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search Box */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search booking #, farmer, field..."
                    className="pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56 sm:w-64"
                  />
                </div>

                {/* Status Segmented Filter */}
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {(['all', 'pending', 'scheduled', 'completed'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setBookingFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                        bookingFilter === st
                          ? 'bg-emerald-600 text-white font-bold shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setReportToEdit(null);
                    setSelectedFlightForReport(flights[0]?.id || null);
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  <span>Author Diagnostic Report</span>
                </button>
              </div>
            </div>

            {/* Bookings Dispatch Queue Table (Desktop Table & Mobile Responsive Cards) */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              
              {/* Desktop Table View (Hidden on mobile < md) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Booking Info</th>
                      <th className="p-4">Farmer &amp; Contact</th>
                      <th className="p-4">Mission Details</th>
                      <th className="p-4">Preferred Slot</th>
                      <th className="p-4">Assigned Pilot &amp; Drone</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Dispatch Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-slate-400">
                          <Plane className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                          <p>No missions match the selected filter criteria.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-4">
                            <p className="font-mono font-bold text-white text-xs">{b.bookingNumber}</p>
                            <span className="text-[10px] text-slate-500">{b.createdAt}</span>
                          </td>

                          <td className="p-4">
                            <p className="font-semibold text-white">{b.farmerName}</p>
                            <p className="text-[11px] text-slate-400">{b.farmerPhone}</p>
                          </td>

                          <td className="p-4">
                            <p className="font-semibold text-emerald-400 capitalize">
                              {b.serviceType.replace(/_/g, ' ')}
                            </p>
                            <p className="text-[11px] text-slate-300">
                              {b.fieldName} &bull; <span className="text-white font-bold">{b.acres} Acres</span>
                            </p>
                            <span className="text-[10px] text-slate-500">{b.chemicalOrNutrientName}</span>
                          </td>

                          <td className="p-4">
                            <p className="font-medium text-white">{b.scheduledDate || b.preferredDate}</p>
                            <p className="text-slate-400 capitalize">{b.scheduledTime || `${b.preferredTimeSlot} window`}</p>
                          </td>

                          <td className="p-4">
                            {b.pilotName ? (
                              <div>
                                <p className="font-semibold text-teal-300">{b.pilotName}</p>
                                <p className="text-[11px] text-slate-400">{b.droneModel}</p>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20">
                                Unassigned
                              </span>
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
                            <div className="flex items-center justify-end gap-2">
                              {b.status === 'pending' && (
                                <button
                                  onClick={() => setSelectedBookingForAssign(b)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  <span>Assign Pilot</span>
                                </button>
                              )}

                              {b.status === 'scheduled' && (
                                <button
                                  onClick={() => setSelectedBookingForUpload(b.id)}
                                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                                >
                                  <UploadCloud className="w-3.5 h-3.5" />
                                  <span>Upload Telemetry</span>
                                </button>
                              )}

                              {b.status === 'completed' && (
                                <button
                                  onClick={() => {
                                    const relatedReport = reports.find(r => r.bookingId === b.id || r.fieldId === b.fieldId);
                                    if (relatedReport) {
                                      setViewingReportId(relatedReport.id);
                                    } else {
                                      setSelectedFlightForReport(flights[0]?.id || null);
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View Report</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List (Visible on mobile < md) */}
              <div className="block md:hidden divide-y divide-slate-800">
                {filteredBookings.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Plane className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs">No missions match the selected filter criteria.</p>
                  </div>
                ) : (
                  filteredBookings.map((b) => (
                    <div key={b.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono font-bold text-white text-xs">{b.bookingNumber}</p>
                          <p className="font-semibold text-emerald-400 text-xs mt-0.5 capitalize">{b.serviceType.replace(/_/g, ' ')}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          b.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : b.status === 'scheduled'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Farmer:</span>
                          <span className="text-white font-medium">{b.farmerName} ({b.farmerPhone})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Plot:</span>
                          <span className="text-white">{b.fieldName} &bull; {b.acres}A</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Time:</span>
                          <span className="text-white">{b.scheduledDate || b.preferredDate} ({b.scheduledTime || b.preferredTimeSlot})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Pilot/Drone:</span>
                          <span className={b.pilotName ? 'text-teal-300 font-semibold' : 'text-amber-400'}>
                            {b.pilotName ? `${b.pilotName} (${b.droneModel})` : 'Unassigned'}
                          </span>
                        </div>
                      </div>

                      {/* Mobile Action Buttons */}
                      <div>
                        {b.status === 'pending' && (
                          <button
                            onClick={() => setSelectedBookingForAssign(b)}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <UserCheck className="w-4 h-4" />
                            <span>Assign Pilot &amp; Drone</span>
                          </button>
                        )}

                        {b.status === 'scheduled' && (
                          <button
                            onClick={() => setSelectedBookingForUpload(b.id)}
                            className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <UploadCloud className="w-4 h-4" />
                            <span>Upload Flight Telemetry</span>
                          </button>
                        )}

                        {b.status === 'completed' && (
                          <button
                            onClick={() => {
                              const relatedReport = reports.find(r => r.bookingId === b.id || r.fieldId === b.fieldId);
                              if (relatedReport) {
                                setViewingReportId(relatedReport.id);
                              } else {
                                setSelectedFlightForReport(flights[0]?.id || null);
                              }
                            }}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View 4K Health Report</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Fleet & Pilots Roster */}
        {activeOperatorTab === 'fleet' && (
          <div className="mt-6">
            <FleetAndPilotsManager />
          </div>
        )}

        {/* Tab 3: Diagnostic Reports Repository */}
        {activeOperatorTab === 'reports_repo' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">4K Multispectral Crop Diagnostic Repository</h3>
                <p className="text-xs text-slate-400">
                  All published agronomist health reports delivered to registered farmers
                </p>
              </div>
              <button
                onClick={() => {
                  setReportToEdit(null);
                  setSelectedFlightForReport(flights[0]?.id || null);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Author New Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-slate-950">
                    <img
                      src={rep.droneImagePrimary}
                      alt={rep.fieldName}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-emerald-400 border border-slate-800">
                      {rep.reportNumber}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                        rep.healthCategory === 'Optimal' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-600 text-white'
                      }`}>
                        {rep.healthCategory}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs text-slate-200 font-semibold">
                      {rep.cropType} &bull; {rep.reportDate}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h4 className="font-bold text-base text-white">{rep.fieldName}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {rep.plainLanguageSummary}
                    </p>

                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Canopy Health:</span>
                      <span className="font-bold text-emerald-400">{rep.overallHealthScore} / 100</span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => setViewingReportId(rep.id)}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => {
                          setReportToEdit(rep);
                          setSelectedFlightForReport(rep.flightId);
                        }}
                        className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                        title="Edit Diagnosis"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Analytics & CRM */}
        {activeOperatorTab === 'analytics' && (
          <div className="mt-6">
            <AnalyticsAndCRM />
          </div>
        )}

      </div>

      {/* Modal Dialogs */}
      {selectedBookingForAssign && (
        <AssignBookingModal
          isOpen={!!selectedBookingForAssign}
          booking={selectedBookingForAssign}
          onClose={() => setSelectedBookingForAssign(null)}
        />
      )}

      {selectedBookingForUpload && (
        <UploadFlightDataModal
          isOpen={!!selectedBookingForUpload}
          bookingId={selectedBookingForUpload}
          onClose={() => setSelectedBookingForUpload(null)}
          onSuccessOpenReportBuilder={(flightId) => {
            setSelectedBookingForUpload(null);
            setSelectedFlightForReport(flightId);
          }}
        />
      )}

      {(selectedFlightForReport || reportToEdit) && (
        <ReportBuilderModal
          isOpen={!!(selectedFlightForReport || reportToEdit)}
          flightId={selectedFlightForReport || reportToEdit?.flightId || flights[0]?.id}
          reportToEdit={reportToEdit}
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
