import React, { useState } from 'react';
import { FoodListing } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Utensils,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
  LogIn,
} from 'lucide-react';

interface ClaimFoodModalProps {
  listing: FoodListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (claimedListing: FoodListing) => void;
}

export const ClaimFoodModal: React.FC<ClaimFoodModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !listing) return null;

  const { switchDemoRole } = useAuth();
  const [quantity, setQuantity] = useState<number>(listing.remainingQuantity || listing.quantity || 10);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any | null>(null);

  const maxClaimable = listing.remainingQuantity !== undefined ? listing.remainingQuantity : listing.quantity;

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      setError('Please specify a positive quantity to claim.');
      return;
    }
    if (quantity > maxClaimable) {
      setError(`Cannot claim more than remaining available quantity (${maxClaimable} ${listing.unit}).`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.claimListing(listing.id, {
        quantity,
        notes: notes.trim() || undefined,
      });

      setSuccessResult(result);

      // Create updated listing object
      const updated: FoodListing = {
        ...listing,
        remainingQuantity: Math.max(0, maxClaimable - quantity),
        status: maxClaimable - quantity <= 0 ? 'RESERVED' : 'AVAILABLE',
      };

      setTimeout(() => {
        onSuccess(updated);
        handleClose();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Failed to claim food listing.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccessResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#032C20] to-[#087B46] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-[#8BE34B]">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Claim Surplus Food</h3>
              <p className="text-xs text-emerald-200/80">Coordinated via Real-Time Multicriteria Matching</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Success Banner */}
          {successResult && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2 animate-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Food Successfully Claimed!</span>
              </div>
              <p>
                A volunteer has been assigned. You will be able to verify safe delivery using the generated OTP upon arrival.
              </p>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
              {error.toLowerCase().includes('authentication') && (
                <button
                  type="button"
                  onClick={async () => {
                    setError(null);
                    setLoading(true);
                    try {
                      await switchDemoRole('NGO_RECEIVER');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold bg-[#087B46] hover:bg-[#066337] text-white rounded-lg flex items-center gap-1.5 transition whitespace-nowrap shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In as NGO</span>
                </button>
              )}
            </div>
          )}

          {/* Listing Card Preview */}
          <div className="flex gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <img
              src={listing.photoUrl || '/assets/veg_biryani.jpg'}
              alt={listing.foodName}
              className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200 shadow-xs"
            />
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  listing.vegetarian ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {listing.vegetarian ? '🌱 Veg' : '🍗 Non-Veg'}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  {listing.foodCategory.replace('_', ' ')}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm truncate">{listing.foodName}</h4>
              <p className="text-xs text-slate-600 flex items-center gap-1 truncate">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{listing.providerOrganizationName}</span>
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{listing.address}</span>
              </p>
            </div>
          </div>

          {/* Claim Form */}
          {!successResult && (
            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Available Portion
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
                    {maxClaimable} {listing.unit}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quantity to Claim *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={maxClaimable}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087B46]/20 focus:border-[#087B46]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Community Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Prepared for shelter evening meal distribution at Mehdipatnam center..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087B46]/20 focus:border-[#087B46]"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#087B46] shrink-0 mt-0.5" />
                <span>
                  <strong>Safe Redistribution Protocol:</strong> Handover is protected with double-entry OTP verification to prevent unauthorized diversion and track public health safety.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || maxClaimable <= 0}
                  className="px-5 py-2 rounded-xl bg-[#087B46] hover:bg-[#066538] text-white text-xs font-bold shadow-md shadow-emerald-900/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#8BE34B]" />
                  <span>{loading ? 'Reserving...' : `Confirm Claim (${quantity} ${listing.unit})`}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
