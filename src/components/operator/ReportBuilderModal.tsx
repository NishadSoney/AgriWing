/**
 * @file components/operator/ReportBuilderModal.tsx
 * @description Agronomic diagnostic authoring modal for drone fleet operators.
 * 
 * Features:
 * - Diagnostic preset templates (Optimal Vigour, Yellow Rust Fungal, Armyworm Pest)
 * - NDVI health score slider and severity classification
 * - Automatic bilingual report generation (English & Hindi)
 * - Actionable agronomic prescription authoring with chemical dosage recommendations
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CropHealthReport, HealthZone, RecommendedAction } from '../../types';
import { 
  X, 
  Sparkles, 
  Save, 
  Layers, 
  Check, 
  Plus, 
  Trash2, 
  FileText, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

interface ReportBuilderModalProps {
  flightId: string | null;
  reportToEdit?: CropHealthReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportBuilderModal: React.FC<ReportBuilderModalProps> = ({
  flightId,
  reportToEdit = null,
  isOpen,
  onClose
}) => {
  const { flights, bookings, fields, farmers, createOrUpdateReport } = useApp();

  const flight = flights.find(fl => fl.id === flightId) || flights[0];
  const booking = bookings.find(b => b.id === flight?.bookingId);
  const field = fields.find(f => f.id === booking?.fieldId) || fields[0];
  const farmer = farmers.find(f => f.id === booking?.farmerId) || farmers[0];

  const [healthScore, setHealthScore] = useState<number>(
    reportToEdit?.overallHealthScore ?? 75
  );
  const [healthCategory, setHealthCategory] = useState<CropHealthReport['healthCategory']>(
    reportToEdit?.healthCategory ?? 'Mild Stress'
  );
  const [summary, setSummary] = useState<string>(
    reportToEdit?.plainLanguageSummary ??
    `Good news: 80% of your ${field?.crop || 'crop'} shows uniform vegetative canopy density. However, our 4K drone scan detected early signs of moisture stress and mild fungal spots on the east field slope. A quick foliar booster spray is recommended within 72 hours.`
  );
  const [summaryHindi, setSummaryHindi] = useState<string>(
    reportToEdit?.plainLanguageSummaryHindi ??
    `आपके खेत का 80% हिस्सा स्वस्थ और हरा-भरा है। पूर्वी हिस्से में हल्की नमी की कमी और फफूंद के लक्षण दिखे हैं। अगले 3 दिनों में फोलियर बूस्टर स्प्रे की सिफारिश की जाती है।`
  );
  const [operatorNotes, setOperatorNotes] = useState<string>(
    reportToEdit?.operatorNotes ?? 'Flight mission completed with zero drift. Calibrated with standard Sentinel NDVI.'
  );

  // Template autofills
  const handleApplyTemplate = (type: 'healthy' | 'rust' | 'pest') => {
    if (type === 'healthy') {
      setHealthScore(95);
      setHealthCategory('Optimal');
      setSummary(`Outstanding crop vigour! 100% of your ${field?.crop} has a deep green chlorophyll index with zero pest damage or nutrient stress.`);
      setSummaryHindi(`फसल की स्थिति अत्यंत उत्कृष्ट है। पूरे खेत में फसल हरी-भरी है और किसी भी कीट का कोई प्रकोप नहीं है।`);
    } else if (type === 'rust') {
      setHealthScore(65);
      setHealthCategory('High Concern');
      setSummary(`Warning: Early Yellow Rust fungal spores (Puccinia striiformis) identified across 1.2 acres on field border. Spot spray Propiconazole 25% EC immediately before rain.`);
      setSummaryHindi(`चेतावनी: खेत के 1.2 एकड़ हिस्से में पीला रतुआ (फफूंद) के लक्षण मिले हैं। तुरंत प्रोपिकोनाजोल फंगीसाइड स्प्रे करें।`);
    } else if (type === 'pest') {
      setHealthScore(55);
      setHealthCategory('Severe Pest Attack');
      setSummary(`Urgent Alert: Fall Armyworm / Bollworm larvae foliar damage detected in central sector. Immediate drone insecticide spray required within 24-48 hours.`);
      setSummaryHindi(`आपातकालीन सूचना: खेत के मध्य भाग में कीट/लार्वा का प्रकोप देखा गया है। अगले 24-48 घंटों में तुरंत कीटनाशक स्प्रे आवश्यक है।`);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sampleZones: HealthZone[] = [
      {
        id: 'hz-b1',
        name: 'Zone A: Vigorous Green Canopy',
        color: '#10B981',
        severity: 'good',
        areaAcres: Number((field.areaAcres * 0.75).toFixed(1)),
        areaPct: 75,
        issue: 'Optimal photosynthetic index, robust tillering.',
        actionRecommended: 'Maintain routine irrigation schedule.',
        coordinates: field.boundaryCoordinates
      },
      {
        id: 'hz-b2',
        name: 'Zone B: Stress Alert Patch',
        color: healthScore < 70 ? '#EF4444' : '#F59E0B',
        severity: healthScore < 70 ? 'critical' : 'warning',
        areaAcres: Number((field.areaAcres * 0.25).toFixed(1)),
        areaPct: 25,
        issue: healthCategory === 'Optimal' ? 'Mild nutrient lag' : 'Early fungal or pest symptom cluster',
        actionRecommended: 'Targeted spot spray with AgriWing micro-droplet drone precision.',
        coordinates: field.boundaryCoordinates
      }
    ];

    const sampleActions: RecommendedAction[] = [
      {
        id: 'act-b1',
        title: healthScore < 70 ? 'Urgent Targeted Spot Spray' : 'Routine Bio-Nutrient Booster',
        description: `Apply recommended foliar mist to boost recovery and protect remaining ${field.areaAcres} acres.`,
        urgency: healthScore < 70 ? 'immediate' : 'within_3_days',
        estimatedCost: Math.round(field.areaAcres * 240),
        recommendedChemical: healthScore < 70 ? 'Propiconazole 25% EC / Bio-Insecticide' : 'IFFCO Nano Urea + Zinc',
        recommendedDosage: '200 ml / acre in 10L atomized mist',
        oneClickServiceType: 'pesticide_spray'
      }
    ];

    createOrUpdateReport({
      id: reportToEdit?.id,
      flightId: flight?.id || 'flt-881',
      bookingId: booking?.id || 'bk-201',
      fieldId: field.id,
      fieldName: field.name,
      farmerId: farmer.id,
      farmerName: farmer.name,
      reportDate: new Date().toISOString().slice(0, 10),
      cropType: field.crop,
      overallHealthScore: Number(healthScore),
      healthCategory,
      plainLanguageSummary: summary,
      plainLanguageSummaryHindi: summaryHindi,
      droneImagePrimary: flight?.dronePhotos[0]?.url || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&auto=format&fit=crop&q=80',
      ndviImageOverlay: flight?.dronePhotos[1]?.url || 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=900&auto=format&fit=crop&q=80',
      healthZones: sampleZones,
      recommendedActions: sampleActions,
      operatorNotes,
      generatedByPilotOrOperator: flight?.pilotName ? `${flight.pilotName} (Certified Ag Operator)` : 'Lead Agronomist & Drone Pilot',
      isReadByFarmer: false
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Generate Farmer Crop Health Report</h3>
              <p className="text-xs text-slate-400">
                {field.name} &bull; Farmer: {farmer.name} ({farmer.phone})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Autofill Templates */}
        <div className="px-6 pt-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-400">⚡ Quick Diagnosis Presets:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyTemplate('healthy')}
              className="px-3 py-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-500/40"
            >
              ✓ All Healthy (95/100)
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate('rust')}
              className="px-3 py-1 bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-xs font-semibold rounded-lg border border-amber-500/40"
            >
              ⚠️ Yellow Rust Alert (65/100)
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate('pest')}
              className="px-3 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold rounded-lg border border-rose-500/40"
            >
              🚨 Severe Pest Attack (55/100)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Health Score & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Overall Health Score (0 to 100):
              </label>
              <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-700">
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={healthScore}
                  onChange={(e) => setHealthScore(Number(e.target.value))}
                  className="flex-1 accent-teal-500"
                />
                <span className="px-3 py-1 bg-teal-500/20 text-teal-300 font-extrabold text-sm rounded-lg border border-teal-500/40">
                  {healthScore}/100
                </span>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Health Category:</label>
              <select
                value={healthCategory}
                onChange={(e) => setHealthCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 font-bold"
              >
                <option value="Optimal">🟢 Optimal (80 - 100)</option>
                <option value="Mild Stress">🟡 Mild Stress (60 - 79)</option>
                <option value="High Concern">🟠 High Concern (40 - 59)</option>
                <option value="Severe Pest Attack">🔴 Severe Pest Attack (&lt; 40)</option>
              </select>
            </div>
          </div>

          {/* Plain-Language Summary (English) */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Plain-Language Summary (English) — Easy for Farmer to Understand:
            </label>
            <textarea
              rows={3}
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Plain-Language Summary (Hindi) */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              सरल भाषा में सारांश (Hindi):
            </label>
            <textarea
              rows={2}
              value={summaryHindi}
              onChange={(e) => setSummaryHindi(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Operator Sign-off Notes */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Internal Pilot / Agronomist Notes:
            </label>
            <input
              type="text"
              value={operatorNotes}
              onChange={(e) => setOperatorNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Publish Report to Farmer App</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
