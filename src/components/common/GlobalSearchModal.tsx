/**
 * @file components/common/GlobalSearchModal.tsx
 * @description Global Spotlight / Command Palette (Ctrl+K) for instant navigation across
 * Fields, Crop Health Reports, Bookings, Government Schemes, and Persona roles.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  X, 
  MapPin, 
  FileText, 
  Plane, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  UserCheck, 
  ShieldAlert, 
  Wind,
  Plus,
  CornerDownLeft
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  category: 'Fields' | 'Reports' | 'Bookings' | 'Schemes' | 'Actions';
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ElementType;
  action: () => void;
}

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    role,
    setRole,
    language,
    setLanguage,
    fields,
    reports,
    bookings,
    activeFarmer,
    setSelectedFieldId,
    setActiveFarmerTab,
    setActiveOperatorTab,
    setIsBookModalOpen,
    setIsNewFieldModalOpen,
    setPreselectedBookingFieldId
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Listen for Ctrl+K / Cmd+K global hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Autofocus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  // Build searchable items list
  const allItems: SearchResultItem[] = [
    // Core Platform Actions
    {
      id: 'act-book',
      category: 'Actions',
      title: language === 'hi' ? 'ड्रोन स्प्रे बुक करें' : 'Book a Drone Spray / Demo',
      subtitle: 'Schedule precision spraying or multispectral flight',
      badge: 'Quick CTA',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: Plane,
      action: () => {
        setPreselectedBookingFieldId(null);
        setIsBookModalOpen(true);
        setIsSearchOpen(false);
      }
    },
    {
      id: 'act-register-field',
      category: 'Actions',
      title: language === 'hi' ? 'नया खेत प्लॉट जोड़ें' : 'Register New Field Plot',
      subtitle: 'Draw GPS parcel boundary & set crop type',
      badge: 'GIS Tool',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      icon: Plus,
      action: () => {
        setRole('farmer');
        setActiveFarmerTab('fields');
        setIsNewFieldModalOpen(true);
        setIsSearchOpen(false);
      }
    },
    {
      id: 'act-switch-farmer',
      category: 'Actions',
      title: 'Go to Farmer Portal',
      subtitle: `Manage ${activeFarmer.name}'s fields, bookings, and health reports`,
      badge: 'Role',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: UserCheck,
      action: () => {
        setRole('farmer');
        setActiveFarmerTab('overview');
        setIsSearchOpen(false);
      }
    },
    {
      id: 'act-switch-operator',
      category: 'Actions',
      title: 'Go to Mission Control',
      subtitle: 'Fleet operations, pilot dispatching & NDVI report builder',
      badge: 'Role',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      icon: ShieldAlert,
      action: () => {
        setRole('operator');
        setActiveOperatorTab('missions');
        setIsSearchOpen(false);
      }
    },
    {
      id: 'act-switch-public',
      category: 'Actions',
      title: 'Go to Public Overview',
      subtitle: 'Pricing, savings calculator, SMAM subsidies & how it works',
      badge: 'Role',
      badgeColor: 'bg-slate-700 text-slate-300 border-slate-600',
      icon: Globe,
      action: () => {
        setRole('public');
        setIsSearchOpen(false);
      }
    },
    {
      id: 'act-weather-radar',
      category: 'Actions',
      title: 'Spray Suitability & Weather Radar',
      subtitle: 'Hourly wind speed, temperature & leaf humidity forecast',
      badge: 'Live Forecast',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Wind,
      action: () => {
        setRole('farmer');
        setActiveFarmerTab('weather');
        setIsSearchOpen(false);
      }
    },
    {
      id: 'act-toggle-lang',
      category: 'Actions',
      title: language === 'en' ? 'Switch Language to हिंदी (Hindi)' : 'Switch Language to English',
      subtitle: 'Bilingual translation toggle across all metrics',
      badge: language === 'en' ? 'हिंदी' : 'EN',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: Globe,
      action: () => {
        setLanguage(language === 'en' ? 'hi' : 'en');
        setIsSearchOpen(false);
      }
    },

    // Field Parcels
    ...fields.map(f => ({
      id: `field-${f.id}`,
      category: 'Fields' as const,
      title: f.name,
      subtitle: `${f.crop} • ${f.areaAcres} Acres • ${f.locationName}`,
      badge: f.currentHealth,
      badgeColor: f.currentHealth === 'Optimal' 
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
        : f.currentHealth === 'Mild Stress' 
        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
        : 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: MapPin,
      action: () => {
        setRole('farmer');
        setActiveFarmerTab('fields');
        setSelectedFieldId(f.id);
        setIsSearchOpen(false);
      }
    })),

    // Crop Health Reports
    ...reports.map(r => ({
      id: `report-${r.id}`,
      category: 'Reports' as const,
      title: `${r.reportNumber} • ${r.fieldName}`,
      subtitle: `Crop: ${r.cropType} • Score: ${r.overallHealthScore}/100 • ${r.reportDate}`,
      badge: r.healthCategory,
      badgeColor: r.healthCategory === 'Optimal' 
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
        : r.healthCategory === 'Mild Stress' 
        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
        : 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: FileText,
      action: () => {
        setRole('farmer');
        setActiveFarmerTab('reports');
        setIsSearchOpen(false);
      }
    })),

    // Bookings & Missions
    ...bookings.map(b => ({
      id: `booking-${b.id}`,
      category: 'Bookings' as const,
      title: `${b.bookingNumber} • ${b.fieldName}`,
      subtitle: `${b.serviceType.replace(/_/g, ' ')} • ₹${b.finalAmount} • Date: ${b.preferredDate}`,
      badge: b.status.toUpperCase(),
      badgeColor: b.status === 'completed'
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        : b.status === 'scheduled'
        ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
        : 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Plane,
      action: () => {
        if (role === 'operator') {
          setActiveOperatorTab('missions');
        } else {
          setRole('farmer');
          setActiveFarmerTab('bookings');
        }
        setIsSearchOpen(false);
      }
    })),

    // Government Schemes
    {
      id: 'scheme-smam',
      category: 'Schemes',
      title: 'SMAM Kisan Drone 40%–50% DBT Subsidy',
      subtitle: 'Sub-Mission on Agricultural Mechanization financial support for small & marginal farmers',
      badge: 'Active DBT',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: ShieldCheck,
      action: () => {
        setRole('public');
        setIsSearchOpen(false);
        setTimeout(() => {
          document.querySelector('#govt-schemes')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    },
    {
      id: 'scheme-daas',
      category: 'Schemes',
      title: 'Kisan Drone Shakti DaaS Program',
      subtitle: 'Drone-as-a-Service model providing subsidized CHC pilot spraying per acre',
      badge: 'CHC Linked',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      icon: Sparkles,
      action: () => {
        setRole('public');
        setIsSearchOpen(false);
        setTimeout(() => {
          document.querySelector('#govt-schemes')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  ];

  // Filter items based on user input
  const filtered = allItems.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    );
  });

  // Handle arrow key selection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={() => setIsSearchOpen(false)} />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'hi'
                ? 'खेत, रिपोर्ट, बुकिंग या स्कीम खोजें... (Ctrl+K)'
                : 'Search fields, reports, bookings, schemes or actions... (Ctrl+K)'
            }
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
              }}
              className="p-1 text-slate-400 hover:text-white rounded-md transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-white bg-slate-800 rounded-md border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p>No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for &quot;Wheat&quot;, &quot;Report&quot;, &quot;Subsidy&quot;, or &quot;Book&quot;</p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-all ${
                    isSelected
                      ? 'bg-emerald-600/20 border border-emerald-500/40 text-white'
                      : 'hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-white truncate">{item.title}</span>
                        {item.badge && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {isSelected && (
                      <span className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 font-mono font-medium">
                        <span>Select</span>
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-300">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-300">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-300">↵</kbd>
              <span>to select</span>
            </span>
            <span className="hidden sm:inline flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-300">ESC</kbd>
              <span>to close</span>
            </span>
          </div>
          <span className="text-slate-500 font-mono">{filtered.length} items</span>
        </div>

      </div>
    </div>
  );
};
