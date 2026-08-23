/**
 * @file components/public/ContactSection.tsx
 * @description Support contact form, toll-free helpline directory, and emergency
 * pest outbreak alert dispatcher for immediate pilot hub notification.
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PhoneCall, MessageSquare, Mail, MapPin, Send, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { language, showToast } = useApp();
  const isHindi = language === 'hi';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    message: '',
    isUrgentPest: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(
      formData.isUrgentPest
        ? '🚨 Urgent Pest Outbreak Alert dispatched to local AgriWing Pilot Hub! We will call in 15 mins.'
        : 'Thank you! AgriWing Kisan Support executive will connect with you shortly.'
    );
  };

  return (
    <section id="contact" className="w-full py-20 bg-slate-900 border-b border-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-400 font-bold text-xs uppercase tracking-wider border border-teal-500/20">
            {isHindi ? 'संपर्क एवं किसान सेवा केंद्र' : '24/7 Kisan Helpdesk & Regional Hubs'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
            {isHindi ? 'हमसे बात करें या अपने गांव में डेमो बुक करें' : 'Talk to Our Agronomist or Request a Free Village Demo'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            {isHindi
              ? 'आपातकालीन कीट प्रकोप, सब्सिडी फॉर्म सहायता या बड़े फार्म डिस्काउंट के लिए तुरंत संपर्क करें।'
              : 'Direct line for emergency pest outbreaks, SMAM subsidy paperwork guidance, or bulk FPO spraying.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Toll Free Helpline */}
            <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Toll-Free Kisan Line</span>
                <p className="text-xl font-black text-white mt-0.5">1800-889-AGRI (2474)</p>
                <p className="text-xs text-slate-400 mt-1">Available in Hindi, Punjabi, Marathi, Gujarati &amp; English (6:00 AM – 10:00 PM)</p>
              </div>
            </div>

            {/* WhatsApp Booking */}
            <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">WhatsApp Direct Booking</span>
                <p className="text-xl font-black text-white mt-0.5">+91 98200 12345</p>
                <p className="text-xs text-slate-400 mt-1">Send a simple photo of your field or audio voice note to schedule a flight.</p>
              </div>
            </div>

            {/* Hub Headquarters */}
            <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Central Operations Base</span>
                <p className="text-sm font-bold text-white mt-0.5">AgriWing Precision Flight Operations Center</p>
                <p className="text-xs text-slate-400 mt-1">Kisan Agrotech Park, Sector 18, Bhopal &bull; Hubs in Ludhiana, Karnal, Nagpur &amp; Indore.</p>
              </div>
            </div>

            {/* Emergency Pest Notice */}
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>Locust or Fall Armyworm Outbreak? Select the emergency check below for 4-hour priority dispatch.</span>
            </div>

          </div>

          {/* Contact & Enquiry Form */}
          <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Enquiry Received!</h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Our regional drone coordinator for <b>{formData.district || 'your area'}</b> will call back shortly at <b>{formData.phone}</b>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">Request Callback or Village Demonstration</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">Your Full Name:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">Mobile / WhatsApp Number:</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98234 56789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Village &amp; District:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pipariya, District Hoshangabad (MP)"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">How can we help your farm?</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us your crop, acreage, or questions about drone spraying/subsidy..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="urgentPest"
                    checked={formData.isUrgentPest}
                    onChange={(e) => setFormData({ ...formData, isUrgentPest: e.target.checked })}
                    className="w-4 h-4 rounded accent-rose-500 cursor-pointer"
                  />
                  <label htmlFor="urgentPest" className="text-xs font-semibold text-rose-300 cursor-pointer">
                    🚨 Urgent Pest Outbreak (Requires same-day pilot dispatch)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
