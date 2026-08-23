/**
 * @file components/public/ServicesAndPricingSection.tsx
 * @description Pricing tiers and service package comparison (Pay-As-You-Go,
 * Seasonal Shield, and Annual Precision) with dynamic subsidy calculator toggles.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRICING_TIERS } from '../../data/mockData';
import { Check, Sparkles, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ServicesAndPricingSection: React.FC<{ onSelectPlan: (planId: string) => void }> = ({ onSelectPlan }) => {
  const { language } = useApp();
  const isHindi = language === 'hi';
  const [applySubsidy, setApplySubsidy] = useState<boolean>(true);

  return (
    <section id="services-pricing" className="w-full py-20 bg-slate-950 border-b border-slate-800/80">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-xs uppercase tracking-wider border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHindi ? 'पारदर्शी मूल्य निर्धारण' : 'Transparent Precision Pricing'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight">
            {isHindi ? 'हर प्रकार के किसान और खेत के लिए योजनाएं' : 'Agricultural Plans for Every Field Scale'}
          </h2>
          <p className="mt-3 text-base text-slate-400">
            {isHindi
              ? 'बिना किसी छिपे शुल्क के। सरकारी 40%-50% SMAM सब्सिडी के साथ अत्यधिक किफायती।'
              : 'Deploy on-demand pay-per-acre or subscribe seasonally with guaranteed scouting telemetry and priority flight scheduling.'}
          </p>

          {/* Subsidy Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-sm">
            <span className="text-xs sm:text-sm font-medium text-slate-300 pl-3">
              {isHindi ? 'सरकारी 40% SMAM सब्सिडी लागू करें:' : 'Calculate with 40% SMAM Direct DBT Subsidy:'}
            </span>
            <button
              type="button"
              onClick={() => setApplySubsidy(!applySubsidy)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                applySubsidy
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{applySubsidy ? '✓ 40% Subsidy Active' : 'Commercial Base Rate'}</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 items-stretch">
          {PRICING_TIERS.map((tier) => {
            const basePrice = tier.pricePerAcre;
            const effectivePrice = applySubsidy ? Math.round(basePrice * 0.6) : basePrice;

            return (
              <div
                key={tier.id}
                className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-200 ${
                  tier.popular
                    ? 'bg-slate-900/95 border-2 border-emerald-500 shadow-xl shadow-emerald-950/40 scale-[1.01]'
                    : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-bold text-[11px] uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Recommended for Growers</span>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{tier.tagline}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-6 pb-6 border-b border-slate-800">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-white font-mono">
                        ₹{effectivePrice}
                      </span>
                      {applySubsidy && (
                        <span className="text-sm font-semibold text-slate-500 line-through font-mono">
                          ₹{basePrice}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-medium">/ acre</span>
                    </div>
                    <p className="text-xs text-emerald-400 font-medium mt-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{tier.billedText}</span>
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-300">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="leading-relaxed text-slate-300">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card CTA */}
                <div className="mt-8 pt-5 border-t border-slate-800">
                  <button
                    onClick={() => onSelectPlan(tier.id)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      tier.popular
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-[11px] text-slate-500 mt-2">
                    Verified DGCA dispatch &bull; No upfront deposit needed
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Acreage & FPO Box */}
        <div className="mt-12 bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-wrap items-center justify-between gap-6 shadow-sm">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
              <Shield className="w-4 h-4" />
              <span>Village Clusters &amp; Farmer Producer Organizations (FPOs)</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white mt-1.5">
              Managing 100+ Acres in your Cooperative?
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              Unlock dedicated drone docking hubs, 75% SMAM Custom Hiring Center grants, and institutional volume tariffs starting at ₹199/acre.
            </p>
          </div>

          <a
            href="tel:1800-889-AGRI"
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 shadow-sm transition flex items-center gap-2"
          >
            <span>Consult FPO Specialist</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </a>
        </div>

      </div>
    </section>
  );
};
