# 🌱 AgriWing — Smart Drone Agriculture Platform

> **Precision Agriculture & Drone Spraying Management System**  
> Empowering modern farmers and agricultural drone fleet operators with GIS parcel mapping, multispectral (NDVI) crop diagnostics, on-demand mission dispatch, and flight telemetry logging.

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
   - [👨‍🌾 Farmer Portal](#-farmer-portal)
   - [🚁 Fleet & Dispatch Hub](#-fleet--dispatch-hub)
   - [🌐 Public Landing & Subsidy Center](#-public-landing--subsidy-center)
3. [Architecture & Tech Stack](#architecture--tech-stack)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Development](#development)
   - [Production Build](#production-build)
5. [Directory Structure](#directory-structure)
6. [Domain Context & Business Logic](#domain-context--business-logic)
7. [License](#license)

---

## 🌟 Overview

**AgriWing** bridges the gap between smallholder farmers, large agricultural estates, and commercial drone fleet service providers. Traditional knapsack spraying consumes excessive water, causes health hazards from chemical exposure, and leads to uneven pesticide distribution. AgriWing enables ultra-low volume (ULV) drone spraying that reduces chemical expenditure by up to 30%, slashes water usage by up to 90%, and completes an acre of spraying in just 7–10 minutes.

---

## 🚀 Key Features

### 👨‍🌾 Farmer Portal
* **Interactive GIS Field Mapping**: Draw and register farm boundaries using high-resolution satellite imagery with automatic acreage computation.
* **1-Click Drone Spraying Booking**: Book precision spraying for pesticides, bio-stimulants, and liquid fertilizers with transparent pricing and instant government subsidy calculations.
* **Multispectral NDVI Crop Health Reports**: View detailed drone imagery overlays with color-coded health zones (Optimal, Mild Stress, High Concern, Pest Attack), spot-remediation advice, and bilingual (English & Hindi) summaries.
* **Real-Time Weather Suitability**: Micro-climate weather indicators evaluating wind speeds, temperature, and humidity against safe drone flight parameters.

### 🚁 Fleet & Dispatch Hub
* **Mission Dispatch**: Assign DGCA-certified commercial drone pilots and hexacopter aircraft to incoming booking requests.
* **Flight Telemetry Logger**: Record flight durations, volume sprayed, dosage rates, GPS flight path trails, battery consumption, and high-resolution aerial photos.
* **Diagnostic Report Builder**: Author and publish customized crop health reports with agronomic templates for fungal rust, pest infestations, and nutrient deficiencies.
* **Asset & Pilot Management**: Track drone airworthiness, flight hours, battery cycle health, and pilot DGCA certifications.
* **Analytics & CRM**: Real-time revenue charts, acres covered, and farmer relationship management.

### 🌐 Public Landing & Subsidy Center
* **Interactive ROI Calculator**: Calculate chemical, water, and labor savings based on total farm acreage.
* **Indian Government Schemes Guide**: Direct information and eligibility criteria for SMAM (40–100% drone subsidies), Sub-Mission on Agricultural Mechanization, and Drone Didi initiatives.
* **Online Demonstration Booking**: Frictionless inquiry and booking workflow.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Type-safe declarative UI components |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first styling |
| **Mapping / GIS** | [Leaflet](https://leafletjs.com/) | Geospatial mapping, polygon drawing & flight trails |
| **State Management** | React Context + LocalStorage Persistence | Real-time reactive state with zero backend setup needed |
| **Icons & Motion** | [Lucide React](https://lucide.dev/) + [Motion](https://motion.dev/) | Rich micro-interactions and iconography |
| **Build Tooling** | [Vite 6](https://vitejs.dev/) | Fast HMR dev server and optimized rollup bundling |

---

## 🏁 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or later recommended)
* **npm** (v9.0.0 or later) or **bun**

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/your-username/agriwing-platform.git
   cd agriwing-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

To compile a production-ready optimized bundle:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 📁 Directory Structure

```
├── index.html                  # HTML entry point with GIS Leaflet stylesheet & typography
├── vite.config.ts              # Vite configuration with React and Tailwind plugins
├── package.json                # Project dependencies and script declarations
├── tsconfig.json               # TypeScript compiler configuration
├── .env.example                # Environment variable reference
├── src/
│   ├── main.tsx                # React DOM root entry point
│   ├── App.tsx                 # Master layout & role-based routing (Public/Farmer/Operator)
│   ├── index.css               # Design system, custom utilities, and Leaflet overrides
│   ├── types/
│   │   └── index.ts            # Core TypeScript domain models and interfaces
│   ├── context/
│   │   └── AppContext.tsx      # Global state provider with reactive LocalStorage persistence
│   ├── data/
│   │   └── mockData.ts         # Agricultural datasets (farms, pilots, drones, NDVI scans)
│   └── components/
│       ├── common/             # Reusable widgets (GIS FieldMap, RoleSwitcherBar, Toast)
│       ├── public/             # Marketing landing page, pricing calculator, subsidy guides
│       ├── farmer/             # Farmer dashboard, crop health viewer, parcel registration
│       └── operator/           # Mission dispatch hub, telemetry uploader, fleet CRM
```

---

## 🌾 Domain Context & Business Logic

* **Field Parcel Coordinates**: Polygon geofence arrays follow standard `[latitude, longitude]` coordinates compatible with Leaflet and GeoJSON standards.
* **NDVI Health Calculation**: Normalized Difference Vegetation Index values (-1 to +1) are categorized into actionable severity tiers: *Optimal* (0.6–0.9), *Mild Stress* (0.4–0.6), *High Concern* (0.2–0.4), and *Severe Pest Attack* (< 0.2).
* **Subsidy Calculation Engine**: Default subsidy parameters incorporate the standard Sub-Mission on Agricultural Mechanization (SMAM) guidelines (40% base subsidy on customized hiring center services).

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.
