/**
 * @file context/AppContext.tsx
 * @description Central Application Context and State Management for AgriWing.
 * 
 * Handles:
 * - Active persona role switching (Farmer, Fleet Operator, Public Landing)
 * - Multilingual support (English / Hindi)
 * - LocalStorage persistence with initial mock seed fallback
 * - CRUD operations for farm parcels, mission bookings, pilot assignments, and health reports
 * - Event-driven in-app notifications
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Farmer,
  Field,
  Pilot,
  Drone,
  Booking,
  Flight,
  CropHealthReport,
  AlertNotification,
  ServiceType
} from '../types';
import {
  INITIAL_FARMERS,
  INITIAL_FIELDS,
  INITIAL_PILOTS,
  INITIAL_DRONES,
  INITIAL_BOOKINGS,
  INITIAL_FLIGHTS,
  INITIAL_REPORTS,
  INITIAL_ALERTS
} from '../data/mockData';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  
  // Active Farmer Persona
  activeFarmer: Farmer;
  setActiveFarmerId: (id: string) => void;
  
  // Core Entities
  farmers: Farmer[];
  fields: Field[];
  pilots: Pilot[];
  drones: Drone[];
  bookings: Booking[];
  flights: Flight[];
  reports: CropHealthReport[];
  alerts: AlertNotification[];

  // Mutations
  addField: (field: Omit<Field, 'id' | 'farmerId' | 'activeAlerts'>) => Field;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  
  createBooking: (bookingData: {
    fieldId: string;
    serviceType: ServiceType;
    chemicalOrNutrientName: string;
    preferredDate: string;
    preferredTimeSlot: 'morning' | 'evening';
    notes?: string;
    customAcres?: number;
  }) => Booking;
  
  assignBooking: (
    bookingId: string, 
    assignment: {
      pilotId: string;
      droneId: string;
      scheduledDate: string;
      scheduledTime: string;
      notes?: string;
    }
  ) => void;
  
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;

  uploadFlightData: (flightData: Omit<Flight, 'id'>) => Flight;
  
  createOrUpdateReport: (reportData: Omit<CropHealthReport, 'id' | 'reportNumber'> & { id?: string }) => CropHealthReport;
  markReportAsRead: (reportId: string) => void;
  
  addDrone: (drone: Omit<Drone, 'id'>) => void;
  updateDroneStatus: (droneId: string, status: Drone['status'], notes?: string) => void;
  
  addPilot: (pilot: Omit<Pilot, 'id'>) => void;
  updatePilotStatus: (pilotId: string, status: Pilot['status']) => void;
  
  markAlertAsRead: (alertId: string) => void;
  markAllAlertsAsRead: () => void;
  
  // Navigation & Modal State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;
  
  isBookModalOpen: boolean;
  setIsBookModalOpen: (open: boolean) => void;
  preselectedBookingFieldId: string | null;
  setPreselectedBookingFieldId: (id: string | null) => void;
  preselectedServiceType: ServiceType | null;
  setPreselectedServiceType: (service: ServiceType | null) => void;

  isNewFieldModalOpen: boolean;
  setIsNewFieldModalOpen: (open: boolean) => void;

  isReportBuilderOpen: boolean;
  setIsReportBuilderOpen: (open: boolean) => void;
  editingReportForFlightId: string | null;
  setEditingReportForFlightId: (flightId: string | null) => void;

  isUploadFlightModalOpen: boolean;
  setIsUploadFlightModalOpen: (open: boolean) => void;
  uploadingForBookingId: string | null;
  setUploadingForBookingId: (bookingId: string | null) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// LocalStorage namespace prefix to avoid collision
const LOCAL_STORAGE_KEY_PREFIX = 'agriwing_v1_';

/**
 * Safely retrieves stored data from browser LocalStorage, falling back to seed mock data.
 */
function getStoredOrInitial<T>(key: string, initial: T): T {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn(`[AgriWing] Failed to read ${key} from localStorage, using initial mock dataset.`, e);
  }
  return initial;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & persona state
  const [role, setRoleState] = useState<Role>('public');
  const [language, setLanguageState] = useState<'en' | 'hi'>('en');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Core entities with persistent backing
  const [farmers] = useState<Farmer[]>(() => getStoredOrInitial('farmers', INITIAL_FARMERS));
  const [activeFarmerId, setActiveFarmerId] = useState<string>(INITIAL_FARMERS[0].id);

  const [fields, setFields] = useState<Field[]>(() => getStoredOrInitial('fields', INITIAL_FIELDS));
  const [pilots, setPilots] = useState<Pilot[]>(() => getStoredOrInitial('pilots', INITIAL_PILOTS));
  const [drones, setDrones] = useState<Drone[]>(() => getStoredOrInitial('drones', INITIAL_DRONES));
  const [bookings, setBookings] = useState<Booking[]>(() => getStoredOrInitial('bookings', INITIAL_BOOKINGS));
  const [flights, setFlights] = useState<Flight[]>(() => getStoredOrInitial('flights', INITIAL_FLIGHTS));
  const [reports, setReports] = useState<CropHealthReport[]>(() => getStoredOrInitial('reports', INITIAL_REPORTS));
  const [alerts, setAlerts] = useState<AlertNotification[]>(() => getStoredOrInitial('alerts', INITIAL_ALERTS));

  // Selection states
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Modal dialog states
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [preselectedBookingFieldId, setPreselectedBookingFieldId] = useState<string | null>(null);
  const [preselectedServiceType, setPreselectedServiceType] = useState<ServiceType | null>(null);

  const [isNewFieldModalOpen, setIsNewFieldModalOpen] = useState(false);

  const [isReportBuilderOpen, setIsReportBuilderOpen] = useState(false);
  const [editingReportForFlightId, setEditingReportForFlightId] = useState<string | null>(null);

  const [isUploadFlightModalOpen, setIsUploadFlightModalOpen] = useState(false);
  const [uploadingForBookingId, setUploadingForBookingId] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  // Sync state changes to browser storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'fields', JSON.stringify(fields));
  }, [fields]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'pilots', JSON.stringify(pilots));
  }, [pilots]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'drones', JSON.stringify(drones));
  }, [drones]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'flights', JSON.stringify(flights));
  }, [flights]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'alerts', JSON.stringify(alerts));
  }, [alerts]);

  /** Switches persona role and sets appropriate default tab */
  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (newRole === 'farmer') {
      setActiveTab('overview');
    } else if (newRole === 'operator') {
      setActiveTab('operations');
    } else {
      setActiveTab('home');
    }
  };

  const setLanguage = (lang: 'en' | 'hi') => {
    setLanguageState(lang);
  };

  const activeFarmer = farmers.find(f => f.id === activeFarmerId) || farmers[0];

  /** Registers a new field parcel for the active farmer */
  const addField = (fieldInput: Omit<Field, 'id' | 'farmerId' | 'activeAlerts'>): Field => {
    const newField: Field = {
      ...fieldInput,
      id: 'fld-' + Date.now(),
      farmerId: activeFarmer.id,
      activeAlerts: 0,
      currentHealth: 'Optimal'
    };
    setFields(prev => [newField, ...prev]);
    showToast(`Field "${newField.name}" (${newField.areaAcres} Acres) registered successfully!`);
    return newField;
  };

  const updateField = (fieldId: string, updates: Partial<Field>) => {
    setFields(prev => prev.map(f => f.id === fieldId ? { ...f, ...updates } : f));
  };

  /**
   * Creates a new spraying or scanning mission booking.
   * Computes market rate cards and applies standard 40% SMAM government subsidy.
   */
  const createBooking = (bookingData: {
    fieldId: string;
    serviceType: ServiceType;
    chemicalOrNutrientName: string;
    preferredDate: string;
    preferredTimeSlot: 'morning' | 'evening';
    notes?: string;
    customAcres?: number;
  }): Booking => {
    const field = fields.find(f => f.id === bookingData.fieldId);
    const acres = bookingData.customAcres || (field ? field.areaAcres : 5);
    
    // Base rate cards per acre in INR
    let ratePerAcre = 399; // Standard pesticide spraying
    if (bookingData.serviceType === 'crop_health_scan') ratePerAcre = 350;
    if (bookingData.serviceType === 'combo_spray_scan') ratePerAcre = 500;
    if (bookingData.serviceType === 'bio_spray') ratePerAcre = 450;
    
    const estimatedPrice = Math.round(acres * ratePerAcre);
    const subsidyPct = 40; // 40% SMAM subsidy default rate
    const finalAmount = Math.round(estimatedPrice * (1 - subsidyPct / 100));

    const newBooking: Booking = {
      id: 'bk-' + Date.now(),
      bookingNumber: `AGW-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(10 + Math.random() * 90)}`,
      farmerId: activeFarmer.id,
      farmerName: activeFarmer.name,
      farmerPhone: activeFarmer.phone,
      fieldId: bookingData.fieldId,
      fieldName: field ? field.name : 'Registered Farm Plot',
      serviceType: bookingData.serviceType,
      chemicalOrNutrientName: bookingData.chemicalOrNutrientName,
      preferredDate: bookingData.preferredDate,
      preferredTimeSlot: bookingData.preferredTimeSlot,
      status: 'pending',
      acres: acres,
      estimatedPrice,
      subsidyAppliedPct: subsidyPct,
      finalAmount,
      notes: bookingData.notes,
      createdAt: new Date().toLocaleString()
    };

    setBookings(prev => [newBooking, ...prev]);

    // Generate notification for fleet dispatch operator
    const operatorAlert: AlertNotification = {
      id: 'alt-' + Date.now(),
      targetRole: 'operator',
      title: `⚡ New Drone Request #${newBooking.bookingNumber}`,
      message: `${activeFarmer.name} requested ${bookingData.serviceType.replace(/_/g, ' ')} for ${acres} acres on ${bookingData.preferredDate}.`,
      severity: 'warning',
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      relatedBookingId: newBooking.id
    };
    setAlerts(prev => [operatorAlert, ...prev]);

    showToast(`Booking request #${newBooking.bookingNumber} submitted! Operator will confirm pilot dispatch.`);
    return newBooking;
  };

  /**
   * Assigns an available DGCA-certified pilot and drone to a pending mission.
   */
  const assignBooking = (
    bookingId: string,
    assignment: {
      pilotId: string;
      droneId: string;
      scheduledDate: string;
      scheduledTime: string;
      notes?: string;
    }
  ) => {
    const pilot = pilots.find(p => p.id === assignment.pilotId);
    const drone = drones.find(d => d.id === assignment.droneId);

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'scheduled',
          pilotId: assignment.pilotId,
          pilotName: pilot ? pilot.name : 'Assigned Pilot',
          droneId: assignment.droneId,
          droneModel: drone ? drone.modelName : 'AgriWing Drone',
          scheduledDate: assignment.scheduledDate,
          scheduledTime: assignment.scheduledTime,
          notes: assignment.notes ? `${b.notes || ''} [Operator: ${assignment.notes}]` : b.notes
        };
      }
      return b;
    }));

    // Notify farmer of confirmed dispatch
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      const farmerAlert: AlertNotification = {
        id: 'alt-' + Date.now(),
        farmerId: booking.farmerId,
        targetRole: 'farmer',
        title: `🚁 Flight Confirmed: Pilot ${pilot?.name || 'Assigned'}`,
        message: `Your spray mission for "${booking.fieldName}" is scheduled for ${assignment.scheduledDate} at ${assignment.scheduledTime}.`,
        severity: 'info',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        relatedBookingId: bookingId
      };
      setAlerts(prev => [farmerAlert, ...prev]);
    }

    showToast('Pilot & Drone assigned successfully! Farmer notified via SMS & App.');
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  /**
   * Ingests completed flight telemetry and aerial photos into mission history.
   */
  const uploadFlightData = (flightData: Omit<Flight, 'id'>): Flight => {
    const newFlight: Flight = {
      ...flightData,
      id: 'flt-' + Date.now()
    };
    setFlights(prev => [newFlight, ...prev]);

    // Automatically transition booking status to completed
    setBookings(prev => prev.map(b => {
      if (b.id === flightData.bookingId) {
        return {
          ...b,
          status: 'completed',
          flightId: newFlight.id
        };
      }
      return b;
    }));

    showToast(`Flight telemetry & ${flightData.dronePhotos.length} drone photos uploaded for Flight #${newFlight.id}!`);
    return newFlight;
  };

  /**
   * Generates or updates an NDVI crop health diagnostic report and notifies farmer.
   */
  const createOrUpdateReport = (
    reportData: Omit<CropHealthReport, 'id' | 'reportNumber'> & { id?: string }
  ): CropHealthReport => {
    const reportId = reportData.id || ('rep-' + Date.now());
    const reportNumber = reportData.id 
      ? (reports.find(r => r.id === reportData.id)?.reportNumber || `RPT-${new Date().toISOString().slice(0,10)}-${Math.floor(100 + Math.random() * 900)}`)
      : `RPT-${new Date().toISOString().slice(0,10)}-${Math.floor(100 + Math.random() * 900)}`;

    const fullReport: CropHealthReport = {
      ...reportData,
      id: reportId,
      reportNumber
    };

    setReports(prev => {
      const exists = prev.some(r => r.id === reportId);
      if (exists) {
        return prev.map(r => r.id === reportId ? fullReport : r);
      }
      return [fullReport, ...prev];
    });

    // Update field's health badge
    setFields(prev => prev.map(f => {
      if (f.id === fullReport.fieldId) {
        return {
          ...f,
          currentHealth: fullReport.healthCategory,
          lastScanDate: fullReport.reportDate,
          activeAlerts: fullReport.healthCategory === 'Optimal' ? 0 : 1
        };
      }
      return f;
    }));

    // Notify farmer of available health diagnostics
    const farmerAlert: AlertNotification = {
      id: 'alt-' + Date.now(),
      farmerId: fullReport.farmerId,
      targetRole: 'farmer',
      title: `📊 Crop Health Report #${reportNumber} is Ready!`,
      message: `Health Score: ${fullReport.overallHealthScore}/100 (${fullReport.healthCategory}). Tap to inspect map zones & recommendations.`,
      severity: fullReport.healthCategory === 'Optimal' ? 'info' : (fullReport.healthCategory === 'Mild Stress' ? 'warning' : 'urgent'),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      relatedFieldId: fullReport.fieldId,
      relatedReportId: fullReport.id
    };
    setAlerts(prev => [farmerAlert, ...prev]);

    showToast(`Health Report #${reportNumber} published to Farmer portal!`);
    return fullReport;
  };

  const markReportAsRead = (reportId: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, isReadByFarmer: true } : r));
  };

  const addDrone = (droneData: Omit<Drone, 'id'>) => {
    const newDrone: Drone = {
      ...droneData,
      id: 'drn-' + Date.now()
    };
    setDrones(prev => [newDrone, ...prev]);
    showToast(`Drone ${newDrone.modelName} registered into fleet!`);
  };

  const updateDroneStatus = (droneId: string, status: Drone['status']) => {
    setDrones(prev => prev.map(d => d.id === droneId ? { ...d, status } : d));
    showToast(`Drone status updated to ${status}.`);
  };

  const addPilot = (pilotData: Omit<Pilot, 'id'>) => {
    const newPilot: Pilot = {
      ...pilotData,
      id: 'pilot-' + Date.now()
    };
    setPilots(prev => [newPilot, ...prev]);
    showToast(`Pilot ${newPilot.name} added to roster!`);
  };

  const updatePilotStatus = (pilotId: string, status: Pilot['status']) => {
    setPilots(prev => prev.map(p => p.id === pilotId ? { ...p, status } : p));
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a));
  };

  const markAllAlertsAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        activeFarmer,
        setActiveFarmerId,
        farmers,
        fields,
        pilots,
        drones,
        bookings,
        flights,
        reports,
        alerts,
        addField,
        updateField,
        createBooking,
        assignBooking,
        updateBookingStatus,
        uploadFlightData,
        createOrUpdateReport,
        markReportAsRead,
        addDrone,
        updateDroneStatus,
        addPilot,
        updatePilotStatus,
        markAlertAsRead,
        markAllAlertsAsRead,
        activeTab,
        setActiveTab,
        selectedFieldId,
        setSelectedFieldId,
        selectedReportId,
        setSelectedReportId,
        isBookModalOpen,
        setIsBookModalOpen,
        preselectedBookingFieldId,
        setPreselectedBookingFieldId,
        preselectedServiceType,
        setPreselectedServiceType,
        isNewFieldModalOpen,
        setIsNewFieldModalOpen,
        isReportBuilderOpen,
        setIsReportBuilderOpen,
        editingReportForFlightId,
        setEditingReportForFlightId,
        isUploadFlightModalOpen,
        setIsUploadFlightModalOpen,
        uploadingForBookingId,
        setUploadingForBookingId,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
