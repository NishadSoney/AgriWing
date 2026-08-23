/**
 * @file components/operator/AssignBookingModal.tsx
 * @description Modal dialog for dispatching DGCA certified pilots and UAV drones
 * to farmer booking requests, establishing mission flight schedules.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { X, Plane, UserCheck, Calendar, Clock, ShieldCheck, Check } from 'lucide-react';

interface AssignBookingModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssignBookingModal: React.FC<AssignBookingModalProps> = ({
  booking,
  isOpen,
  onClose
}) => {
  const { pilots, drones, assignBooking } = useApp();

  const [pilotId, setPilotId] = useState<string>(pilots[0]?.id || '');
  const [droneId, setDroneId] = useState<string>(drones[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState<string>(
    booking?.preferredDate || new Date().toISOString().slice(0, 10)
  );
  const [scheduledTime, setScheduledTime] = useState<string>(
    booking?.preferredTimeSlot === 'morning' ? '06:00 AM - 07:30 AM' : '05:00 PM - 06:30 PM'
  );
  const [notes, setNotes] = useState<string>('Standard 120-micron atomized foliar application');

  if (!isOpen || !booking) return null;

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    assignBooking(booking.id, {
      pilotId,
      droneId,
      scheduledDate,
      scheduledTime,
      notes
    });
    onClose();
  };

  const selectedPilot = pilots.find(p => p.id === pilotId);
  const selectedDrone = drones.find(d => d.id === droneId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Dispatch &amp; Assign Mission</h3>
              <p className="text-xs text-slate-400">Booking #{booking.bookingNumber} &bull; {booking.fieldName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAssign} className="p-6 space-y-5">
          
          {/* Booking Overview Card */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-300">
              <span>Farmer:</span>
              <span className="font-semibold text-white">{booking.farmerName} ({booking.farmerPhone})</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Service &amp; Chemical:</span>
              <span className="font-semibold text-emerald-400 capitalize">{booking.serviceType.replace(/_/g, ' ')} &bull; {booking.chemicalOrNutrientName}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Area to Spray:</span>
              <span className="font-semibold text-white">{booking.acres} Acres</span>
            </div>
          </div>

          {/* Pilot Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Select Certified Pilot:
            </label>
            <select
              value={pilotId}
              onChange={(e) => setPilotId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
              required
            >
              {pilots.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.dgcaLicenseNumber}) — Rating: {p.rating}★ ({p.totalFlightHours}h) — {p.status.toUpperCase()}
                </option>
              ))}
            </select>
            {selectedPilot && (
              <p className="text-[11px] text-teal-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>License valid till {selectedPilot.licenseExpiryDate} &bull; Base: {selectedPilot.baseLocation}</span>
              </p>
            )}
          </div>

          {/* Drone Selection */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Select Available Drone:
            </label>
            <select
              value={droneId}
              onChange={(e) => setDroneId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
              required
            >
              {drones.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.modelName} ({d.regNumber}) — Battery {d.batteryHealthPct}% — Payload {d.payloadCapacityLiters}L — {d.status.toUpperCase()}
                </option>
              ))}
            </select>
            {selectedDrone && (
              <p className="text-[11px] text-slate-400 mt-1">
                Equipment: {selectedDrone.equipmentType} &bull; Next Service: {selectedDrone.nextServiceDue}
              </p>
            )}
          </div>

          {/* Schedule Date & Time Slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Scheduled Flight Date:
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Flight Time Window:
              </label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                required
              />
            </div>
          </div>

          {/* Operator Instructions */}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">
              Operator / Pilot Flight Briefing Note:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Confirm &amp; Notify Farmer</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
