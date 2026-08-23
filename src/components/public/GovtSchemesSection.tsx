/**
 * @file components/public/GovtSchemesSection.tsx
 * @description Educational and interactive subsidy navigator covering Indian Government
 * agricultural drone initiatives (SMAM, Drone Didi, Agriculture Infrastructure Fund).
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GOVT_SCHEMES } from '../../data/mockData';
import { 
  Building2, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight, 
  Award,
  Sparkles
} from 'lucide-react';

export const GovtSchemesSection: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  const { language } = useApp();
  const isHindi = language === 'hi';
  const [selectedScheme, setSelectedScheme] = useState<string>(GOVT_SCHEMES[0].id);
  const [checkLandSize, setCheckLandSize] = useState<string>('under_5');
  const [checkCategory, setCheckCategory] = useState<string>('general');
  const [showEligibilityResult, setShowEligibilityResult] = useState<boolean>(false);

  const scheme = GOVT_SCHEMES.find(s => s.id === selectedScheme) || GOVT_SCHEMES[0];

  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEligibilityResult(true);
  };

  return (
    <section id="govt-schemes" className="w-full py-20 bg-slate-900 border-b border-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/20">
            {isHindi ? 'सरकारी योजनाएं और सब्सिडी' : 'Government Subsidies & Schemes'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            {isHindi ? 'ड्रोन खेती पर 40% से 75% तक सरकारी सहायता' : 'Get Up to 40%–75% Financial Aid for Drone Farming'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            {isHindi
              ? 'एग्रीविंग सीधे भारत सरकार के SMAM और किसान ड्रोन शक्ति पोर्टलों से जुड़ा हुआ है। बिल में सब्सिडी तुरंत घटाई जाती है।'
              : 'AgriWing automatically submits your flight GPS telemetry and Khasra details to state portals for seamless DBT subsidy clearance.'}
          </p>
        </div>

        {/* Schemes Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Scheme Switcher Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
              Available Central &amp; State Schemes:
            </h3>
            {GOVT_SCHEMES.map((s) => {
              const isSelected = s.id === selectedScheme;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedScheme(s.id);
                    setShowEligibilityResult(false);
                  }}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-start justify-between border ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 scale-[1.01]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mb-1">
                      {s.subsidyPct}
                    </span>
                    <h4 className="font-bold text-sm text-slate-100">{s.shortName}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{s.agency}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 mt-1 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                </button>
              );
            })}

            {/* Eligibility Quick Checker Card */}
            <div className="mt-6 p-5 bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl border border-teal-500/30">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-sm mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Instant Subsidy Estimator</span>
              </div>
              <form onSubmit={handleCheckEligibility} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1">Landholding Size:</label>
                  <select
                    value={checkLandSize}
                    onChange={(e) => setCheckLandSize(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="under_5">Small / Marginal Farmer (&lt; 5 Acres)</option>
                    <option value="5_to_15">Medium Farmer (5 – 15 Acres)</option>
                    <option value="fpo_group">Farmer Producer Organization / FPO</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Applicant Category:</label>
                  <select
                    value={checkCategory}
                    onChange={(e) => setCheckCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="general">General / OBC Farmer</option>
                    <option value="sc_st_women">SC / ST / Women Farmer (Special 50% DBT)</option>
                    <option value="north_east">North-Eastern / Hill Region</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition"
                >
                  Check My Subsidy Rate
                </button>
              </form>

              {showEligibilityResult && (
                <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Eligible for {checkCategory === 'sc_st_women' ? '50%' : (checkLandSize === 'fpo_group' ? '75%' : '40%')} Subsidy!</span>
                  </p>
                  <p className="mt-1 text-slate-300 text-[11px]">
                    Your estimated spray cost will be just ₹200–₹240/acre after direct deduction.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Scheme Details Display */}
          <div className="lg:col-span-8 bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {scheme.agency}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">{scheme.name}</h3>
                </div>
                <div className="text-right">
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-sm">
                    {scheme.subsidyPct}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-6 text-sm text-slate-300 leading-relaxed">{scheme.description}</p>

              {/* Highlights */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {scheme.highlights.map((hl, hIdx) => (
                  <div key={hIdx} className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-slate-200 font-medium">{hl}</p>
                  </div>
                ))}
              </div>

              {/* Eligibility & Documents Two-column */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Eligibility Criteria</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {scheme.eligibility.map((el, elIdx) => (
                      <li key={elIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-400" />
                    <span>Required Documents</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {scheme.documentsRequired.map((doc, docIdx) => (
                      <li key={docIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-1.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-10 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-white">Zero Hassle Guarantee:</span> AgriWing generates and attaches digital flight receipts directly for your subsidy claim.
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={scheme.officialPortalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={onBookClick}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                >
                  Book with Subsidy
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
