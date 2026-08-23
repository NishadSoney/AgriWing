/**
 * @file components/farmer/RegisterNewFieldModal.tsx
 * @description Modal dialog enabling farmers to register new land parcels.
 * 
 * Features:
 * - Interactive polygon boundary drawing directly on GIS satellite tiles
 * - Automatic parcel centroid calculation for navigation pins
 * - Crop metadata capture (crop variety, sowing date, soil type, irrigation mechanism)
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Field } from '../../types';
import { 
  X, 
  MapPin, 
  Plus, 
  Trash2, 
  Save, 
  Info, 
  Sparkles,
  Layers
} from 'lucide-react';
import { FieldMap } from '../common/FieldMap';

interface RegisterNewFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterNewFieldModal: React.FC<RegisterNewFieldModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addField, showToast, activeFarmer } = useApp();

  const [name, setName] = useState('');
  const [crop, setCrop] = useState('Wheat');
  const [variety, setVariety] = useState('HD-2967 High Yield');
  const [areaAcres, setAreaAcres] = useState<number>(5.0);
  const [locationName, setLocationName] = useState('East Sector, Near Main Canal');
  const [soilType, setSoilType] = useState('Black Clayey Loam');
  const [irrigationType, setIrrigationType] = useState('Canal + Sprinkler');
  const [sownDate, setSownDate] = useState(new Date().toISOString().slice(0, 10));

  // Default drawn polygon coordinates around farm cluster
  const [drawnPoints, setDrawnPoints] = useState<[number, number][]>([
    [22.7630, 78.3580],
    [22.7645, 78.3615],
    [22.7610, 78.3620],
    [22.7600, 78.3585]
  ]);

  if (!isOpen) return null;

  const handleClearPoints = () => {
    setDrawnPoints([]);
    showToast('Click anywhere on the map to add boundary corner points.');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (drawnPoints.length < 3) {
      alert('Please define at least 3 boundary corner points on the map for your field polygon.');
      return;
    }

    // Compute center coordinates as average of polygon
    const latSum = drawnPoints.reduce((acc, p) => acc + p[0], 0);
    const lngSum = drawnPoints.reduce((acc, p) => acc + p[1], 0);
    const center: [number, number] = [
      Number((latSum / drawnPoints.length).toFixed(6)),
      Number((lngSum / drawnPoints.length).toFixed(6))
    ];

    addField({
      name: name || `Field Khasra ${Math.floor(400 + Math.random() * 99)}`,
      crop,
      variety,
      areaAcres: Number(areaAcres),
      locationName,
      centerCoordinates: center,
      boundaryCoordinates: drawnPoints,
      sownDate,
      soilType,
      irrigationType,
      currentHealth: 'Optimal'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Register New Farm Plot &amp; GPS Boundary</h3>
              <p className="text-xs text-slate-400">Map your field for autonomous precision flight path calculations</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form inputs */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Field Name / Khasra No.:</label>
              <input
                type="text"
                required
                placeholder="e.g. South Paddy Basin (Khasra 409)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Crop Type:</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                  <option value="Paddy">Paddy / Rice (धान)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Sugarcane">Sugarcane (गन्ना)</option>
                  <option value="Citrus / Orange">Citrus Orchard (संतरा)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Area (Acres):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="100"
                  required
                  value={areaAcres}
                  onChange={(e) => setAreaAcres(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Seed Variety / Hybrid:</label>
              <input
                type="text"
                placeholder="e.g. PBW-725 / Bt Hybrid"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Soil Type:</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Black Clayey Loam">Black Clayey Loam</option>
                  <option value="Alluvial Loam">Alluvial Loam</option>
                  <option value="Red Sandy Soil">Red Sandy Soil</option>
                  <option value="Laterite">Laterite Soil</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Sown Date:</label>
                <input
                  type="date"
                  value={sownDate}
                  onChange={(e) => setSownDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Location / Landmark:</label>
              <input
                type="text"
                placeholder="e.g. Near River Lift Canal, Pipariya"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Boundary Points: {drawnPoints.length} set</span>
              </div>
              <p className="mt-1 text-[11px]">
                You can click on the map to add more polygon corners or reset points anytime.
              </p>
            </div>
          </div>

          {/* Right Map Drawer */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Click map to draw boundary polygon:
              </span>
              <button
                type="button"
                onClick={handleClearPoints}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Points</span>
              </button>
            </div>

            <FieldMap
              interactiveDrawMode={true}
              drawnPoints={drawnPoints}
              onPointsChange={(pts) => setDrawnPoints(pts)}
              heightClass="h-80 lg:h-96"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save &amp; Register Field</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
