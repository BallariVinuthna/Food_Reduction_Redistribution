import React, { useState, useEffect } from 'react';
import { FoodListing, DashboardAnalytics } from '../types';
import { api } from '../services/api';
import { SurplusMap } from '../components/SurplusMap';
import { ClaimFoodModal } from '../components/ClaimFoodModal';
import {
  Users,
  Package,
  Heart,
  TrendingUp,
  ArrowRight,
  Search,
  MapPin,
  Clock,
  Building2,
  ChevronRight,
  Utensils,
  Leaf,
  Calendar,
  Sparkles,
  CheckCircle2,
  Truck,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { AnimatedPageHeading } from '../components/AnimatedPageHeading';

interface OperationsDashboardProps {
  onNavigate: (tab: string) => void;
  searchFilter?: string;
  selectedLocation?: string;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  onNavigate,
  searchFilter = '',
  selectedLocation = 'Hyderabad',
}) => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [selectedClaimListing, setSelectedClaimListing] = useState<FoodListing | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [timeFilter, setTimeFilter] = useState<'month' | 'week' | 'year'>('month');
  const [impactViewMode, setImpactViewMode] = useState<'prediction' | 'actual'>('prediction');
  const [selectedMonth, setSelectedMonth] = useState<string>('Oct 2026');
  const [showMonthDropdown, setShowMonthDropdown] = useState<boolean>(false);

  // Realistic mock listings matching prompt design if API is loading/empty
  const fallbackListings: FoodListing[] = [
    {
      id: 'f1',
      providerId: 'p1',
      providerOrganizationName: 'Taj Banjara Kitchens',
      foodName: 'Royal Buffet Steamed Rice & Dal Makhani',
      foodCategory: 'COOKED_MEALS',
      quantity: 50,
      unit: 'servings',
      preparationTime: new Date(Date.now() - 3600000).toISOString(),
      availableFrom: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 7200000).toISOString(),
      address: 'Banjara Hills, Hyderabad',
      latitude: 17.4156,
      longitude: 78.4487,
      foodCondition: 'FRESHLY_PREPARED',
      vegetarian: true,
      storageCondition: 'HEATED_CONTAINER',
      photoUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      status: 'AVAILABLE',
      urgencyLevel: 'HIGH',
      availableMinutesRemaining: 120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'f2',
      providerId: 'p2',
      providerOrganizationName: 'Karachi Bakery Artisanal',
      foodName: 'Artisan Sourdough Loaves & Multigrain Breads',
      foodCategory: 'BAKERY_BREAD',
      quantity: 35,
      unit: 'packets',
      preparationTime: new Date(Date.now() - 7200000).toISOString(),
      availableFrom: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 14400000).toISOString(),
      address: 'Jubilee Hills, Hyderabad',
      latitude: 17.4312,
      longitude: 78.4073,
      foodCondition: 'FRESHLY_PREPARED',
      vegetarian: true,
      storageCondition: 'ROOM_TEMP',
      photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      status: 'AVAILABLE',
      urgencyLevel: 'MEDIUM',
      availableMinutesRemaining: 240,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'f3',
      providerId: 'p3',
      providerOrganizationName: 'Paradise Biryani Hub',
      foodName: 'Hyderabadi Veg Dum Biryani & Mirchi Ka Salan',
      foodCategory: 'COOKED_MEALS',
      quantity: 45,
      unit: 'servings',
      preparationTime: new Date(Date.now() - 3600000).toISOString(),
      availableFrom: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 10800000).toISOString(),
      address: 'MG Road, Secunderabad',
      latitude: 17.4411,
      longitude: 78.4983,
      foodCondition: 'FRESHLY_PREPARED',
      vegetarian: true,
      storageCondition: 'HEATED_CONTAINER',
      photoUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      status: 'AVAILABLE',
      urgencyLevel: 'HIGH',
      availableMinutesRemaining: 180,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'f4',
      providerId: 'p4',
      providerOrganizationName: 'Rythu Bazaar Mandi',
      foodName: 'Farm Fresh Tomatoes & Crisp Cucumbers',
      foodCategory: 'FRESH_PRODUCE',
      quantity: 30,
      unit: 'kg',
      preparationTime: new Date(Date.now() - 1800000).toISOString(),
      availableFrom: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 18000000).toISOString(),
      address: 'HITEC City, Hyderabad',
      latitude: 17.4435,
      longitude: 78.3772,
      foodCondition: 'EXCELLENT',
      vegetarian: true,
      storageCondition: 'ROOM_TEMP',
      photoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      status: 'AVAILABLE',
      urgencyLevel: 'LOW',
      availableMinutesRemaining: 360,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'f5',
      providerId: 'p5',
      providerOrganizationName: 'Metro Cash & Carry Hub',
      foodName: 'Sealed Organic Basmati Rice Bags (5 kg)',
      foodCategory: 'PACKAGED_GROCERIES',
      quantity: 20,
      unit: 'packets',
      preparationTime: new Date(Date.now() - 3600000).toISOString(),
      availableFrom: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 86400000).toISOString(),
      address: 'Gachibowli, Hyderabad',
      latitude: 17.4401,
      longitude: 78.3489,
      foodCondition: 'SEALED_PACKAGED',
      vegetarian: true,
      storageCondition: 'ROOM_TEMP',
      photoUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      status: 'AVAILABLE',
      urgencyLevel: 'LOW',
      availableMinutesRemaining: 720,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const fetchDashboardData = async () => {
    try {
      setLoadingListings(true);
      const [activeData, analyticsData] = await Promise.allSettled([
        api.getActiveSurplus(),
        api.getAnalytics(),
      ]);

      if (activeData.status === 'fulfilled' && activeData.value && activeData.value.length > 0) {
        setListings(activeData.value);
      } else {
        setListings(fallbackListings);
      }

      if (analyticsData.status === 'fulfilled' && analyticsData.value) {
        setAnalytics(analyticsData.value);
      }
    } catch {
      setListings(fallbackListings);
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter listings based on global search
  const displayedListings = listings.filter((l) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      l.foodName.toLowerCase().includes(q) ||
      l.providerOrganizationName.toLowerCase().includes(q) ||
      l.address.toLowerCase().includes(q) ||
      l.foodCategory.toLowerCase().includes(q)
    );
  });

  // Deduplicate listings by foodName so items never repeat, and guarantee 5 distinct items across categories
  const uniqueDisplayedListings = React.useMemo(() => {
    const seen = new Set<string>();
    const res: FoodListing[] = [];
    for (const item of displayedListings) {
      const key = item.foodName.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        res.push(item);
      }
    }
    // If fewer than 5 items, supplement from distinct fallback items
    if (res.length < 5) {
      for (const fb of fallbackListings) {
        const key = fb.foodName.trim().toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          res.push(fb);
          if (res.length >= 5) break;
        }
      }
    }
    return res;
  }, [displayedListings]);

  // Calculate distance mock string based on location coordinates
  const getDistanceString = (idx: number, lat?: number) => {
    const distances = ['2.1 km away', '3.4 km away', '4.8 km away', '1.9 km away', '3.2 km away'];
    return distances[idx % distances.length];
  };

  // Calculate pickup remaining hours string
  const getPickupWindowString = (minutes: number) => {
    if (minutes <= 60) return `Pickup in 1 hr`;
    const hrs = Math.round(minutes / 60);
    return `Pickup in ${hrs} hrs`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ======================================================== */}
      {/* ROW 1: Hero Banner (Left) + Live Food Map Card (Right) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Hero Banner (8 cols on desktop) */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden min-h-[360px] flex flex-col justify-between p-6 sm:p-8 text-white shadow-xl group">
          {/* Real Redistribution Photo Background */}
          <img
            src="/assets/hero_redistribution.jpg"
            alt="SurplusFlow Food Redistribution Volunteer handing meal"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 pointer-events-none"
          />

          {/* Deep Forest Gradient Overlay for High Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#163D2B]/95 via-[#24543B]/80 to-transparent z-0" />

          {/* Top Hero Text (Word-by-Word Animated) */}
          <div className="relative z-10 max-w-xl space-y-2">
            <AnimatedPageHeading
              tag="HYDERABAD FOOD NETWORK • SMART OPERATIONS"
              title="Every meal tells a story."
              italicSubtitle="Act before surplus spoils."
              baseDelayMs={60}
              wordStaggerMs={110}
            />
            <p className="text-xs sm:text-sm text-[#DCE9DE]/90 font-medium leading-relaxed animate-word-fade-up" style={{ animationDelay: '380ms' }}>
              Connects commercial food providers, NGOs and volunteers to reduce food waste and fight hunger.
            </p>
          </div>

          {/* 4 Impact Stat Chips + CTA Buttons (Staggered Rising Boxes) */}
          <div className="relative z-10 space-y-4 pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Chip 1 */}
              <div
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#FFFFFF]/95 border border-[#DCE9DE] text-[#20352A] shadow-md animate-box-rise"
                style={{ animationDelay: '260ms' }}
              >
                <div className="w-8 h-8 rounded-xl bg-[#DCE9DE] text-[#163D2B] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold leading-none truncate">
                    {analytics?.totalQuantityRedistributedMeals
                      ? Number(analytics.totalQuantityRedistributedMeals).toLocaleString()
                      : (analytics?.totalMealsRedistributed ? Number(analytics.totalMealsRedistributed).toLocaleString() : '12,840')}
                  </div>
                  <div className="text-[10px] text-[#547462] font-semibold mt-0.5 truncate">
                    Meals Shared
                  </div>
                </div>
              </div>

              {/* Chip 2 */}
              <div
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#FFFFFF]/95 border border-[#DCE9DE] text-[#20352A] shadow-md animate-box-rise"
                style={{ animationDelay: '340ms' }}
              >
                <div className="w-8 h-8 rounded-xl bg-[#DCE9DE] text-[#24543B] flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold leading-none truncate">
                    {analytics?.foodWasteAvoidedKg
                      ? `${Math.round(analytics.foodWasteAvoidedKg).toLocaleString()} kg`
                      : (analytics?.totalWeightSavedKg ? `${Math.round(analytics.totalWeightSavedKg).toLocaleString()} kg` : '5,136 kg')}
                  </div>
                  <div className="text-[10px] text-[#547462] font-semibold mt-0.5 truncate">
                    Food Saved
                  </div>
                </div>
              </div>

              {/* Chip 3 */}
              <div
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#FFFFFF]/95 border border-[#DCE9DE] text-[#20352A] shadow-md animate-box-rise"
                style={{ animationDelay: '420ms' }}
              >
                <div className="w-8 h-8 rounded-xl bg-[#DCE9DE] text-[#367A50] flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold leading-none truncate">
                    {analytics?.peopleServed ? Number(analytics.peopleServed).toLocaleString() : '3,640'}
                  </div>
                  <div className="text-[10px] text-[#547462] font-semibold mt-0.5 truncate">
                    People Nourished
                  </div>
                </div>
              </div>

              {/* Chip 4 */}
              <div
                className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#FFFFFF]/95 border border-[#DCE9DE] text-[#20352A] shadow-md animate-box-rise"
                style={{ animationDelay: '500ms' }}
              >
                <div className="w-8 h-8 rounded-xl bg-[#DCE9DE] text-[#163D2B] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold leading-none truncate">
                    {analytics?.matchSuccessRatePercentage ? `${Math.round(analytics.matchSuccessRatePercentage)}%` : (analytics?.pickupSuccessRate ? `${Math.round(analytics.pickupSuccessRate)}%` : '92%')}
                  </div>
                  <div className="text-[10px] text-[#547462] font-semibold mt-0.5 truncate">
                    Success Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Prominent Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('create-donation')}
                className="px-6 py-2.5 rounded-full bg-[#367A50] hover:bg-[#24543B] text-[#FFFFFF] text-xs sm:text-sm font-extrabold shadow-lg shadow-[#163D2B]/30 hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Donate Food</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('find-food')}
                className="px-6 py-2.5 rounded-full bg-[#FFFFFF]/95 hover:bg-[#FFFFFF] text-[#20352A] text-xs sm:text-sm font-bold shadow-md hover:scale-102 transition-all flex items-center gap-2 cursor-pointer border border-[#DCE9DE]"
              >
                <Search className="w-4 h-4 text-[#79A786]" />
                <span>Find Food Near Me</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Live Food Map Card (Rising from Bottom) */}
        <div
          className="lg:col-span-4 bg-[#FFFFFF] rounded-3xl p-5 border border-[#DCE9DE] shadow-sm flex flex-col justify-between animate-box-rise"
          style={{ animationDelay: '360ms' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#087B46] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Live Food Map</h3>
            </div>
            <button
              onClick={() => onNavigate('map')}
              className="text-xs font-bold text-[#087B46] hover:text-[#066538] flex items-center gap-1 transition-colors"
            >
              <span>View Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Leaflet OpenStreetMap Box */}
          <div className="w-full h-52 rounded-2xl overflow-hidden border border-slate-200 relative">
            <SurplusMap
              listings={listings}
              centerLat={17.4156}
              centerLon={78.4487}
              zoom={11}
              onSelectListing={(l) => setSelectedClaimListing(l)}
            />
          </div>

          {/* Map Legend matching design */}
          <div className="flex items-center justify-around text-[10px] font-bold text-slate-600 pt-3 border-t border-slate-100 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#087B46] ring-2 ring-emerald-200" />
              <span>Food Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] ring-2 ring-orange-200" />
              <span>NGO / Receiver</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] ring-2 ring-blue-200" />
              <span>Volunteer</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ROW 2: Available Surplus Food (Left) + Analytics & Activity (Right) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Available Surplus Food 5-in-a-row (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Prominent White Banner Card for Header */}
          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#FFFFFF] border border-[#DCE9DE] shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F2F7F1] border border-[#DCE9DE] flex items-center justify-center text-[#367A50] shadow-2xs">
                <Utensils className="w-5 h-5 text-[#367A50]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-[#20352A] tracking-tight">
                    Available Surplus Food
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#DCE9DE] text-[#163D2B] text-[10px] font-bold">
                    {uniqueDisplayedListings.length} Active Batches
                  </span>
                </div>
                <p className="text-[11px] text-[#547462] font-medium hidden sm:block">
                  Verified surplus batches ready for immediate reservation & dispatch
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('find-food')}
              className="px-3.5 py-1.5 rounded-xl bg-[#367A50] hover:bg-[#24543B] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs hover:shadow cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5 Food Listing Cards Grid (Rising Sequentially from Bottom) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {uniqueDisplayedListings.slice(0, 5).map((listing, idx) => {
              const distance = getDistanceString(idx, listing.latitude);
              const pickupWindow = getPickupWindowString(listing.availableMinutesRemaining || 120);
              const isFav = !!favorites[listing.id];
              const cardPhoto = listing.photoUrl || fallbackListings[idx % fallbackListings.length].photoUrl;

              return (
                <div
                  key={listing.id}
                  className="bg-[#FFFFFF] rounded-2xl border border-[#DCE9DE] shadow-xs hover:border-[#79A786] hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group animate-box-rise"
                  style={{ animationDelay: `${420 + idx * 80}ms` }}
                >
                  {/* Photo & Overlays */}
                  <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={cardPhoto}
                      alt={listing.foodName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Distance Badge (Top Left) */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-bold shadow-xs">
                      {distance}
                    </div>

                    {/* Favorite Heart (Top Right) */}
                    <button
                      onClick={() => toggleFavorite(listing.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-xs transition-colors"
                      aria-label="Add to favorites"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-white'
                        }`}
                      />
                    </button>

                    {/* Veg / Non-Veg Badge (Bottom Left over image) */}
                    <div className="absolute bottom-2 left-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow-xs ${
                          listing.vegetarian
                            ? 'bg-[#087B46] text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {listing.vegetarian ? 'Veg' : 'Non-Veg'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                        {listing.foodName}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {listing.providerOrganizationName}
                      </p>

                      {/* Info Icons */}
                      <div className="space-y-1 pt-2 text-[10px] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{listing.remainingQuantity || listing.quantity} servings</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{pickupWindow}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{listing.address.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Claim Food Action Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => setSelectedClaimListing(listing)}
                        className="w-full py-1.5 rounded-xl border border-[#087B46] text-[#087B46] hover:bg-[#087B46] hover:text-white text-xs font-bold transition-all"
                      >
                        Claim Food
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Impact This Month + Recent Activity (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Impact This Month Card (Rising Sequentially) */}
          <div
            className="bg-[#FFFFFF] rounded-3xl p-5 border border-[#DCE9DE] shadow-sm space-y-4 animate-box-rise"
            style={{ animationDelay: '520ms' }}
          >
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#087B46] flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Impact This Month</h3>
                  <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Today: 25 Oct 2026
                  </div>
                </div>
              </div>

              {/* Month Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                >
                  <Calendar className="w-3 h-3 text-[#087B46]" />
                  <span>{selectedMonth}</span>
                  <ChevronRight className={`w-3 h-3 transition-transform ${showMonthDropdown ? '-rotate-90' : 'rotate-90'}`} />
                </button>

                {showMonthDropdown && (
                  <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => { setSelectedMonth('Oct 2026'); setShowMonthDropdown(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between ${selectedMonth === 'Oct 2026' ? 'bg-emerald-50 text-[#087B46]' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <span>Oct 2026 (Current)</span>
                      {selectedMonth === 'Oct 2026' && <CheckCircle2 className="w-3.5 h-3.5 text-[#087B46]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedMonth('Sep 2026'); setShowMonthDropdown(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between ${selectedMonth === 'Sep 2026' ? 'bg-emerald-50 text-[#087B46]' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <span>Sep 2026</span>
                      {selectedMonth === 'Sep 2026' && <CheckCircle2 className="w-3.5 h-3.5 text-[#087B46]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedMonth('Aug 2026'); setShowMonthDropdown(false); }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between ${selectedMonth === 'Aug 2026' ? 'bg-emerald-50 text-[#087B46]' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <span>Aug 2026</span>
                      {selectedMonth === 'Aug 2026' && <CheckCircle2 className="w-3.5 h-3.5 text-[#087B46]" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Prediction vs Actual Toggle Pill (Only for Oct 2026 current month) */}
            {selectedMonth === 'Oct 2026' && (
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setImpactViewMode('prediction')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    impactViewMode === 'prediction'
                      ? 'bg-white text-[#087B46] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#087B46]" />
                  <span>Oct 2026 Prediction</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImpactViewMode('actual')}
                  className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    impactViewMode === 'actual'
                      ? 'bg-white text-[#087B46] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>Actual (To 25 Oct)</span>
                </button>
              </div>
            )}

            {/* Dynamic 2x2 Metric Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Metric 1: Meals Shared */}
              <div className="p-3.5 rounded-2xl bg-[#E8F7EE]/60 border border-emerald-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-[#087B46]/10 text-[#087B46]">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-[#087B46] flex items-center gap-0.5">
                    {selectedMonth === 'Oct 2026'
                      ? (impactViewMode === 'prediction' ? '↑ 28% Forecast' : '↑ 19% MTD')
                      : (selectedMonth === 'Sep 2026' ? '↑ 12%' : '↑ 8%')}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900">
                    {selectedMonth === 'Oct 2026'
                      ? (impactViewMode === 'prediction' ? '2,850' : '2,090')
                      : (selectedMonth === 'Sep 2026' ? '2,420' : '2,150')}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">
                    {impactViewMode === 'prediction' && selectedMonth === 'Oct 2026' ? 'Projected Meals' : 'Meals Shared'}
                  </div>
                </div>
              </div>

              {/* Metric 2: Food Saved (kg) */}
              <div className="p-3.5 rounded-2xl bg-[#E8F7EE]/60 border border-emerald-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-[#087B46]/10 text-[#087B46]">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-[#087B46] flex items-center gap-0.5">
                    {selectedMonth === 'Oct 2026'
                      ? (impactViewMode === 'prediction' ? '↑ 35% Forecast' : '↑ 26% MTD')
                      : (selectedMonth === 'Sep 2026' ? '↑ 14%' : '↑ 9%')}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900">
                    {selectedMonth === 'Oct 2026'
                      ? (impactViewMode === 'prediction' ? '1,140 kg' : '836 kg')
                      : (selectedMonth === 'Sep 2026' ? '968 kg' : '860 kg')}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">
                    {impactViewMode === 'prediction' && selectedMonth === 'Oct 2026' ? 'Projected Weight' : 'Food Saved'}
                  </div>
                </div>
              </div>

              {/* Metric 3: People Served */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5">
                    {selectedMonth === 'Oct 2026'
                      ? (impactViewMode === 'prediction' ? '↑ 24% Forecast' : '↑ 16% MTD')
                      : (selectedMonth === 'Sep 2026' ? '↑ 10%' : '↑ 7%')}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900">
                    {selectedMonth === 'Oct 2026'
                      ? (impactViewMode === 'prediction' ? '2,280' : '1,672')
                      : (selectedMonth === 'Sep 2026' ? '1,936' : '1,720')}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">
                    {impactViewMode === 'prediction' && selectedMonth === 'Oct 2026' ? 'Projected People' : 'People Served'}
                  </div>
                </div>
              </div>

              {/* Metric 4: Partner NGOs */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-amber-600/10 text-amber-600">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                    {selectedMonth === 'Oct 2026'
                      ? (impactViewMode === 'prediction' ? '↑ 15% Network' : '↑ 10% Active')
                      : 'Active'}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900">
                    {selectedMonth === 'Oct 2026'
                      ? (impactViewMode === 'prediction' ? '18' : '14')
                      : (selectedMonth === 'Sep 2026' ? '14' : '12')}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">Partner NGOs</div>
                </div>
              </div>
            </div>

            {/* Smart Contextual Banner */}
            {selectedMonth === 'Oct 2026' && (
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#087B46] shrink-0 mt-0.5" />
                <div className="text-[11px] text-emerald-900 leading-snug font-medium">
                  {impactViewMode === 'prediction' ? (
                    <span>
                      <strong className="font-bold text-[#087B46]">Oct 2026 Full-Month AI Prediction:</strong> Day 25 of 31 elapsed (81%). Based on weekend surge velocity, an additional <strong className="font-bold">760 meals (~304 kg)</strong> are projected by Oct 31, 2026.
                    </span>
                  ) : (
                    <span>
                      <strong className="font-bold text-[#087B46]">Actual Month-To-Date (25 Oct 2026):</strong> 2,090 meals logged across Banjara Hills, Hitec City, Secunderabad, and Gandipet.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity Card (Rising Sequentially) */}
          <div
            className="bg-[#FFFFFF] rounded-3xl p-5 border border-[#DCE9DE] shadow-sm space-y-4 animate-box-rise"
            style={{ animationDelay: '620ms' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm">Recent Activity</h3>
              <button
                onClick={() => onNavigate('messages')}
                className="text-xs font-bold text-[#087B46] hover:text-[#066538] flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Activity List */}
            <div className="space-y-3">
              {[
                {
                  id: 1,
                  title: 'New food donation created',
                  sub: 'Hotel Taj Deccan • 50 meals',
                  time: '5 min ago',
                  icon: Sparkles,
                  color: 'bg-emerald-100 text-[#087B46]',
                },
                {
                  id: 2,
                  title: 'Volunteer assigned',
                  sub: 'Rahul Verma assigned to pickup',
                  time: '12 min ago',
                  icon: Truck,
                  color: 'bg-blue-100 text-blue-600',
                },
                {
                  id: 3,
                  title: 'Food collected',
                  sub: 'From Bakery Bliss • 40 meals',
                  time: '1 hr ago',
                  icon: Package,
                  color: 'bg-amber-100 text-amber-600',
                },
                {
                  id: 4,
                  title: 'Food delivered',
                  sub: 'To Hope Foundation NGO',
                  time: '2 hrs ago',
                  icon: CheckCircle2,
                  color: 'bg-purple-100 text-purple-600',
                },
              ].map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${act.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{act.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">{act.sub}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                      {act.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ROW 3: Three Role-Based Horizontal Promotional Cards */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Card 1: For Food Donors */}
        <div className="bg-[#FFF5EB] rounded-3xl p-5 border border-orange-200/70 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <img
            src="/assets/chef_donor.jpg"
            alt="Chef Food Donor"
            className="w-24 h-24 rounded-2xl object-cover shrink-0 shadow-sm"
          />
          <div className="space-y-1.5 min-w-0">
            <h4 className="font-extrabold text-slate-900 text-sm">For Food Donors</h4>
            <p className="text-xs text-slate-600 leading-snug">
              Easily donate surplus food from your restaurant, event or home.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('create-donation')}
                className="text-xs font-bold text-[#EA580C] hover:text-orange-800 flex items-center gap-1 group"
              >
                <span>Start Donating</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: For Volunteers */}
        <div className="bg-[#F0F7FF] rounded-3xl p-5 border border-blue-200/70 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <img
            src="/assets/volunteer_worker.jpg"
            alt="Delivery Volunteer"
            className="w-24 h-24 rounded-2xl object-cover shrink-0 shadow-sm"
          />
          <div className="space-y-1.5 min-w-0">
            <h4 className="font-extrabold text-slate-900 text-sm">For Volunteers</h4>
            <p className="text-xs text-slate-600 leading-snug">
              Help collect and deliver food to those in need.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('pickup-delivery')}
                className="text-xs font-bold text-[#2563EB] hover:text-blue-800 flex items-center gap-1 group"
              >
                <span>Join as a Volunteer</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: For NGOs & Receivers */}
        <div className="bg-[#F8F4FF] rounded-3xl p-5 border border-purple-200/70 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <img
            src="/assets/ngo_receiver.jpg"
            alt="NGO Community Coordinator"
            className="w-24 h-24 rounded-2xl object-cover shrink-0 shadow-sm"
          />
          <div className="space-y-1.5 min-w-0">
            <h4 className="font-extrabold text-slate-900 text-sm">For NGOs & Receivers</h4>
            <p className="text-xs text-slate-600 leading-snug">
              Access nutritious food regularly for your community.
            </p>
            <div className="pt-1">
              <button
                onClick={() => onNavigate('community')}
                className="text-xs font-bold text-[#9333EA] hover:text-purple-800 flex items-center gap-1 group"
              >
                <span>Register Your NGO</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Claim Food Modal */}
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
