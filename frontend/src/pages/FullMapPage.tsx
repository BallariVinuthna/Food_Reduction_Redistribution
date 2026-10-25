import React, { useState, useEffect } from 'react';
import { FoodListing } from '../types';
import { api } from '../services/api';
import { SurplusMap } from '../components/SurplusMap';
import { ClaimFoodModal } from '../components/ClaimFoodModal';
import { AnimatedPageHeading } from '../components/AnimatedPageHeading';
import {
  MapPin,
  Filter,
  ArrowLeft,
  RefreshCw,
  Building2,
  Utensils,
  Truck,
  Heart,
} from 'lucide-react';

interface FullMapPageProps {
  onNavigate: (tab: string) => void;
}

export const FullMapPage: React.FC<FullMapPageProps> = ({ onNavigate }) => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaimListing, setSelectedClaimListing] = useState<FoodListing | null>(null);

  const fetchActiveListings = async () => {
    setLoading(true);
    try {
      const data = await api.getActiveSurplus();
      setListings(data);
    } catch {
      // Quiet fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveListings();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DCE9DE] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-xl bg-[#F2F7F1] hover:bg-[#DCE9DE] text-[#24543B] border border-[#DCE9DE] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <AnimatedPageHeading
              text="Live Food Redistribution Map • Hyderabad"
              className="text-xl sm:text-2xl font-extrabold text-[#20352A]"
            />
            <p className="text-xs text-slate-500">
              Spatial tracking of food donations, recipient hubs, and transport volunteers.
            </p>
          </div>
        </div>

        <button
          onClick={fetchActiveListings}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Full Size Map Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-4 space-y-3">
        <div className="w-full h-[620px] rounded-2xl overflow-hidden border border-slate-200">
          <SurplusMap
            listings={listings}
            centerLat={17.4156}
            centerLon={78.4487}
            zoom={12}
            onSelectListing={(l) => setSelectedClaimListing(l)}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 px-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-4 font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#087B46] ring-2 ring-emerald-200" />
              <span>Available Food Surplus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#EA580C] ring-2 ring-orange-200" />
              <span>NGO Receiver / Shelter</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#2563EB] ring-2 ring-blue-200" />
              <span>Volunteer Logistics</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            Click any pin to inspect batch details or coordinate immediate pickup
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      <ClaimFoodModal
        listing={selectedClaimListing}
        isOpen={!!selectedClaimListing}
        onClose={() => setSelectedClaimListing(null)}
        onSuccess={(claimed) => {
          setListings((prev) =>
            prev.map((l) => (l.id === claimed.id ? claimed : l))
          );
        }}
      />
    </div>
  );
};
