import React, { useState, useEffect } from 'react';
import { PickupAssignment } from '../types';
import { api } from '../services/api';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  ShieldCheck,
  Building2,
  RefreshCw,
  Phone,
} from 'lucide-react';

export const PickupDeliveryPage: React.FC = () => {
  const [pickups, setPickups] = useState<PickupAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePickupForOtp, setActivePickupForOtp] = useState<PickupAssignment | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpType, setOtpType] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchPickups = async () => {
    setLoading(true);
    try {
      const data = await api.getAllPickups();
      setPickups(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleUpdateStatus = async (pickupId: string, nextStatus: string, otp?: string) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const updated = await api.updatePickupStatus(pickupId, {
        status: nextStatus,
        otp: otp || undefined,
      });
      setPickups((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setActionSuccess(`Status transitioned to ${nextStatus} successfully!`);
      setActivePickupForOtp(null);
      setOtpInput('');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err.message || 'Failed to update pickup status.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#087B46] uppercase tracking-wider">
            Volunteer Logistics Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Pickup & Delivery Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track active missions, verify handover OTPs at provider kitchens, and confirm recipient arrivals across Hyderabad.
          </p>
        </div>

        <button
          onClick={fetchPickups}
          className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-2 self-start md:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Pickups List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#087B46]" />
          <p className="text-xs font-medium">Loading active assignments...</p>
        </div>
      ) : pickups.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">No active pickup assignments</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When surplus food listings are matched with recipient shelters, delivery missions will appear here for dispatch.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pickups.map((pickup) => (
            <div
              key={pickup.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Header status */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-[#087B46]">
                    {pickup.status.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    ID: {pickup.id.substring(0, 8)}...
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  {pickup.foodName}
                </h3>

                {/* Route Information */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">Donor: {pickup.providerOrganizationName || pickup.providerName || 'Food Provider'}</span>
                      <p className="text-slate-500 text-[11px]">{pickup.providerAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2 border-t border-slate-200/60">
                    <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">Destination: {pickup.receiverOrganizationName || pickup.receiverName || 'NGO Partner'}</span>
                      <p className="text-slate-500 text-[11px]">{pickup.receiverAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>Quantity: <strong className="text-slate-900">{pickup.quantity} {pickup.unit}</strong></div>
                  <div>Volunteer: <strong className="text-slate-900">{pickup.volunteerName || 'Unassigned'}</strong></div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                {pickup.status === 'ASSIGNED' && (
                  <button
                    onClick={() => handleUpdateStatus(pickup.id, 'EN_ROUTE')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                  >
                    Start Trip (En Route)
                  </button>
                )}

                {pickup.status === 'EN_ROUTE' && (
                  <button
                    onClick={() => handleUpdateStatus(pickup.id, 'ARRIVED')}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition"
                  >
                    Mark Arrived at Donor
                  </button>
                )}

                {pickup.status === 'ARRIVED' && (
                  <button
                    onClick={() => {
                      setActivePickupForOtp(pickup);
                      setOtpType('PICKUP');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#087B46] text-white text-xs font-bold hover:bg-[#066538] transition flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Verify Pickup OTP</span>
                  </button>
                )}

                {pickup.status === 'COLLECTED' && (
                  <button
                    onClick={() => {
                      setActivePickupForOtp(pickup);
                      setOtpType('DELIVERY');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify Delivery OTP</span>
                  </button>
                )}

                {pickup.status === 'DELIVERED' && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mission Completed</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OTP Verification Modal */}
      {activePickupForOtp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <KeyRound className="w-5 h-5 text-[#087B46]" />
              <h3 className="font-extrabold text-base">
                Verify {otpType === 'PICKUP' ? 'Donor Pickup OTP' : 'Recipient Delivery OTP'}
              </h3>
            </div>

            <p className="text-xs text-slate-500">
              {otpType === 'PICKUP'
                ? `Ask ${activePickupForOtp.providerOrganizationName || activePickupForOtp.providerName || 'Food Provider'} for the 6-digit handover OTP.`
                : `Ask ${activePickupForOtp.receiverOrganizationName || activePickupForOtp.receiverName || 'NGO Partner'} for the 6-digit delivery inspection OTP.`}
            </p>

            <input
              type="text"
              maxLength={6}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="e.g., 492015"
              className="w-full text-center text-xl font-mono tracking-widest px-3 py-2.5 rounded-xl border border-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-[#087B46]"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActivePickupForOtp(null);
                  setOtpInput('');
                }}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={otpInput.length < 4 || actionLoading}
                onClick={() =>
                  handleUpdateStatus(
                    activePickupForOtp.id,
                    otpType === 'PICKUP' ? 'COLLECTED' : 'DELIVERED',
                    otpInput
                  )
                }
                className="px-4 py-1.5 rounded-xl bg-[#087B46] hover:bg-[#066538] text-white text-xs font-bold disabled:opacity-50"
              >
                {actionLoading ? 'Verifying...' : 'Confirm Handover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
