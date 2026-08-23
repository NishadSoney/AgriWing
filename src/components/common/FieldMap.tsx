/**
 * @file components/common/FieldMap.tsx
 * @description Interactive Leaflet GIS mapping component for AgriWing.
 * 
 * Features:
 * - Dual base layer toggling (Esri World Imagery satellite vs. OpenStreetMap street)
 * - Dynamic geofence rendering with health-coded SVG polygons
 * - Autopilot GPS flight trail and drone telemetry marker visualization
 * - Interactive polygon drawing mode for farmers defining new field parcels
 * - Automatic bounding-box fitting with smooth camera panning
 */

import React, { useEffect, useRef, useState } from 'react';
import { Field, HealthZone } from '../../types';
import L from 'leaflet';

interface FieldMapProps {
  fields?: Field[];
  activeField?: Field | null;
  healthZones?: HealthZone[];
  flightTrail?: [number, number][];
  onFieldClick?: (field: Field) => void;
  interactiveDrawMode?: boolean;
  drawnPoints?: [number, number][];
  onPointsChange?: (points: [number, number][]) => void;
  heightClass?: string;
  showSatellite?: boolean;
}

export const FieldMap: React.FC<FieldMapProps> = ({
  fields = [],
  activeField = null,
  healthZones = [],
  flightTrail = [],
  onFieldClick,
  interactiveDrawMode = false,
  drawnPoints = [],
  onPointsChange,
  heightClass = 'h-96',
  showSatellite = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const [mapType, setMapType] = useState<'satellite' | 'street'>(showSatellite ? 'satellite' : 'street');

  // Initialize Leaflet map instance lifecycle
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent duplicate initialization

    // Center on active field or default to central Indian agricultural cluster
    const initialCenter: [number, number] = activeField 
      ? activeField.centerCoordinates 
      : fields.length > 0 
        ? fields[0].centerCoordinates 
        : [22.7592, 78.3582];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: activeField ? 16 : 14,
      zoomControl: true,
      attributionControl: false
    });

    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18
    });

    if (mapType === 'satellite') {
      satelliteLayer.addTo(map);
    } else {
      streetLayer.addTo(map);
    }

    const layersGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update base tile layer on user toggle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (mapType === 'satellite') {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
      }).addTo(map);
    } else {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);
    }
  }, [mapType]);

  // Click-to-draw boundary handler for new parcel registration
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (interactiveDrawMode && onPointsChange) {
        const newPoint: [number, number] = [Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6))];
        onPointsChange([...drawnPoints, newPoint]);
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [interactiveDrawMode, drawnPoints, onPointsChange]);

  // Render polygons, health zone overlays, and GPS flight trails
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const bounds = L.latLngBounds([]);

    // 1. Draw Field Boundary Polygons
    if (healthZones.length === 0 && !interactiveDrawMode) {
      fields.forEach((field) => {
        const isSelected = activeField?.id === field.id;
        
        let strokeColor = '#10B981'; // Green (Optimal)
        let fillColor = '#10B981';
        if (field.currentHealth === 'High Concern' || field.currentHealth === 'Severe Pest Attack') {
          strokeColor = '#EF4444'; // Red (Critical Alert)
          fillColor = '#EF4444';
        } else if (field.currentHealth === 'Mild Stress') {
          strokeColor = '#F59E0B'; // Amber (Warning)
          fillColor = '#F59E0B';
        }

        const polygon = L.polygon(field.boundaryCoordinates, {
          color: strokeColor,
          weight: isSelected ? 3.5 : 2,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.45 : 0.25,
          dashArray: isSelected ? undefined : '4, 4'
        }).addTo(group);

        polygon.bindTooltip(`<b>${field.name}</b><br/>${field.crop} • ${field.areaAcres} Acres`, {
          permanent: false,
          direction: 'top',
          className: 'custom-map-tooltip'
        });

        polygon.on('click', () => {
          if (onFieldClick) onFieldClick(field);
        });

        field.boundaryCoordinates.forEach(pt => bounds.extend(pt));

        // Center Pin Marker with health status indicator
        const customIcon = L.divIcon({
          className: 'bg-transparent',
          html: `
            <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110">
              <div class="px-2 py-1 bg-slate-900/90 text-white text-xs font-semibold rounded-lg shadow-lg border border-slate-700 flex items-center gap-1.5 backdrop-blur-sm">
                <span class="w-2 h-2 rounded-full ${
                  field.currentHealth === 'Optimal' ? 'bg-emerald-400' :
                  field.currentHealth === 'Mild Stress' ? 'bg-amber-400' : 'bg-rose-500 animate-ping'
                }"></span>
                <span>${field.name.split(' ')[0]} (${field.areaAcres}A)</span>
              </div>
            </div>
          `,
          iconSize: [120, 30]
        });

        const marker = L.marker(field.centerCoordinates, { icon: customIcon }).addTo(group);
        marker.on('click', () => {
          if (onFieldClick) onFieldClick(field);
        });
      });
    }

    // 2. Draw NDVI Multispectral Health Diagnostic Zones
    if (healthZones.length > 0) {
      healthZones.forEach((zone) => {
        const polygon = L.polygon(zone.coordinates, {
          color: zone.color,
          weight: 3,
          fillColor: zone.color,
          fillOpacity: 0.55
        }).addTo(group);

        polygon.bindPopup(`
          <div class="p-1 font-sans text-slate-800">
            <h4 class="font-bold text-sm" style="color: ${zone.color}">${zone.name}</h4>
            <p class="text-xs text-slate-600 mt-1"><b>Area:</b> ${zone.areaAcres} Acres (${zone.areaPct}%)</p>
            <p class="text-xs text-slate-700 mt-1"><b>Status:</b> ${zone.issue}</p>
            <div class="mt-2 p-1.5 bg-slate-100 rounded text-[11px] font-medium text-slate-900 border-l-2" style="border-left-color: ${zone.color}">
              💡 <b>Recommended Action:</b> ${zone.actionRecommended}
            </div>
          </div>
        `);

        zone.coordinates.forEach(pt => bounds.extend(pt));
      });
    }

    // 3. Draw GPS Flight Trail & Real-Time Drone Position
    if (flightTrail.length > 0) {
      L.polyline(flightTrail, {
        color: '#06B6D4',
        weight: 3,
        opacity: 0.9,
        dashArray: '6, 6'
      }).addTo(group);

      flightTrail.forEach(pt => bounds.extend(pt));

      const lastPoint = flightTrail[flightTrail.length - 1];
      const droneIcon = L.divIcon({
        className: 'bg-transparent',
        html: `
          <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            <div class="w-8 h-8 rounded-full bg-cyan-500/90 text-white flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 17" />
              </svg>
            </div>
          </div>
        `,
        iconSize: [32, 32]
      });

      L.marker(lastPoint, { icon: droneIcon }).addTo(group);
    }

    // 4. Draw interactive boundary points when farmer outlines a new field
    if (interactiveDrawMode && drawnPoints.length > 0) {
      drawnPoints.forEach((pt, idx) => {
        const pointMarker = L.circleMarker(pt, {
          radius: 6,
          color: '#10B981',
          fillColor: '#FFFFFF',
          fillOpacity: 1,
          weight: 2
        }).addTo(group);

        pointMarker.bindTooltip(`Point #${idx + 1}`, { permanent: false });
        bounds.extend(pt);
      });

      if (drawnPoints.length >= 2) {
        L.polyline(drawnPoints, {
          color: '#10B981',
          weight: 3,
          dashArray: '5, 5'
        }).addTo(group);
      }

      if (drawnPoints.length >= 3) {
        L.polygon(drawnPoints, {
          color: '#10B981',
          weight: 2,
          fillColor: '#10B981',
          fillOpacity: 0.35
        }).addTo(group);
      }
    }

    // Smoothly pan & fit bounds around active geometries
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 17 });
    }
  }, [fields, activeField, healthZones, flightTrail, interactiveDrawMode, drawnPoints]);

  return (
    <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden shadow-inner border border-slate-700/60 bg-slate-950`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Base Layer Switcher Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-700/80 flex">
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mapType === 'satellite'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            🛰️ Satellite
          </button>
          <button
            type="button"
            onClick={() => setMapType('street')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mapType === 'street'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            🗺️ Street
          </button>
        </div>

        {interactiveDrawMode && (
          <div className="bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-emerald-500/40 text-xs text-emerald-300 max-w-[200px]">
            <p className="font-semibold text-white">📍 Click on map to add field boundary corners</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Add at least 3 points to create polygon.</p>
          </div>
        )}
      </div>

      {/* Health Spectrum Legend */}
      {healthZones.length > 0 && (
        <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-2.5 rounded-xl border border-slate-700/80 text-xs shadow-lg flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider">Health Spectrum:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
            <span className="text-slate-300 text-xs">Vigorous (70-100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-500/20"></span>
            <span className="text-slate-300 text-xs">Mild Stress (40-69%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-500/20 animate-pulse"></span>
            <span className="text-slate-300 text-xs">Pest / Fungal Threat (&lt;40%)</span>
          </div>
        </div>
      )}
    </div>
  );
};
