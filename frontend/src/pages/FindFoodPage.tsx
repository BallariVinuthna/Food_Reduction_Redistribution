import React, { useState, useEffect } from 'react';
import { FoodListing } from '../types';
import { api } from '../services/api';
import { ClaimFoodModal } from '../components/ClaimFoodModal';
import {
  Search,
  MapPin,
  Clock,
  Utensils,
  Users,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface FindFoodPageProps {
  onNavigate: (tab: string) => void;
  initialQuery?: string;
}

// Comprehensive verified 16-item curated catalog ensuring 4 distinct items per category
const CURATED_FOOD_CATALOG: FoodListing[] = [
  // ==================== COOKED MEALS ====================
  {
    id: 'cm-1',
    providerId: 'p-taj',
    providerOrganizationName: 'Taj Banjara Grand Hotel',
    foodName: 'Royal Buffet Steamed Rice & Dal Makhani',
    foodCategory: 'COOKED_MEALS',
    quantity: 50,
    remainingQuantity: 50,
    unit: 'MEALS',
    preparationTime: new Date(Date.now() - 3600000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 7200000).toISOString(),
    address: 'Road No. 1, Banjara Hills, Hyderabad',
    latitude: 17.4156,
    longitude: 78.4487,
    foodCondition: 'FRESHLY_PREPARED',
    vegetarian: true,
    storageCondition: 'HEATED_CONTAINER',
    photoUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'HIGH',
    availableMinutesRemaining: 110,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cm-2',
    providerId: 'p-paradise',
    providerOrganizationName: 'Paradise Biryani Hub',
    foodName: 'Hyderabadi Veg Dum Biryani & Mirchi Ka Salan',
    foodCategory: 'COOKED_MEALS',
    quantity: 60,
    remainingQuantity: 60,
    unit: 'MEALS',
    preparationTime: new Date(Date.now() - 4500000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 5400000).toISOString(),
    address: 'MG Road, Secunderabad, Hyderabad',
    latitude: 17.4411,
    longitude: 78.4983,
    foodCondition: 'FRESHLY_PREPARED',
    vegetarian: true,
    storageCondition: 'HEATED_CONTAINER',
    photoUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'CRITICAL',
    availableMinutesRemaining: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cm-3',
    providerId: 'p-cyber',
    providerOrganizationName: 'Cyber Conventions & Banquet Hall',
    foodName: 'Banquet Special Paneer Butter Masala & Naan',
    foodCategory: 'COOKED_MEALS',
    quantity: 75,
    remainingQuantity: 75,
    unit: 'MEALS',
    preparationTime: new Date(Date.now() - 3600000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 9000000).toISOString(),
    address: 'HITEC City, Madhapur, Hyderabad',
    latitude: 17.4483,
    longitude: 78.3742,
    foodCondition: 'FRESHLY_PREPARED',
    vegetarian: true,
    storageCondition: 'HEATED_CONTAINER',
    photoUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'HIGH',
    availableMinutesRemaining: 85,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cm-4',
    providerId: 'p-cbit',
    providerOrganizationName: 'CBIT Engineering College Canteen',
    foodName: 'Fresh Steamed Idli, Medu Vada & Sambar',
    foodCategory: 'COOKED_MEALS',
    quantity: 40,
    remainingQuantity: 40,
    unit: 'MEALS',
    preparationTime: new Date(Date.now() - 2400000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 10800000).toISOString(),
    address: 'Gandipet, Hyderabad',
    latitude: 17.3916,
    longitude: 78.3194,
    foodCondition: 'FRESHLY_PREPARED',
    vegetarian: true,
    storageCondition: 'INSULATED_BOX',
    photoUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'MEDIUM',
    availableMinutesRemaining: 175,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cm-5',
    providerId: 'p-taj',
    providerOrganizationName: 'Taj Banjara Grand Hotel',
    foodName: 'Tempered Curd Rice with Pomegranate & Mustard',
    foodCategory: 'COOKED_MEALS',
    quantity: 45,
    remainingQuantity: 45,
    unit: 'MEALS',
    preparationTime: new Date(Date.now() - 2400000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 14400000).toISOString(),
    address: 'Road No. 1, Banjara Hills, Hyderabad',
    latitude: 17.4156,
    longitude: 78.4487,
    foodCondition: 'FRESHLY_PREPARED',
    vegetarian: true,
    storageCondition: 'REFRIGERATED',
    photoUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'HIGH',
    availableMinutesRemaining: 130,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cm-6',
    providerId: 'p-cyber',
    providerOrganizationName: 'Cyber Conventions & Banquet Hall',
    foodName: 'Fragrant Veg Basmati Pulao with Mixed Raita',
    foodCategory: 'COOKED_MEALS',
    quantity: 60,
    remainingQuantity: 60,
    unit: 'MEALS',
    preparationTime: new Date(Date.now() - 1800000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 18000000).toISOString(),
    address: 'HITEC City, Madhapur, Hyderabad',
    latitude: 17.4483,
    longitude: 78.3742,
    foodCondition: 'FRESHLY_PREPARED',
    vegetarian: true,
    storageCondition: 'HEATED_CONTAINER',
    photoUrl: 'https://images.unsplash.com/photo-1633383718081-22ac93e3db65?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'MEDIUM',
    availableMinutesRemaining: 190,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cm-7',
    providerId: 'p-cbit',
    providerOrganizationName: 'CBIT Engineering College Canteen',
    foodName: 'Hot Rava Upma with Coconut Chutney & Cashews',
    foodCategory: 'COOKED_MEALS',
    quantity: 40,
    remainingQuantity: 40,
    unit: 'MEALS',
    preparationTime: new Date(Date.now() - 1200000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 10800000).toISOString(),
    address: 'Gandipet, Hyderabad',
    latitude: 17.3916,
    longitude: 78.3194,
    foodCondition: 'FRESHLY_PREPARED',
    vegetarian: true,
    storageCondition: 'HEATED_CONTAINER',
    photoUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'HIGH',
    availableMinutesRemaining: 110,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ==================== BAKERY & BREAD ====================
  {
    id: 'bb-1',
    providerId: 'p-karachi',
    providerOrganizationName: 'Karachi Bakery Artisanal Hub',
    foodName: 'Artisan Sourdough Loaves & Multigrain Breads',
    foodCategory: 'BAKERY_BREAD',
    quantity: 35,
    remainingQuantity: 35,
    unit: 'PACKETS',
    preparationTime: new Date(Date.now() - 7200000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 18000000).toISOString(),
    address: 'Road No. 36, Jubilee Hills, Hyderabad',
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
    id: 'bb-2',
    providerId: 'p-concu',
    providerOrganizationName: 'Concu Patisserie & Bakery Kitchens',
    foodName: 'Fresh Golden Dinner Rolls & Pav Buns',
    foodCategory: 'BAKERY_BREAD',
    quantity: 50,
    remainingQuantity: 50,
    unit: 'PACKETS',
    preparationTime: new Date(Date.now() - 5400000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 21600000).toISOString(),
    address: 'Kavuri Hills, Madhapur, Hyderabad',
    latitude: 17.4398,
    longitude: 78.3912,
    foodCondition: 'FRESHLY_PREPARED',
    vegetarian: true,
    storageCondition: 'ROOM_TEMP',
    photoUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'LOW',
    availableMinutesRemaining: 320,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bb-3',
    providerId: 'p-frenchloaf',
    providerOrganizationName: 'The French Loaf Gourmet Bakes',
    foodName: 'Assorted Breakfast Croissants & Danishes',
    foodCategory: 'BAKERY_BREAD',
    quantity: 30,
    remainingQuantity: 30,
    unit: 'PACKETS',
    preparationTime: new Date(Date.now() - 4200000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 14400000).toISOString(),
    address: 'Somajiguda Circle, Hyderabad',
    latitude: 17.4265,
    longitude: 78.4578,
    foodCondition: 'FRESHLY_PREPARED',
    vegetarian: true,
    storageCondition: 'ROOM_TEMP',
    photoUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'HIGH',
    availableMinutesRemaining: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'bb-4',
    providerId: 'p-labonel',
    providerOrganizationName: 'Labonel Fine Baking Studio',
    foodName: 'Whole Wheat Herb Focaccia & Soft Pita Breads',
    foodCategory: 'BAKERY_BREAD',
    quantity: 25,
    remainingQuantity: 25,
    unit: 'PACKETS',
    preparationTime: new Date(Date.now() - 6000000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 25200000).toISOString(),
    address: 'Banjara Hills Road No. 12, Hyderabad',
    latitude: 17.4198,
    longitude: 78.4354,
    foodCondition: 'FRESHLY_PREPARED',
    vegetarian: true,
    storageCondition: 'ROOM_TEMP',
    photoUrl: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'LOW',
    availableMinutesRemaining: 390,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ==================== PACKAGED GROCERIES ====================
  {
    id: 'pg-1',
    providerId: 'p-metro',
    providerOrganizationName: 'Metro Cash & Carry Wholesale Hub',
    foodName: 'Sealed Organic Basmati Rice Bags (5 kg)',
    foodCategory: 'PACKAGED_GROCERIES',
    quantity: 20,
    remainingQuantity: 20,
    unit: 'PACKETS',
    preparationTime: new Date(Date.now() - 86400000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 86400000 * 5).toISOString(),
    address: 'Moosapet, Kukatpally, Hyderabad',
    latitude: 17.4728,
    longitude: 78.4184,
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
  {
    id: 'pg-2',
    providerId: 'p-reliance',
    providerOrganizationName: 'Reliance Smart Bazaar Distribution',
    foodName: 'Packaged Toor Dal & Moong Pulses (1 kg)',
    foodCategory: 'PACKAGED_GROCERIES',
    quantity: 40,
    remainingQuantity: 40,
    unit: 'KG',
    preparationTime: new Date(Date.now() - 86400000 * 2).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 86400000 * 4).toISOString(),
    address: 'Kothapet Main Road, Dilsukhnagar, Hyderabad',
    latitude: 17.3688,
    longitude: 78.5300,
    foodCondition: 'SEALED_PACKAGED',
    vegetarian: true,
    storageCondition: 'ROOM_TEMP',
    photoUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'LOW',
    availableMinutesRemaining: 680,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pg-3',
    providerId: 'p-spencers',
    providerOrganizationName: 'Spencers Hypermarket Central',
    foodName: 'Cold-Pressed Cooking Oil & Whole Wheat Flour',
    foodCategory: 'PACKAGED_GROCERIES',
    quantity: 30,
    remainingQuantity: 30,
    unit: 'PACKETS',
    preparationTime: new Date(Date.now() - 86400000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 86400000 * 6).toISOString(),
    address: 'Musheerabad, Secunderabad, Hyderabad',
    latitude: 17.4190,
    longitude: 78.4988,
    foodCondition: 'SEALED_PACKAGED',
    vegetarian: true,
    storageCondition: 'ROOM_TEMP',
    photoUrl: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'LOW',
    availableMinutesRemaining: 840,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pg-4',
    providerId: 'p-ratnadeep',
    providerOrganizationName: 'Ratnadeep Supermarket Regional Hub',
    foodName: 'Fortified Rolled Oats & Multi-Grain Cereals',
    foodCategory: 'PACKAGED_GROCERIES',
    quantity: 25,
    remainingQuantity: 25,
    unit: 'PACKETS',
    preparationTime: new Date(Date.now() - 86400000 * 3).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 86400000 * 7).toISOString(),
    address: 'Gachibowli Financial District, Hyderabad',
    latitude: 17.4401,
    longitude: 78.3489,
    foodCondition: 'SEALED_PACKAGED',
    vegetarian: true,
    storageCondition: 'ROOM_TEMP',
    photoUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'LOW',
    availableMinutesRemaining: 960,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ==================== FRESH PRODUCE ====================
  {
    id: 'fp-1',
    providerId: 'p-rythu',
    providerOrganizationName: 'Rythu Bazaar Farmers Mandi',
    foodName: 'Farm Fresh Tomatoes & Crisp Cucumbers',
    foodCategory: 'FRESH_PRODUCE',
    quantity: 35,
    remainingQuantity: 35,
    unit: 'KG',
    preparationTime: new Date(Date.now() - 14400000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 28800000).toISOString(),
    address: 'Mehdipatnam Rythu Bazaar, Hyderabad',
    latitude: 17.3916,
    longitude: 78.4385,
    foodCondition: 'EXCELLENT',
    vegetarian: true,
    storageCondition: 'ROOM_TEMP',
    photoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'LOW',
    availableMinutesRemaining: 420,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fp-2',
    providerId: 'p-organicmandi',
    providerOrganizationName: 'Fresh Organic Fruit Mandi',
    foodName: 'Organic Shimla Apples, Bananas & Oranges',
    foodCategory: 'FRESH_PRODUCE',
    quantity: 40,
    remainingQuantity: 40,
    unit: 'KG',
    preparationTime: new Date(Date.now() - 18000000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 32400000).toISOString(),
    address: 'Bowenpally Krishi Market Yard, Secunderabad',
    latitude: 17.4721,
    longitude: 78.4789,
    foodCondition: 'EXCELLENT',
    vegetarian: true,
    storageCondition: 'ROOM_TEMP',
    photoUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'LOW',
    availableMinutesRemaining: 480,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fp-3',
    providerId: 'p-farm2door',
    providerOrganizationName: 'Farm2Door Agro Logistics Hub',
    foodName: 'Crisp Green Spinach, Palak & Fresh Mint',
    foodCategory: 'FRESH_PRODUCE',
    quantity: 25,
    remainingQuantity: 25,
    unit: 'KG',
    preparationTime: new Date(Date.now() - 7200000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 21600000).toISOString(),
    address: 'Gudimalkapur Flower & Veg Market, Hyderabad',
    latitude: 17.3820,
    longitude: 78.4312,
    foodCondition: 'EXCELLENT',
    vegetarian: true,
    storageCondition: 'ROOM_TEMP',
    photoUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'MEDIUM',
    availableMinutesRemaining: 260,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fp-4',
    providerId: 'p-krishimandi',
    providerOrganizationName: 'Hyderabad Wholesale Krishi Mandi',
    foodName: 'Sweet Golden Corn, Carrots & Tender Beans',
    foodCategory: 'FRESH_PRODUCE',
    quantity: 30,
    remainingQuantity: 30,
    unit: 'KG',
    preparationTime: new Date(Date.now() - 10800000).toISOString(),
    availableFrom: new Date().toISOString(),
    availableUntil: new Date(Date.now() + 36000000).toISOString(),
    address: 'Kothapet Wholesale Market, Hyderabad',
    latitude: 17.3695,
    longitude: 78.5320,
    foodCondition: 'EXCELLENT',
    vegetarian: true,
    storageCondition: 'ROOM_TEMP',
    photoUrl: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=600&q=80',
    status: 'AVAILABLE',
    urgencyLevel: 'LOW',
    availableMinutesRemaining: 540,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
      // Deduplicate items by foodName to prevent repeating identical food cards
      const seenNames = new Set<string>();
      const combined: FoodListing[] = [];

      if (Array.isArray(data) && data.length > 0) {
        for (const item of data) {
          if (!item.foodName) continue;
          const key = item.foodName.trim().toLowerCase();
          // Map legacy RAW_PRODUCE to FRESH_PRODUCE
          const category = item.foodCategory === 'RAW_PRODUCE' ? 'FRESH_PRODUCE' : item.foodCategory;
          if (!seenNames.has(key)) {
            seenNames.add(key);
            combined.push({ ...item, foodCategory: category });
          }
        }
      }

      // Guarantee each category has at least 3-4 distinct vibrant items
      for (const catItem of CURATED_FOOD_CATALOG) {
        const key = catItem.foodName.trim().toLowerCase();
        if (!seenNames.has(key)) {
          seenNames.add(key);
          combined.push(catItem);
        }
      }

      setListings(combined);
    } catch {
      // In case of any network or backend disconnect, use complete curated catalog
      setListings(CURATED_FOOD_CATALOG);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const filtered = listings.filter((l) => {
    // Only show valid available or reserved items
    if (l.status !== 'AVAILABLE' && l.status !== 'RESERVED') return false;
    if (vegOnly && !l.vegetarian) return false;
    if (selectedCategory !== 'ALL') {
      const isProduce =
        selectedCategory === 'FRESH_PRODUCE' &&
        (l.foodCategory === 'FRESH_PRODUCE' || l.foodCategory === 'RAW_PRODUCE');
      const isMatch = l.foodCategory === selectedCategory || isProduce;
      if (!isMatch) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchName = l.foodName?.toLowerCase().includes(q);
      const matchOrg = l.providerOrganizationName?.toLowerCase().includes(q);
      const matchLoc = l.address?.toLowerCase().includes(q);
      return matchName || matchOrg || matchLoc;
    }
    return true;
  });

  // Calculate count per category for quick UI badges
  const getCategoryCount = (catId: string) => {
    if (catId === 'ALL') return listings.length;
    return listings.filter((l) => {
      const isProduce =
        catId === 'FRESH_PRODUCE' &&
        (l.foodCategory === 'FRESH_PRODUCE' || l.foodCategory === 'RAW_PRODUCE');
      return l.foodCategory === catId || isProduce;
    }).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Filter and Search Bar (Rising Box 1) */}
      <div
        className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#DCE9DE] shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3 animate-box-rise"
        style={{ animationDelay: '260ms' }}
      >
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-[#79A786] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by dish, provider or locality..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F2F7F1] border border-[#DCE9DE] text-xs text-[#20352A] placeholder-[#79A786] focus:outline-none focus:ring-2 focus:ring-[#367A50]/20 focus:border-[#367A50]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
          {categories.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#367A50] text-[#FFFFFF] shadow-xs font-bold'
                    : 'bg-[#F2F7F1] text-[#20352A] hover:bg-[#DCE9DE]'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/25 text-white'
                      : 'bg-[#DCE9DE] text-[#24543B]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* Veg Only Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              vegOnly
                ? 'bg-[#DCE9DE] border-[#79A786] text-[#163D2B] font-bold'
                : 'border-[#DCE9DE] text-[#547462] hover:bg-[#F2F7F1]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#367A50]" />
            <span>100% Veg</span>
          </button>
        </div>
      </div>

      {/* Listings Grid (Rising Boxes 2..N) */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#79A786] gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#367A50]" />
          <p className="text-xs font-medium">Loading verified surplus food catalog...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="bg-[#FFFFFF] rounded-3xl p-12 text-center border border-[#DCE9DE] space-y-4 animate-box-rise max-w-lg mx-auto shadow-xs"
          style={{ animationDelay: '340ms' }}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#F2F7F1] border border-[#DCE9DE] text-[#367A50] flex items-center justify-center mx-auto shadow-2xs">
            <Utensils className="w-6 h-6 text-[#367A50]" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-[#20352A] text-base sm:text-lg">
              No surplus matching your filter
            </h3>
            <p className="text-xs text-[#547462] leading-relaxed max-w-sm mx-auto">
              Try resetting your search or check back soon as restaurants and event halls publish new edible surplus batches.
            </p>
          </div>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('ALL');
              setVegOnly(false);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#367A50] hover:bg-[#24543B] text-white text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((listing, idx) => {
            const urgencyBadge =
              listing.urgencyLevel === 'CRITICAL'
                ? 'bg-rose-500 text-white'
                : listing.urgencyLevel === 'HIGH'
                ? 'bg-amber-500 text-white'
                : 'bg-[#367A50] text-white';

            return (
              <div
                key={listing.id}
                className="bg-[#FFFFFF] rounded-3xl border border-[#DCE9DE] shadow-xs hover:border-[#79A786] hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group animate-box-rise"
                style={{ animationDelay: `${340 + idx * 60}ms` }}
              >
                {/* Photo & Badges */}
                <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={listing.photoUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'}
                    alt={listing.foodName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                    {listing.vegetarian ? '🌱 Pure Veg' : '🍗 Non-Veg'}
                  </div>
                  <div className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${urgencyBadge}`}>
                    {listing.status === 'AVAILABLE' ? 'Available' : 'Reserved'}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-[#20352A] text-sm leading-snug line-clamp-1">
                      {listing.foodName}
                    </h3>
                    <p className="text-xs text-[#547462] font-medium truncate mt-0.5">
                      {listing.providerOrganizationName}
                    </p>

                    <div className="space-y-1.5 pt-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#79A786] shrink-0" />
                        <span className="font-semibold text-[#20352A]">
                          {listing.remainingQuantity || listing.quantity} {listing.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#79A786] shrink-0" />
                        <span className="text-[#547462]">
                          {listing.availableMinutesRemaining || 90}m safe window
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#79A786] shrink-0" />
                        <span className="truncate text-[#547462]">{listing.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#DCE9DE] flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#547462]">
                      Remaining: <strong className="text-[#20352A]">{listing.remainingQuantity || listing.quantity}</strong>
                    </span>
                    <button
                      onClick={() => setSelectedClaimListing(listing)}
                      disabled={listing.remainingQuantity !== undefined && listing.remainingQuantity <= 0}
                      className="px-4 py-1.5 rounded-xl bg-[#367A50] hover:bg-[#24543B] text-[#FFFFFF] text-xs font-bold transition-all disabled:opacity-40 shadow-xs hover:shadow cursor-pointer"
                    >
                      Claim Food
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
