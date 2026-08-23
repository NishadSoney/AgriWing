/**
 * @file components/farmer/CropHealthReportViewer.tsx
 * @description In-depth diagnostic viewer for multispectral (NDVI) crop health reports.
 * 
 * Features:
 * - Interactive NDVI layer switching (RGB 4K aerial photography vs. False-color NDVI vs. GIS zone overlays)
 * - Health zone area breakdowns (Optimal, Mild Stress, High Concern, Pest Attack)
 * - Bilingual translation toggle (English / Hindi Kisan summary)
 * - Direct 1-click spot-spray booking from agronomist recommendations
 * - Clean printable format for offline farm record-keeping
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CropHealthReport, ServiceType } from '../../types';
import { 
  X, 
  Printer, 
  Share2, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Plane, 
  Layers, 
  Image as ImageIcon, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  ArrowRight,
  Droplets,
  Volume2
} from 'lucide-react';
import { FieldMap } from '../common/FieldMap';

interface CropHealthReportViewerProps {
  reportId: string;
  onClose: () => void;
}

export const CropHealthReportViewer: React.FC<CropHealthReportViewerProps> = ({
  reportId,
  onClose
}) => {
  const { reports, fields, flights, setIsBookModalOpen, setPreselectedBookingFieldId, setPreselectedServiceType, markReportAsRead } = useApp();
  const [activePhotoTab, setActivePhotoTab] = useState<'drone_photo' | 'ndvi_scan' | 'health_map'>('health_map');
  const [showHindi, setShowHindi] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const report = reports.find(r => r.id === reportId) || reports[0];
  const field = fields.find(f => f.id === report?.fieldId);
  const flight = flights.find(fl => fl.id === report?.flightId);

  // Mark as read when opened
  React.useEffect(() => {
    if (report && !report.isReadByFarmer) {
      markReportAsRead(report.id);
    }
  }, [report?.id]);

  if (!report) return null;

  const handle1ClickBook = (serviceType: ServiceType = 'pesticide_spray') => {
    setPreselectedBookingFieldId(report.fieldId);
    setPreselectedServiceType(serviceType);
    setIsBookModalOpen(true);
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSimulateAudioRead = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Top Action Bar */}
        <div className="p-4 sm:p-6 bg-slate-800/90 border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">Crop Health Diagnostic Report</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-950 text-emerald-400 border border-slate-700">
                  {report.reportNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generated from 4K Drone Multispectral Survey &bull; Date: {report.reportDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Printable Container */}
        <div className="p-6 sm:p-8 space-y-8 print:p-4 print:space-y-4">
          
          {/* Header Summary Banner */}
          <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-3xl border border-slate-800 flex flex-wrap items-center justify-between gap-6 print:border-black/20 print:bg-slate-50">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Field Diagnostic Record
              </span>
              <h2 className="text-2xl font-black text-white print:text-black">{report.fieldName}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 print:text-slate-700 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <b>Farmer:</b> {report.farmerName}
                </span>
                <span><b>Crop:</b> {report.cropType}</span>
                <span><b>Survey Date:</b> {report.reportDate}</span>
                {flight && <span><b>Pilot:</b> {flight.pilotName}</span>}
              </div>
            </div>

            {/* Health Score Gauge */}
            <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-inner print:bg-white print:border-black/20">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full border-4 border-slate-800">
                <div 
                  className={`w-full h-full rounded-full flex items-center justify-center font-black text-xl ${
                    report.overallHealthScore >= 80 ? 'text-emerald-400' :
                    report.overallHealthScore >= 60 ? 'text-amber-400' : 'text-rose-500'
                  }`}
                >
                  {report.overallHealthScore}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Overall Canopy Health</p>
                <p className={`text-base font-black ${
                  report.healthCategory === 'Optimal' ? 'text-emerald-400' :
                  report.healthCategory === 'Mild Stress' ? 'text-amber-400' : 'text-rose-400 animate-pulse'
                }`}>
                  {report.healthCategory}
                </p>
                <p className="text-[11px] text-slate-400">Score 0–100 NDVI benchmark</p>
              </div>
            </div>
          </div>

          {/* Plain-Language Summary Box */}
          <div className="p-6 bg-slate-950/80 rounded-3xl border border-slate-800 relative space-y-3 print:bg-slate-50 print:border-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h4 className="font-bold text-sm text-white print:text-black">
                  📢 Plain-Language Summary for Farmer (सरल भाषा में सारांश)
                </h4>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  type="button"
                  onClick={() => setShowHindi(!showHindi)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    showHindi
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {showHindi ? 'English Text' : 'हिंदी में देखें'}
                </button>

                <button
                  type="button"
                  onClick={handleSimulateAudioRead}
                  className={`p-1.5 rounded-lg text-xs border border-slate-700 flex items-center gap-1 transition ${
                    isPlayingAudio ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                  title="Listen to audio summary"
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  <span className="text-[11px]">{isPlayingAudio ? 'Playing...' : 'Audio Voice'}</span>
                </button>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 print:text-slate-800 leading-relaxed">
              {showHindi && report.plainLanguageSummaryHindi
                ? report.plainLanguageSummaryHindi
                : report.plainLanguageSummary}
            </p>
          </div>

          {/* Map & Drone Photos View Switcher */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:hidden">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePhotoTab('health_map')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activePhotoTab === 'health_map'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Color-Coded Health Zones Map</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePhotoTab('ndvi_scan')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activePhotoTab === 'ndvi_scan'
                      ? 'bg-teal-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Multispectral NDVI Scan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePhotoTab('drone_photo')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activePhotoTab === 'drone_photo'
                      ? 'bg-sky-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>4K Drone RGB Imagery</span>
                </button>
              </div>
            </div>

            {/* Display Active Visual */}
            {activePhotoTab === 'health_map' && (
              <div className="space-y-4">
                <FieldMap
                  activeField={field}
                  healthZones={report.healthZones}
                  flightTrail={flight?.gpsFlightTrail}
                  heightClass="h-96"
                />

                {/* Health Zones Breakdown Table */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {report.healthZones.map((zone) => (
                    <div
                      key={zone.id}
                      className="p-4 rounded-2xl border text-xs flex flex-col justify-between"
                      style={{
                        borderColor: zone.color + '60',
                        backgroundColor: '#090d16'
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-extrabold text-sm" style={{ color: zone.color }}>
                            {zone.name}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white border border-slate-800">
                            {zone.areaAcres} Acres ({zone.areaPct}%)
                          </span>
                        </div>
                        <p className="text-slate-300 leading-snug mt-1">
                          <b>Findings:</b> {zone.issue}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-200">
                        <span className="font-semibold text-emerald-400">Recommendation: </span>
                        {zone.actionRecommended}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activePhotoTab === 'ndvi_scan' && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={report.ndviImageOverlay || 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&auto=format&fit=crop&q=80'}
                  alt="Multispectral NDVI Scan"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-xs text-white max-w-md">
                  <p className="font-bold text-teal-400">Near-Infrared Reflectance Map (Calibrated 4K)</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Dark Green indicates high chlorophyll photosynthetic activity. Red/Orange pixels pinpoint chlorophyll depletion or fungal spore necrosis.
                  </p>
                </div>
              </div>
            )}

            {activePhotoTab === 'drone_photo' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={report.droneImagePrimary}
                    alt="RGB Drone survey"
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-3 text-xs text-slate-300">
                    <p className="font-semibold text-white">4K RGB Aerial Inspection Photo</p>
                    <p className="text-[11px] text-slate-400">Captured at 25m AGL with AgriWing T-25 Survey Gimbal.</p>
                  </div>
                </div>

                {flight && flight.dronePhotos.length > 1 && (
                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img
                      src={flight.dronePhotos[flight.dronePhotos.length - 1].url}
                      alt="Drone spray nozzle"
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-3 text-xs text-slate-300">
                      <p className="font-semibold text-white">Micronizer Atomizer Nozzle Close-Up</p>
                      <p className="text-[11px] text-slate-400">{flight.dronePhotos[flight.dronePhotos.length - 1].caption}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recommended Actions Section */}
          <div className="space-y-4">
            <h4 className="text-base font-extrabold text-white print:text-black flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Recommended Farm Actions (तुरंत कार्रवाई की सिफारिश)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.recommendedActions.map((act) => (
                <div
                  key={act.id}
                  className="p-5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between print:border-black/20 print:bg-white"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        act.urgency === 'immediate'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {act.urgency === 'immediate' ? '🚨 Immediate (Within 48h)' : '⏰ Within 3 Days'}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        Est. Cost: ₹{act.estimatedCost}
                      </span>
                    </div>

                    <h5 className="font-bold text-sm text-white print:text-black mb-1">{act.title}</h5>
                    <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed mb-3">
                      {act.description}
                    </p>

                    {act.recommendedChemical && (
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-300 print:bg-slate-50 mb-3">
                        <span className="font-semibold text-teal-300">Prescribed Chemical: </span>
                        {act.recommendedChemical} &bull; <b>Dosage:</b> {act.recommendedDosage}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handle1ClickBook(act.oneClickServiceType || 'pesticide_spray')}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 print:hidden"
                  >
                    <Plane className="w-3.5 h-3.5 -rotate-45" />
                    <span>1-Click Book Drone Spray for this Action</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Operator Sign-off & Weather Footer */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4 print:border-black/20">
            <div>
              <span className="font-semibold text-slate-200">Certified by: </span>
              <span>{report.generatedByPilotOrOperator}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">{report.operatorNotes}</p>
            </div>

            {flight && (
              <div className="flex items-center gap-4 text-[11px]">
                <span>💨 Wind: {flight.weatherConditions.windSpeedKmh} km/h</span>
                <span>🌡️ Temp: {flight.weatherConditions.temperatureC}°C</span>
                <span>💧 Humidity: {flight.weatherConditions.humidityPct}%</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
