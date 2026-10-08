import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FoodListing, Match } from '../types';
import { SurplusMap } from '../components/SurplusMap';
import { CreateListingWizard } from './CreateListingWizard';
import { MatchScoreBadge } from '../components/MatchScoreBadge';
import { TimelineTracker } from '../components/TimelineTracker';
import {
  PlusCircle,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Package,
} from 'lucide-react';

export const ProviderDashboard: React.FC = () => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedListing, setSelectedListing] = useState<FoodListing | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchingLoading, setMatchingLoading] = useState(false);

  const fetchListings = async () => {
    try {
      const data = await api.getActiveListings();
      setListings(data);
      if (data.length > 0 && !selectedListing) {
        setSelectedListing(data[0]);
        loadMatchesForListing(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMatchesForListing = async (listingId: string) => {
    setMatchingLoading(true);
    try {
      let data = await api.getMatchesForListing(listingId);
      if (data.length === 0) {
        // Auto-trigger matching engine if none generated yet
        data = await api.generateMatches(listingId);
      }
      setMatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setMatchingLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  if (showWizard) {
    return (
      <CreateListingWizard
        onSuccess={(newListing) => {
          setShowWizard(false);
          fetchListings();
          setSelectedListing(newListing);
          loadMatchesForListing(newListing.id);
        }}
        onCancel={() => setShowWizard(false)}
      />
    );
  }

  // Dashboard Stats
  const totalListed = listings.reduce((sum, l) => sum + l.quantity, 0);
  const activeCount = listings.filter((l) => l.status === 'AVAILABLE').length;
  const inProgressCount = listings.filter((l) => l.status === 'RESERVED' || l.status === 'ACCEPTED' || l.status === 'PICKUP_ASSIGNED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Provider Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white shadow-xl">
        <div>
          <span className="text-xs font-semibold text-lime-300 uppercase tracking-wider">
            Donor Operations Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Taj Banjara Kitchens</h1>
          <p className="text-xs text-emerald-200 mt-1">
            Hyderabad City Grid • Active Hospitality Donor Partner
          </p>
        </div>

        <button
          onClick={() => setShowWizard(true)}
          className="px-5 py-3 rounded-2xl bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Surplus Food</span>
        </button>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Active Surplus Listings</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{activeCount}</p>
          <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">Ready for dispatch</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">In Transit / Matched</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{inProgressCount}</p>
          <p className="text-[11px] text-teal-600 mt-0.5 font-medium">Pickup coordinated</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Total Available Meals</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalListed}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Servings logged</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-medium">Reliability Score</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">98.5%</p>
          <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">Verified donor badge</p>
        </div>
      </div>

      {/* Map & Active Listings Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Active Listings Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-700" />
              Active Surplus Inventory
            </h2>
            <span className="text-xs text-slate-500 font-medium">{listings.length} items</span>
          </div>

          <div className="space-y-3">
            {listings.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
                No active surplus listings right now. Click "Register New Surplus Food" to list items.
              </div>
            ) : (
              listings.map((l) => {
                const isSelected = selectedListing?.id === l.id;
                const isCritical = l.urgencyLevel === 'CRITICAL';
                return (
                  <div
                    key={l.id}
                    onClick={() => {
                      setSelectedListing(l);
                      loadMatchesForListing(l.id);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/60 border-emerald-500 shadow-md ring-2 ring-emerald-400/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {l.foodCategory}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 mt-1">{l.foodName}</h3>
                      </div>
                      <span className="text-base font-extrabold text-emerald-800">
                        {l.quantity} {l.unit}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[180px]">{l.address}</span>
                      </div>

                      <div className={`px-2 py-0.5 rounded-full font-bold text-[10px] border flex items-center gap-1 ${
                        isCritical
                          ? 'bg-red-100 text-red-800 border-red-300 animate-pulse'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{l.availableMinutesRemaining} mins left</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <TimelineTracker currentStatus={l.status} compact />
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        Matches <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Map & Smart Matching Engine Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Leaflet Map Card */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                Hyderabad Regional Surplus & Receiver Grid
              </h3>
              <span className="text-[11px] text-slate-500">Live Geocoded Nodes</span>
            </div>
            <div className="h-[280px]">
              <SurplusMap
                listings={listings}
                selectedListingId={selectedListing?.id}
                onSelectListing={(l) => {
                  setSelectedListing(l);
                  loadMatchesForListing(l.id);
                }}
              />
            </div>
          </div>

          {/* Smart Matching Engine Results Card */}
          {selectedListing && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-sm text-slate-900">
                      Smart Matching Engine Results for: <span className="text-emerald-800">{selectedListing.foodName}</span>
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Multicriteria MCDA scored against available receivers in Hyderabad
                  </p>
                </div>

                <TimelineTracker currentStatus={selectedListing.status} compact />
              </div>

              {/* Ranked Matches List */}
              {matchingLoading ? (
                <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
                  Executing MCDA optimization engine across receiver network...
                </div>
              ) : matches.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="font-semibold text-slate-700">No suitable receiver found within initial 25 km radius.</p>
                  <p className="text-[11px] text-slate-500 mt-1">Fallback alert automatically dispatched to volunteer collection pool.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {matches.map((m, idx) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        idx === 0
                          ? 'bg-emerald-50/70 border-emerald-400 shadow-xs ring-1 ring-emerald-300'
                          : 'bg-slate-50/50 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            idx === 0 ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-slate-900">{m.receiverOrganizationName}</h4>
                              {idx === 0 && (
                                <span className="text-[9px] font-extrabold uppercase bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-md">
                                  Top Match
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              📍 {m.distanceKm} km away • Transit ETA: ~{m.estimatedPickupMinutes} mins
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <MatchScoreBadge match={m} />
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border ${
                            m.status === 'ACCEPTED'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : m.status === 'NOTIFIED'
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
