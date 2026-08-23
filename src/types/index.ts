/**
 * @file types/index.ts
 * @description Core TypeScript type definitions and domain interfaces for AgriWing.
 * Covers user personas, GIS field geometry, drone fleet assets, DGCA pilot licensing,
 * mission booking workflows, flight telemetry, and multispectral crop health diagnostics.
 */

/** User access role across the platform */
export type Role = 'public' | 'farmer' | 'operator';

/** Specialized drone services supported by the fleet */
export type ServiceType = 
  | 'pesticide_spray' 
  | 'fertilizer_spray' 
  | 'bio_spray' 
  | 'crop_health_scan' 
  | 'combo_spray_scan';

/** Mission / booking lifecycle states */
export type BookingStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

/** Aircraft operational readiness states */
export type DroneStatus = 'ready' | 'in_flight' | 'maintenance' | 'charging';

/** DGCA licensed pilot availability */
export type PilotStatus = 'available' | 'on_mission' | 'off_duty';

/** Diagnostic severity levels for NDVI health zones */
export type HealthSeverity = 'good' | 'warning' | 'critical';

/**
 * Farm field parcel with GPS boundary coordinates and agronomic metadata.
 */
export interface Field {
  id: string;
  farmerId: string;
  name: string;
  crop: string;
  variety?: string;
  areaAcres: number;
  locationName: string;
  centerCoordinates: [number, number]; // [lat, lng] for centering maps
  boundaryCoordinates: [number, number][]; // Polygon vertices for GIS geofence
  sownDate: string;
  soilType: string;
  irrigationType: string;
  currentHealth: 'Optimal' | 'Mild Stress' | 'High Concern' | 'Severe Pest Attack';
  lastScanDate?: string;
  lastSprayDate?: string;
  activeAlerts: number;
}

/**
 * Registered farmer profile with landholding and subscription tier.
 */
export interface Farmer {
  id: string;
  name: string;
  phone: string;
  email: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  totalAcreage: number;
  subscriptionPlanId: 'pay_as_you_go' | 'seasonal_shield' | 'annual_precision';
  subscriptionStatus: 'active' | 'expired' | 'trial';
  subscriptionExpiry: string;
  coveredAcresRemaining: number;
  avatar?: string;
}

/**
 * DGCA certified commercial drone pilot on the fleet roster.
 */
export interface Pilot {
  id: string;
  name: string;
  phone: string;
  email: string;
  dgcaLicenseNumber: string; // Indian Directorate General of Civil Aviation remote pilot cert
  licenseExpiryDate: string;
  totalFlightHours: number;
  status: PilotStatus;
  rating: number;
  baseLocation: string;
  avatar: string;
  certifications: string[];
  assignedMissionsCount: number;
}

/**
 * Commercial agricultural drone asset (UAV).
 */
export interface Drone {
  id: string;
  modelName: string;
  regNumber: string; // Unique UIN registration number
  serialNo: string;
  payloadCapacityLiters: number; // e.g. 10L, 16L, 25L tank capacity
  batteryHealthPct: number;
  totalFlightHours: number;
  status: DroneStatus;
  lastMaintenanceDate: string;
  nextServiceDue: string;
  equipmentType: 'Spraying + Multispectral 4K' | 'Heavy Spray 25L' | 'High-Res NDVI Scout';
  currentPilotId?: string;
}

/**
 * Service mission booking request created by a farmer or scheduled by an operator.
 */
export interface Booking {
  id: string;
  bookingNumber: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  fieldId: string;
  fieldName: string;
  serviceType: ServiceType;
  chemicalOrNutrientName: string;
  preferredDate: string;
  preferredTimeSlot: 'morning' | 'evening'; // Morning (06:00-09:00) | Evening (16:00-18:30)
  status: BookingStatus;
  acres: number;
  estimatedPrice: number; // Base service price in INR
  subsidyAppliedPct: number; // e.g. 40% SMAM subsidy
  finalAmount: number; // Price after subsidy
  pilotId?: string;
  pilotName?: string;
  droneId?: string;
  droneModel?: string;
  flightId?: string;
  notes?: string;
  createdAt: string;
  scheduledDate?: string;
  scheduledTime?: string;
}

/**
 * Aerial drone photograph captured during flight.
 */
export interface DronePhoto {
  id: string;
  url: string;
  caption: string;
  timestamp: string;
  type: 'rgb' | 'ndvi' | 'thermal' | 'action';
}

/**
 * Sub-parcel diagnostic zone identified in NDVI multispectral scans.
 */
export interface HealthZone {
  id: string;
  name: string;
  color: string;
  severity: HealthSeverity;
  areaAcres: number;
  areaPct: number;
  issue: string;
  actionRecommended: string;
  coordinates: [number, number][];
}

/**
 * Agronomist action recommendation generated from scan findings.
 */
export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  urgency: 'immediate' | 'within_3_days' | 'monitor';
  estimatedCost: number;
  recommendedChemical?: string;
  recommendedDosage?: string;
  oneClickServiceType?: ServiceType;
}

/**
 * Completed flight mission telemetry and execution log.
 */
export interface Flight {
  id: string;
  bookingId: string;
  pilotId: string;
  pilotName: string;
  droneId: string;
  droneModel: string;
  flightDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  sprayVolumeLiters: number;
  chemicalName: string;
  dosagePerAcre: string;
  coverageAcres: number;
  weatherConditions: {
    windSpeedKmh: number;
    temperatureC: number;
    humidityPct: number;
    conditions: string;
    windDirection: string;
  };
  gpsFlightTrail: [number, number][]; // Array of GPS coordinates logged by onboard autopilot
  dronePhotos: DronePhoto[];
  status: 'completed' | 'aborted';
  batteryDrainPct: number;
}

/**
 * Comprehensive crop health report published for farmer inspection.
 */
export interface CropHealthReport {
  id: string;
  reportNumber: string;
  flightId: string;
  bookingId: string;
  fieldId: string;
  fieldName: string;
  farmerId: string;
  farmerName: string;
  reportDate: string;
  cropType: string;
  overallHealthScore: number; // 0 to 100 NDVI-derived score
  healthCategory: 'Optimal' | 'Mild Stress' | 'High Concern' | 'Severe Pest Attack';
  plainLanguageSummary: string;
  plainLanguageSummaryHindi?: string;
  droneImagePrimary: string;
  ndviImageOverlay?: string;
  healthZones: HealthZone[];
  recommendedActions: RecommendedAction[];
  operatorNotes: string;
  generatedByPilotOrOperator: string;
  isReadByFarmer: boolean;
}

/**
 * In-app notification alert for farmers or dispatch operators.
 */
export interface AlertNotification {
  id: string;
  farmerId?: string; // Empty target indicates operator broadcast
  targetRole: 'farmer' | 'operator' | 'all';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'urgent';
  date: string;
  read: boolean;
  relatedFieldId?: string;
  relatedReportId?: string;
  relatedBookingId?: string;
}

/**
 * Indian Central & State Government agricultural subsidy scheme.
 */
export interface GovtScheme {
  id: string;
  name: string;
  shortName: string;
  agency: string;
  subsidyPct: string;
  maxAmount: string;
  description: string;
  eligibility: string[];
  documentsRequired: string[];
  highlights: string[];
  officialPortalUrl: string;
}
