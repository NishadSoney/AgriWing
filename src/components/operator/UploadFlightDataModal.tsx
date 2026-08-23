/**
 * @file components/operator/UploadFlightDataModal.tsx
 * @description Ingestion dialog for recording post-flight mission telemetry,
 * including spray volume, micro-climate weather, battery consumption, and aerial photos.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, Flight, DronePhoto } from '../../types';
import { 
  X, 
  UploadCloud, 
  Plane, 
  Droplets, 
  Wind, 
  Sun, 
  BatteryCharging, 
  Image as ImageIcon, 
  Check, 
  Sparkles,
  Plus
} from 'lucide-react';

interface UploadFlightDataModalProps {
  bookingId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessOpenReportBuilder?: (flightId: string) => void;
}

export const UploadFlightDataModal: React.FC<UploadFlightDataModalProps> = ({
  bookingId,
  isOpen,
  onClose,
  onSuccessOpenReportBuilder
}) => {
  const { bookings, pilots, drones, fields, uploadFlightData } = useApp();

  const booking = bookings.find(b => b.id === bookingId) || bookings[0];
  const field = fields.find(f => f.id === booking?.fieldId);

  const [sprayVolume, setSprayVolume] = useState<number>(45);
  const [chemicalName, setChemicalName] = useState<string>(
    booking?.chemicalOrNutrientName || 'Propiconazole 25% EC'
  );
  const [dosage, setDosage] = useState<string>('7.5 Liters / Acre (Ultra Low Volume Atomized)');
  const [startTime, setStartTime] = useState<string>('06:15 AM');
  const [endTime, setEndTime] = useState<string>('07:00 AM');
  const [duration, setDuration] = useState<number>(45);
  const [windSpeed, setWindSpeed] = useState<number>(5.4);
  const [temperature, setTemperature] = useState<number>(25.0);
  const [humidity, setHumidity] = useState<number>(75);
  const [windDirection, setWindDirection] = useState<string>('North-East 4 kts');
  const [batteryDrain, setBatteryDrain] = useState<number>(38);

  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&auto=format&fit=crop&q=80'
  );
  const [ndviUrl, setNdviUrl] = useState<string>(
    'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=900&auto=format&fit=crop&q=80'
  );

  if (!isOpen || !booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Default flight trail polygon offset
    const center = field ? field.centerCoordinates : [22.7592, 78.3582];
    const mockTrail: [number, number][] = field ? field.boundaryCoordinates : [
      [center[0] + 0.002, center[1] - 0.002],
      [center[0] + 0.002, center[1] + 0.002],
      [center[0] - 0.002, center[1] + 0.002],
      [center[0] - 0.002, center[1] - 0.002]
    ];

    const photos: DronePhoto[] = [
      {
        id: 'dp-' + Date.now() + '-1',
        url: photoUrl,
        caption: `4K RGB Aerial Inspection of ${booking.fieldName}`,
        timestamp: `${booking.scheduledDate || 'Today'} ${startTime}`,
        type: 'rgb'
      },
      {
        id: 'dp-' + Date.now() + '-2',
        url: ndviUrl,
        caption: 'Near-Infrared Multispectral Crop Health Index',
        timestamp: `${booking.scheduledDate || 'Today'} ${endTime}`,
        type: 'ndvi'
      }
    ];

    const newFlight = uploadFlightData({
      bookingId: booking.id,
      pilotId: booking.pilotId || 'pilot-1',
      pilotName: booking.pilotName || 'Capt. Vikramaditya Singh',
      droneId: booking.droneId || 'drn-101',
      droneModel: booking.droneModel || 'AgriWing T-25 Pro',
      flightDate: booking.scheduledDate || new Date().toISOString().slice(0, 10),
      startTime,
      endTime,
      durationMinutes: Number(duration),
      sprayVolumeLiters: Number(sprayVolume),
      chemicalName,
      dosagePerAcre: dosage,
      coverageAcres: booking.acres,
      weatherConditions: {
        windSpeedKmh: Number(windSpeed),
        temperatureC: Number(temperature),
        humidityPct: Number(humidity),
        conditions: 'Clear morning, zero thermal turbulence',
        windDirection
      },
      gpsFlightTrail: mockTrail,
      dronePhotos: photos,
      status: 'completed',
      batteryDrainPct: Number(batteryDrain)
    });

    onClose();

    if (onSuccessOpenReportBuilder) {
      onSuccessOpenReportBuilder(newFlight.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Upload Post-Flight Telemetry &amp; Imagery</h3>
              <p className="text-xs text-slate-400">Mission #{booking.bookingNumber} &bull; {booking.fieldName}</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Mission Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Total Spray Volume (L):</label>
              <input
                type="number"
                step="1"
                required
                value={sprayVolume}
                onChange={(e) => setSprayVolume(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 font-mono text-sm font-bold"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Duration (Mins):</label>
              <input
                type="number"
                required
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 font-mono text-sm font-bold"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Battery Drain (%):</label>
              <input
                type="number"
                required
                value={batteryDrain}
                onChange={(e) => setBatteryDrain(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500 font-mono text-sm font-bold"
              />
            </div>
          </div>

          {/* Chemical & Dosage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Chemical / Nutrient Applied:</label>
              <input
                type="text"
                required
                value={chemicalName}
                onChange={(e) => setChemicalName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Prescribed Dosage Formula:</label>
              <input
                type="text"
                required
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Weather Conditions at Flight */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <span className="font-bold text-slate-300 block">Flight Meteorology Log (IMD Verified):</span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Wind Speed (km/h):</label>
                <input
                  type="number"
                  step="0.1"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Temperature (°C):</label>
                <input
                  type="number"
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Humidity (%):</label>
                <input
                  type="number"
                  value={humidity}
                  onChange={(e) => setHumidity(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Drone Imagery Cloud Links */}
          <div className="space-y-3">
            <span className="font-bold text-slate-300 block">Cloud Storage Imagery Links:</span>
            <div>
              <label className="text-slate-400 block mb-1">4K RGB Aerial Inspection Photo URL:</label>
              <input
                type="url"
                required
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Multispectral NDVI Reflectance Scan URL:</label>
              <input
                type="url"
                required
                value={ndviUrl}
                onChange={(e) => setNdviUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-[11px]"
              />
            </div>
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
              className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Flight &amp; Generate Health Report</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
