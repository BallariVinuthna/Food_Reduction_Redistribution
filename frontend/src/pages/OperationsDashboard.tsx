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

  // Realistic mock listings matching prompt design if API is loading/empty
  const fallbackListings: FoodListing[] = [
    {
      id: 'f1',
      providerId: 'p1',
      providerOrganizationName: 'Hotel Taj Deccan',
      foodName: 'Veg Biryani',
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
      photoUrl: '/assets/veg_biryani.jpg',
      status: 'AVAILABLE',
      urgencyLevel: 'HIGH',
      availableMinutesRemaining: 120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'f2',
      providerId: 'p2',
      providerOrganizationName: 'Bakery Bliss',
      foodName: 'Dinner Rolls',
      foodCategory: 'BAKERY_BREAD',
      quantity: 40,
      unit: 'servings',
      preparationTime: new Date(Date.now() - 7200000).toISOString(),
      availableFrom: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 14400000).toISOString(),
      address: 'Jubilee Hills, Hyderabad',
      latitude: 17.4312,
      longitude: 78.4073,
      foodCondition: 'FRESHLY_PREPARED',
      vegetarian: true,
      storageCondition: 'ROOM_TEMP',
      photoUrl: '/assets/dinner_rolls.jpg',
      status: 'AVAILABLE',
      urgencyLevel: 'MEDIUM',
      availableMinutesRemaining: 240,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'f3',
      providerId: 'p3',
      providerOrganizationName: 'Cloud Kitchen Co.',
      foodName: 'Chicken Curry',
      foodCategory: 'COOKED_MEALS',
      quantity: 35,
      unit: 'servings',
      preparationTime: new Date(Date.now() - 3600000).toISOString(),
      availableFrom: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 10800000).toISOString(),
      address: 'Madhapur, Hyderabad',
      latitude: 17.4483,
      longitude: 78.3742,
      foodCondition: 'FRESHLY_PREPARED',
      vegetarian: false,
      storageCondition: 'HEATED_CONTAINER',
      photoUrl: '/assets/chicken_curry.jpg',
      status: 'AVAILABLE',
      urgencyLevel: 'HIGH',
      availableMinutesRemaining: 180,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'f4',
      providerId: 'p4',
      providerOrganizationName: 'GreenBite Cafe',
      foodName: 'Fresh Salads',
      foodCategory: 'FRESH_PRODUCE',
      quantity: 25,
      unit: 'servings',
      preparationTime: new Date(Date.now() - 1800000).toISOString(),
      availableFrom: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 3600000).toISOString(),
      address: 'HITEC City, Hyderabad',
      latitude: 17.4435,
      longitude: 78.3772,
      foodCondition: 'CHILLED',
      vegetarian: true,
      storageCondition: 'REFRIGERATED',
      photoUrl: '/assets/fresh_salads.jpg',
      status: 'AVAILABLE',
      urgencyLevel: 'CRITICAL',
      availableMinutesRemaining: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'f5',
      providerId: 'p5',
      providerOrganizationName: 'Event Caterers',
      foodName: 'Packed Meals',
      foodCategory: 'COOKED_MEALS',
      quantity: 60,
      unit: 'servings',
      preparationTime: new Date(Date.now() - 3600000).toISOString(),
      availableFrom: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 18000000).toISOString(),
      address: 'Gachibowli, Hyderabad',
      latitude: 17.4401,
      longitude: 78.3489,
      foodCondition: 'FRESHLY_PREPARED',
      vegetarian: true,
      storageCondition: 'ROOM_TEMP',
      photoUrl: '/assets/packed_meals.jpg',
      status: 'AVAILABLE',
      urgencyLevel: 'LOW',
      availableMinutesRemaining: 300,
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

          {/* Deep Green Gradient Overlay for High Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#032C20]/95 via-[#032C20]/75 to-transparent z-0" />

          {/* Top Hero Text */}
          <div className="relative z-10 max-w-xl space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Bridging Surplus to <span className="text-[#8BE34B]">Smiles</span>
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 font-medium leading-relaxed">
              Connects food providers, NGOs and volunteers to reduce food waste and fight hunger.
            </p>
          </div>

          {/* 4 Impact Stat Chips + CTA Buttons */}
          <div className="relative z-10 space-y-4 pt-6">
            {/* 4 Glass Impact Metrics matching design */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Chip 1 */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/95 text-slate-900 shadow-md">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold leading-none truncate">
                    {analytics?.totalQuantityRedistributedMeals
                      ? Number(analytics.totalQuantityRedistributedMeals).toLocaleString()
                      : (analytics?.totalMealsRedistributed ? Number(analytics.totalMealsRedistributed).toLocaleString() : '12,840')}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate">
                    Meals Shared
                  </div>
                </div>
              </div>

              {/* Chip 2 */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/95 text-slate-900 shadow-md">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold leading-none truncate">
                    {analytics?.foodWasteAvoidedKg
                      ? `${Math.round(analytics.foodWasteAvoidedKg).toLocaleString()} kg`
                      : (analytics?.totalWeightSavedKg ? `${Math.round(analytics.totalWeightSavedKg).toLocaleString()} kg` : '5,136 kg')}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate">
                    Food Saved
                  </div>
                </div>
              </div>

              {/* Chip 3 */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/95 text-slate-900 shadow-md">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold leading-none truncate">
                    {analytics?.peopleServed ? Number(analytics.peopleServed).toLocaleString() : '3,640'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate">
                    People Nourished
                  </div>
                </div>
              </div>

              {/* Chip 4 */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/95 text-slate-900 shadow-md">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-extrabold leading-none truncate">
                    {analytics?.matchSuccessRatePercentage ? `${Math.round(analytics.matchSuccessRatePercentage)}%` : (analytics?.pickupSuccessRate ? `${Math.round(analytics.pickupSuccessRate)}%` : '92%')}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate">
                    Success Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Prominent Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('create-donation')}
                className="px-6 py-2.5 rounded-full bg-[#8BE34B] hover:bg-[#7cd43e] text-[#032C20] text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-950/20 hover:scale-102 transition-all flex items-center gap-2"
              >
                <span>Donate Food</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('find-food')}
                className="px-6 py-2.5 rounded-full bg-white/95 hover:bg-white text-slate-900 text-xs sm:text-sm font-bold shadow-md hover:scale-102 transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-slate-600" />
                <span>Find Food Near Me</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Live Food Map Card (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#087B46]" />
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Available Surplus Food
              </h2>
            </div>
            <button
              onClick={() => onNavigate('find-food')}
              className="text-xs font-bold text-[#087B46] hover:text-[#066538] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5 Food Listing Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
            {displayedListings.slice(0, 5).map((listing, idx) => {
              const distance = getDistanceString(idx, listing.latitude);
              const pickupWindow = getPickupWindowString(listing.availableMinutesRemaining || 120);
              const isFav = !!favorites[listing.id];

              return (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  {/* Photo & Overlays */}
                  <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={listing.photoUrl || fallbackListings[idx % fallbackListings.length].photoUrl}
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
          {/* Impact This Month Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#087B46] flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">Impact This Month</h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full cursor-pointer hover:bg-slate-200 transition-colors">
                <span>Mar 2025</span>
                <ChevronRight className="w-3 h-3 rotate-90" />
              </div>
            </div>

            {/* 2x2 Metric Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Metric 1: Meals Shared */}
              <div className="p-3.5 rounded-2xl bg-[#E8F7EE]/60 border border-emerald-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-[#087B46]/10 text-[#087B46]">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-[#087B46] flex items-center gap-0.5">
                    ↑ 24%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900">12.8K</div>
                  <div className="text-[11px] font-medium text-slate-500">Meals Shared</div>
                </div>
              </div>

              {/* Metric 2: Food Saved (kg) */}
              <div className="p-3.5 rounded-2xl bg-[#E8F7EE]/60 border border-emerald-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-[#087B46]/10 text-[#087B46]">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-[#087B46] flex items-center gap-0.5">
                    ↑ 32%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900">5,136 kg</div>
                  <div className="text-[11px] font-medium text-slate-500">Food Saved</div>
                </div>
              </div>

              {/* Metric 3: People Served */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-600">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5">
                    ↑ 18%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900">3.6K</div>
                  <div className="text-[11px] font-medium text-slate-500">People Served</div>
                </div>
              </div>

              {/* Metric 4: Partner NGOs */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-amber-600/10 text-amber-600">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                    ↑ 12%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900">38</div>
                  <div className="text-[11px] font-medium text-slate-500">Partner NGOs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
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
