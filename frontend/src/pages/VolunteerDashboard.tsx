import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PickupAssignment, PickupStatus } from '../types';
import { TimelineTracker } from '../components/TimelineTracker';
import {
  Truck,
  CheckCircle2,
  MapPin,
  Phone,
  Navigation,
  FileText,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const VolunteerDashboard: React.FC = () => {
  const [pickups, setPickups] = useState<PickupAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [proofNotes, setProofNotes] = useState<Record<string, string>>({});
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const fetchPickups = async () => {
    try {
      const data = await api.getAllPickups();
      setPickups(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleUpdateStatus = async (pickupId: string, nextStatus: PickupStatus) => {
    setActionLoading(pickupId);
    try {
      const notes = proofNotes[pickupId] || 'Transit verified and compliant with food safety window.';
      await api.updatePickupStatus(pickupId, {
        status: nextStatus,
        proofNotes: notes,
      });

      if (nextStatus === 'DELIVERED') {
        setSuccessBanner('🎉 Delivery Completed! Surplus food safely redistributed and impact metrics updated.');
      } else {
        setSuccessBanner(`Pickup status updated to ${nextStatus}. Notifications dispatched.`);
      }

      await fetchPickups();
      setTimeout(() => setSuccessBanner(null), 6000);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-lime-300 uppercase tracking-wider">
            Volunteer & Transit Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Vikram Sharma (Volunteer Hub)</h1>
          <p className="text-xs text-teal-200 mt-1">
            Active Hyderabad Collection Partner • Vehicle: Two-Wheeler / Insulated Bag
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md border border-white/15">
          <Truck className="w-5 h-5 text-lime-300" />
          <div>
            <p className="text-[10px] text-teal-200 uppercase font-semibold">Active Assignments</p>
            <p className="text-sm font-bold text-white">
              {pickups.filter((p) => p.status !== 'DELIVERED' && p.status !== 'FAILED').length} Active Tasks
            </p>
          </div>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-700" />
          Redistribution Transit Routes & Handover Workflow
        </h2>

        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Loading pickup assignments...</div>
        ) : pickups.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
            <Truck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-800">No pickup tasks assigned yet</p>
            <p className="text-[11px] text-slate-400 mt-1">
              When an NGO accepts surplus food, assignments will appear here with pickup and delivery addresses.
            </p>
          </div>
        ) : (
          pickups.map((p) => {
            const isCompleted = p.status === 'DELIVERED';
            return (
              <div
                key={p.id}
                className={`p-6 rounded-3xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white border-emerald-300 shadow-md ring-1 ring-emerald-200'
                }`}
              >
                {/* Header & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Surplus Redistribution Order
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {p.foodName} • <span className="text-emerald-700 font-extrabold">{p.quantity} {p.unit}</span>
                    </h3>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                    p.status === 'DELIVERED'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : p.status === 'COLLECTED'
                      ? 'bg-teal-100 text-teal-800 border-teal-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}>
                    {p.status}
                  </span>
                </div>

                {/* Visual Lifecycle Progression Tracker */}
                <div className="my-4">
                  <TimelineTracker currentStatus={p.status === 'DELIVERED' ? 'REDISTRIBUTED' : p.status === 'COLLECTED' ? 'COLLECTED' : 'PICKUP_ASSIGNED'} />
                </div>

                {/* Pickup & Delivery Location Addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs">
                  {/* Origin */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-800">
                      Step A: Pickup Origin (Food Provider)
                    </span>
                    <p className="font-bold text-slate-900">{p.providerOrganizationName}</p>
                    <p className="text-slate-600 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{p.providerAddress}</span>
                    </p>
                    {p.providerPhone && (
                      <p className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                        <Phone className="w-3 h-3" />
                        <span>{p.providerPhone}</span>
                      </p>
                    )}
                  </div>

                  {/* Destination */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-blue-800">
                      Step B: Delivery Destination (Recipient NGO)
                    </span>
                    <p className="font-bold text-slate-900">{p.receiverOrganizationName}</p>
                    <p className="text-slate-600 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{p.receiverAddress}</span>
                    </p>
                    {p.receiverPhone && (
                      <p className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                        <Phone className="w-3 h-3" />
                        <span>{p.receiverPhone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Advancement Workflow Buttons */}
                {!isCompleted ? (
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex-1 max-w-md">
                      <input
                        type="text"
                        placeholder="Handover verification notes (e.g. food temperature verified, containers sealed)"
                        value={proofNotes[p.id] || ''}
                        onChange={(e) => setProofNotes({ ...proofNotes, [p.id]: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {p.status === 'ASSIGNED' && (
                        <button
                          onClick={() => handleUpdateStatus(p.id, 'EN_ROUTE')}
                          disabled={actionLoading === p.id}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>Mark En Route</span>
                        </button>
                      )}

                      {p.status === 'EN_ROUTE' && (
                        <button
                          onClick={() => handleUpdateStatus(p.id, 'ARRIVED')}
                          disabled={actionLoading === p.id}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>Mark Arrived at Donor</span>
                        </button>
                      )}

                      {p.status === 'ARRIVED' && (
                        <button
                          onClick={() => handleUpdateStatus(p.id, 'COLLECTED')}
                          disabled={actionLoading === p.id}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Confirm Food Collected</span>
                        </button>
                      )}

                      {p.status === 'COLLECTED' && (
                        <button
                          onClick={() => handleUpdateStatus(p.id, 'DELIVERED')}
                          disabled={actionLoading === p.id}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-lime-300" />
                          <span>Confirm Safely Delivered & Redistributed</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Redistribution verified and completed. Logged to system audit trail.</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
