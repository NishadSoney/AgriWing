/**
 * @file components/public/BookDemoModal.tsx
 * @description Multi-step interactive booking modal for scheduling farm demonstrations
 * and custom drone spraying missions with live subsidy pricing previews.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceType } from '../../types';
import { 
  X, 
  Plane, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Droplets, 
  Sparkles, 
  Phone, 
  User, 
  Check, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: string | null;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({
  isOpen,
  onClose,
  initialPlanId = null
}) => {
  const { createBooking, showToast, language, setRole } = useApp();
  const isHindi = language === 'hi';

  const [step, setStep] = useState<number>(1);
  const [crop, setCrop] = useState<string>('Wheat');
  const [serviceType, setServiceType] = useState<ServiceType>('combo_spray_scan');
  const [acres, setAcres] = useState<number>(6);
  const [farmerName, setFarmerName] = useState<string>('Ramesh Patel');
  const [farmerPhone, setFarmerPhone] = useState<string>('+91 98234 56789');
  const [village, setVillage] = useState<string>('Pipariya, Hoshangabad');
  const [preferredDate, setPreferredDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10)
  );
  const [timeSlot, setTimeSlot] = useState<'morning' | 'evening'>('morning');
  const [chemicalName, setChemicalName] = useState<string>('Bio-stimulant + Foliar Micronutrients');
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdBookingNo, setCreatedBookingNo] = useState<string>('');

  if (!isOpen) return null;

  // Rate calculation
  let ratePerAcre = 399;
  if (serviceType === 'crop_health_scan') ratePerAcre = 350;
  if (serviceType === 'combo_spray_scan') ratePerAcre = 500;
  if (serviceType === 'bio_spray') ratePerAcre = 450;

  const totalBasePrice = acres * ratePerAcre;
  const subsidyDiscount = Math.round(totalBasePrice * 0.4);
  const finalPayable = totalBasePrice - subsidyDiscount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking = createBooking({
      fieldId: 'fld-1', // maps to primary field
      serviceType,
      chemicalOrNutrientName: chemicalName || 'Foliar Precision Spray',
      preferredDate,
      preferredTimeSlot: timeSlot,
      customAcres: acres,
      notes: `Village: ${village} | Farmer: ${farmerName} (${farmerPhone}) | ${notes}`
    });

    setCreatedBookingNo(newBooking.bookingNumber);
    setIsSuccess(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseModal = () => {
    setIsSuccess(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isHindi ? 'ड्रोन सेवा / डेमो बुकिंग' : 'Book Drone Spray & Crop Scan'}
              </h3>
              <p className="text-xs text-slate-400">
                {isHindi ? '40% SMAM सब्सिडी के साथ तत्काल पायलट शेड्यूलिंग' : 'Instant Pilot Dispatch with 40% SMAM Govt Subsidy'}
              </p>
            </div>
          </div>

          <button
            onClick={handleCloseModal}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto animate-bounce-short">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-2xl font-black text-white">
                {isHindi ? 'बुकिंग सफलतापूर्वक स्वीकार कर ली गई!' : 'Mission Request Received!'}
              </h4>
              <p className="text-xs font-mono text-emerald-400 mt-1">
                Booking ID: {createdBookingNo}
              </p>
              <p className="text-sm text-slate-300 max-w-md mx-auto mt-3">
                {isHindi
                  ? `धन्यवाद ${farmerName}! हमने आपके ${acres} एकड़ ${crop} के खेत के लिए अनुरोध दर्ज कर लिया है। ऑपरेटर जल्द ही पायलट और ड्रोन असाइन करेंगे।`
                  : `Thank you, ${farmerName}! Your request for ${acres} Acres of ${crop} on ${preferredDate} (${timeSlot === 'morning' ? 'Morning Slot' : 'Evening Slot'}) has been scheduled.`}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="max-w-md mx-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Service:</span>
                <span className="font-semibold text-white capitalize">{serviceType.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Field Area:</span>
                <span className="font-semibold text-white">{acres} Acres</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Base Tariff:</span>
                <span className="text-slate-400">₹{totalBasePrice}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Govt 40% SMAM Subsidy:</span>
                <span>-₹{subsidyDiscount}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-extrabold text-white">
                <span>Effective Amount:</span>
                <span className="text-emerald-400">₹{finalPayable}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  handleCloseModal();
                  setRole('farmer');
                }}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition flex items-center gap-2"
              >
                <span>View in Farmer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleCloseModal}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Step 1: Crop & Service */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                1. Select Crop &amp; Service Type:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                {['Wheat', 'Cotton', 'Paddy', 'Mustard', 'Soybean', 'Orchard'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCrop(c)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold text-center border transition ${
                      crop === c
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'combo_spray_scan' as ServiceType,
                    title: '⚡ Combo: Health Scan + Spray',
                    desc: '4K Multispectral NDVI diagnosis + targeted foliar spray',
                    rate: '₹300/Acre (subsidized)'
                  },
                  {
                    id: 'pesticide_spray' as ServiceType,
                    title: '💧 Precision Pesticide Spray',
                    desc: 'Ultra-low volume atomized mist, 100% leaf coverage',
                    rate: '₹239/Acre (subsidized)'
                  },
                  {
                    id: 'fertilizer_spray' as ServiceType,
                    title: '🌿 Nano-Urea / Foliar Nutrition',
                    desc: 'Quick foliar absorption, 30% fertilizer efficiency boost',
                    rate: '₹239/Acre (subsidized)'
                  },
                  {
                    id: 'crop_health_scan' as ServiceType,
                    title: '🛰️ 4K Multispectral Crop Scan',
                    desc: 'Detect pest, fungal rust & water stress early',
                    rate: '₹210/Acre (subsidized)'
                  }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServiceType(s.id)}
                    className={`p-3 rounded-2xl text-left border transition flex flex-col justify-between ${
                      serviceType === s.id
                        ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{s.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{s.desc}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 mt-2">{s.rate}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Acreage & Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  2. Farm Area (Acres):
                </label>
                <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={acres}
                    onChange={(e) => setAcres(Number(e.target.value))}
                    className="flex-1 accent-emerald-500 cursor-pointer"
                  />
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-extrabold text-sm rounded-lg border border-emerald-500/30 shrink-0">
                    {acres} Acres
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Preferred Date:
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Time slot picker */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Time Window (Low Wind Hours for Zero Drift):
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTimeSlot('morning')}
                  className={`p-3 rounded-xl text-xs font-semibold border flex items-center gap-2.5 transition ${
                    timeSlot === 'morning'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <p className="font-bold">🌅 Morning Window</p>
                    <p className="text-[10px] text-slate-400">05:30 AM – 09:00 AM (Recommended)</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTimeSlot('evening')}
                  className={`p-3 rounded-xl text-xs font-semibold border flex items-center gap-2.5 transition ${
                    timeSlot === 'evening'
                      ? 'bg-teal-950/80 border-teal-500 text-teal-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Clock className="w-4 h-4 text-teal-400" />
                  <div className="text-left">
                    <p className="font-bold">🌇 Evening Window</p>
                    <p className="text-[10px] text-slate-400">04:30 PM – 07:00 PM</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Farmer Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Farmer Name:</label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Phone / WhatsApp:</label>
                <input
                  type="tel"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Village &amp; District:</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Price Preview Card */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>40% SMAM Central Subsidy Deducted Automatically</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Standard ₹{totalBasePrice} &rarr; <span className="text-white font-semibold">You pay only ₹{finalPayable}</span> for {acres} Acres
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-white">₹{finalPayable}</span>
                <span className="text-[11px] text-slate-400 block">Pay after spray completion</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
              >
                <span>Confirm Drone Dispatch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
