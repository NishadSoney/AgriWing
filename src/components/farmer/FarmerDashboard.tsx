/**
 * @file components/farmer/FarmerDashboard.tsx
 * @description Refined portal interface for registered farmers.
 * 
 * Features:
 * - Overview Dashboard: KPI metrics, urgent alerts, weather suitability radar, quick action CTAs
 * - GIS Field Parcels & Map: Interactive satellite GIS map with 1-click plot spray scheduling
 * - 4K Multispectral Crop Reports: High-resolution NDVI health diagnoses and zone breakdowns
 * - Spray Orders & Mission Tracking: Filterable flight history with pilot assignments and receipts
 * - Subsidy & Plan Tracker: 40%-50% SMAM DBT subsidy breakdown and remaining acre quota
 * - Agrometeorological Radar: Hourly wind/temp/humidity forecast for safe drone operations
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Field, CropHealthReport, Booking } from '../../types';
import { 
  MapPin, 
  Plane, 
  FileCheck2, 
  CreditCard, 
  Plus, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Droplets, 
  ChevronRight, 
  Layers, 
  TrendingUp, 
  Wind, 
  Sun, 
  Download,
  Search,
  LayoutDashboard,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { FieldMap } from '../common/FieldMap';
import { CropHealthReportViewer } from './CropHealthReportViewer';
import { RegisterNewFieldModal } from './RegisterNewFieldModal';
import { BookDemoModal } from '../public/BookDemoModal';

export const FarmerDashboard: React.FC = () => {
  const { 
    activeFarmer, 
    fields, 
    reports, 
    bookings, 
    alerts, 
    markAlertAsRead, 
    setIsBookModalOpen, 
    isBookModalOpen,
    isNewFieldModalOpen, 
    setIsNewFieldModalOpen,
    setPreselectedBookingFieldId,
    setPreselectedServiceType,
    activeFarmerTab,
    setActiveFarmerTab,
    selectedFieldId,
    setSelectedFieldId,
    selectedReportId,
    setSelectedReportId,
    language
  } = useApp();

  const isHindi = language === 'hi';

  // Farmer-specific items
  const farmerFields = fields.filter(f => f.farmerId === activeFarmer.id);
  const farmerReports = reports.filter(r => r.farmerId === activeFarmer.id);
  const farmerBookings = bookings.filter(b => b.farmerId === activeFarmer.id);
  const farmerAlerts = alerts.filter(a => a.farmerId === activeFarmer.id || a.targetRole === 'all' || a.targetRole === 'farmer');

  const urgentAlerts = farmerAlerts.filter(a => !a.read && a.severity === 'urgent');

  // Selected Field state
  const currentSelectedField = farmerFields.find(f => f.id === selectedFieldId) || farmerFields[0] || null;

  // Active Report Modal
  const [activeReportViewerId, setActiveReportViewerId] = useState<string | null>(selectedReportId || null);

  // Filters
  const [fieldSearch, setFieldSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'scheduled' | 'completed'>('all');

  const filteredFields = farmerFields.filter(f => 
    f.name.toLowerCase().includes(fieldSearch.toLowerCase()) ||
    f.crop.toLowerCase().includes(fieldSearch.toLowerCase()) ||
    f.locationName.toLowerCase().includes(fieldSearch.toLowerCase())
  );

  const filteredBookings = farmerBookings.filter(b => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  const handleOpenReport = (reportId: string) => {
    setActiveReportViewerId(reportId);
  };

  const handleBookForField = (field: Field) => {
    setPreselectedBookingFieldId(field.id);
    setIsBookModalOpen(true);
  };

  // Sync external selectedReportId
  React.useEffect(() => {
    if (selectedReportId) {
      setActiveReportViewerId(selectedReportId);
      setSelectedReportId(null);
    }
  }, [selectedReportId, setSelectedReportId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      
      {/* Top Banner Profile Summary */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            
            {/* Farmer Identity */}
            <div className="flex items-center gap-4">
              <img
                src={activeFarmer.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'}
                alt={activeFarmer.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg shadow-emerald-950/40"
              />
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{activeFarmer.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                    🌾 {activeFarmer.subscriptionPlanId.replace(/_/g, ' ')} PLAN
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{activeFarmer.village}, {activeFarmer.district}, {activeFarmer.state}</span>
                  <span>&bull;</span>
                  <span>{activeFarmer.phone}</span>
                </p>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsNewFieldModalOpen(true)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700/80 transition flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>{isHindi ? 'नया खेत जोड़ें' : 'Register New Field'}</span>
              </button>

              <button
                onClick={() => {
                  setPreselectedBookingFieldId(null);
                  setPreselectedServiceType(null);
                  setIsBookModalOpen(true);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 transition flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Plane className="w-4 h-4 -rotate-45" />
                <span>{isHindi ? 'ड्रोन स्प्रे बुक करें' : 'Book Drone Spray'}</span>
              </button>
            </div>

          </div>

          {/* Sleek Stat KPI Metrics Bar */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div 
              onClick={() => setActiveFarmerTab('fields')}
              className="p-4 bg-slate-950/60 hover:bg-slate-950/90 rounded-2xl border border-slate-800/80 hover:border-emerald-500/30 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Land Mapped</span>
                <MapPin className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">{activeFarmer.totalAcreage} Acres</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{farmerFields.length} active plots registered</p>
            </div>

            <div 
              onClick={() => setActiveFarmerTab('subscription')}
              className="p-4 bg-slate-950/60 hover:bg-slate-950/90 rounded-2xl border border-slate-800/80 hover:border-teal-500/30 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Subsidized Quota</span>
                <ShieldCheck className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-teal-400 mt-1.5">{activeFarmer.coveredAcresRemaining} Acres</p>
              <p className="text-[11px] text-slate-500 mt-0.5">40% SMAM DBT Applied</p>
            </div>

            <div 
              onClick={() => setActiveFarmerTab('bookings')}
              className="p-4 bg-slate-950/60 hover:bg-slate-950/90 rounded-2xl border border-slate-800/80 hover:border-sky-500/30 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Upcoming Spray</span>
                <Plane className="w-4 h-4 text-sky-400 -rotate-45" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-sky-400 mt-1.5">
                {farmerBookings.filter(b => b.status === 'scheduled' || b.status === 'pending').length} Active
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Next slot: 06:00 AM Dawn</p>
            </div>

            <div 
              onClick={() => setActiveFarmerTab('reports')}
              className="p-4 bg-slate-950/60 hover:bg-slate-950/90 rounded-2xl border border-slate-800/80 hover:border-emerald-500/30 transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Avg Crop Health</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1.5">88 / 100</p>
              <p className="text-[11px] text-amber-400 mt-0.5 font-medium">1 localized spot alert</p>
            </div>
          </div>

          {/* Urgent Alert Banner */}
          {urgentAlerts.length > 0 && (
            <div className="mt-4 p-4 bg-rose-950/60 border border-rose-500/40 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{urgentAlerts[0].title}</h4>
                  <p className="text-xs text-rose-200 mt-0.5">{urgentAlerts[0].message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {urgentAlerts[0].relatedReportId && (
                  <button
                    onClick={() => handleOpenReport(urgentAlerts[0].relatedReportId!)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Inspect 4K Diagnostic
                  </button>
                )}
                <button
                  onClick={() => markAlertAsRead(urgentAlerts[0].id)}
                  className="px-3 py-2 bg-slate-900 text-slate-300 hover:text-white rounded-xl text-xs border border-slate-800 transition cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Main Navigation Sub-Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 mt-6">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: 'overview', label: isHindi ? '🌾 ओवरव्यू' : '🌾 Farm Overview', icon: LayoutDashboard },
            { id: 'fields', label: isHindi ? '🗺️ खेत और मैप' : `🗺️ Fields & GIS Map (${farmerFields.length})`, icon: MapPin },
            { id: 'reports', label: isHindi ? '📊 स्वास्थ्य रिपोर्ट' : `📊 Crop Health Reports (${farmerReports.length})`, icon: FileCheck2 },
            { id: 'bookings', label: isHindi ? '🚁 स्प्रे ऑर्डर्स' : `🚁 Spray Orders (${farmerBookings.length})`, icon: Plane },
            { id: 'subscription', label: isHindi ? '💳 सब्सिडी व प्लान' : '💳 Subsidy & Invoices', icon: CreditCard },
            { id: 'weather', label: isHindi ? '🌤️ मौसम राडार' : '🌤️ Spray Suitability Radar', icon: Wind }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeFarmerTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFarmerTab(tab.id as any)}
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

        {/* Tab 0: OVERVIEW (HOME DASHBOARD) */}
        {activeFarmerTab === 'overview' && (
          <div className="mt-6 space-y-6">
            
            {/* Quick Action Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => {
                  setPreselectedBookingFieldId(null);
                  setIsBookModalOpen(true);
                }}
                className="p-5 bg-gradient-to-br from-slate-900 to-emerald-950/30 rounded-2xl border border-emerald-500/30 hover:border-emerald-500/60 shadow-lg transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                  <Plane className="w-5 h-5 -rotate-45" />
                </div>
                <h3 className="font-extrabold text-base text-white mt-4 group-hover:text-emerald-400 transition">
                  {isHindi ? '1-क्लिक ड्रोन स्प्रे' : '1-Click Precision Spray'}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Book pesticide, foliar nano-urea or bio-stimulants with 40% SMAM DBT subsidy.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <span>Schedule Flight</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div 
                onClick={() => {
                  setPreselectedServiceType('crop_health_scan');
                  setIsBookModalOpen(true);
                }}
                className="p-5 bg-gradient-to-br from-slate-900 to-teal-950/30 rounded-2xl border border-teal-500/30 hover:border-teal-500/60 shadow-lg transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-white mt-4 group-hover:text-teal-300 transition">
                  {isHindi ? '4K फसल स्वास्थ्य स्कैन' : '4K Multispectral NDVI Scan'}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Detect aphids, yellow rust, nitrogen deficiencies &amp; weed hotspots 7 days early.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-teal-300 font-bold">
                  <span>Request 4K Scouting</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div 
                onClick={() => setIsNewFieldModalOpen(true)}
                className="p-5 bg-gradient-to-br from-slate-900 to-sky-950/30 rounded-2xl border border-sky-500/30 hover:border-sky-500/60 shadow-lg transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-white mt-4 group-hover:text-sky-300 transition">
                  {isHindi ? 'खेत सीमा प्लॉट करें' : 'Map New Farm Plot'}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Add Khasra boundary coordinates via interactive satellite GPS drawing tool.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-sky-300 font-bold">
                  <span>Draw GPS Parcel</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Middle Section: GIS Map & Weather Radar Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left GIS Map Snapshot */}
              <div className="lg:col-span-8 space-y-3">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <div>
                      <h4 className="font-bold text-sm text-white">Interactive Field GIS Map</h4>
                      <p className="text-xs text-slate-400">Showing {farmerFields.length} registered plots with live health overlays</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveFarmerTab('fields')}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>View All Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <FieldMap
                  fields={farmerFields}
                  activeField={currentSelectedField}
                  onFieldClick={(f) => {
                    setSelectedFieldId(f.id);
                    setActiveFarmerTab('fields');
                  }}
                  heightClass="h-[380px]"
                />
              </div>

              {/* Right Weather & Spray Suitability Card */}
              <div className="lg:col-span-4 bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-teal-400" />
                    <h4 className="font-bold text-sm text-white">Live Spray Radar</h4>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold rounded-full border border-emerald-500/30">
                    🟢 WINDOW OPEN
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                    <Wind className="w-4 h-4 text-teal-400 mx-auto mb-1" />
                    <p className="font-bold text-sm text-white">5.8 km/h</p>
                    <p className="text-[10px] text-slate-400">Wind</p>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                    <Sun className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                    <p className="font-bold text-sm text-white">26.4°C</p>
                    <p className="text-[10px] text-slate-400">Temp</p>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80">
                    <Droplets className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                    <p className="font-bold text-sm text-white">72%</p>
                    <p className="text-[10px] text-slate-400">Humidity</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <p className="font-semibold text-white flex items-center justify-between">
                    <span>Optimal Spray Window:</span>
                    <span className="text-emerald-400 font-bold">Tomorrow 05:30 AM</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Calm atmospheric inversion allows 98% droplet adhesion without drift.
                  </p>
                </div>

                <button
                  onClick={() => setActiveFarmerTab('weather')}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition text-center"
                >
                  View 3-Day Spray Forecast
                </button>
              </div>

            </div>

            {/* Bottom Row: Recent 4K Health Diagnostics & Active Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Reports Preview */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-teal-400" />
                    <span>Recent 4K Multispectral Scans</span>
                  </h4>
                  <button
                    onClick={() => setActiveFarmerTab('reports')}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    View All ({farmerReports.length})
                  </button>
                </div>

                <div className="space-y-2.5">
                  {farmerReports.slice(0, 2).map(rep => (
                    <div
                      key={rep.id}
                      onClick={() => handleOpenReport(rep.id)}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img src={rep.droneImagePrimary} alt={rep.fieldName} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-xs text-white">{rep.fieldName}</p>
                          <p className="text-[11px] text-slate-400">{rep.cropType} &bull; {rep.reportDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rep.healthCategory === 'Optimal' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {rep.healthCategory} ({rep.overallHealthScore}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Bookings Preview */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Plane className="w-4 h-4 text-sky-400 -rotate-45" />
                    <span>Active Spray Missions</span>
                  </h4>
                  <button
                    onClick={() => setActiveFarmerTab('bookings')}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    View All ({farmerBookings.length})
                  </button>
                </div>

                <div className="space-y-2.5">
                  {farmerBookings.slice(0, 2).map(b => (
                    <div
                      key={b.id}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-white">{b.bookingNumber}</span>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-extrabold uppercase ${
                            b.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-sky-500/20 text-sky-300'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{b.fieldName} &bull; {b.chemicalOrNutrientName}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-sm text-white">₹{b.finalAmount}</p>
                        <p className="text-[10px] text-slate-400">{b.scheduledDate || b.preferredDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 1: FIELDS & INTERACTIVE GIS MAP */}
        {activeFarmerTab === 'fields' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Fields List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Your Farm Plots ({farmerFields.length})
                </h3>
                <button
                  onClick={() => setIsNewFieldModalOpen(true)}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Plot</span>
                </button>
              </div>

              {/* Search input for fields */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fieldSearch}
                  onChange={(e) => setFieldSearch(e.target.value)}
                  placeholder="Filter plots by name or crop..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {filteredFields.map((field) => {
                  const isSelected = currentSelectedField?.id === field.id;
                  return (
                    <div
                      key={field.id}
                      onClick={() => setSelectedFieldId(field.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-emerald-500 shadow-lg ring-1 ring-emerald-500/50'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-white">{field.name}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{field.crop} &bull; {field.areaAcres} Acres</p>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          field.currentHealth === 'Optimal'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : field.currentHealth === 'Mild Stress'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        }`}>
                          {field.currentHealth}
                        </span>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                        <div>
                          <span>Last Spray: </span>
                          <span className="text-slate-200 font-semibold">{field.lastSprayDate || 'None'}</span>
                        </div>
                        <div>
                          <span>Last Scan: </span>
                          <span className="text-slate-200 font-semibold">{field.lastScanDate || 'None'}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const latestReport = farmerReports.find(r => r.fieldId === field.id);
                            if (latestReport) {
                              handleOpenReport(latestReport.id);
                            } else {
                              handleBookForField(field);
                            }
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          View Health
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookForField(field);
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Plane className="w-3 h-3 -rotate-45" />
                          <span>Book Spray</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Interactive Field GPS Map */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {currentSelectedField ? currentSelectedField.name : 'All Fields GPS Overview'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any field boundary to inspect health status &amp; schedule drone mission
                  </p>
                </div>
                {currentSelectedField && (
                  <button
                    onClick={() => handleBookForField(currentSelectedField)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Spray This Field</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              <FieldMap
                fields={farmerFields}
                activeField={currentSelectedField}
                onFieldClick={(f) => setSelectedFieldId(f.id)}
                heightClass="h-[520px]"
              />
            </div>

          </div>
        )}

        {/* Tab 2: CROP HEALTH REPORTS */}
        {activeFarmerTab === 'reports' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">4K Multispectral Crop Health Reports</h3>
                <p className="text-xs text-slate-400">
                  Detailed color-coded canopy diagnosis, drone imagery, and plain-language agronomist actions
                </p>
              </div>
              <button
                onClick={() => {
                  setPreselectedServiceType('crop_health_scan');
                  setIsBookModalOpen(true);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Request New 4K Scan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {farmerReports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div className="relative h-48 bg-slate-950 overflow-hidden">
                    <img
                      src={rep.droneImagePrimary}
                      alt={rep.fieldName}
                      className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-emerald-400 border border-slate-800">
                      {rep.reportNumber}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase shadow-lg ${
                        rep.healthCategory === 'Optimal'
                          ? 'bg-emerald-500 text-slate-950'
                          : rep.healthCategory === 'Mild Stress'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-rose-600 text-white animate-pulse'
                      }`}>
                        {rep.healthCategory} ({rep.overallHealthScore}/100)
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-slate-200">
                      <b>Crop:</b> {rep.cropType} &bull; <b>Date:</b> {rep.reportDate}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h4 className="font-extrabold text-lg text-white">{rep.fieldName}</h4>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {rep.plainLanguageSummary}
                    </p>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                      <span className="text-slate-400">Health Zones:</span>
                      <div className="flex items-center gap-1.5">
                        {rep.healthZones.map((z, idx) => (
                          <span
                            key={idx}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: z.color }}
                            title={`${z.name}: ${z.areaAcres}A`}
                          />
                        ))}
                        <span className="text-[11px] text-slate-300 font-semibold ml-1">
                          {rep.healthZones.length} Zones Analyzed
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-3">
                      <button
                        onClick={() => handleOpenReport(rep.id)}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <FileCheck2 className="w-4 h-4" />
                        <span>Inspect Full Report &amp; Zones</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: SPRAY ORDERS & MISSIONS */}
        {activeFarmerTab === 'bookings' && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Spray Mission Orders &amp; Flights</h3>
                <p className="text-xs text-slate-400">Track pilot assignment, chemical dosage, and flight telemetry</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Filter Pills */}
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {(['all', 'pending', 'scheduled', 'completed'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setBookingFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                        bookingFilter === st ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsBookModalOpen(true)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Request</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Booking #</th>
                      <th className="p-4">Field &amp; Crop</th>
                      <th className="p-4">Service &amp; Chemical</th>
                      <th className="p-4">Date &amp; Slot</th>
                      <th className="p-4">Assigned Pilot &amp; Drone</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-4 font-mono font-bold text-white">{b.bookingNumber}</td>
                        <td className="p-4">
                          <p className="font-semibold text-white">{b.fieldName}</p>
                          <p className="text-slate-400">{b.acres} Acres</p>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-emerald-400 capitalize block">
                            {b.serviceType.replace(/_/g, ' ')}
                          </span>
                          <span className="text-slate-400 text-[11px]">{b.chemicalOrNutrientName}</span>
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
                            <span className="text-slate-500 italic">Assigning Pilot...</span>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-white">₹{b.finalAmount}</p>
                          <span className="text-[10px] text-emerald-400">40% Subsidy applied</span>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: SUBSCRIPTION & INVOICES */}
        {activeFarmerTab === 'subscription' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Active Plan Card */}
              <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-emerald-950/40 rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs uppercase border border-emerald-500/30">
                      Active Plan
                    </span>
                    <span className="text-xs text-slate-400">Auto-renews on {activeFarmer.subscriptionExpiry}</span>
                  </div>

                  <h3 className="text-2xl font-black text-white mt-4">Seasonal Crop Shield</h3>
                  <p className="text-xs text-slate-300 mt-1">Covers all Rabi season sprays + 1 Free 4K Multispectral Crop Scan</p>

                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">Covered Acreage Usage:</span>
                      <span className="text-emerald-400">
                        {(activeFarmer.totalAcreage - activeFarmer.coveredAcresRemaining).toFixed(1)} / {activeFarmer.totalAcreage} Acres used
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                        style={{
                          width: `${((activeFarmer.totalAcreage - activeFarmer.coveredAcresRemaining) / activeFarmer.totalAcreage) * 100}%`
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {activeFarmer.coveredAcresRemaining} Acres remaining for upcoming booster sprays.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400">Plan Rate:</span>
                    <p className="text-lg font-black text-white">₹719 / acre <span className="text-xs text-emerald-400 font-normal">(40% SMAM subsidized)</span></p>
                  </div>
                  <button
                    onClick={() => setIsBookModalOpen(true)}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Upgrade to Annual Pass
                  </button>
                </div>
              </div>

              {/* Invoices List */}
              <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">GST Invoices &amp; Subsidy Receipts</h4>
                  <span className="text-xs text-slate-400">Official digital receipts</span>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'INV-2026-0818', date: '18 Aug 2026', amount: '₹1,950', desc: 'North Wheat Combo Spray & Scan', status: 'Paid via UPI' },
                    { id: 'INV-2026-0816', date: '16 Aug 2026', amount: '₹1,440', desc: 'East Cotton Bio-Pesticide Spray', status: 'Paid via UPI' },
                    { id: 'INV-2026-0728', date: '28 Jul 2026', amount: '₹2,160', desc: 'Riverbed Mustard Foliar Spray', status: 'Paid via KCC' }
                  ].map((inv) => (
                    <div key={inv.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-white">{inv.id}</span>
                          <span className="text-[10px] text-emerald-400 font-semibold">{inv.status}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{inv.desc} &bull; {inv.date}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-white">{inv.amount}</span>
                        <button
                          onClick={() => alert(`Downloading official GST Tax Invoice & GPS Flight Certificate for ${inv.id}`)}
                          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition cursor-pointer"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 5: SPRAY SUITABILITY & DISTRICT WEATHER */}
        {activeFarmerTab === 'weather' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Weather Radar Card */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {activeFarmer.district} District Agrometeorological Radar
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">Live Spray Suitability Index</h3>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-extrabold text-xs rounded-full border border-emerald-500/40">
                  🟢 EXCELLENT (Grade A)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <Wind className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                  <p className="text-xl font-bold text-white">5.8 km/h</p>
                  <p className="text-xs text-slate-400 mt-0.5">Wind Speed</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-1">Optimal (&lt;12 km/h)</p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <Sun className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-xl font-bold text-white">26.4°C</p>
                  <p className="text-xs text-slate-400 mt-0.5">Temperature</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-1">Low evaporation</p>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                  <Droplets className="w-6 h-6 text-sky-400 mx-auto mb-2" />
                  <p className="text-xl font-bold text-white">72%</p>
                  <p className="text-xs text-slate-400 mt-0.5">Foliar Humidity</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-1">High droplet stick</p>
                </div>
              </div>

              {/* 3-Day Forecast Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recommended Flight Windows This Week:
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">Tomorrow (05:30 AM – 09:00 AM)</span>
                      <p className="text-slate-400 text-[11px]">Wind 4.2 km/h &bull; Clear sky &bull; 0% rain chance</p>
                    </div>
                    <span className="text-emerald-400 font-bold">Recommended ★★★</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">Tomorrow Evening (04:30 PM – 06:45 PM)</span>
                      <p className="text-slate-400 text-[11px]">Wind 6.8 km/h &bull; Sunset calm &bull; 0% rain chance</p>
                    </div>
                    <span className="text-emerald-400 font-bold">Good ★★☆</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">Day After Tomorrow (11:00 AM – 03:00 PM)</span>
                      <p className="text-slate-400 text-[11px]">Thermal updrafts &amp; wind &gt;16 km/h</p>
                    </div>
                    <span className="text-rose-400 font-bold">Avoid (High Drift Risk)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drone safety & drift advisory */}
            <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>AgriWing Weather-Lock Guarantee</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our flight computers automatically cross-check IMD doppler radar and onsite anemometers. If wind exceeds 12 km/h during your scheduled slot, the flight is automatically rescheduled for the next morning with zero cancellation charge.
              </p>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-2">
                <p className="font-semibold text-teal-300">Why morning/evening windows?</p>
                <p className="text-[11px]">
                  During midday sun, rising heat thermals cause fine droplets to evaporate before touching leaves. Early dawn and late dusk provide stable air and leaf stomata opening for 98% chemical uptake.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Modals */}
      <RegisterNewFieldModal
        isOpen={isNewFieldModalOpen}
        onClose={() => setIsNewFieldModalOpen(false)}
      />

      <BookDemoModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />

      {activeReportViewerId && (
        <CropHealthReportViewer
          reportId={activeReportViewerId}
          onClose={() => setActiveReportViewerId(null)}
        />
      )}

    </div>
  );
};
