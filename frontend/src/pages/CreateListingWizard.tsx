import React, { useState } from 'react';
import { api } from '../services/api';
import { FoodListing } from '../types';
import { FoodImageChecker } from '../components/FoodImageChecker';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Info,
  Camera,
  Layers,
} from 'lucide-react';

interface CreateListingWizardProps {
  onSuccess: (newListing: FoodListing) => void;
  onCancel: () => void;
}

export const CreateListingWizard: React.FC<CreateListingWizardProps> = ({ onSuccess, onCancel }) => {
  const [entryMode, setEntryMode] = useState<'ai-checker' | 'manual'>('ai-checker');
  const [aiAutofilled, setAiAutofilled] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [foodName, setFoodName] = useState('Royal Buffet Steamed Rice & Dal Makhani');
  const [foodCategory, setFoodCategory] = useState('COOKED_MEALS');
  const [quantity, setQuantity] = useState<number>(50);
  const [unit, setUnit] = useState('MEALS');
  const [foodCondition, setFoodCondition] = useState('FRESHLY_PREPARED');
  const [isVegetarian, setIsVegetarian] = useState(true);
  const [allergenInfo, setAllergenInfo] = useState('Contains Dairy (Butter). No Nuts.');
  const [storageCondition, setStorageCondition] = useState('HEATED_CONTAINER');

  // Time State: Default 90 minutes from now (as specified in prompt demo flow!)
  const [availableMinutes, setAvailableMinutes] = useState(90);

  // Location State (Hyderabad defaults)
  const [address, setAddress] = useState('Road No. 1, Banjara Hills, Hyderabad, Telangana');
  const [latitude, setLatitude] = useState(17.4156);
  const [longitude, setLongitude] = useState(78.4487);
  const [pickupInstructions, setPickupInstructions] = useState('Service entrance behind banquet kitchen. Ask for Sous Chef Anirudh.');
  const [contactPhone, setContactPhone] = useState('+91 9876543211');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80');

  // Food Safety Checklist State
  const [temperatureSafe, setTemperatureSafe] = useState(true);
  const [cleanPackaging, setCleanPackaging] = useState(true);
  const [preparedWithinSafeWindow, setPreparedWithinSafeWindow] = useState(true);
  const [allergenDeclared, setAllergenDeclared] = useState(true);
  const [providerCertified, setProviderCertified] = useState(true);
  const [safetyNotes, setSafetyNotes] = useState('Freshly prepared and held at 65°C in clean food-grade aluminum containers.');

  const handleApplyFromAi = (confirmedData: {
    foodName: string;
    foodCategory: string;
    quantity: number;
    unit: string;
    storageCondition: string;
    allergenInfo: string;
    availableMinutes: number;
    photoUrl: string;
  }) => {
    setFoodName(confirmedData.foodName);
    setFoodCategory(confirmedData.foodCategory);
    setQuantity(confirmedData.quantity);
    setUnit(confirmedData.unit);
    setStorageCondition(confirmedData.storageCondition);
    setAllergenInfo(confirmedData.allergenInfo);
    setAvailableMinutes(confirmedData.availableMinutes);
    if (confirmedData.photoUrl) {
      setPhotoUrl(confirmedData.photoUrl);
    }
    setAiAutofilled(true);
    setEntryMode('manual');
    setStep(2); // Take donor to review Quantity & Time then Safety checklist
  };

  // Pre-calculated Available Time Display
  const now = new Date();
  const availableUntilTime = new Date(now.getTime() + availableMinutes * 60000);

  const calculateUrgencyLevel = (mins: number) => {
    if (mins <= 60) return { label: 'CRITICAL', color: 'text-red-700 bg-red-100 border-red-300' };
    if (mins <= 120) return { label: 'HIGH', color: 'text-amber-700 bg-amber-100 border-amber-300' };
    if (mins <= 240) return { label: 'MEDIUM', color: 'text-teal-700 bg-teal-100 border-teal-300' };
    return { label: 'LOW', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
  };

  const urgency = calculateUrgencyLevel(availableMinutes);

  const handleSubmit = async () => {
    if (!temperatureSafe || !cleanPackaging || !preparedWithinSafeWindow || !providerCertified) {
      setError('All food safety compliance items must be verified before publishing surplus food.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const submitTime = new Date();
    const availableUntilDate = new Date(submitTime.getTime() + availableMinutes * 60000);
    const prepDate = new Date(submitTime.getTime() - 60 * 60000);

    const toLocalISO = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const payload = {
      foodName,
      foodCategory,
      quantity,
      unit,
      preparationTime: toLocalISO(prepDate),
      availableFrom: toLocalISO(submitTime),
      availableUntil: toLocalISO(availableUntilDate),
      address,
      latitude,
      longitude,
      foodCondition,
      isVegetarian,
      allergenInfo,
      storageCondition,
      pickupInstructions,
      photoUrl,
      contactPhone,
      temperatureSafe,
      cleanPackaging,
      preparedWithinSafeWindow,
      allergenDeclared,
      providerCertified,
      safetyNotes,
    };

    try {
      const created = await api.createListing(payload);
      // Automatically trigger smart matching calculation
      await api.generateMatches(created.id);
      onSuccess(created);
    } catch (err: any) {
      setError(err.message || 'Failed to publish surplus food listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Entry Mode Switcher */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => setEntryMode('ai-checker')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            entryMode === 'ai-checker'
              ? 'bg-[#032C20] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#8BE34B]" />
          <span>AI Food Image Checker</span>
          <span className="text-[10px] bg-[#8BE34B]/20 text-[#8BE34B] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Fast-Track
          </span>
        </button>

        <button
          type="button"
          onClick={() => setEntryMode('manual')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            entryMode === 'manual'
              ? 'bg-[#032C20] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4 text-slate-400" />
          <span>Standard Step-by-Step Entry</span>
          {aiAutofilled && (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              ✓ Pre-filled
            </span>
          )}
        </button>
      </div>

      {/* Render AI Checker or Step Wizard */}
      {entryMode === 'ai-checker' ? (
        <FoodImageChecker
          onApplyToDonationForm={handleApplyFromAi}
          onSkipToManualForm={() => setEntryMode('manual')}
        />
      ) : (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* AI Pre-fill notice banner if applicable */}
          {aiAutofilled && (
            <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-3 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>AI Inspection Applied:</strong> Pre-filled from your analyzed photo. Please review the details below.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEntryMode('ai-checker')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
              >
                Scan Another Photo
              </button>
            </div>
          )}

          {/* Wizard Header */}
          <div className="p-6 bg-gradient-to-r from-emerald-900 to-teal-800 text-white flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-lime-300 uppercase tracking-wider">
                Surplus Registration Wizard
              </span>
              <h2 className="text-xl font-bold mt-1">List Edible Surplus Food</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              Cancel
            </button>
          </div>

          {/* Wizard Progress Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className={step >= 1 ? 'text-emerald-700 font-bold' : ''}>1. Food Details</span>
              <span className={step >= 2 ? 'text-emerald-700 font-bold' : ''}>2. Quantity & Time</span>
              <span className={step >= 3 ? 'text-emerald-700 font-bold' : ''}>3. Location</span>
              <span className={step >= 4 ? 'text-emerald-700 font-bold' : ''}>4. Safety Check</span>
              <span className={step >= 5 ? 'text-emerald-700 font-bold' : ''}>5. Preview</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

        {/* Wizard Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Food Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Step 1: Food Details & Specifications</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Food Item Name *</label>
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. Cooked Rice, Paneer Curry, Fresh Bread"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Food Category *</label>
                  <select
                    value={foodCategory}
                    onChange={(e) => setFoodCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="COOKED_MEALS">Cooked Meals (Rice, Curries, Rotis)</option>
                    <option value="BAKERY_BREAD">Bakery & Bread</option>
                    <option value="PACKAGED_GROCERIES">Packaged Groceries</option>
                    <option value="FRESH_PRODUCE">Fresh Produce / Fruits</option>
                    <option value="DAIRY">Dairy</option>
                    <option value="BEVERAGES">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Food Condition *</label>
                  <select
                    value={foodCondition}
                    onChange={(e) => setFoodCondition(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="FRESHLY_PREPARED">Freshly Prepared Surplus</option>
                    <option value="BUFFER_SURPLUS">Unserved Buffet Buffer</option>
                    <option value="SHELF_STABLE">Shelf Stable / Sealed</option>
                    <option value="CHILLED">Chilled / Refrigerated</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="radio"
                    name="veg"
                    checked={isVegetarian}
                    onChange={() => setIsVegetarian(true)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>🌱 100% Vegetarian</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="radio"
                    name="veg"
                    checked={!isVegetarian}
                    onChange={() => setIsVegetarian(false)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>🍗 Non-Vegetarian</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Allergen Information</label>
                <input
                  type="text"
                  value={allergenInfo}
                  onChange={(e) => setAllergenInfo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  placeholder="e.g. Contains Dairy, Gluten, Nuts, or None"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Quantity & Available Usable Time */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Step 2: Quantity & Redistribution Time Window</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit *</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="MEALS">Meals / Servings</option>
                    <option value="KG">Kilograms (kg)</option>
                    <option value="PACKETS">Packets / Trays</option>
                  </select>
                </div>
              </div>

              {/* Usable Time Slider */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    Available Usable Time Before Spoilage
                  </label>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-white text-emerald-900">
                    {availableMinutes} minutes
                  </span>
                </div>

                <input
                  type="range"
                  min={30}
                  max={360}
                  step={15}
                  value={availableMinutes}
                  onChange={(e) => setAvailableMinutes(Number(e.target.value))}
                  className="w-full mt-3 accent-emerald-600 cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>30 mins (Urgent)</span>
                  <span>90 mins (Prompt)</span>
                  <span>4 hours (Buffer)</span>
                  <span>6 hours</span>
                </div>

                {/* Real Calculation Notice requested in prompt */}
                <div className="mt-4 p-3 rounded-xl bg-white border border-emerald-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Calculated Expiry Time:</span>
                    <span className="font-bold text-slate-900">
                      {availableUntilTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-slate-600">Calculated Urgency Level:</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] border ${urgency.color}`}>
                      {urgency.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Location */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Step 3: Location & Geocoding (Hyderabad Scope)</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Instructions for Volunteer</label>
                <textarea
                  rows={2}
                  value={pickupInstructions}
                  onChange={(e) => setPickupInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  placeholder="Gate entrance, contact person name, vehicle parking instructions..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Food Safety Checklist */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm">Step 4: Mandatory Food Safety Checklist</h3>
              </div>

              <p className="text-xs text-slate-600">
                To guarantee recipient dignity and public health integrity, food donors must verify all compliance items.
              </p>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={temperatureSafe}
                    onChange={(e) => setTemperatureSafe(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900">Safe Temperature Verification</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Food maintained hot above 65°C or chilled below 5°C throughout holding.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={cleanPackaging}
                    onChange={(e) => setCleanPackaging(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900">Clean Food-Grade Packaging</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Sealed in sanitized, food-grade containers without cross-contamination.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={preparedWithinSafeWindow}
                    onChange={(e) => setPreparedWithinSafeWindow(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900">Prepared Within Safe Window</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Food cooked or prepared within the past 2–4 hours; not customer plate waste.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={allergenDeclared}
                    onChange={(e) => setAllergenDeclared(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900">Allergen Transparency</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Dairy, nuts, or gluten allergens are accurately disclosed in the listing.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={providerCertified}
                    onChange={(e) => setProviderCertified(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900">Provider Authorization & Signing</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      I confirm this food is wholesome, fit for human consumption, and compliant with local standards.
                    </p>
                  </div>
                </label>
              </div>

              {/* Mandatory Legal Disclosure requested in prompt */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2 mt-4">
                <Info className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                <span>
                  <strong>Regulatory Notice:</strong> "Food redistribution must follow applicable food-safety and local
                  regulatory requirements."
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: Preview & Ready to Publish */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Step 5: Review & Multicriteria Matching Projection</h3>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between items-start pb-2 border-b border-slate-200">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{foodName}</h4>
                    <span className="text-[11px] text-slate-500">{foodCategory} • {isVegetarian ? '🌱 Vegetarian' : '🍗 Non-Veg'}</span>
                  </div>
                  <span className="font-extrabold text-base text-emerald-800">
                    {quantity} {unit}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div>📍 Location: <span className="font-medium text-slate-800">{address}</span></div>
                  <div>⏱ Expiry Window: <span className="font-medium text-slate-800">{availableMinutes} minutes</span></div>
                  <div>🌡 Storage: <span className="font-medium text-slate-800">{storageCondition}</span></div>
                  <div>🚨 Urgency Status: <span className={`font-bold px-1.5 py-0.5 rounded-full ${urgency.color}`}>{urgency.label}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Safety Checklist Verified
                  </span>
                  <span>Ready for Multicriteria Engine</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
                🚀 <strong>Upon publishing:</strong> The Matching Engine will instantly evaluate nearby NGOs in Hyderabad
                based on distance, capacity fit, urgency weight, and dietary suitability, notifying the highest-ranked receiver.
              </div>
            </div>
          )}

          {/* Wizard Action Buttons */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => { setError(null); setStep(step - 1); }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => { setError(null); setStep(step + 1); }}
                className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-emerald-950 text-xs font-bold transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {submitting ? 'Publishing & Matching...' : 'Publish & Trigger Matching'}
              </button>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
