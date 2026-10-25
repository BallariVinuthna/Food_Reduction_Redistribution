import React, { useState, useEffect } from 'react';
import { FoodListing } from '../types';
import { api } from '../services/api';
import { AnimatedPageHeading } from '../components/AnimatedPageHeading';
import {
  Package,
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react';

interface MyDonationsPageProps {
  onNavigate: (tab: string) => void;
}

export const MyDonationsPage: React.FC<MyDonationsPageProps> = ({ onNavigate }) => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyDonations = async () => {
    setLoading(true);
    try {
      const data = await api.getAllListings();
      setListings(data);
    } catch {
      const active = await api.getActiveSurplus();
      setListings(active);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE9DE] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#367A50] uppercase tracking-wider">
            Provider Management
          </span>
          <AnimatedPageHeading
            text="My Surplus Food Donations"
            className="text-2xl sm:text-3xl font-extrabold text-[#20352A] mt-1"
          />
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review listed batches, track portions reserved by NGO receivers, and monitor volunteer dispatch status.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create-donation')}
          className="px-5 py-2.5 rounded-2xl bg-[#367A50] hover:bg-[#24543B] text-white text-xs font-bold shadow-md shadow-[#163D2B]/20 transition-all flex items-center gap-2 self-start md:self-center shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#DCE9DE]" />
          <span>New Surplus Batch</span>
        </button>
      </div>

      {/* Donations Table */}
      <div
        className="bg-white rounded-3xl border border-[#DCE9DE] shadow-sm overflow-hidden animate-box-rise"
        style={{ animationDelay: '280ms' }}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">Donation History & Allocations</h3>
          <button
            onClick={fetchMyDonations}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#087B46]" />
            <p className="text-xs font-medium">Loading donation records...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#087B46] flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">No food donations listed yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When your kitchen has surplus prepared food or bakery items, publish them to save food waste.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Food Item</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Total Qty</th>
                  <th className="px-5 py-3.5">Remaining</th>
                  <th className="px-5 py-3.5">Expiry Window</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={l.photoUrl || '/assets/veg_biryani.jpg'}
                        alt={l.foodName}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div>{l.foodName}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{l.address.split(',')[0]}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {l.foodCategory.replace('_', ' ')}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {l.quantity} {l.unit}
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-700">
                      {l.remainingQuantity !== undefined ? l.remainingQuantity : l.quantity} {l.unit}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {l.availableMinutesRemaining || 90} mins
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        l.status === 'AVAILABLE'
                          ? 'bg-emerald-100 text-[#087B46]'
                          : l.status === 'RESERVED' || l.status === 'PICKUP_ASSIGNED'
                          ? 'bg-blue-100 text-blue-700'
                          : l.status === 'REDISTRIBUTED'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onNavigate('pickup-delivery')}
                        className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition"
                      >
                        View Pickup
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
