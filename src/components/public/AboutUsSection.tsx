/**
 * @file components/public/AboutUsSection.tsx
 * @description Company mission, safety standards, DGCA regulatory compliance,
 * and leadership narrative highlighting agricultural engineering expertise.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Award, HeartHandshake, Leaf, Users, MapPin } from 'lucide-react';

export const AboutUsSection: React.FC = () => {
  const { language } = useApp();
  const isHindi = language === 'hi';

  return (
    <section id="about-us" className="w-full py-20 bg-slate-950 border-b border-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs uppercase tracking-wider border border-emerald-500/20">
            {isHindi ? 'हमारे बारे में' : 'Our Mission & Fleet Heritage'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            {isHindi ? 'भारतीय कृषि को आधुनिक तकनीक से सशक्त बनाना' : 'Empowering Farmers with Safe, Precision Drone Technology'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            {isHindi
              ? 'एग्रीविंग का लक्ष्य किसानों के स्वास्थ्य की रक्षा करना, पानी और रसायनों की बर्बादी रोकना और प्रति एकड़ उत्पादन बढ़ाना है।'
              : 'Founded by agricultural engineers and DGCA-certified drone aviators to replace toxic manual spraying with autonomous precision flight.'}
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-900/80 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {isHindi ? 'किसान स्वास्थ्य और सुरक्षा' : 'Zero Farmer Toxicity'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Traditional knapsack sprayers expose farmers to dangerous chemical mist. Our autonomous drones keep human operators safely on field borders while delivering precise 120-micron droplets.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-semibold text-emerald-400">
              100% Remote Autonomous Flight
            </div>
          </div>

          <div className="p-8 bg-slate-900/80 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-6">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {isHindi ? '90% पानी और पर्यावरण संरक्षण' : '90% Water & Climate Conservation'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Where tractor boom sprayers flood fields with 200 liters of water per acre, AgriWing’s atomized micro-droplet technology achieves superior leaf adhesion with only 10 to 12 liters of water.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-semibold text-teal-400">
              Over 8 Million Liters Saved in 2025–26
            </div>
          </div>

          <div className="p-8 bg-slate-900/80 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {isHindi ? 'DGCA अनुपालन और लाइसेंस' : 'DGCA Licensed & Certified Fleet'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Every AgriWing pilot is rigorously trained at DGCA-authorized Remote Pilot Training Organizations (RPTO), and our Type-Certified drones feature terrain-following radar and fail-safe return-to-home.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-semibold text-sky-400">
              Type-Certified Drones &bull; Full Insurance
            </div>
          </div>
        </div>

        {/* Regional Hubs Banner */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/80 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Rapid 24-Hour Regional Response</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white mt-1">
              Serving 42+ Districts with Mobile Hub Units
            </h4>
            <p className="text-sm text-slate-300 mt-2">
              Our mobile drone battery trailers and charging vans are stationed across major agricultural belts (Punjab, Haryana, MP, Maharashtra, UP, Gujarat, Rajasthan & Andhra Pradesh).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="px-4 py-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center">
              <p className="text-2xl font-extrabold text-emerald-400">42+</p>
              <p className="text-xs text-slate-400">Rural Hubs</p>
            </div>
            <div className="px-4 py-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center">
              <p className="text-2xl font-extrabold text-teal-400">120+</p>
              <p className="text-xs text-slate-400">Licensed Pilots</p>
            </div>
            <div className="px-4 py-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center">
              <p className="text-2xl font-extrabold text-sky-400">180+</p>
              <p className="text-xs text-slate-400">Active Drones</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
