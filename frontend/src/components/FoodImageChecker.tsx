import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { api } from '../services/api';
import { FoodImageAssessment } from '../types';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Info,
  Clock,
  Layers,
  Thermometer,
  FileCheck,
  X,
} from 'lucide-react';

interface FoodImageCheckerProps {
  onApplyToDonationForm: (confirmedData: {
    foodName: string;
    foodCategory: string;
    quantity: number;
    unit: string;
    storageCondition: string;
    allergenInfo: string;
    availableMinutes: number;
    photoUrl: string;
  }) => void;
  onSkipToManualForm?: () => void;
}

export const FoodImageChecker: React.FC<FoodImageCheckerProps> = ({
  onApplyToDonationForm,
  onSkipToManualForm,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<FoodImageAssessment | null>(null);

  // Donor Correction and Confirmation State
  const [confirmedFoodName, setConfirmedFoodName] = useState('');
  const [confirmedCategory, setConfirmedCategory] = useState('COOKED_MEALS');
  const [confirmedQuantity, setConfirmedQuantity] = useState<number>(50);
  const [confirmedUnit, setConfirmedUnit] = useState('SERVINGS');
  const [confirmedStorage, setConfirmedStorage] = useState('HEATED_CONTAINER');
  const [confirmedAllergens, setConfirmedAllergens] = useState('');
  const [confirmedMinutes, setConfirmedMinutes] = useState(90);
  const [donorSafetyVerified, setDonorSafetyVerified] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setError(null);
    const validFormats = ['image/jpeg', 'image/png', 'image/webp'];

    if (!validFormats.includes(file.type)) {
      setError('Invalid format. Please upload a JPEG, PNG, or WEBP image.');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Image size must not exceed 10 MB.');
      return false;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setAssessment(null);
    return true;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select or capture a food photo first.');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setUploadProgress(25);

    const progressTimer = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
    }, 200);

    try {
      const result: FoodImageAssessment = await api.uploadAndAnalyzeFoodImage(selectedFile);
      clearInterval(progressTimer);
      setUploadProgress(100);

      setAssessment(result);
      setConfirmedFoodName(result.detectedFoodName || '');
      setConfirmedCategory(result.detectedCategory || 'COOKED_MEALS');
      setConfirmedStorage(result.storageRecommendation || 'HEATED_CONTAINER');
      setConfirmedAllergens(
        result.detectedCategory === 'BAKERY_BREAD'
          ? 'Contains Gluten (Wheat)'
          : result.detectedFoodName.toLowerCase().includes('biryani')
          ? 'Vegetarian • Dairy (Ghee)'
          : 'None declared'
      );
    } catch (err: any) {
      clearInterval(progressTimer);
      setError(err.message || 'Image analysis failed. You may retry or continue with manual entry.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirmAndApply = async () => {
    if (!confirmedFoodName.trim()) {
      setError('Please provide a valid food name.');
      return;
    }
    if (confirmedQuantity <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }
    if (!donorSafetyVerified) {
      setError('You must confirm that food has been safely cooked, held within temperature limits, and packed in clean containers.');
      return;
    }

    setConfirming(true);
    setError(null);

    try {
      if (assessment?.id) {
        await api.confirmImageCheck(assessment.id, {
          confirmedFoodName,
          confirmedCategory,
          confirmedQuantity,
          confirmedUnit,
          confirmedStorage,
          confirmedAllergens,
          confirmedMinutes,
          applyToListing: true,
        });
      }

      // Propagate confirmed data to donation wizard
      onApplyToDonationForm({
        foodName: confirmedFoodName,
        foodCategory: confirmedCategory,
        quantity: confirmedQuantity,
        unit: confirmedUnit,
        storageCondition: confirmedStorage,
        allergenInfo: confirmedAllergens,
        availableMinutes: confirmedMinutes,
        photoUrl: assessment?.imageUrl || imagePreview || '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to persist confirmation.');
    } finally {
      setConfirming(false);
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setAssessment(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DCE9DE] shadow-sm p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#DCE9DE]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2F7F1] text-[#24543B] border border-[#DCE9DE] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#367A50]" />
            AI Visual Inspection
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#20352A] tracking-tight">
            AI Food Image Checker
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload or capture food photography for preliminary categorization and packaging integrity review before redistribution.
          </p>
        </div>

        {onSkipToManualForm && (
          <button
            type="button"
            onClick={onSkipToManualForm}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 underline underline-offset-4 self-start sm:self-center"
          >
            Skip to manual form →
          </button>
        )}
      </div>

      {/* Advisory Food Safety Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-950 flex items-start gap-3.5 text-xs leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-extrabold text-amber-900 block mb-0.5">
            Advisory Visual Assessment Only — Not a Microbiological Certification
          </strong>
          Harmful bacteria, toxins, internal core temperatures, and sanitary preparation history
          <strong> cannot be verified reliably from a photo</strong>. You as the donor must independently verify temperature compliance (hot food &gt;60°C, cold food &lt;5°C) and clean packaging before food redistribution.
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Zone */}
      {!imagePreview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-[#087B46] bg-emerald-50/50 scale-[1.005]'
              : 'border-slate-200 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/20'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 text-[#087B46] flex items-center justify-center mx-auto">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <p className="text-sm font-extrabold text-slate-800">
                Drag and drop your food photo here, or browse
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports JPEG, PNG, WEBP (up to 10 MB)
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-sm"
              >
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                Select File
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-sm"
              >
                <Camera className="w-4 h-4 text-blue-600" />
                Use Camera
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview & Actions */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 items-center">
            <div className="relative w-full md:w-56 h-48 rounded-xl overflow-hidden bg-slate-900/10 shrink-0 border border-slate-200 shadow-inner">
              <img
                src={imagePreview}
                alt="Food Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={resetSelection}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
                title="Change Photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">
                    {selectedFile?.name || 'Uploaded Food Photo'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • ${selectedFile.type}` : 'Ready for visual scan'}
                  </p>
                </div>

                {!assessment && !analyzing && (
                  <button
                    type="button"
                    onClick={resetSelection}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Replace Image
                  </button>
                )}
              </div>

              {/* Progress Bar during Analysis */}
              {analyzing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                      Analyzing food characteristics with Vision AI...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#087B46] to-[#8BE34B] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Analyze CTA */}
              {!assessment && !analyzing && (
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#087B46] hover:bg-[#066337] text-white font-extrabold text-xs shadow-md transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#8BE34B]" />
                    Analyze Food Image
                  </button>
                  <button
                    type="button"
                    onClick={resetSelection}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI Assessment Results Card */}
          {assessment && (
            <div className="p-6 rounded-3xl bg-[#E8F7EE]/60 border border-emerald-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-200/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      AI Visual Assessment Results
                    </h3>
                    <p className="text-xs text-slate-500">
                      Preliminary categorization and physical packaging inspection
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-emerald-800 text-xs font-extrabold border border-emerald-200 shadow-sm">
                  Confidence: {Math.round(assessment.confidenceScore * 100)}%
                </div>
              </div>

              {/* Grid Assessment Chips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visible Characteristics */}
                <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Visible Characteristics
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    {assessment.visibleCharacteristics?.map((char, idx) => (
                      <li key={idx}>{char}</li>
                    ))}
                  </ul>
                </div>

                {/* Possible Visual Concerns */}
                <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Visual Checks & Handling Notes
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    {assessment.visualConcerns?.map((concern, idx) => (
                      <li key={idx}>{concern}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Next Steps */}
              {assessment.recommendedNextSteps && assessment.recommendedNextSteps.length > 0 && (
                <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2 text-xs">
                  <span className="font-extrabold text-slate-800 block">
                    Recommended Operational Steps:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {assessment.recommendedNextSteps.map((step, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                      >
                        ✓ {step}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Donor Review & Confirmation Section */}
              <div className="p-5 rounded-2xl bg-white border-2 border-emerald-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-600" />
                    Review & Confirm Details Before Proceeding
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Donor Verification Mandatory
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  {/* Food Name */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Food Name</label>
                    <input
                      type="text"
                      value={confirmedFoodName}
                      onChange={(e) => setConfirmedFoodName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087B46]"
                    />
                  </div>

                  {/* Food Category */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Category</label>
                    <select
                      value={confirmedCategory}
                      onChange={(e) => setConfirmedCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087B46]"
                    >
                      <option value="COOKED_MEALS">Cooked Meals (Rice, Curry, etc.)</option>
                      <option value="BAKERY_BREAD">Bakery & Bread</option>
                      <option value="FRESH_PRODUCE">Fresh Produce / Salads</option>
                      <option value="PACKAGED_GOODS">Packaged Goods</option>
                      <option value="DAIRY_PRODUCTS">Dairy Products</option>
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Actual Quantity</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        value={confirmedQuantity}
                        onChange={(e) => setConfirmedQuantity(Number(e.target.value))}
                        className="w-24 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087B46]"
                      />
                      <select
                        value={confirmedUnit}
                        onChange={(e) => setConfirmedUnit(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087B46]"
                      >
                        <option value="SERVINGS">Servings</option>
                        <option value="MEALS">Meals</option>
                        <option value="KG">Kilograms (kg)</option>
                        <option value="BOXES">Boxes</option>
                      </select>
                    </div>
                  </div>

                  {/* Storage Condition */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Storage Condition</label>
                    <select
                      value={confirmedStorage}
                      onChange={(e) => setConfirmedStorage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087B46]"
                    >
                      <option value="HEATED_CONTAINER">Heated Container (&gt;60°C)</option>
                      <option value="REFRIGERATED">Refrigerated (&lt;5°C)</option>
                      <option value="ROOM_TEMP">Clean Room Temp (Baked Goods)</option>
                      <option value="FROZEN">Frozen Storage</option>
                    </select>
                  </div>

                  {/* Safe Pickup Window */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Safe Pickup Window</label>
                    <select
                      value={confirmedMinutes}
                      onChange={(e) => setConfirmedMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087B46]"
                    >
                      <option value={60}>Within 1 Hour (Critical)</option>
                      <option value={90}>Within 1.5 Hours (Standard Hot)</option>
                      <option value={120}>Within 2 Hours (Recommended)</option>
                      <option value={240}>Within 4 Hours (Chilled/Bakery)</option>
                    </select>
                  </div>

                  {/* Allergens */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Allergen Declarations</label>
                    <input
                      type="text"
                      value={confirmedAllergens}
                      onChange={(e) => setConfirmedAllergens(e.target.value)}
                      placeholder="e.g. Contains Dairy, Gluten, Nuts"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087B46]"
                    />
                  </div>
                </div>

                {/* Safety Confirmation Checkbox */}
                <label className="flex items-start gap-2.5 pt-2 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={donorSafetyVerified}
                    onChange={(e) => setDonorSafetyVerified(e.target.checked)}
                    className="mt-0.5 rounded text-[#087B46] focus:ring-[#087B46]"
                  />
                  <span>
                    <strong>I confirm the details above:</strong> The food was prepared in a sanitary kitchen, is held within safe thermal boundaries, and is securely packaged for volunteer transit.
                  </span>
                </label>

                {/* Continue to Donation Form Button */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={resetSelection}
                    className="px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Scan Another Image
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmAndApply}
                    disabled={confirming}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#087B46] hover:bg-[#066337] text-white font-extrabold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    {confirming ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-[#8BE34B]" />
                    )}
                    Apply Details to Donation Form
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
