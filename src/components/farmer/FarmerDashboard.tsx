/**
 * @file components/farmer/FarmerDashboard.tsx
 * @description Main portal interface for registered farmers.
 * 
 * Provides:
 * - Farm overview with real-time spray suitability weather metrics (wind speed, humidity, temp)
 * - Interactive GIS map of registered field parcels with live health status
 * - 1-Click quick booking workflow for pesticide, fertilizer, and NDVI scanning missions
 * - Multispectral crop health diagnostic report center
 * - Subsidy status tracker and mission history timeline
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Field, CropHealthReport, Booking } from '../../types';
import { 
  MapPin, 
  Plane, 
  FileCheck2, 
  CreditCard, 
  Bell, 
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
  ExternalLink,
  Download
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
    flights, 
    alerts, 
    markAlertAsRead, 
    setIsBookModalOpen, 
    isBookModalOpen,
    isNewFieldModalOpen, 
    setIsNewFieldModalOpen,
    setPreselectedBookingFieldId,
    setPreselectedServiceType
  } = useApp();

  const [activeFarmerTab, setActiveFarmerTab] = useState<'fields' | 'reports' | 'bookings' | 'subscription' | 'weather'>('fields');
  const [selectedField, setSelectedField] = useState<Field | null>(fields[0] || null);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  // Farmer-specific items
  const farmerFields = fields.filter(f => f.farmerId === activeFarmer.id);
  const farmerReports = reports.filter(r => r.farmerId === activeFarmer.id);
  const farmerBookings = bookings.filter(b => b.farmerId === activeFarmer.id);
  const farmerAlerts = alerts.filter(a => a.farmerId === activeFarmer.id || a.targetRole === 'all');

  const urgentAlerts = farmerAlerts.filter(a => !a.read && a.severity === 'urgent');

  const handleOpenReport = (reportId: string) => {
    setActiveReportId(reportId);
  };

  const handleBookForField = (field: Field) => {
    setPreselectedBookingFieldId(field.id);
    setIsBookModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      
      {/* Top Banner Profile Summary */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            
            {/* Farmer Identity */}
            <div className="flex items-center gap-4">
              <img
                src={activeFarmer.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'}
                alt={activeFarmer.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white tracking-tight">{activeFarmer.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    🌾 {activeFarmer.subscriptionPlanId.replace(/_/g, ' ').toUpperCase()} PLAN
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-normal">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
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
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700/80 transition flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Register New Field</span>
              </button>

              <button
                onClick={() => {
                  setPreselectedBookingFieldId(null);
                  setPreselectedServiceType(null);
                  setIsBookModalOpen(true);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/50 transition flex items-center gap-2"
              >
                <Plane className="w-4 h-4 -rotate-45" />
                <span>Book Drone Spray</span>
              </button>
            </div>

          </div>

          {/* Sleek Stat Metrics */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/90 rounded-xl shadow-sm border border-slate-800 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Land Serviced</span>
                <MapPin className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{activeFarmer.totalAcreage} Acres</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{farmerFields.length} active plots mapped</p>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-xl shadow-sm border border-slate-800 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Covered Plan</span>
                <ShieldCheck className="w-4 h-4 text-teal-400" />
              </div>
              <p className="text-2xl font-bold text-teal-400 mt-1">{activeFarmer.coveredAcresRemaining} Acres</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Valid till {activeFarmer.subscriptionExpiry}</p>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-xl shadow-sm border border-slate-800 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Scheduled Spray</span>
                <Plane className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-2xl font-bold text-sky-400 mt-1">
                {farmerBookings.filter(b => b.status === 'scheduled' || b.status === 'pending').length} Missions
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Tomorrow 06:00 AM slot</p>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-xl shadow-sm border border-slate-800 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg. Crop Health</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                88%
              </p>
              <p className="text-[11px] text-amber-400 mt-0.5 font-medium">1 localized spot alert</p>
            </div>
          </div>

          {/* Urgent Alert Banner */}
          {urgentAlerts.length > 0 && (
            <div className="mt-6 p-4 bg-rose-950/70 border border-rose-500/40 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-white">{urgentAlerts[0].title}</h4>
                  <p className="text-xs text-rose-200 mt-0.5">{urgentAlerts[0].message}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {urgentAlerts[0].relatedReportId && (
                  <button
                    onClick={() => handleOpenReport(urgentAlerts[0].relatedReportId!)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Inspect Report
                  </button>
                )}
                <button
                  onClick={() => markAlertAsRead(urgentAlerts[0].id)}
                  className="px-3 py-1.5 bg-slate-900 text-slate-300 hover:text-white rounded-xl text-xs border border-slate-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 mt-6">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: 'fields', label: '🌾 Registered Fields & Map', icon: MapPin },
            { id: 'reports', label: `📊 Crop Health Reports (${farmerReports.length})`, icon: FileCheck2 },
            { id: 'bookings', label: `🚁 Spray Orders & Flights (${farmerBookings.length})`, icon: Plane },
            { id: 'subscription', label: '💳 Subscription & Invoices', icon: CreditCard },
            { id: 'weather', label: '🌤️ Spray Suitability & Weather', icon: Wind }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeFarmerTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFarmerTab(tab.id as any)}
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

        {/* Tab 1: Fields & Interactive Map */}
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
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Plot</span>
                </button>
              </div>

              {farmerFields.map((field) => {
                const isSelected = selectedField?.id === field.id;
                return (
                  <div
                    key={field.id}
                    onClick={() => setSelectedField(field)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-500 shadow-lg ring-1 ring-emerald-500/50'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-white">{field.name}</h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{field.crop} &bull; {field.areaAcres} Acres</p>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        field.currentHealth === 'Optimal'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : field.currentHealth === 'Mild Stress'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      }`}>
                        {field.currentHealth}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <div>
                        <span>Last Spray: </span>
                        <span className="text-slate-200 font-semibold">{field.lastSprayDate || 'None'}</span>
                      </div>
                      <div>
                        <span>Last 4K Scan: </span>
                        <span className="text-slate-200 font-semibold">{field.lastScanDate || 'None'}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
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
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                      >
                        View Health Map
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookForField(field);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <Plane className="w-3 h-3 -rotate-45" />
                        <span>Book Spray</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Interactive Field GPS Map */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {selectedField ? selectedField.name : 'All Fields GPS Overview'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any field boundary to inspect health status &amp; schedule drone mission
                  </p>
                </div>
                {selectedField && (
                  <button
                    onClick={() => handleBookForField(selectedField)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center gap-1.5"
                  >
                    <span>Spray This Field</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              <FieldMap
                fields={farmerFields}
                activeField={selectedField}
                onFieldClick={(f) => setSelectedField(f)}
                heightClass="h-[480px]"
              />
            </div>

          </div>
        )}

        {/* Tab 2: Crop Health Reports */}
        {activeFarmerTab === 'reports' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
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
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
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
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
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

        {/* Tab 3: Spray Orders & Missions */}
        {activeFarmerTab === 'bookings' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Spray Mission Orders &amp; Flights</h3>
                <p className="text-xs text-slate-400">Track pilot assignment, chemical dosage, and flight telemetry</p>
              </div>
              <button
                onClick={() => setIsBookModalOpen(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Service Request</span>
              </button>
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
                    {farmerBookings.map((b) => (
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

        {/* Tab 4: Subscription & Invoices */}
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
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition"
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
                          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition"
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

        {/* Tab 5: Spray Suitability & District Weather */}
        {activeFarmerTab === 'weather' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Weather Radar Card */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Hoshangabad District Agrometeorological Radar
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
                Our flight planning computers automatically cross-check Indian Meteorological Department (IMD) doppler radar and onsite anemometers. If wind exceeds 12 km/h during your scheduled slot, the flight is automatically rescheduled for the next morning with zero cancellation charge.
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

      {activeReportId && (
        <CropHealthReportViewer
          reportId={activeReportId}
          onClose={() => setActiveReportId(null)}
        />
      )}

    </div>
  );
};
