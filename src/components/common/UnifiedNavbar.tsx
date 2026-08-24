/**
 * @file components/common/UnifiedNavbar.tsx
 * @description Unified, role-aware top navigation bar consolidating persona switching,
 * farmer profile switching, Spotlight search (Ctrl+K), notification center, and
 * responsive navigation into a single sleek glassmorphic header.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plane, 
  Search, 
  Bell, 
  Globe, 
  UserCheck, 
  ShieldAlert, 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight, 
  Sparkles, 
  Activity,
  Plus,
  CheckCircle2,
  MapPin
} from 'lucide-react';

import { AgriWingLogo } from './AgriWingLogo';

interface UnifiedNavbarProps {
  onBookClick?: () => void;
}

export const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({ onBookClick }) => {
  const { 
    role, 
    setRole, 
    language, 
    setLanguage, 
    alerts, 
    farmers,
    activeFarmer, 
    setActiveFarmerId,
    activeFarmerTab,
    setActiveFarmerTab,
    activeOperatorTab,
    setActiveOperatorTab,
    setIsSearchOpen,
    setIsNotificationDrawerOpen,
    setIsBookModalOpen,
    setIsNewFieldModalOpen,
    setPreselectedBookingFieldId
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [farmerDropdownOpen, setFarmerDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const isHindi = language === 'hi';

  // Unread alerts relevant to current role
  const unreadAlerts = alerts.filter(a => !a.read && (
    role === 'operator' ? (a.targetRole === 'operator' || a.targetRole === 'all') :
    (a.farmerId === activeFarmer.id || a.targetRole === 'all' || a.targetRole === 'farmer')
  )).length;

  const publicNavLinks = [
    { name: isHindi ? 'होम' : 'Home', href: '#' },
    { name: isHindi ? 'कार्यप्रणाली' : 'How It Works', href: '#how-it-works' },
    { name: isHindi ? 'सेवाएं एवं मूल्य' : 'Services & Pricing', href: '#services-pricing' },
    { name: isHindi ? 'सरकारी सब्सिडी' : 'Govt Schemes', href: '#govt-schemes' },
    { name: isHindi ? 'हमारे बारे में' : 'About Us', href: '#about-us' },
    { name: isHindi ? 'संपर्क' : 'Contact', href: '#contact' },
  ];

  const handleScrollTo = (href: string) => {
    setMobileMenuOpen(false);
    if (role !== 'public') {
      setRole('public');
      setTimeout(() => {
        if (href === '#') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookNow = () => {
    setPreselectedBookingFieldId(null);
    if (onBookClick) {
      onBookClick();
    } else {
      setIsBookModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 text-slate-100 shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left: Brand & Active Context */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              onClick={() => handleScrollTo('#')}
              className="cursor-pointer group select-none flex items-center gap-2"
            >
              <AgriWingLogo size="md" showText={false} />
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                    Agri<span className="text-emerald-400">Wing</span>
                  </span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold rounded uppercase border border-emerald-500/20">
                    {role === 'public' ? 'Precision Ag' : role === 'farmer' ? 'Farmer Hub' : 'Mission Control'}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 mt-0.5">Enterprise Drone Analytics</span>
              </div>
            </div>

            {/* Farmer Profile Switcher (When in Farmer Portal) */}
            {role === 'farmer' && (
              <div className="relative hidden md:block ml-2 pl-3 border-l border-slate-800">
                <button
                  onClick={() => setFarmerDropdownOpen(!farmerDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition"
                >
                  <img
                    src={activeFarmer.avatar}
                    alt={activeFarmer.name}
                    className="w-5 h-5 rounded-full object-cover border border-emerald-500/40"
                  />
                  <span>{activeFarmer.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({activeFarmer.totalAcreage}A)</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {farmerDropdownOpen && (
                  <div 
                    className="absolute top-full left-3 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setFarmerDropdownOpen(false)}
                  >
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1">
                      Switch Demo Farmer Profile:
                    </p>
                    {farmers.map(f => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setActiveFarmerId(f.id);
                          setFarmerDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                          f.id === activeFarmer.id 
                            ? 'bg-emerald-600/20 text-emerald-300 font-bold border border-emerald-500/30' 
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={f.avatar} alt={f.name} className="w-6 h-6 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-white leading-none">{f.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{f.district}, {f.state}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">{f.totalAcreage}A</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Airspace status (When in Operator Mode) */}
            {role === 'operator' && (
              <div className="hidden xl:flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-800 text-[11px] font-mono text-emerald-400">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>DGCA AIRSPACE: GREEN</span>
              </div>
            )}
          </div>

          {/* Middle: Desktop Navigation / Role-Aware Tabs */}
          <div className="hidden lg:flex items-center gap-1">
            {role === 'public' ? (
              <div className="flex items-center space-x-1">
                {publicNavLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleScrollTo(link.href)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            ) : role === 'farmer' ? (
              <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'overview', label: isHindi ? 'ओवरव्यू' : 'Overview' },
                  { id: 'fields', label: isHindi ? 'खेत और मैप' : 'Fields & Map' },
                  { id: 'reports', label: isHindi ? 'स्वास्थ्य रिपोर्ट' : 'Health Reports' },
                  { id: 'bookings', label: isHindi ? 'स्प्रे ऑर्डर्स' : 'Spray Orders' },
                  { id: 'weather', label: isHindi ? 'मौसम' : 'Weather Radar' },
                  { id: 'subscription', label: isHindi ? 'सब्सिडी' : 'Subsidy & Plan' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFarmerTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeFarmerTab === tab.id
                        ? 'bg-emerald-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'missions', label: '🎯 Dispatch Queue' },
                  { id: 'fleet', label: '🛸 Fleet & Hardware' },
                  { id: 'reports_repo', label: '📊 Reports Hub' },
                  { id: 'analytics', label: '📈 Analytics & CRM' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveOperatorTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeOperatorTab === tab.id
                        ? 'bg-emerald-600 text-white shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Global Actions, Persona Pill Switcher, Search, Notifications */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Quick Spotlight Search Button (Ctrl+K) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
              title="Search anything (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">{isHindi ? 'खोजें...' : 'Search...'}</span>
              <kbd className="hidden sm:inline px-1.5 py-0.2 bg-slate-950 border border-slate-800 rounded text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Role Switcher Dropdown / Segmented Pill */}
            <div className="hidden sm:flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setRole('public')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  role === 'public'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setRole('farmer')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  role === 'farmer'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                Farmer
              </button>
              <button
                onClick={() => setRole('operator')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  role === 'operator'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                Operator
              </button>
            </div>

            {/* Language Switcher EN / हिंदी */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded text-xs font-semibold transition ${
                  language === 'en' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded text-xs font-semibold transition ${
                  language === 'hi' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिं
              </button>
            </div>

            {/* Notification Bell with Badge */}
            <button
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              title="View Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-950 animate-pulse">
                  {unreadAlerts}
                </span>
              )}
            </button>

            {/* Primary Action CTA Button */}
            <button
              onClick={handleBookNow}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plane className="w-3.5 h-3.5 -rotate-45" />
              <span>{isHindi ? 'स्प्रे बुक करें' : 'Book Spray'}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-150">
          
          {/* Mobile Persona Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setRole('public');
                setMobileMenuOpen(false);
              }}
              className={`py-2 rounded-lg text-xs font-bold text-center transition ${
                role === 'public' ? 'bg-emerald-600 text-white' : 'text-slate-400'
              }`}
            >
              Public
            </button>
            <button
              onClick={() => {
                setRole('farmer');
                setMobileMenuOpen(false);
              }}
              className={`py-2 rounded-lg text-xs font-bold text-center transition ${
                role === 'farmer' ? 'bg-emerald-600 text-white' : 'text-slate-400'
              }`}
            >
              Farmer
            </button>
            <button
              onClick={() => {
                setRole('operator');
                setMobileMenuOpen(false);
              }}
              className={`py-2 rounded-lg text-xs font-bold text-center transition ${
                role === 'operator' ? 'bg-emerald-600 text-white' : 'text-slate-400'
              }`}
            >
              Operator
            </button>
          </div>

          {/* Farmer Switcher on Mobile */}
          {role === 'farmer' && (
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Active Farmer Persona:</span>
              <div className="grid grid-cols-1 gap-1.5">
                {farmers.map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setActiveFarmerId(f.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs transition ${
                      f.id === activeFarmer.id ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{f.name} ({f.district})</span>
                    <span className="text-[11px] font-mono">{f.totalAcreage} Acres</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Links */}
          {role === 'public' ? (
            <div className="space-y-1 pt-2 border-t border-slate-800">
              {publicNavLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleScrollTo(link.href)}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800/40 rounded-lg transition"
                >
                  {link.name}
                </button>
              ))}
            </div>
          ) : role === 'farmer' ? (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              {[
                { id: 'overview', label: '🌾 Overview' },
                { id: 'fields', label: '🗺️ Fields & Map' },
                { id: 'reports', label: '📊 Health Reports' },
                { id: 'bookings', label: '🚁 Spray Orders' },
                { id: 'weather', label: '🌤️ Weather Radar' },
                { id: 'subscription', label: '💳 Subsidy Plan' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFarmerTab(tab.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center transition ${
                    activeFarmerTab === tab.id ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-950 text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              {[
                { id: 'missions', label: '🎯 Missions Queue' },
                { id: 'fleet', label: '🛸 Fleet Hardware' },
                { id: 'reports_repo', label: '📊 Reports Hub' },
                { id: 'analytics', label: '📈 Analytics & CRM' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveOperatorTab(tab.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center transition ${
                    activeOperatorTab === tab.id ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-950 text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Quick Book CTA on Mobile */}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleBookNow();
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
            >
              <Plane className="w-4 h-4 -rotate-45" />
              <span>{isHindi ? 'ड्रोन सेवा तुरंत बुक करें' : 'Book a Drone Spray / Demo'}</span>
            </button>
          </div>

        </div>
      )}
    </header>
  );
};
