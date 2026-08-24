/**
 * @file components/public/ContactSection.tsx
 * @description Support contact form, toll-free helpline directory, and emergency
 * pest outbreak alert dispatcher for immediate pilot hub notification.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PhoneCall, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Sparkles,
  Check
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { language, showToast } = useApp();
  const isHindi = language === 'hi';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    preferredDate: todayStr,
    preferredTimeSlot: 'morning_dawn',
    customTime: '07:00',
    message: '',
    isUrgentPest: false
  });
  const [submitted, setSubmitted] = useState(false);

  // Date Dropdown & Calendar navigation state
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDateDropdownOpen(false);
      }
    };
    if (isDateDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDateDropdownOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast(
      formData.isUrgentPest
        ? '🚨 Urgent Pest Outbreak Alert dispatched to local AgriWing Pilot Hub! We will call in 15 mins.'
        : `Thank you! Demonstration request booked for ${formData.preferredDate}. A Kisan Support executive will connect shortly.`
    );
  };

  const getTimeSlotLabel = () => {
    if (formData.preferredTimeSlot === 'morning_dawn') return 'Early Dawn (06:00 AM - 09:00 AM)';
    if (formData.preferredTimeSlot === 'midday') return 'Midday (10:00 AM - 01:00 PM)';
    if (formData.preferredTimeSlot === 'evening') return 'Evening Dusk (04:30 PM - 07:00 PM)';
    return formData.customTime || 'Custom Time';
  };

  const getFormattedDateLabel = (dateStr: string) => {
    if (!dateStr) return isHindi ? 'तारीख चुनें' : 'Select Date';
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setHours(0, 0, 0, 0);

    const isToday = dateObj.getTime() === today.getTime();
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = dateObj.getTime() === tomorrow.getTime();

    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    const formatted = dateObj.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', options);

    if (isToday) return `${isHindi ? 'आज' : 'Today'} (${formatted})`;
    if (isTomorrow) return `${isHindi ? 'कल' : 'Tomorrow'} (${formatted})`;
    return formatted;
  };

  // Quick preset dates generator
  const getPresetDates = () => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const in2Days = new Date(today);
    in2Days.setDate(in2Days.getDate() + 2);

    // Next Saturday / Weekend
    const daysUntilWeekend = (6 - today.getDay() + 7) % 7 || 7;
    const nextWeekend = new Date(today);
    nextWeekend.setDate(nextWeekend.getDate() + daysUntilWeekend);

    return [
      { label: isHindi ? 'आज' : 'Today', date: todayStr },
      { label: isHindi ? 'कल' : 'Tomorrow', date: tomorrow.toISOString().slice(0, 10) },
      { label: isHindi ? '2 दिन बाद' : 'In 2 Days', date: in2Days.toISOString().slice(0, 10) },
      { label: isHindi ? 'सप्ताहांत' : 'This Weekend', date: nextWeekend.toISOString().slice(0, 10) }
    ];
  };

  // Calendar matrix generator
  const currentYear = calendarViewDate.getFullYear();
  const currentMonth = calendarViewDate.getMonth();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCalendarViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDate = (dayNum: number) => {
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    const selectedIso = `${currentYear}-${mStr}-${dStr}`;
    setFormData(prev => ({ ...prev, preferredDate: selectedIso }));
    setIsDateDropdownOpen(false);
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
                <h4 className="text-xl font-bold text-white">Demonstration &amp; Callback Requested!</h4>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Scheduled Date:</span>
                    <span className="text-white font-bold">{getFormattedDateLabel(formData.preferredDate)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Preferred Window:</span>
                    <span className="text-emerald-400 font-bold">{getTimeSlotLabel()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-200">{formData.district || 'Registered Village'}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Our regional drone pilot coordinator for <b>{formData.district || 'your area'}</b> will connect with you at <b>{formData.phone}</b> to confirm the live drone demo.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Schedule Another Demo / Message
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

                {/* Preferred Date & Time Fields with Interactive Dropdown Calendar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800/80">
                  
                  {/* Date Input with Interactive Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isHindi ? 'पसंदीदा डेमो तारीख (ड्रॉपडाउन):' : 'Preferred Demo Date (Click to Pick):'}</span>
                    </label>

                    {/* Interactive Dropdown Trigger */}
                    <div
                      onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                      className={`w-full p-2.5 bg-slate-950 border rounded-xl flex items-center justify-between cursor-pointer transition select-none ${
                        isDateDropdownOpen 
                          ? 'border-emerald-500 ring-1 ring-emerald-500/50 shadow-md shadow-emerald-950/40' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-semibold text-white truncate">
                          {getFormattedDateLabel(formData.preferredDate)}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDateDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                    </div>

                    {/* Rich Date Dropdown Menu */}
                    {isDateDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                        
                        {/* Quick Presets Bar */}
                        <div className="mb-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            {isHindi ? 'त्वरित विकल्प:' : 'Quick Presets:'}
                          </p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {getPresetDates().map((preset) => {
                              const isSelected = formData.preferredDate === preset.date;
                              return (
                                <button
                                  key={preset.date}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, preferredDate: preset.date });
                                    setIsDateDropdownOpen(false);
                                  }}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                                    isSelected
                                      ? 'bg-emerald-600 text-white font-bold'
                                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
                                  }`}
                                >
                                  <span>{preset.label}</span>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Calendar Month Header */}
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-bold text-white">
                            {calendarViewDate.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', { month: 'long', year: 'numeric' })}
                          </span>
                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Days of Week Header */}
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500 mb-1">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>

                        {/* Calendar Day Tiles Grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {/* Empty offset padding */}
                          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="h-7" />
                          ))}

                          {/* Days in Month */}
                          {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
                            const dayNum = idx + 1;
                            const mStr = String(currentMonth + 1).padStart(2, '0');
                            const dStr = String(dayNum).padStart(2, '0');
                            const dateIso = `${currentYear}-${mStr}-${dStr}`;
                            
                            const cellDate = new Date(currentYear, currentMonth, dayNum);
                            cellDate.setHours(0, 0, 0, 0);
                            const isPast = cellDate.getTime() < today.getTime();
                            const isSelected = formData.preferredDate === dateIso;
                            const isTodayCell = cellDate.getTime() === today.getTime();

                            return (
                              <button
                                key={dayNum}
                                type="button"
                                disabled={isPast}
                                onClick={() => handleSelectDate(dayNum)}
                                className={`h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer relative ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white font-bold shadow-md ring-1 ring-emerald-400'
                                    : isPast
                                    ? 'text-slate-600 opacity-40 cursor-not-allowed'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                              >
                                <span>{dayNum}</span>
                                {isTodayCell && !isSelected && (
                                  <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-emerald-400" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Footer info & close */}
                        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                          <span>Click any date to pick</span>
                          <button
                            type="button"
                            onClick={() => setIsDateDropdownOpen(false)}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold transition cursor-pointer"
                          >
                            Done
                          </button>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Preferred Time Slot */}
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      <span>{isHindi ? 'पसंदीदा समय स्लॉट:' : 'Preferred Time Slot:'}</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={formData.preferredTimeSlot}
                        onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="morning_dawn">🌅 Early Dawn (06:00 AM – 09:00 AM)</option>
                        <option value="midday">☀️ Midday (10:00 AM – 01:00 PM)</option>
                        <option value="evening">🌇 Evening Dusk (04:30 PM – 07:00 PM)</option>
                        <option value="custom">⏱️ Specific Time</option>
                      </select>
                      {formData.preferredTimeSlot === 'custom' && (
                        <input
                          type="time"
                          value={formData.customTime}
                          onChange={(e) => setFormData({ ...formData, customTime: e.target.value })}
                          className="w-28 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      )}
                    </div>
                  </div>
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
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
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
