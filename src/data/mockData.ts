/**
 * @file data/mockData.ts
 * @description Initial seed dataset for AgriWing demonstration and local offline operation.
 * 
 * Includes realistic agricultural data modeled after Indian agrarian regions:
 * - Farmers from Madhya Pradesh (Hoshangabad), Punjab (Ludhiana), and Maharashtra (Nagpur)
 * - DGCA-certified commercial drone pilots with verified licensing formats
 * - Type-certified agricultural UAVs (hexacopters and octocopters with 16L-25L payload tanks)
 * - Multispectral NDVI health diagnostic records and SMAM government subsidy structures
 */

import {
  Farmer,
  Field,
  Pilot,
  Drone,
  Booking,
  Flight,
  CropHealthReport,
  AlertNotification,
  GovtScheme
} from '../types';

export const INITIAL_FARMERS: Farmer[] = [
  {
    id: 'f-101',
    name: 'Ramesh Patel',
    phone: '+91 98234 56789',
    email: 'ramesh.patel@kisanmail.in',
    village: 'Pipariya',
    district: 'Hoshangabad',
    state: 'Madhya Pradesh',
    pincode: '461775',
    totalAcreage: 18.5,
    subscriptionPlanId: 'seasonal_shield',
    subscriptionStatus: 'active',
    subscriptionExpiry: '2026-11-30',
    coveredAcresRemaining: 12.0,
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'f-102',
    name: 'Sukhwinder Singh',
    phone: '+91 94172 88321',
    email: 'sukhwinder.farm@punjabkrishi.in',
    village: 'Ballowal',
    district: 'Ludhiana',
    state: 'Punjab',
    pincode: '141008',
    totalAcreage: 32.0,
    subscriptionPlanId: 'annual_precision',
    subscriptionStatus: 'active',
    subscriptionExpiry: '2027-03-31',
    coveredAcresRemaining: 24.5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'f-103',
    name: 'Anandi Bai',
    phone: '+91 97551 22910',
    email: 'anandi.bai@agrifarmer.org',
    village: 'Ganeshpura',
    district: 'Nagpur',
    state: 'Maharashtra',
    pincode: '441108',
    totalAcreage: 8.0,
    subscriptionPlanId: 'pay_as_you_go',
    subscriptionStatus: 'active',
    subscriptionExpiry: '2026-09-30',
    coveredAcresRemaining: 0,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_FIELDS: Field[] = [
  {
    id: 'fld-1',
    farmerId: 'f-101',
    name: 'North Wheat Field (Khasra 402)',
    crop: 'Wheat (HD-2967)',
    variety: 'High Yield Semi-Dwarf',
    areaAcres: 6.5,
    locationName: 'North Canal Road, Pipariya',
    centerCoordinates: [22.7592, 78.3582],
    boundaryCoordinates: [
      [22.7610, 78.3560],
      [22.7615, 78.3605],
      [22.7578, 78.3610],
      [22.7570, 78.3565]
    ],
    sownDate: '2025-11-20',
    soilType: 'Black Clayey Loam',
    irrigationType: 'Canal + Drip',
    currentHealth: 'High Concern',
    lastScanDate: '2026-08-18',
    lastSprayDate: '2026-08-04',
    activeAlerts: 2
  },
  {
    id: 'fld-2',
    farmerId: 'f-101',
    name: 'East Cotton Patch (Khasra 405)',
    crop: 'Cotton (Bt RCH-659)',
    variety: 'Long Staple Hybrid',
    areaAcres: 4.8,
    locationName: 'East Well Sector, Pipariya',
    centerCoordinates: [22.7540, 78.3630],
    boundaryCoordinates: [
      [22.7560, 78.3615],
      [22.7562, 78.3655],
      [22.7525, 78.3650],
      [22.7520, 78.3610]
    ],
    sownDate: '2026-06-12',
    soilType: 'Medium Deep Black',
    irrigationType: 'Tube Well Sprinkler',
    currentHealth: 'Optimal',
    lastScanDate: '2026-08-15',
    lastSprayDate: '2026-08-16',
    activeAlerts: 0
  },
  {
    id: 'fld-3',
    farmerId: 'f-101',
    name: 'Riverbed Mustard Plot (Khasra 411)',
    crop: 'Mustard (Pusa Mustard-30)',
    variety: 'Low Erucic Acid',
    areaAcres: 7.2,
    locationName: 'Narmada Bank Basin',
    centerCoordinates: [22.7650, 78.3520],
    boundaryCoordinates: [
      [22.7675, 78.3500],
      [22.7670, 78.3555],
      [22.7630, 78.3545],
      [22.7635, 78.3490]
    ],
    sownDate: '2025-10-25',
    soilType: 'Alluvial Loam',
    irrigationType: 'Flood / River Lift',
    currentHealth: 'Mild Stress',
    lastScanDate: '2026-08-10',
    lastSprayDate: '2026-07-28',
    activeAlerts: 1
  }
];

export const INITIAL_PILOTS: Pilot[] = [
  {
    id: 'pilot-1',
    name: 'Capt. Vikramaditya Singh',
    phone: '+91 98765 43210',
    email: 'vikram.singh@agriwing.com',
    dgcaLicenseNumber: 'DGCA-RPA-2024-0891',
    licenseExpiryDate: '2028-05-15',
    totalFlightHours: 342,
    status: 'available',
    rating: 4.9,
    baseLocation: 'Hoshangabad Regional Hub #1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    certifications: ['DGCA Medium Category RPAS', 'Precision Ag Pesticide Handling', 'Thermal Multispectral Specialist'],
    assignedMissionsCount: 148
  },
  {
    id: 'pilot-2',
    name: 'Priya Deshmukh',
    phone: '+91 98111 23456',
    email: 'priya.deshmukh@agriwing.com',
    dgcaLicenseNumber: 'DGCA-RPA-2024-1104',
    licenseExpiryDate: '2028-09-20',
    totalFlightHours: 215,
    status: 'available',
    rating: 4.8,
    baseLocation: 'Bhopal Central Hub',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    certifications: ['DGCA Small & Medium Category', 'Foliar Nutrient Dispersion', 'NDVI Calibrated Flight'],
    assignedMissionsCount: 92
  },
  {
    id: 'pilot-3',
    name: 'Gurpreet Gill',
    phone: '+91 94100 99887',
    email: 'gurpreet.gill@agriwing.com',
    dgcaLicenseNumber: 'DGCA-RPA-2023-0442',
    licenseExpiryDate: '2027-11-10',
    totalFlightHours: 510,
    status: 'on_mission',
    rating: 5.0,
    baseLocation: 'Ludhiana North Base',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    certifications: ['Master Flight Instructor (RPTO)', 'Heavy Ag Payload 25L', 'Night Spray Protocol'],
    assignedMissionsCount: 230
  }
];

export const INITIAL_DRONES: Drone[] = [
  {
    id: 'drn-101',
    modelName: 'AgriWing T-25 Pro Octocopter',
    regNumber: 'UIN-AGW-2024-0012',
    serialNo: 'AW-T25-9981-IND',
    payloadCapacityLiters: 25,
    batteryHealthPct: 94,
    totalFlightHours: 184,
    status: 'ready',
    lastMaintenanceDate: '2026-08-10',
    nextServiceDue: '2026-09-10',
    equipmentType: 'Spraying + Multispectral 4K'
  },
  {
    id: 'drn-102',
    modelName: 'HexaSpray X-16 Precision',
    regNumber: 'UIN-AGW-2024-0044',
    serialNo: 'HX-16P-4402-IND',
    payloadCapacityLiters: 16,
    batteryHealthPct: 88,
    totalFlightHours: 240,
    status: 'ready',
    lastMaintenanceDate: '2026-08-01',
    nextServiceDue: '2026-09-01',
    equipmentType: 'Heavy Spray 25L'
  },
  {
    id: 'drn-103',
    modelName: 'SkyScout NDVI 4K Multispectral',
    regNumber: 'UIN-AGW-2025-0109',
    serialNo: 'SS-NDVI-8831-IND',
    payloadCapacityLiters: 5,
    batteryHealthPct: 98,
    totalFlightHours: 72,
    status: 'ready',
    lastMaintenanceDate: '2026-08-14',
    nextServiceDue: '2026-09-14',
    equipmentType: 'High-Res NDVI Scout'
  },
  {
    id: 'drn-104',
    modelName: 'AgriWing T-25 Pro (Unit #2)',
    regNumber: 'UIN-AGW-2024-0089',
    serialNo: 'AW-T25-9988-IND',
    payloadCapacityLiters: 25,
    batteryHealthPct: 82,
    totalFlightHours: 290,
    status: 'charging',
    lastMaintenanceDate: '2026-07-28',
    nextServiceDue: '2026-08-28',
    equipmentType: 'Spraying + Multispectral 4K'
  }
];

export const INITIAL_FLIGHTS: Flight[] = [
  {
    id: 'flt-881',
    bookingId: 'bk-201',
    pilotId: 'pilot-1',
    pilotName: 'Capt. Vikramaditya Singh',
    droneId: 'drn-101',
    droneModel: 'AgriWing T-25 Pro Octocopter',
    flightDate: '2026-08-18',
    startTime: '06:15 AM',
    endTime: '07:05 AM',
    durationMinutes: 50,
    sprayVolumeLiters: 48,
    chemicalName: 'Multispectral Scan + Micronutrient Zinc Booster',
    dosagePerAcre: '7.4 Liters / Acre (Ultra Low Volume Atomized)',
    coverageAcres: 6.5,
    weatherConditions: {
      windSpeedKmh: 6.2,
      temperatureC: 24.5,
      humidityPct: 78,
      conditions: 'Clear dawn, optimal for zero spray drift',
      windDirection: 'North-East 4 kts'
    },
    batteryDrainPct: 42,
    status: 'completed',
    gpsFlightTrail: [
      [22.7610, 78.3560],
      [22.7612, 78.3580],
      [22.7615, 78.3605],
      [22.7600, 78.3607],
      [22.7598, 78.3562],
      [22.7585, 78.3563],
      [22.7588, 78.3609],
      [22.7578, 78.3610],
      [22.7570, 78.3565]
    ],
    dronePhotos: [
      {
        id: 'dp-1',
        url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&auto=format&fit=crop&q=80',
        caption: 'High-Altitude 4K RGB Survey of North Wheat Field',
        timestamp: '2026-08-18 06:22 AM',
        type: 'rgb'
      },
      {
        id: 'dp-2',
        url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=900&auto=format&fit=crop&q=80',
        caption: 'Multispectral Near-Infrared (NDVI) Canopy Reflection Map',
        timestamp: '2026-08-18 06:35 AM',
        type: 'ndvi'
      },
      {
        id: 'dp-3',
        url: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=900&auto=format&fit=crop&q=80',
        caption: 'Drone Ultra-Low-Volume Micronizer Nozzle Spray in Action',
        timestamp: '2026-08-18 06:48 AM',
        type: 'action'
      }
    ]
  },
  {
    id: 'flt-880',
    bookingId: 'bk-200',
    pilotId: 'pilot-2',
    pilotName: 'Priya Deshmukh',
    droneId: 'drn-102',
    droneModel: 'HexaSpray X-16 Precision',
    flightDate: '2026-08-16',
    startTime: '05:45 PM',
    endTime: '06:25 PM',
    durationMinutes: 40,
    sprayVolumeLiters: 35,
    chemicalName: 'Organic Neem Bio-Pesticide (Azadirachtin 10,000 ppm)',
    dosagePerAcre: '7.3 Liters / Acre',
    coverageAcres: 4.8,
    weatherConditions: {
      windSpeedKmh: 4.8,
      temperatureC: 27.0,
      humidityPct: 65,
      conditions: 'Sunset calm, excellent atomization absorption',
      windDirection: 'West 3 kts'
    },
    batteryDrainPct: 36,
    status: 'completed',
    gpsFlightTrail: [
      [22.7560, 78.3615],
      [22.7562, 78.3655],
      [22.7542, 78.3653],
      [22.7540, 78.3613],
      [22.7525, 78.3650],
      [22.7520, 78.3610]
    ],
    dronePhotos: [
      {
        id: 'dp-4',
        url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=900&auto=format&fit=crop&q=80',
        caption: 'East Cotton Plot Post-Spray Foliar Absorption',
        timestamp: '2026-08-16 06:10 PM',
        type: 'rgb'
      }
    ]
  }
];

export const INITIAL_REPORTS: CropHealthReport[] = [
  {
    id: 'rep-901',
    reportNumber: 'RPT-2026-08-402',
    flightId: 'flt-881',
    bookingId: 'bk-201',
    fieldId: 'fld-1',
    fieldName: 'North Wheat Field (Khasra 402)',
    farmerId: 'f-101',
    farmerName: 'Ramesh Patel',
    reportDate: '2026-08-18',
    cropType: 'Wheat (HD-2967)',
    overallHealthScore: 68,
    healthCategory: 'High Concern',
    plainLanguageSummary: 'Good news: 75% of your wheat field has a strong, deep green canopy with healthy tillers. However, our drone cameras identified a 1.2-acre patch in the North-East corner showing early yellowing rust spores (Puccinia striiformis) and mild nitrogen deficiency caused by water ponding. Spot treatment is strongly recommended within 48-72 hours to prevent fungal spread to adjacent healthy rows.',
    plainLanguageSummaryHindi: 'आपके गेहूं के खेत का 75% हिस्सा बिल्कुल स्वस्थ और हरा-भरा है। लेकिन उत्तर-पूर्वी कोने में 1.2 एकड़ हिस्से में पीला रतुआ (फफूंद) के शुरुआती लक्षण दिखे हैं। इसे बाकी खेत में फैलने से रोकने के लिए अगले 48-72 घंटों में तुरंत फंगीसाइड स्प्रे की सिफारिश की जाती है।',
    droneImagePrimary: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&auto=format&fit=crop&q=80',
    ndviImageOverlay: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=900&auto=format&fit=crop&q=80',
    healthZones: [
      {
        id: 'hz-1',
        name: 'Zone A: Prime Vibrant Canopy',
        color: '#10B981', // green
        severity: 'good',
        areaAcres: 4.8,
        areaPct: 74,
        issue: 'No stress detected. Vigorous vegetative growth and uniform canopy density.',
        actionRecommended: 'Maintain regular irrigation schedule. No chemical intervention needed.',
        coordinates: [
          [22.7600, 78.3560],
          [22.7615, 78.3590],
          [22.7578, 78.3610],
          [22.7570, 78.3565]
        ]
      },
      {
        id: 'hz-2',
        name: 'Zone B: Mild Moisture Stress',
        color: '#F59E0B', // yellow-amber
        severity: 'warning',
        areaAcres: 0.5,
        areaPct: 8,
        issue: 'Low chlorophyll reflectance index (NDVI 0.48 vs healthy 0.82) along field drainage slope.',
        actionRecommended: 'Clear the sub-drainage trench to prevent root suffocation.',
        coordinates: [
          [22.7610, 78.3590],
          [22.7615, 78.3605],
          [22.7602, 78.3608],
          [22.7600, 78.3590]
        ]
      },
      {
        id: 'hz-3',
        name: 'Zone C: Critical Yellow Rust Fungal Outbreak',
        color: '#EF4444', // red
        severity: 'critical',
        areaAcres: 1.2,
        areaPct: 18,
        issue: 'Early foliar pustules of stripe/yellow rust detected with thermal heat signature spike.',
        actionRecommended: 'Spot spray Propiconazole 25% EC (Tilt) or Tebuconazole @ 200ml/acre with AgriWing micro-droplet drone precision.',
        coordinates: [
          [22.7590, 78.3598],
          [22.7602, 78.3608],
          [22.7578, 78.3610],
          [22.7580, 78.3595]
        ]
      }
    ],
    recommendedActions: [
      {
        id: 'act-1',
        title: 'Precision Anti-Fungal Spot Spray (Zone C)',
        description: 'Targeted drone spray of Propiconazole 25% EC directly on the infected 1.2 acres before morning dew dissipates.',
        urgency: 'immediate',
        estimatedCost: 480,
        recommendedChemical: 'Propiconazole 25% EC (Tilt)',
        recommendedDosage: '200 ml in 20 Liters atomized mist / 1.2 Acres',
        oneClickServiceType: 'pesticide_spray'
      },
      {
        id: 'act-2',
        title: 'Nano-Urea + Zinc Sulphate Foliar Boost',
        description: 'Foliar nutrition mist across Zone B & C to accelerate recovery of yellowed foliage.',
        urgency: 'within_3_days',
        estimatedCost: 350,
        recommendedChemical: 'IFFCO Nano Urea + 12% Chelated Zinc',
        recommendedDosage: '4 ml / Liter',
        oneClickServiceType: 'fertilizer_spray'
      }
    ],
    operatorNotes: 'Pilot Vikram confirmed clear flight with zero drift onto neighboring mustard plots. High-resolution imagery calibrated against standard Sentinel-2 NDVI benchmark.',
    generatedByPilotOrOperator: 'Capt. Vikramaditya Singh & Agronomist Dr. Shalini Verma',
    isReadByFarmer: false
  },
  {
    id: 'rep-900',
    reportNumber: 'RPT-2026-08-405',
    flightId: 'flt-880',
    bookingId: 'bk-200',
    fieldId: 'fld-2',
    fieldName: 'East Cotton Patch (Khasra 405)',
    farmerId: 'f-101',
    farmerName: 'Ramesh Patel',
    reportDate: '2026-08-16',
    cropType: 'Cotton (Bt RCH-659)',
    overallHealthScore: 94,
    healthCategory: 'Optimal',
    plainLanguageSummary: 'Excellent crop health! The cotton crop shows outstanding boll formation, lush dark-green vegetative index (average NDVI 0.88), and zero bollworm/whitefly infestation following the organic bio-spray.',
    plainLanguageSummaryHindi: 'कपास की फसल बहुत अच्छी स्थिति में है। पौधों का विकास शानदार है और बायो-स्प्रे के बाद किसी भी कीट का प्रकोप नहीं है।',
    droneImagePrimary: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=900&auto=format&fit=crop&q=80',
    healthZones: [
      {
        id: 'hz-4',
        name: 'Uniform Prime Cotton Canopy',
        color: '#10B981',
        severity: 'good',
        areaAcres: 4.8,
        areaPct: 100,
        issue: 'Zero pest infestation, optimal canopy closure.',
        actionRecommended: 'Next routine scouting recommended in 14 days.',
        coordinates: [
          [22.7560, 78.3615],
          [22.7562, 78.3655],
          [22.7525, 78.3650],
          [22.7520, 78.3610]
        ]
      }
    ],
    recommendedActions: [
      {
        id: 'act-3',
        title: 'Schedule Pre-Flowering Bio-Nutrient Scan',
        description: 'Book follow-up 4K scan in two weeks to time the flower bud boost.',
        urgency: 'monitor',
        estimatedCost: 399,
        oneClickServiceType: 'crop_health_scan'
      }
    ],
    operatorNotes: 'Excellent spray coverage with 98% droplet distribution uniformity. Farmer pleased with quick 18-minute turnaround.',
    generatedByPilotOrOperator: 'Priya Deshmukh (Lead Ag Operator)',
    isReadByFarmer: true
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-201',
    bookingNumber: 'AGW-2026-0818-01',
    farmerId: 'f-101',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98234 56789',
    fieldId: 'fld-1',
    fieldName: 'North Wheat Field (Khasra 402)',
    serviceType: 'combo_spray_scan',
    chemicalOrNutrientName: 'Multispectral Scan + Micronutrient Zinc Booster',
    preferredDate: '2026-08-18',
    preferredTimeSlot: 'morning',
    status: 'completed',
    acres: 6.5,
    estimatedPrice: 3250,
    subsidyAppliedPct: 40,
    finalAmount: 1950,
    pilotId: 'pilot-1',
    pilotName: 'Capt. Vikramaditya Singh',
    droneId: 'drn-101',
    droneModel: 'AgriWing T-25 Pro Octocopter',
    flightId: 'flt-881',
    notes: 'Please verify yellow spots on north boundary during scan.',
    createdAt: '2026-08-17 08:30 AM',
    scheduledDate: '2026-08-18',
    scheduledTime: '06:00 AM - 07:00 AM'
  },
  {
    id: 'bk-200',
    bookingNumber: 'AGW-2026-0816-04',
    farmerId: 'f-101',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98234 56789',
    fieldId: 'fld-2',
    fieldName: 'East Cotton Patch (Khasra 405)',
    serviceType: 'bio_spray',
    chemicalOrNutrientName: 'Organic Neem Bio-Pesticide (Azadirachtin)',
    preferredDate: '2026-08-16',
    preferredTimeSlot: 'evening',
    status: 'completed',
    acres: 4.8,
    estimatedPrice: 2400,
    subsidyAppliedPct: 40,
    finalAmount: 1440,
    pilotId: 'pilot-2',
    pilotName: 'Priya Deshmukh',
    droneId: 'drn-102',
    droneModel: 'HexaSpray X-16 Precision',
    flightId: 'flt-880',
    notes: 'Organic certified plot; avoid chemical cross-contamination.',
    createdAt: '2026-08-15 02:15 PM',
    scheduledDate: '2026-08-16',
    scheduledTime: '05:30 PM - 06:30 PM'
  },
  {
    id: 'bk-202',
    bookingNumber: 'AGW-2026-0824-02',
    farmerId: 'f-101',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98234 56789',
    fieldId: 'fld-1',
    fieldName: 'North Wheat Field (Khasra 402)',
    serviceType: 'pesticide_spray',
    chemicalOrNutrientName: 'Propiconazole 25% EC (Yellow Rust Cure)',
    preferredDate: '2026-08-24',
    preferredTimeSlot: 'morning',
    status: 'scheduled',
    acres: 6.5,
    estimatedPrice: 2600,
    subsidyAppliedPct: 40,
    finalAmount: 1560,
    pilotId: 'pilot-1',
    pilotName: 'Capt. Vikramaditya Singh',
    droneId: 'drn-101',
    droneModel: 'AgriWing T-25 Pro Octocopter',
    notes: 'Urgent spot spray for Zone C as recommended in Report #901.',
    createdAt: '2026-08-19 11:20 AM',
    scheduledDate: '2026-08-24',
    scheduledTime: '06:00 AM - 07:15 AM'
  },
  {
    id: 'bk-203',
    bookingNumber: 'AGW-2026-0825-05',
    farmerId: 'f-102',
    farmerName: 'Sukhwinder Singh',
    farmerPhone: '+91 94172 88321',
    fieldId: 'fld-3',
    fieldName: 'Basmati Paddy Sector 12',
    serviceType: 'fertilizer_spray',
    chemicalOrNutrientName: 'IFFCO Nano DAP + Bio Potassium',
    preferredDate: '2026-08-25',
    preferredTimeSlot: 'morning',
    status: 'pending',
    acres: 15.0,
    estimatedPrice: 5850,
    subsidyAppliedPct: 50,
    finalAmount: 2925,
    notes: 'Basmati early tillering phase. Needs morning calm wind.',
    createdAt: '2026-08-22 04:45 PM'
  },
  {
    id: 'bk-204',
    bookingNumber: 'AGW-2026-0826-01',
    farmerId: 'f-103',
    farmerName: 'Anandi Bai',
    farmerPhone: '+91 97551 22910',
    fieldId: 'fld-2',
    fieldName: 'Nagpur Orange Orchard',
    serviceType: 'crop_health_scan',
    chemicalOrNutrientName: 'Multispectral 4K Citrus Greening Scan',
    preferredDate: '2026-08-26',
    preferredTimeSlot: 'evening',
    status: 'pending',
    acres: 8.0,
    estimatedPrice: 3200,
    subsidyAppliedPct: 40,
    finalAmount: 1920,
    notes: 'Check for citrus dieback / leaf miner symptoms.',
    createdAt: '2026-08-23 09:10 AM'
  }
];

export const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'alt-1',
    farmerId: 'f-101',
    targetRole: 'farmer',
    title: '⚠️ Critical Yellow Rust Alert (North Wheat)',
    message: 'Report #RPT-2026-08-402 identified 1.2 acres of stripe rust in Zone C. Book recommended spot spray before spread.',
    severity: 'urgent',
    date: '2026-08-18 08:30 AM',
    read: false,
    relatedFieldId: 'fld-1',
    relatedReportId: 'rep-901'
  },
  {
    id: 'alt-2',
    farmerId: 'f-101',
    targetRole: 'farmer',
    title: '✅ Flight Mission Completed & Report Ready',
    message: 'Capt. Vikram finished spraying and NDVI scanning on North Wheat Field (6.5 Acres). Report is now live.',
    severity: 'info',
    date: '2026-08-18 07:15 AM',
    read: true,
    relatedFieldId: 'fld-1',
    relatedReportId: 'rep-901'
  },
  {
    id: 'alt-3',
    farmerId: 'f-101',
    targetRole: 'farmer',
    title: '🌤️ Optimal Spray Weather Forecast Tomorrow',
    message: 'Wind speed 4-7 km/h, zero rain expected from 05:30 AM to 09:00 AM. Ideal window for precision foliar application.',
    severity: 'info',
    date: '2026-08-23 06:00 AM',
    read: false
  },
  {
    id: 'alt-4',
    targetRole: 'operator',
    title: '🔔 2 New Spray Booking Requests Received',
    message: 'Sukhwinder Singh (15 Acres Paddy) & Anandi Bai (8 Acres Citrus) requested drone dispatch.',
    severity: 'warning',
    date: '2026-08-23 09:15 AM',
    read: false,
    relatedBookingId: 'bk-203'
  },
  {
    id: 'alt-5',
    targetRole: 'operator',
    title: '🔋 Drone Unit #104 Charging & Service Reminder',
    message: 'AgriWing T-25 Pro (Unit #2) reached 290 logged flight hours. 300-hour rotor inspection due in 10 hours.',
    severity: 'info',
    date: '2026-08-22 08:00 PM',
    read: true
  }
];

export const GOVT_SCHEMES: GovtScheme[] = [
  {
    id: 'smam-drone',
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    shortName: 'SMAM Kisan Drone Subsidy',
    agency: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    subsidyPct: '40% - 50% for Individual Farmers / 75% for FPOs',
    maxAmount: 'Up to ₹4,00,000 - ₹5,00,000 for procurement & 50% on Hiring Services',
    description: 'Central government financial assistance scheme providing direct cost reduction on agricultural drone hire charges (spraying & crop health diagnostics) and machine procurement.',
    eligibility: [
      'Small and Marginal Farmers (Landholding < 2 Hectares / 5 Acres)',
      'SC/ST, Women Farmers, and North Eastern Region Farmers receive up to 50% subsidy',
      'Farmer Producer Organizations (FPOs) and Custom Hiring Centers (CHCs) get up to 75% aid'
    ],
    documentsRequired: [
      'Aadhaar Card linked with Mobile Number',
      'Land Ownership Record (7/12 Extract, Khasra/Khatauni or Land Registry)',
      'Bank Passbook Copy (for Direct Benefit Transfer)',
      'Caste Certificate / Small Farmer ID (if applicable for 50% rate)'
    ],
    highlights: [
      'Reduces per-acre spray cost from ₹500 to just ₹250–₹300',
      'Instant billing rebate directly applied on AgriWing platform for verified farmers',
      'Zero manual paperwork: AgriWing uploads flight GPS log directly to state portal'
    ],
    officialPortalUrl: 'https://agrimachinery.nic.in/'
  },
  {
    id: 'drone-shakti',
    name: 'Kisan Drone Shakti Initiative & PLI Program',
    shortName: 'Kisan Drone Shakti Mission',
    agency: 'Ministry of Civil Aviation & Dept. of Agriculture',
    subsidyPct: 'Up to 50% on Drone-as-a-Service (DaaS) operations',
    maxAmount: 'Subsidized custom spray rates capped at state minimum tariffs',
    description: 'Promotes Drone-as-a-Service (DaaS) in rural areas to eliminate pesticide poisoning among farm laborers and boost water efficiency by 90%.',
    eligibility: [
      'All registered farmers cultivating cereal, pulse, oilseed, cotton, or fruit crops',
      'Cooperative societies and village panchayat clusters',
      'Graduates in agriculture starting rural drone service hubs'
    ],
    documentsRequired: [
      'Farmer Kisan Credit Card (KCC) or PM-Kisan ID',
      'Crop Sowing Declaration / Girdawari certificate',
      'Valid identity proof'
    ],
    highlights: [
      'Guaranteed 24-hour turnaround for emergency pest outbreak calls',
      'Free crop health report included with every 3rd subsidized spray',
      'Supported by DGCA certified rural drone pilots'
    ],
    officialPortalUrl: 'https://pmkisan.gov.in/'
  },
  {
    id: 'state-horticulture',
    name: 'National Horticulture Mission (MIDH) Precision Drone Grant',
    shortName: 'MIDH Orchard & Vegetable Drone Support',
    agency: 'Mission for Integrated Development of Horticulture',
    subsidyPct: '50% on foliar micronutrient & organic bio-spray runs',
    maxAmount: '₹3,000 per hectare per season',
    description: 'Specialized scheme incentivizing drone-based canopy nutrition spraying for fruit orchards (Citrus, Mango, Apple, Grapes) and high-value vegetables.',
    eligibility: [
      'Farmers cultivating fruits, spices, flowers, or greenhouse vegetables',
      'Existing beneficiaries of Drip/Micro-irrigation systems'
    ],
    documentsRequired: [
      'Horticulture land registration',
      'Soil Health Card / Foliar test requirement recommendation',
      'Bank details for DBT'
    ],
    highlights: [
      'Allows ultra-fine misting under dense tree canopies without fruit bruising',
      'Reduces chemical fungicide usage by 35% compared to tractor blowers'
    ],
    officialPortalUrl: 'https://midh.gov.in/'
  }
];

export const PRICING_TIERS = [
  {
    id: 'pay_as_you_go',
    name: 'Pay-Per-Acre On-Demand',
    tagline: 'Ideal for trial or smallholders with 1–5 acres',
    pricePerAcre: 399,
    priceUnit: 'per acre / spray',
    billedText: 'Pay per flight mission',
    popular: false,
    color: 'slate',
    features: [
      'Precision pesticide or fertilizer foliar spray',
      'Ultra-Low Volume (ULV) 90% water saving',
      'Standard GPS flight trail log & receipt',
      'Basic SMS & WhatsApp completion confirmation',
      '48-hour pilot dispatch guarantee',
      'Govt. 40% SMAM subsidy eligible (effective ₹239/acre)'
    ],
    ctaText: 'Book Single Spray',
    accentColor: 'from-slate-700 to-slate-800'
  },
  {
    id: 'seasonal_shield',
    name: 'Seasonal Crop Shield',
    tagline: 'Most Popular for Wheat, Cotton, Paddy & Soybeans',
    pricePerAcre: 1199,
    priceUnit: 'per acre / entire crop season (up to 4 flights)',
    billedText: 'Covers entire 4-month crop lifecycle',
    popular: true,
    color: 'emerald',
    features: [
      'Includes 3 Precision Sprays (Basal, Pre-bloom, Pest protection)',
      '1 Free 4K Multispectral Crop Health Scan (NDVI Map)',
      'Color-coded zone report with plain-language action advice',
      'Priority 24-hour pilot dispatch slot',
      'Dedicated Agronomist WhatsApp advice support',
      'Automatic weather-drift rescheduling with zero penalty',
      'Govt. 40% SMAM subsidy eligible (effective ₹719/acre)'
    ],
    ctaText: 'Get Seasonal Pass',
    accentColor: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'annual_precision',
    name: 'Annual Precision Farm Pass',
    tagline: 'For progressive multi-crop growers & progressive farms',
    pricePerAcre: 2499,
    priceUnit: 'per acre / year (unlimited scouting + 8 sprays)',
    billedText: 'Covers Kharif, Rabi & Zaid seasons (12 months)',
    popular: false,
    color: 'sky',
    features: [
      '8 Precision Sprays across two major + one catch crop seasons',
      '4 Quarterly High-Res 4K Multispectral NDVI Health Scans',
      'GPS field boundary survey & digital Khasra mapping included',
      'Same-day Emergency Pest Outbreak Dispatch guarantee',
      'Free drone seed broadcasting & nano-fertilizer pilot run',
      'Direct Agronomist phone consultation on demand',
      'Annual soil nutrient & yield increase analytics',
      'Govt. 50% subsidy eligible (effective ₹1,249/acre)'
    ],
    ctaText: 'Subscribe Annual Pass',
    accentColor: 'from-blue-600 to-indigo-700'
  }
];
