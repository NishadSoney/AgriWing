/**
 * @file components/operator/FleetAndPilotsManager.tsx
 * @description Fleet asset register and DGCA-certified pilot roster management.
 * 
 * Features:
 * - Aircraft airworthiness, payload capacity, and battery cycle health tracking
 * - Pilot DGCA license number verification and mission flight hours log
 * - Status toggling (Available, On Mission, Maintenance, Charging)
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Drone, Pilot } from '../../types';
import { 
  Plane, 
  UserCheck, 
  Plus, 
  ShieldCheck, 
  Battery, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Zap
} from 'lucide-react';

export const FleetAndPilotsManager: React.FC = () => {
  const { drones, pilots, addDrone, updateDroneStatus, addPilot, updatePilotStatus, showToast } = useApp();
  const [subTab, setSubTab] = useState<'drones' | 'pilots'>('drones');

  // New Drone Form state
  const [isAddDroneOpen, setIsAddDroneOpen] = useState(false);
  const [newDroneModel, setNewDroneModel] = useState('AgriWing T-25 Pro Octocopter');
  const [newDroneReg, setNewDroneReg] = useState(`UIN-AGW-2026-0${Math.floor(100 + Math.random() * 900)}`);
  const [newDronePayload, setNewDronePayload] = useState<number>(25);

  // New Pilot Form state
  const [isAddPilotOpen, setIsAddPilotOpen] = useState(false);
  const [newPilotName, setNewPilotName] = useState('');
  const [newPilotLicense, setNewPilotLicense] = useState(`DGCA-RPA-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newPilotPhone, setNewPilotPhone] = useState('+91 98');
  const [newPilotBase, setNewPilotBase] = useState('Regional Hub #1');

  const handleCreateDrone = (e: React.FormEvent) => {
    e.preventDefault();
    addDrone({
      modelName: newDroneModel,
      regNumber: newDroneReg,
      serialNo: `AW-${Date.now().toString().slice(-6)}-IND`,
      payloadCapacityLiters: Number(newDronePayload),
      batteryHealthPct: 100,
      totalFlightHours: 0,
      status: 'ready',
      lastMaintenanceDate: new Date().toISOString().slice(0, 10),
      nextServiceDue: new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10),
      equipmentType: 'Spraying + Multispectral 4K'
    });
    setIsAddDroneOpen(false);
  };

  const handleCreatePilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPilotName) return;
    addPilot({
      name: newPilotName,
      phone: newPilotPhone,
      email: `${newPilotName.toLowerCase().replace(/ /g, '.')}@agriwing.com`,
      dgcaLicenseNumber: newPilotLicense,
      licenseExpiryDate: '2029-12-31',
      totalFlightHours: 120,
      status: 'available',
      rating: 4.9,
      baseLocation: newPilotBase,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      certifications: ['DGCA Medium RPAS', 'Precision Ag Safe Spray'],
      assignedMissionsCount: 0
    });
    setIsAddPilotOpen(false);
    setNewPilotName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Fleet Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setSubTab('drones')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              subTab === 'drones'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plane className="w-4 h-4 -rotate-45" />
            <span>Drone Hardware Fleet ({drones.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('pilots')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              subTab === 'pilots'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Certified Pilot Roster ({pilots.length})</span>
          </button>
        </div>

        {subTab === 'drones' ? (
          <button
            onClick={() => setIsAddDroneOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Drone Unit</span>
          </button>
        ) : (
          <button
            onClick={() => setIsAddPilotOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Licensed Pilot</span>
          </button>
        )}
      </div>

      {/* Drones View */}
      {subTab === 'drones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drones.map((drone) => (
            <div
              key={drone.id}
              className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-teal-400 font-bold">
                      {drone.regNumber}
                    </span>
                    <h4 className="font-extrabold text-base text-white mt-0.5">{drone.modelName}</h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    drone.status === 'ready'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : drone.status === 'charging'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : drone.status === 'in_flight'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 animate-pulse'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {drone.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Payload Tank:</span>
                    <p className="font-black text-white text-sm mt-0.5">{drone.payloadCapacityLiters} Liters</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Battery Health:</span>
                    <p className="font-black text-emerald-400 text-sm mt-0.5 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{drone.batteryHealthPct}%</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Flight Hours:</span>
                    <span className="font-mono font-bold text-white">{drone.totalFlightHours} Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Equipment Spec:</span>
                    <span className="text-teal-300 font-semibold">{drone.equipmentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Next Service Due:</span>
                    <span className="text-slate-200">{drone.nextServiceDue}</span>
                  </div>
                </div>
              </div>

              {/* Status Switcher */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">Set Status:</span>
                <select
                  value={drone.status}
                  onChange={(e) => updateDroneStatus(drone.id, e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-teal-500"
                >
                  <option value="ready">Ready for Mission</option>
                  <option value="in_flight">In Flight</option>
                  <option value="charging">Charging Dock</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pilots View */}
      {subTab === 'pilots' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pilots.map((pilot) => (
            <div
              key={pilot.id}
              className="bg-slate-900 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src={pilot.avatar}
                    alt={pilot.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/40"
                  />
                  <div>
                    <h4 className="font-extrabold text-base text-white">{pilot.name}</h4>
                    <span className="text-[11px] font-mono text-teal-400 font-bold block">
                      {pilot.dgcaLicenseNumber}
                    </span>
                    <span className="text-xs text-amber-400 font-bold">★ {pilot.rating} Rating</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Logged Hours:</span>
                    <span className="font-bold text-white">{pilot.totalFlightHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Location:</span>
                    <span className="text-slate-200">{pilot.baseLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DGCA Validity:</span>
                    <span className="text-emerald-400 font-semibold">{pilot.licenseExpiryDate}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                    Certifications:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {pilot.certifications.map((c, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-teal-500/10 text-teal-300 text-[10px] font-semibold border border-teal-500/20"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  pilot.status === 'available'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : pilot.status === 'on_mission'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {pilot.status}
                </span>

                <select
                  value={pilot.status}
                  onChange={(e) => updatePilotStatus(pilot.id, e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2 py-1 text-xs focus:outline-none"
                >
                  <option value="available">Available</option>
                  <option value="on_mission">On Mission</option>
                  <option value="off_duty">Off Duty</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Drone Modal */}
      {isAddDroneOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">Register New Drone Unit</h3>
            <form onSubmit={handleCreateDrone} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Model Name:</label>
                <input
                  type="text"
                  required
                  value={newDroneModel}
                  onChange={(e) => setNewDroneModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">UIN Registration Number:</label>
                <input
                  type="text"
                  required
                  value={newDroneReg}
                  onChange={(e) => setNewDroneReg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Payload Capacity (Liters):</label>
                <input
                  type="number"
                  required
                  value={newDronePayload}
                  onChange={(e) => setNewDronePayload(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddDroneOpen(false)}
                  className="px-4 py-2 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl"
                >
                  Save Drone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Pilot Modal */}
      {isAddPilotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">Add Certified Drone Pilot</h3>
            <form onSubmit={handleCreatePilot} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manpreet Dhillon"
                  value={newPilotName}
                  onChange={(e) => setNewPilotName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">DGCA Remote Pilot License #:</label>
                <input
                  type="text"
                  required
                  value={newPilotLicense}
                  onChange={(e) => setNewPilotLicense(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Phone Number:</label>
                <input
                  type="tel"
                  required
                  value={newPilotPhone}
                  onChange={(e) => setNewPilotPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddPilotOpen(false)}
                  className="px-4 py-2 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl"
                >
                  Save Pilot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
