/**
 * @file components/public/PublicNavbar.tsx
 * @description Public marketing header and footer navigation components with
 * smooth section scrolling, mobile responsive drawer, and quick demo CTA hooks.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plane, Menu, X, ArrowRight, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface PublicNavbarProps {
  onBookClick: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onBookClick }) => {
  const { setRole, language } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHindi = language === 'hi';

  const navLinks = [
    { name: isHindi ? 'होम' : 'Home', href: '#' },
    { name: isHindi ? 'कार्यप्रणाली' : 'How It Works', href: '#how-it-works' },
    { name: isHindi ? 'सेवाएं एवं मूल्य' : 'Services & Pricing', href: '#services-pricing' },
    { name: isHindi ? 'सरकारी सब्सिडी' : 'Govt Schemes', href: '#govt-schemes' },
    { name: isHindi ? 'हमारे बारे में' : 'About Us', href: '#about-us' },
    { name: isHindi ? 'संपर्क' : 'Contact', href: '#contact' },
  ];

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="w-full bg-slate-900/85 backdrop-blur-xl border-b border-slate-800/80 text-slate-200 sticky top-0 z-40 transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => scrollTo('#')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 text-white -rotate-45" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white">AgriWing</span>
              <span className="text-[10px] text-emerald-400 font-mono tracking-wider font-semibold">ENTERPRISE</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.href)}
                className="text-xs font-medium text-slate-300 hover:text-emerald-400 transition cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={() => setRole('farmer')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Farmer Portal</span>
            </button>

            <button
              onClick={onBookClick}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950/40 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Schedule Service</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onBookClick}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollTo(link.href)}
              className="block w-full text-left py-2 text-sm font-medium text-slate-300 hover:text-emerald-400"
            >
              {link.name}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setRole('farmer');
              }}
              className="w-full py-2.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold text-center"
            >
              🌾 Farmer Portal
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setRole('operator');
              }}
              className="w-full py-2.5 bg-emerald-600 text-white border border-emerald-500 rounded-xl text-xs font-semibold text-center"
            >
              🛸 Mission Control
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export const PublicFooter: React.FC = () => {
  const { setRole } = useApp();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-14 text-slate-400 text-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5 text-white font-bold text-base mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Plane className="w-4 h-4 text-white -rotate-45" />
            </div>
            <span>AgriWing Technologies</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Enterprise precision agriculture drone spraying and 4K multispectral crop diagnostic intelligence. DGCA-certified operations nationwide.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ISO 9001:2015 &amp; DGCA RPAS Certified</span>
          </div>
          <p className="text-slate-500 mt-4 text-[11px]">
            &copy; {new Date().getFullYear()} AgriWing Technologies Pvt. Ltd. All rights reserved.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-slate-200">Precision Services</h4>
          <ul className="space-y-2.5 text-slate-400">
            <li><a href="#services-pricing" className="hover:text-emerald-400 transition">Precision Crop Protection Spray</a></li>
            <li><a href="#services-pricing" className="hover:text-emerald-400 transition">Nano-Urea &amp; DAP Foliar Nutrition</a></li>
            <li><a href="#services-pricing" className="hover:text-emerald-400 transition">4K Multispectral NDVI Scouting</a></li>
            <li><a href="#services-pricing" className="hover:text-emerald-400 transition">Organic Bio-Stimulant Spraying</a></li>
            <li><a href="#services-pricing" className="hover:text-emerald-400 transition">Custom Hiring Center (CHC) Integration</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-slate-200">Government Initiatives</h4>
          <ul className="space-y-2.5 text-slate-400">
            <li><a href="#govt-schemes" className="hover:text-emerald-400 transition">SMAM Kisan Drone 40-50% Subsidy</a></li>
            <li><a href="#govt-schemes" className="hover:text-emerald-400 transition">Kisan Drone Shakti DaaS Program</a></li>
            <li><a href="#govt-schemes" className="hover:text-emerald-400 transition">MIDH Horticulture Drone Grant</a></li>
            <li><a href="#govt-schemes" className="hover:text-emerald-400 transition">FPO 75% Machine Procurement Scheme</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-slate-200">Enterprise Access</h4>
          <div className="space-y-2.5">
            <button
              onClick={() => setRole('farmer')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-800 text-xs font-semibold text-center transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Registered Farmer Portal</span>
            </button>
            <button
              onClick={() => setRole('operator')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-800 text-xs font-semibold text-center transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pilot &amp; Operations Console</span>
            </button>
            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              DGCA License: DGCA/RPAS/OP-2024-8831
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
