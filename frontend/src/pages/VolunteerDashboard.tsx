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
  ShieldCheck,
  AlertCircle,
  KeyRound,
  XCircle,
} from 'lucide-react';

export const VolunteerDashboard: React.FC = () => {
  const [pickups, setPickups] = useState<PickupAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [proofNotes, setProofNotes] = useState<Record<string, string>>({});
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // OTP Verification Modal State
  const [activeModal, setActiveModal] = useState<{
    pickupId: string;
    step: 'PICKUP_OTP' | 'DELIVERY_OTP' | 'CANCEL_REPORT';
    targetStatus?: PickupStatus;
    expectedQuantity?: number;
    unit?: string;
  } | null>(null);

  const [enteredOtp, setEnteredOtp] = useState('');
  const [actualQuantity, setActualQuantity] = useState<number>(0);
  const [failureReason, setFailureReason] = useState('');

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

  const handleOpenOtpModal = (pickup: PickupAssignment, step: 'PICKUP_OTP' | 'DELIVERY_OTP') => {
    setActiveModal({
      pickupId: pickup.id,
      step,
      targetStatus: step === 'PICKUP_OTP' ? 'COLLECTED' : 'DELIVERED',
      expectedQuantity: pickup.quantity,
      unit: pickup.unit,
    });
    setEnteredOtp('');
    setActualQuantity(pickup.quantity);
  };

  const handleOpenCancelModal = (pickup: PickupAssignment) => {
    setActiveModal({
      pickupId: pickup.id,
      step: 'CANCEL_REPORT',
      expectedQuantity: pickup.quantity,
      unit: pickup.unit,
    });
    setFailureReason('');
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;

    setActionLoading(activeModal.pickupId);
    try {
      if (activeModal.step === 'PICKUP_OTP') {
        const notes = proofNotes[activeModal.pickupId] || 'Physical temperature & packaging safety verified at provider.';
        await api.updatePickupStatus(activeModal.pickupId, {
          status: 'COLLECTED',
          otp: enteredOtp,
          actualQuantity: actualQuantity || activeModal.expectedQuantity,
          proofNotes: notes,
        });
        setSuccessBanner('Pickup OTP verified! Food collected and securely locked in transit.');
      } else if (activeModal.step === 'DELIVERY_OTP') {
        const notes = proofNotes[activeModal.pickupId] || 'Delivered to NGO kitchen. Verified with recipient OTP.';
        await api.updatePickupStatus(activeModal.pickupId, {
          status: 'DELIVERED',
          otp: enteredOtp,
          actualQuantity: actualQuantity || activeModal.expectedQuantity,
          proofNotes: notes,
        });
        setSuccessBanner('🎉 Delivery OTP Verified! Handover complete. Persistent audit transaction closed.');
      } else if (activeModal.step === 'CANCEL_REPORT') {
        await api.updatePickupStatus(activeModal.pickupId, {
          status: 'FAILED',
          failedReason: failureReason || 'Handover aborted at site',
          cancellationReason: failureReason,
          proofNotes: `Handover failure recorded: ${failureReason}`,
        });
        setSuccessBanner('Handover exception recorded in immutable audit log.');
      }

      setActiveModal(null);
      await fetchPickups();
      setTimeout(() => setSuccessBanner(null), 6000);
    } catch (err: any) {
      alert(err.message || 'Operation failed. Verify OTP code.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSimpleStatusAdvance = async (pickupId: string, nextStatus: PickupStatus) => {
    setActionLoading(pickupId);
    try {
      const notes = proofNotes[pickupId] || 'Transit checkpoint confirmed.';
      await api.updatePickupStatus(pickupId, {
        status: nextStatus,
        proofNotes: notes,
      });
      setSuccessBanner(`Transit status updated to ${nextStatus}.`);
      await fetchPickups();
      setTimeout(() => setSuccessBanner(null), 5000);
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
            Active Hyderabad Collection Partner • Two-Factor Handover Verification (OTPs)
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
          <div className="text-center py-12 text-slate-500 text-sm">Loading assigned transit routes...</div>
        ) : pickups.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 text-sm">
            No active pickups assigned. New matching routes will appear here automatically.
          </div>
        ) : (
          pickups.map((p) => {
            const isCompleted = p.status === 'DELIVERED';
            const isFailed = p.status === 'FAILED';

            return (
              <div
                key={p.id}
                className={`p-6 rounded-3xl bg-white border ${
                  isCompleted ? 'border-emerald-200 shadow-2xs' : isFailed ? 'border-red-200 bg-red-50/20' : 'border-slate-200 shadow-md'
                } space-y-4 transition-all`}
              >
                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      Assignment ID: {p.id.substring(0, 8)}...
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{p.foodName}</h3>
                    <p className="text-xs text-slate-500">
                      Quantity: <strong className="text-slate-800">{p.quantity} {p.unit}</strong>
                    </p>
                  </div>

                  <span
                    className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : isFailed
                        ? 'bg-red-100 text-red-800'
                        : p.status === 'COLLECTED'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                {/* Stepper Timeline */}
                <TimelineTracker currentStatus={p.status} />

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
                {!isCompleted && !isFailed ? (
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex-1 max-w-md">
                      <input
                        type="text"
                        placeholder="Handover notes (e.g. food temperature verified, containers sealed)"
                        value={proofNotes[p.id] || ''}
                        onChange={(e) => setProofNotes({ ...proofNotes, [p.id]: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {p.status === 'ASSIGNED' && (
                        <button
                          onClick={() => handleSimpleStatusAdvance(p.id, 'EN_ROUTE')}
                          disabled={actionLoading === p.id}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>Mark En Route</span>
                        </button>
                      )}

                      {p.status === 'EN_ROUTE' && (
                        <button
                          onClick={() => handleSimpleStatusAdvance(p.id, 'ARRIVED')}
                          disabled={actionLoading === p.id}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>Mark Arrived at Donor</span>
                        </button>
                      )}

                      {p.status === 'ARRIVED' && (
                        <button
                          onClick={() => handleOpenOtpModal(p, 'PICKUP_OTP')}
                          disabled={actionLoading === p.id}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-4 h-4" />
                          <span>Enter Pickup OTP</span>
                        </button>
                      )}

                      {p.status === 'COLLECTED' && (
                        <button
                          onClick={() => handleOpenOtpModal(p, 'DELIVERY_OTP')}
                          disabled={actionLoading === p.id}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 text-lime-300" />
                          <span>Verify Delivery OTP</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenCancelModal(p)}
                        disabled={actionLoading === p.id}
                        className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Report Exception</span>
                      </button>
                    </div>
                  </div>
                ) : isCompleted ? (
                  <div className="pt-2 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Redistribution verified with double OTP authentication and logged to system audit trail.</span>
                  </div>
                ) : (
                  <div className="pt-2 flex items-center gap-2 text-xs text-red-800 font-semibold">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>Handover marked as failed / cancelled. Reason logged in audit records.</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* OTP Verification & Exception Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">
                {activeModal.step === 'PICKUP_OTP'
                  ? 'Verify Food Pickup Handover'
                  : activeModal.step === 'DELIVERY_OTP'
                  ? 'Verify Recipient Delivery Handover'
                  : 'Report Transit / Handover Exception'}
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              {activeModal.step === 'PICKUP_OTP'
                ? 'Ask the kitchen provider for the 6-digit Pickup OTP shown on their dashboard.'
                : activeModal.step === 'DELIVERY_OTP'
                ? 'Ask the NGO receiver for the 6-digit Delivery OTP shown on their dashboard.'
                : 'State the specific operational reason why this handover could not be completed.'}
            </p>

            <form onSubmit={handleSubmitModal} className="space-y-4">
              {activeModal.step !== 'CANCEL_REPORT' ? (
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">6-Digit Verification PIN (OTP)</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="e.g. 582914"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.trim())}
                      className="w-full mt-1 border border-slate-300 rounded-xl px-3 py-2.5 text-center font-mono text-lg font-bold tracking-widest text-slate-900 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">Actual Handed Over Quantity ({activeModal.unit})</label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={actualQuantity}
                      onChange={(e) => setActualQuantity(Number(e.target.value))}
                      className="w-full mt-1 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-emerald-500"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-slate-700">Exception Reason</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Receiver facility closed, temperature exceeded safe limit, recipient capacity full..."
                    value={failureReason}
                    onChange={(e) => setFailureReason(e.target.value)}
                    className="w-full mt-1 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-red-500"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading !== null}
                  className={`px-4 py-2 rounded-xl text-white text-xs font-bold cursor-pointer ${
                    activeModal.step === 'CANCEL_REPORT'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-emerald-700 hover:bg-emerald-800'
                  }`}
                >
                  {activeModal.step === 'CANCEL_REPORT' ? 'Confirm Exception' : 'Verify Handover'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
