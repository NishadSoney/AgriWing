/**
 * @file components/public/HeroSection.tsx
 * @description Marketing hero section featuring value propositions,
 * DGCA certified credentials, and an interactive savings calculator for farmers.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plane, Droplets, Zap, ShieldCheck, ArrowRight, Sparkles, TrendingUp, PhoneCall, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  const { language, setRole } = useApp();
  const [calcAcres, setCalcAcres] = useState<number>(10);
  const [calcCrop, setCalcCrop] = useState<string>('Wheat');

  const waterSavedLiters = Math.round(calcAcres * 180);
  const chemicalSavedRupees = Math.round(calcAcres * 420);
  const timeSavedHours = Math.round(calcAcres * 3.5);

  const isHindi = language === 'hi';

  return (
    <section className="relative w-full overflow-hidden pt-10 pb-20 bg-slate-950 border-b border-slate-800/80">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        
        {/* Top verified badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-emerald-400 text-xs sm:text-sm font-medium backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {isHindi
                ? 'भारत सरकार 40%-50% SMAM सब्सिडी समर्थित प्रमाणित ड्रोन सेवा'
                : 'Govt. SMAM Subsidy Approved: 40%–50% DBT on Every Drone Flight'}
            </span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            {isHindi ? (
              <>
                <span className="text-emerald-400">7 मिनट में 1 एकड़</span> सटीक स्प्रे।
                <br />
                <span className="text-white mt-1 block font-bold">शून्य स्वास्थ्य जोखिम, 90% पानी की बचत।</span>
              </>
            ) : (
              <>
                Autonomous Precision Drone Spraying.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  1 Acre in 7 Minutes. Zero Hazard.
                </span>
              </>
            )}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {isHindi
              ? 'एग्रीविंग के साथ अपने खेत के लिए सटीक ड्रोन कीटनाशक, नैनो-यूरिया स्प्रे और 4K फसल स्वास्थ्य जांच बुक करें। केवल ₹239/एकड़ से शुरू।'
              : 'Enterprise-grade agricultural drone operations for agrochemical spraying, foliar nutrition, and 4K multispectral NDVI crop diagnostics across India.'}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-3.5 max-w-xl mx-auto">
            <button
              onClick={onBookClick}
              className="w-full sm:w-auto justify-center px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-emerald-950/50 hover:scale-[1.01] active:scale-[0.99] transition flex items-center gap-2 cursor-pointer"
            >
              <Plane className="w-4 h-4 -rotate-45" />
              <span>{isHindi ? 'ड्रोन सेवा तुरंत बुक करें' : 'Book a Drone Spray / Demo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setRole('farmer')}
              className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm sm:text-base border border-slate-800 hover:border-slate-700 transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{isHindi ? 'किसान डैशबोर्ड देखें' : 'Try Farmer Portal Demo'}</span>
            </button>

            <a
              href="tel:1800-889-AGRI"
              className="w-full sm:w-auto justify-center px-5 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs sm:text-sm border border-slate-800/80 flex items-center gap-2 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kisan Line: 1800-889-2474</span>
            </a>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-800/80">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white font-mono">45,000+</p>
              <p className="text-xs text-slate-400 mt-0.5">{isHindi ? 'एकड़ स्प्रे पूरा हुआ' : 'Acres Precision Sprayed'}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">90%</p>
              <p className="text-xs text-slate-400 mt-0.5">{isHindi ? 'पानी की बचत' : 'Water Saved per Acre'}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-teal-400 font-mono">100%</p>
              <p className="text-xs text-slate-400 mt-0.5">{isHindi ? 'DGCA पायलट' : 'DGCA Licensed Pilots'}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-sky-400 font-mono">24-48h</p>
              <p className="text-xs text-slate-400 mt-0.5">{isHindi ? 'खेत पर डिलीवरी' : 'Dispatch Turnaround'}</p>
            </div>
          </div>
        </div>

        {/* Interactive Savings Calculator Card */}
        <div className="max-w-4xl mx-auto bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {isHindi ? 'अपनी बचत और उपज लाभ की गणना करें' : 'Calculate Farm Savings & Water Efficiency'}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isHindi
                  ? 'देखें कि पारंपरिक पीठ वाले स्प्रेयर की तुलना में एग्रीविंग ड्रोन से आप कितना बचाते हैं:'
                  : 'Compare real-world savings against manual knapsack spraying:'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Crop Profile:</span>
              <select
                value={calcCrop}
                onChange={(e) => setCalcCrop(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-500"
              >
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Cotton">Cotton (कपास)</option>
                <option value="Paddy">Paddy / Rice (धान)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Sugarcane">Sugarcane (गन्ना)</option>
                <option value="Orchard">Fruit Orchard (बागवानी)</option>
              </select>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Acreage Slider */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  {isHindi ? 'खेत का क्षेत्रफल (एकड़)' : 'Farm Acreage:'}
                </label>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 font-bold text-sm font-mono rounded-lg border border-emerald-500/30">
                  {calcAcres} Acres
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={calcAcres}
                onChange={(e) => setCalcAcres(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>1 Acre</span>
                <span>10 Acres</span>
                <span>25 Acres</span>
                <span>50+ Acres</span>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">SMAM Subsidy Active:</strong> 40%–50% direct DBT rebate applicable on all booked sorties.</span>
              </div>
            </div>

            {/* Calculated Results */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 text-center flex flex-col justify-between shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-2">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white font-mono">{waterSavedLiters.toLocaleString()} L</p>
                  <p className="text-xs font-semibold text-teal-400 mt-0.5">Water Conserved</p>
                  <p className="text-[11px] text-slate-400 mt-1">90% reduction vs manual hose</p>
                </div>
              </div>

              <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 text-center flex flex-col justify-between shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white font-mono">₹{chemicalSavedRupees.toLocaleString()}</p>
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">Cost Saved</p>
                  <p className="text-[11px] text-slate-400 mt-1">Micro-droplet spray adherence</p>
                </div>
              </div>

              <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 text-center flex flex-col justify-between shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white font-mono">{timeSavedHours} Hours</p>
                  <p className="text-xs font-semibold text-sky-400 mt-0.5">Labor Time Saved</p>
                  <p className="text-[11px] text-slate-400 mt-1">Zero toxic chemical contact</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
