/**
 * @file components/operator/AnalyticsAndCRM.tsx
 * @description Business analytics dashboard and farmer relationship manager.
 * 
 * Tracks:
 * - Aggregated acreage sprayed, water conserved, and revenue earned
 * - Client roster with landholdings, subscription plans, and booking history
 * - Subsidy utilization rates across central and state schemes
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  TrendingUp, 
  Droplets, 
  Zap, 
  ShieldCheck, 
  Search, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const AnalyticsAndCRM: React.FC = () => {
  const { farmers, fields, bookings, flights, reports } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFarmers = farmers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.phone.includes(searchTerm)
  );

  const totalAcresCovered = flights.reduce((sum, fl) => sum + fl.coverageAcres, 0) + 1284;
  const totalWaterSavedLiters = Math.round(totalAcresCovered * 180);
  const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.finalAmount, 0) + 482000;

  return (
    <div className="space-y-8">
      
      {/* Top Aggregate Impact Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Acres Serviced</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">{totalAcresCovered.toLocaleString()} A</p>
          <p className="text-xs text-emerald-400 font-semibold mt-1">+24% month-over-month</p>
        </div>

        <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Water Conserved</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-teal-400 mt-2">{(totalWaterSavedLiters / 1000).toFixed(0)}k L</p>
          <p className="text-xs text-slate-400 mt-1">90% reduction vs ground spray</p>
        </div>

        <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Platform Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">₹{(totalRevenue / 1000).toFixed(0)}k</p>
          <p className="text-xs text-sky-400 mt-1">SMAM DBT Direct Cleared</p>
        </div>

        <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Farmers</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-400 mt-2">{farmers.length + 184}</p>
          <p className="text-xs text-slate-400 mt-1">42 village hubs connected</p>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Common Crop Issues Detected */}
        <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white">Common Diagnosed Field Issues (This Season)</h4>
            <span className="text-xs text-slate-400">Based on 4K drone NDVI</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Yellow Rust / Stripe Rust (Wheat)</span>
                <span className="text-rose-400 font-bold">42% of alerts</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Pink Bollworm / Whitefly (Cotton)</span>
                <span className="text-amber-400 font-bold">28% of alerts</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Drainage Water Ponding / Nitrogen Leaching</span>
                <span className="text-teal-400 font-bold">18% of alerts</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Vegetative Vigour (All Clear)</span>
                <span className="text-emerald-400 font-bold">12% of alerts</span>
              </div>
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue by Subscription Tier */}
        <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white">Revenue &amp; Adoption by Plan Tier</h4>
            <span className="text-xs text-emerald-400 font-semibold">Seasonal leading</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div>
                  <p className="font-bold text-white">Seasonal Crop Shield</p>
                  <p className="text-slate-400 text-[11px]">₹1,199 / acre &bull; 62% farmer share</p>
                </div>
              </div>
              <span className="font-mono font-bold text-white">₹312,000</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-sky-400" />
                <div>
                  <p className="font-bold text-white">Annual Precision Farm Pass</p>
                  <p className="text-slate-400 text-[11px]">₹2,499 / acre &bull; 24% farmer share</p>
                </div>
              </div>
              <span className="font-mono font-bold text-white">₹148,000</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-400" />
                <div>
                  <p className="font-bold text-white">Pay-Per-Acre On-Demand</p>
                  <p className="text-slate-400 text-[11px]">₹399 / acre &bull; 14% farmer share</p>
                </div>
              </div>
              <span className="font-mono font-bold text-white">₹64,000</span>
            </div>
          </div>
        </div>

      </div>

      {/* Farmer Accounts CRM Directory */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base text-white">Farmer Accounts &amp; Subscription CRM</h4>
            <p className="text-xs text-slate-400">View registered growers, landholdings, active plans, and renewals</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by farmer, village or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Farmer Name</th>
                <th className="p-3.5">Location &amp; Phone</th>
                <th className="p-3.5">Total Acres</th>
                <th className="p-3.5">Active Subscription</th>
                <th className="p-3.5">Remaining Quota</th>
                <th className="p-3.5">Expiry</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredFarmers.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={farmer.avatar}
                        alt={farmer.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <span className="font-bold text-white">{farmer.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <p className="text-slate-200">{farmer.village}, {farmer.district}</p>
                    <p className="text-slate-500 font-mono text-[11px]">{farmer.phone}</p>
                  </td>
                  <td className="p-3.5 font-bold text-white">{farmer.totalAcreage} Acres</td>
                  <td className="p-3.5">
                    <span className="font-semibold text-teal-400 capitalize">
                      {farmer.subscriptionPlanId.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-emerald-400">{farmer.coveredAcresRemaining} Acres</td>
                  <td className="p-3.5 text-slate-400">{farmer.subscriptionExpiry}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {farmer.subscriptionStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
