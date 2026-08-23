/**
 * @file App.tsx
 * @description Root application shell with dynamic role-based persona routing,
 * universal toast management, and global booking modal dialogs.
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import { Toast } from './components/common/Toast';
import { PublicNavbar, PublicFooter } from './components/public/PublicNavbar';
import { HeroSection } from './components/public/HeroSection';
import { HowItWorksSection } from './components/public/HowItWorksSection';
import { ServicesAndPricingSection } from './components/public/ServicesAndPricingSection';
import { GovtSchemesSection } from './components/public/GovtSchemesSection';
import { AboutUsSection } from './components/public/AboutUsSection';
import { ContactSection } from './components/public/ContactSection';
import { BookDemoModal } from './components/public/BookDemoModal';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { OperatorDashboard } from './components/operator/OperatorDashboard';

const MainContent: React.FC = () => {
  const { role, isBookModalOpen, setIsBookModalOpen } = useApp();
  const [selectedPlanForBooking, setSelectedPlanForBooking] = useState<string | null>(null);

  const handleOpenBookModal = (planId?: string) => {
    setSelectedPlanForBooking(planId || null);
    setIsBookModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Universal Persona Switcher & Language Bar */}
      <RoleSwitcherBar />

      {/* Role-Based Rendering */}
      {role === 'public' && (
        <main className="w-full flex-1 flex flex-col">
          <PublicNavbar onBookClick={() => handleOpenBookModal()} />
          <HeroSection onBookClick={() => handleOpenBookModal()} />
          <HowItWorksSection onBookClick={() => handleOpenBookModal()} />
          <ServicesAndPricingSection onSelectPlan={(planId) => handleOpenBookModal(planId)} />
          <GovtSchemesSection onBookClick={() => handleOpenBookModal()} />
          <AboutUsSection />
          <ContactSection />
          <PublicFooter />
        </main>
      )}

      {role === 'farmer' && (
        <main className="w-full flex-1 flex flex-col">
          <FarmerDashboard />
        </main>
      )}

      {role === 'operator' && (
        <main className="w-full flex-1 flex flex-col">
          <OperatorDashboard />
        </main>
      )}

      {/* Universal Toast Notifications */}
      <Toast />

      {/* Global Booking / Demo Modal */}
      <BookDemoModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        initialPlanId={selectedPlanForBooking}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
