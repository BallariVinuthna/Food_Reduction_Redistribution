import React, { useState, useEffect } from 'react';
import { FoodListing } from '../types';
import { api } from '../services/api';
import { ClaimFoodModal } from '../components/ClaimFoodModal';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Utensils,
  Heart,
  Users,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
} from 'lucide-react';

interface FindFoodPageProps {
  onNavigate: (tab: string) => void;
  initialQuery?: string;
}

export const FindFoodPage: React.FC<FindFoodPageProps> = ({ onNavigate, initialQuery = '' }) => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [selectedClaimListing, setSelectedClaimListing] = useState<FoodListing | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'COOKED_MEALS', label: 'Cooked Meals' },
    { id: 'BAKERY_BREAD', label: 'Bakery & Bread' },
    { id: 'PACKAGED_GROCERIES', label: 'Packaged Groceries' },
    { id: 'FRESH_PRODUCE', label: 'Fresh Produce' },
  ];

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await api.getAllListings();
      setListings(data);
    } catch {
      // Fallback
      const active = await api.getActiveSurplus();
      setListings(active);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const filtered = listings.filter((l) => {
    if (l.status !== 'AVAILABLE' && l.status !== 'RESERVED') return false;
    if (vegOnly && !l.vegetarian) return false;
    if (selectedCategory !== 'ALL' && l.foodCategory !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = l.foodName.toLowerCase().includes(q);
      const matchOrg = l.providerOrganizationName.toLowerCase().includes(q);
      const matchLoc = l.address.toLowerCase().includes(q);
      return matchName || matchOrg || matchLoc;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#087B46] uppercase tracking-wider">
            Live Surplus Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Find Edible Food Near You
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Inspect real-time surplus donations across Hyderabad, verify safe holding times, and claim for your community.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create-donation')}
          className="px-5 py-2.5 rounded-2xl bg-[#087B46] hover:bg-[#066538] text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all flex items-center gap-2 self-start md:self-center shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#8BE34B]" />
          <span>Donate Surplus Food</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by dish or locality..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#087B46]/20 focus:border-[#087B46]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#087B46] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Veg Only Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              vegOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>100% Veg</span>
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#087B46]" />
          <p className="text-xs font-medium">Loading verified surplus food...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#087B46] flex items-center justify-center mx-auto">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">No surplus matching your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search or check back soon as restaurants and event halls publish new edible surplus batches.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('ALL');
              setVegOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                <img
                  src={listing.photoUrl || '/assets/veg_biryani.jpg'}
                  alt={listing.foodName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                  {listing.vegetarian ? '🌱 Pure Veg' : '🍗 Non-Veg'}
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#087B46] text-white text-[10px] font-bold shadow-xs">
                  {listing.status}
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-1">
                    {listing.foodName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {listing.providerOrganizationName}
                  </p>

                  <div className="space-y-1.5 pt-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{listing.remainingQuantity || listing.quantity} {listing.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{listing.availableMinutesRemaining || 90}m safe window</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{listing.address}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-400">
                    Remaining: <strong className="text-slate-800">{listing.remainingQuantity || listing.quantity}</strong>
                  </span>
                  <button
                    onClick={() => setSelectedClaimListing(listing)}
                    disabled={listing.remainingQuantity !== undefined && listing.remainingQuantity <= 0}
                    className="px-4 py-1.5 rounded-xl bg-[#087B46] hover:bg-[#066538] text-white text-xs font-bold transition-all disabled:opacity-40"
                  >
                    Claim Food
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
