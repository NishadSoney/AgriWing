/**
 * @file components/public/HowItWorksSection.tsx
 * @description Interactive 4-step workflow explainer (Book -> Dispatch -> Precision Flight -> NDVI Report)
 * comparing modern drone application against traditional manual knapsack spraying.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Smartphone, 
  Truck, 
  Plane, 
  FileCheck2, 
  Check, 
  X, 
  ArrowRight, 
  Clock, 
  Droplets, 
  ShieldCheck, 
  Sparkles,
  Layers
} from 'lucide-react';

export const HowItWorksSection: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  const { language } = useApp();
  const isHindi = language === 'hi';
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      stepNumber: '01',
      title: isHindi ? '1. ऐप या कॉल पर बुक करें' : '1. Schedule in 60 Seconds',
      description: isHindi
        ? 'अपने खेत का चयन करें, कीटनाशक/उर्वरक या स्वास्थ्य स्कैन चुनें और अपनी सुविधानुसार समय तय करें।'
        : 'Choose your registered field, select service (Pesticide, Foliar Urea, Bio-stimulant, or NDVI Scan), and pick morning/evening slot.',
      icon: Smartphone,
      highlight: 'Available via App, WhatsApp or Toll-Free 1800-889-2474',
      badge: 'Zero Complex Paperwork'
    },
    {
      stepNumber: '02',
      title: isHindi ? '2. पायलट और ड्रोन आपके खेत पर' : '2. Certified Pilot Dispatched',
      description: isHindi
        ? 'हमारे DGCA प्रमाणित पायलट हाई-टेक स्प्रे ड्रोन के साथ सीधे आपके खेत की मेड़ पर 24-48 घंटों में पहुंचते हैं।'
        : 'A licensed agricultural pilot arrives at your field with calibrated drones (AgriWing T-25), radar terrain sensors & safety equipment.',
      icon: Truck,
      highlight: 'Weather-monitored safe flight window (<12 km/h wind)',
      badge: 'DGCA Certified Safety'
    },
    {
      stepNumber: '03',
      title: isHindi ? '3. 7 मिनट में सटीक माइक्रो-स्प्रे' : '3. Precision Drone Mission',
      description: isHindi
        ? 'ड्रोन के घूर्णनशील पंखों से हवा का ऐसा दबाव बनता है जिससे दवा पत्तियों के ऊपर और नीचे दोनों तरफ समान रूप से चिपकती है।'
        : 'Centrifugal atomizers disperse uniform 120-micron droplets with prop-wash downward thrust, coating both upper & lower leaf surfaces perfectly.',
      icon: Plane,
      highlight: '90% Water Saved (10L vs 180L per acre)',
      badge: '100% Crop Penetration'
    },
    {
      stepNumber: '04',
      title: isHindi ? '4. मोबाइल पर तुरंत हेल्थ रिपोर्ट' : '4. Plain-Language Health Report',
      description: isHindi
        ? 'उड़ान के 1 घंटे के अंदर अपने फोन पर रंगीन हेल्थ मैप और सरल भाषा में सलाह पाएं (कौन से हिस्से में कीड़ा है, क्या छिड़काव करें)।'
        : 'Within hours, receive color-coded health zone maps, drone photos, and actionable agronomist recommendations on your phone.',
      icon: FileCheck2,
      highlight: 'Color-coded zones: Green, Yellow & Red alert zones',
      badge: 'Actionable Advice'
    }
  ];

  return (
    <section id="how-it-works" className="w-full py-20 bg-slate-900 border-b border-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-400 font-bold text-xs uppercase tracking-wider border border-teal-500/20">
            {isHindi ? 'कार्यप्रणाली' : 'Seamless End-to-End Workflow'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            {isHindi ? 'एग्रीविंग कैसे काम करता है?' : 'How AgriWing Powers Your Harvest'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            {isHindi
              ? 'खेत की बुकिंग से लेकर कीटनाशक छिड़काव और रिपोर्ट डिलीवरी तक 4 सरल चरण।'
              : 'From instant booking to automated precision spraying and actionable reports in 4 simple steps.'}
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isSelected = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`relative rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-slate-800 to-slate-800/90 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02]'
                    : 'bg-slate-950/70 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-emerald-400/30 font-mono">
                      {s.stepNumber}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {s.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{s.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/60 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{s.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table: Traditional vs AgriWing */}
        <div className="mt-20 max-w-4xl mx-auto bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isHindi ? 'पारंपरिक छिड़काव बनाम एग्रीविंग ड्रोन' : 'Traditional Manual Spray vs. AgriWing Precision Drone'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Why thousands of farmers are replacing manual labor with drone agriculture
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400">
                  <th className="pb-3 font-semibold">Feature / Metric</th>
                  <th className="pb-3 font-semibold text-rose-400">❌ Manual Backpack Spray</th>
                  <th className="pb-3 font-semibold text-emerald-400">✅ AgriWing Drone System</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3.5 font-medium text-white">Time per Acre</td>
                  <td className="py-3.5 text-rose-300">3.5 to 5 Hours per acre</td>
                  <td className="py-3.5 font-bold text-emerald-400">6 to 8 Minutes per acre</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-medium text-white">Water Consumption</td>
                  <td className="py-3.5 text-rose-300">150 – 200 Liters / acre</td>
                  <td className="py-3.5 font-bold text-emerald-400">10 – 12 Liters / acre (90% Saved)</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-medium text-white">Farmer Health &amp; Inhalation Risk</td>
                  <td className="py-3.5 text-rose-300">High (Skin contact &amp; lung poison risk)</td>
                  <td className="py-3.5 font-bold text-emerald-400">Zero (Remote autonomous control)</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-medium text-white">Crop Trampling Damage</td>
                  <td className="py-3.5 text-rose-300">3% – 5% crop crushed by walking</td>
                  <td className="py-3.5 font-bold text-emerald-400">0% (Flies smoothly above canopy)</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-medium text-white">Underside Leaf Penetration</td>
                  <td className="py-3.5 text-rose-300">Poor (Pests hide under leaves)</td>
                  <td className="py-3.5 font-bold text-emerald-400">100% (Prop-wash air turbulance)</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-medium text-white">Govt Subsidy Eligibility</td>
                  <td className="py-3.5 text-slate-500">None</td>
                  <td className="py-3.5 font-bold text-emerald-400">40%–50% SMAM Direct Subsidy</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full DGCA certified compliance &amp; third-party damage insurance included</span>
            </div>
            <button
              onClick={onBookClick}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition flex items-center gap-2"
            >
              <span>Schedule Farm Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
