import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Match, PickupAssignment } from '../types';
import { MatchScoreBadge } from '../components/MatchScoreBadge';
import {
  HeartHandshake,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Building2,
  Filter,
  KeyRound,
  Truck,
  ShieldCheck,
  Split
} from 'lucide-react';

export const ReceiverDashboard: React.FC = () => {
  const [activeMatches, setActiveMatches] = useState<Match[]>([]);
  const [incomingPickups, setIncomingPickups] = useState<PickupAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchMatchesAndPickups = async () => {
    try {
      // Fetch active listings and their matches
      const activeListings = await api.getActiveListings();
      const allMatches: Match[] = [];

      for (const listing of activeListings) {
        const matches = await api.getMatchesForListing(listing.id);
        allMatches.push(...matches);
      }

      // Deduplicate by match ID
      const uniqueMatches = Array.from(new Map(allMatches.map((m) => [m.id, m])).values());
      setActiveMatches(uniqueMatches);

      // Fetch pickups
      const pickups = await api.getAllPickups();
      setIncomingPickups(pickups);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchesAndPickups();
  }, []);

  const handleAccept = async (matchId: string) => {
    setActionLoading(matchId);
    try {
      await api.acceptMatch(matchId, 'Accepted by Robin Hood Army Jubilee Hills team for immediate community distribution.');
      setSuccessMessage('Donation accepted! A delivery OTP has been generated. Provide this PIN to the volunteer when they arrive with the food.');
      await fetchMatchesAndPickups();
      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err: any) {
      alert(err.message || 'Failed to accept donation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (matchId: string) => {
    setActionLoading(matchId);
    try {
      await api.rejectMatch(matchId, 'Recipient shelter currently at peak dinner capacity.');
      setSuccessMessage('Donation declined. The system has automatically cascaded the offer to the next ranked receiver.');
      await fetchMatchesAndPickups();
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to reject donation');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-900 to-teal-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
            Receiver Operations Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Robin Hood Army • Hyderabad</h1>
          <p className="text-xs text-blue-200 mt-1">
            Registered Non-Profit Food Redistribution Partner • Capacity: 120 Meals • Verified Status
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/15">
          <Building2 className="w-5 h-5 text-teal-300" />
          <div className="text-left">
            <p className="text-[10px] text-blue-200 uppercase font-semibold">Available Capacity</p>
            <p className="text-sm font-bold text-white">80 / 120 Meals Space</p>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Incoming Deliveries & Handover Verification PINs */}
      {incomingPickups.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-base text-slate-900">
                Incoming Deliveries & Secure Handover PINs
              </h3>
            </div>
            <span className="text-xs text-slate-500">Double OTP Handover Protocol</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingPickups
              .filter(p => p.status !== 'DELIVERED' && p.status !== 'FAILED')
              .map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{p.foodName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      {p.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    From: <strong>{p.providerOrganizationName}</strong> • Qty: <strong>{p.quantity} {p.unit}</strong>
                  </p>

                  <div className="p-3 rounded-xl bg-white border border-blue-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-semibold text-slate-700">Delivery Handover PIN (OTP):</span>
                    </div>
                    <span className="font-mono text-base font-extrabold text-emerald-800 tracking-wider">
                      {p.deliveryOtp || '839201'}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Disclose this OTP to volunteer {p.volunteerName || 'Vikram Sharma'} only after physical inspection.</span>
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Filter Ribbon */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Surplus Offers Dispatched by Smart Matching Engine</span>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={filterVegOnly}
            onChange={(e) => setFilterVegOnly(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <span>Filter Vegetarian Only</span>
        </label>
      </div>

      {/* Available Matches Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Loading incoming surplus matches...</div>
        ) : activeMatches.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
            <HeartHandshake className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-800">No pending surplus matches right now</p>
            <p className="text-[11px] text-slate-400 mt-1">
              New matches will appear automatically when donors in Hyderabad publish surplus food.
            </p>
          </div>
        ) : (
          activeMatches.map((m) => {
            const isAccepted = m.status === 'ACCEPTED';
            const isRejected = m.status === 'REJECTED';

            return (
              <div
                key={m.id}
                className={`p-6 rounded-3xl border transition-all ${
                  isAccepted
                    ? 'bg-emerald-50/50 border-emerald-300 shadow-sm'
                    : isRejected
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Food & Donor details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Surplus Match
                      </span>
                      <span className="text-xs text-slate-500 font-medium">📍 {m.distanceKm} km away</span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900">{m.foodName}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                        Quantity: {m.quantity} {m.unit}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {m.receiverAddress}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        Transit ETA: ~{m.estimatedPickupMinutes} mins
                      </span>
                    </div>
                  </div>

                  {/* Score & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <MatchScoreBadge match={m} size="lg" />

                    {!isAccepted && !isRejected ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAccept(m.id)}
                          disabled={actionLoading === m.id}
                          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept & Dispatch</span>
                        </button>

                        <button
                          onClick={() => handleReject(m.id)}
                          disabled={actionLoading === m.id}
                          className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4 text-slate-400" />
                          <span>Decline (Cascade)</span>
                        </button>
                      </div>
                    ) : (
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border ${
                        isAccepted
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}>
                        {m.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
