import React, { useEffect, useRef } from 'react';
import { FoodListing } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SurplusMapProps {
  listings: FoodListing[];
  centerLat?: number;
  centerLon?: number;
  zoom?: number;
  selectedListingId?: string;
  onSelectListing?: (listing: FoodListing) => void;
}

export const SurplusMap: React.FC<SurplusMapProps> = ({
  listings,
  centerLat = 17.4156, // Central Hyderabad
  centerLon = 78.4487,
  zoom = 12,
  onSelectListing,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map instance once
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLon],
        zoom: zoom,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers layer
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Add Markers for Listings
    listings.forEach((listing) => {
      if (!listing.latitude || !listing.longitude) return;

      const isCritical = listing.urgencyLevel === 'CRITICAL';
      const isHigh = listing.urgencyLevel === 'HIGH';

      const color = isCritical ? '#ef4444' : isHigh ? '#f59e0b' : '#059669';

      // Custom pulsing HTML icon
      const customIcon = L.divIcon({
        className: 'custom-surplus-pin',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
          ">
            ${
              isCritical
                ? `<div style="
                    position: absolute;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: rgba(239, 68, 68, 0.4);
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                  "></div>`
                : ''
            }
            <div style="
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background-color: ${color};
              border: 3px solid white;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 11px;
              font-weight: bold;
            ">
              ${isCritical ? '!' : '🍽'}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([listing.latitude, listing.longitude], { icon: customIcon }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1';
      popupContent.innerHTML = `
        <div style="font-family: system-ui, sans-serif; font-size: 12px; color: #0f172a;">
          <div style="font-weight: bold; font-size: 13px; margin-bottom: 2px;">${listing.foodName}</div>
          <div style="color: #059669; font-weight: 600;">${listing.quantity} ${listing.unit} • ${listing.providerOrganizationName}</div>
          <div style="color: #64748b; font-size: 11px; margin-top: 3px;">📍 ${listing.address}</div>
          <div style="margin-top: 6px; padding: 3px 6px; border-radius: 6px; font-size: 11px; font-weight: 600; display: inline-block; background-color: ${
            isCritical ? '#fee2e2' : '#ecfdf5'
          }; color: ${isCritical ? '#991b1b' : '#065f46'};">
            ${listing.availableMinutesRemaining} mins remaining (${listing.urgencyLevel})
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onSelectListing) onSelectListing(listing);
      });
    });

    // Add Hyderabad landmark reference markers (NGO receivers)
    const receivers = [
      { name: 'Robin Hood Army Hub', lat: 17.4265, lon: 78.4116, type: 'NGO' },
      { name: 'Akshaya Patra Shelter', lat: 17.3688, lon: 78.5300, type: 'Shelter' },
      { name: 'Feed The Need Fridge', lat: 17.4447, lon: 78.4664, type: 'Community Fridge' },
    ];

    receivers.forEach((rec) => {
      const recIcon = L.divIcon({
        className: 'custom-receiver-pin',
        html: `
          <div style="
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background-color: #2563eb;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
          ">
            🏠
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      L.marker([rec.lat, rec.lon], { icon: recIcon })
        .addTo(map)
        .bindPopup(`<b>${rec.name}</b><br/><span style="color:#64748b; font-size:11px;">Registered Recipient Hub (${rec.type})</span>`);
    });

  }, [listings, centerLat, centerLon, zoom, onSelectListing]);

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full" />
      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200 z-[1000] text-[11px] space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-ping" />
          <span className="font-medium text-slate-700">Critical Surplus (&lt;60m)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
          <span className="font-medium text-slate-700">Active Food Surplus</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
          <span className="font-medium text-slate-700">NGO Receivers / Shelters</span>
        </div>
      </div>
    </div>
  );
};
