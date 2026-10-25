import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  RefreshCw,
  PlusCircle,
  Clock,
  Sparkles,
  Info,
  ShieldCheck,
  HeartHandshake,
  Trash2,
  Users,
  Layers,
  ChevronRight,
  Filter,
  Check,
  Sliders,
  BarChart3,
  Search,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { api } from '../services/api';
import {
  FoodPreparationRecord,
  FoodPreparationEntryPayload,
  SmartPreparationPrediction,
  PreparationAdvisorSummary,
} from '../types';
import { AnimatedPageHeading } from '../components/AnimatedPageHeading';

interface SurplusPredictionPageProps {
  onNavigateToDonation?: (prefill: {
    sourceRecordId: string;
    foodName: string;
    foodCategory: string;
    quantity: number;
    unit: string;
    storageCondition: string;
    safetyNotes: string;
  }) => void;
}

export const SurplusPredictionPage: React.FC<SurplusPredictionPageProps> = ({
  onNavigateToDonation,
}) => {
  // Navigation sub-tabs
  const [activeView, setActiveView] = useState<'advisor' | 'tracker' | 'history'>('advisor');

  // Dashboard Filters & State
  const [dateRangeDays, setDateRangeDays] = useState<number>(30);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterMealPeriod, setFilterMealPeriod] = useState<string>('ALL');
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(true);
  const [dashboardSummary, setDashboardSummary] = useState<PreparationAdvisorSummary | null>(null);

  // Demand Prediction Interactive State
  const [predFoodItem, setPredFoodItem] = useState<string>('Veg Biryani & Rice');
  const [predMealPeriod, setPredMealPeriod] = useState<string>('LUNCH');
  const [predTargetDate, setPredTargetDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [safetyMargin, setSafetyMargin] = useState<number>(10.0);
  const [loadingPrediction, setLoadingPrediction] = useState<boolean>(false);
  const [predictionData, setPredictionData] = useState<SmartPreparationPrediction | null>(null);

  // Data Entry Tracker State
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [entryFoodName, setEntryFoodName] = useState<string>('');
  const [entryCategory, setEntryCategory] = useState<string>('COOKED_MEALS');
  const [entryMealPeriod, setEntryMealPeriod] = useState<string>('LUNCH');
  const [entryPrepared, setEntryPrepared] = useState<number | ''>('');
  const [entryServed, setEntryServed] = useState<number | ''>('');
  const [entryDonated, setEntryDonated] = useState<number | ''>(0);
  const [entryDiscarded, setEntryDiscarded] = useState<number | ''>(0);
  const [entryCustomers, setEntryCustomers] = useState<number | ''>('');
  const [entryUnit, setEntryUnit] = useState<string>('PORTIONS');
  const [entryNotes, setEntryNotes] = useState<string>('');
  const [entrySafetyMargin, setEntrySafetyMargin] = useState<number>(10);
  const [submittingEntry, setSubmittingEntry] = useState<boolean>(false);
  const [entryError, setEntryError] = useState<string | null>(null);
  const [entrySuccessMsg, setEntrySuccessMsg] = useState<string | null>(null);

  // History List State
  const [historyRecords, setHistoryRecords] = useState<FoodPreparationRecord[]>([]);
  const [historySearch, setHistorySearch] = useState<string>('');
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // Donation Confirmation Modal State
  const [handoffModalRecord, setHandoffModalRecord] = useState<FoodPreparationRecord | null>(null);

  // Real-time remaining calculation in Entry Form
  const calculatedRemaining = useMemo(() => {
    const prep = typeof entryPrepared === 'number' ? entryPrepared : 0;
    const serv = typeof entryServed === 'number' ? entryServed : 0;
    const don = typeof entryDonated === 'number' ? entryDonated : 0;
    const disc = typeof entryDiscarded === 'number' ? entryDiscarded : 0;
    const rem = prep - (serv + don + disc);
    return Math.round(rem * 100) / 100;
  }, [entryPrepared, entryServed, entryDonated, entryDiscarded]);

  const isEntryOverDistributed = useMemo(() => {
    const prep = typeof entryPrepared === 'number' ? entryPrepared : 0;
    const serv = typeof entryServed === 'number' ? entryServed : 0;
    const don = typeof entryDonated === 'number' ? entryDonated : 0;
    const disc = typeof entryDiscarded === 'number' ? entryDiscarded : 0;
    return (serv + don + disc) > prep;
  }, [entryPrepared, entryServed, entryDonated, entryDiscarded]);

  // Fetch Dashboard Summary
  const fetchDashboard = async () => {
    setLoadingDashboard(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - dateRangeDays * 86400000).toISOString().split('T')[0];
      const data = await api.getPreparationAdvisorDashboard({
        startDate,
        endDate,
        category: filterCategory !== 'ALL' ? filterCategory : undefined,
        mealPeriod: filterMealPeriod !== 'ALL' ? filterMealPeriod : undefined,
      });
      setDashboardSummary(data);
    } catch (err) {
      console.error('Failed to load preparation advisor dashboard', err);
    } finally {
      setLoadingDashboard(false);
    }
  };

  // Fetch Demand Prediction
  const fetchPrediction = async () => {
    setLoadingPrediction(true);
    try {
      const pred = await api.getSmartDemandPrediction({
        foodItem: predFoodItem,
        mealPeriod: predMealPeriod,
        targetDate: predTargetDate,
        safetyMarginPct: safetyMargin,
      });
      setPredictionData(pred);
    } catch (err) {
      console.error('Failed to load demand prediction', err);
    } finally {
      setLoadingPrediction(false);
    }
  };

  // Fetch History Records
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0];
      const records = await api.getPreparationRecords({
        startDate,
        endDate,
        category: filterCategory !== 'ALL' ? filterCategory : undefined,
        mealPeriod: filterMealPeriod !== 'ALL' ? filterMealPeriod : undefined,
      });
      setHistoryRecords(records);
    } catch (err) {
      console.error('Failed to load preparation history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchHistory();
  }, [dateRangeDays, filterCategory, filterMealPeriod]);

  useEffect(() => {
    fetchPrediction();
  }, [predFoodItem, predMealPeriod, predTargetDate, safetyMargin]);

  // Handle Form Submission
  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEntryError(null);
    setEntrySuccessMsg(null);

    if (!entryFoodName.trim()) {
      setEntryError('Please specify the food item name.');
      return;
    }
    if (typeof entryPrepared !== 'number' || entryPrepared <= 0) {
      setEntryError('Quantity prepared must be greater than 0.');
      return;
    }
    if (typeof entryServed !== 'number' || entryServed < 0) {
      setEntryError('Quantity served must be 0 or greater.');
      return;
    }
    if (isEntryOverDistributed) {
      setEntryError('The combined sum of served, donated, and discarded quantities exceeds total prepared.');
      return;
    }

    setSubmittingEntry(true);
    try {
      const payload: FoodPreparationEntryPayload = {
        foodItemName: entryFoodName.trim(),
        foodCategory: entryCategory,
        recordDate: entryDate,
        mealPeriod: entryMealPeriod,
        quantityPrepared: entryPrepared,
        quantityConsumed: entryServed,
        quantityDonated: typeof entryDonated === 'number' ? entryDonated : 0,
        quantityDiscarded: typeof entryDiscarded === 'number' ? entryDiscarded : 0,
        customersServed: typeof entryCustomers === 'number' ? entryCustomers : undefined,
        unit: entryUnit,
        notes: entryNotes.trim() || undefined,
        safetyMarginPct: entrySafetyMargin,
      };

      await api.createPreparationRecord(payload);
      setEntrySuccessMsg(
        `Meal record logged successfully! Unallocated leftover remaining: ${calculatedRemaining} ${entryUnit}.`
      );

      // Reset form fields
      setEntryFoodName('');
      setEntryPrepared('');
      setEntryServed('');
      setEntryDonated(0);
      setEntryDiscarded(0);
      setEntryCustomers('');
      setEntryNotes('');

      // Refresh data
      fetchDashboard();
      fetchHistory();
      fetchPrediction();
    } catch (err: any) {
      setEntryError(err.message || 'Failed to save preparation record.');
    } finally {
      setSubmittingEntry(false);
    }
  };

  // Handle Donation Handoff Click
  const handleInitiateDonation = async (record: FoodPreparationRecord) => {
    if (!onNavigateToDonation) {
      alert('Redistribution navigation handler not available.');
      return;
    }

    try {
      const handoff = await api.getDonationHandoff(record.id);
      onNavigateToDonation({
        sourceRecordId: record.id,
        foodName: handoff.foodName || record.foodItemName,
        foodCategory: handoff.foodCategory || record.foodCategory,
        quantity: handoff.quantity || record.quantityRemaining,
        unit: handoff.unit || record.unit,
        storageCondition: handoff.storageCondition || 'HEATED_CONTAINER',
        safetyNotes: handoff.safetyNotes || `Remaining surplus from ${record.mealPeriod} prep on ${record.recordDate}.`,
      });
    } catch (err: any) {
      alert('Could not prepare donation handoff: ' + err.message);
    }
  };

  // Filtered History Records for Search
  const filteredHistory = useMemo(() => {
    if (!historySearch.trim()) return historyRecords;
    const q = historySearch.toLowerCase();
    return historyRecords.filter(
      (r) =>
        r.foodItemName.toLowerCase().includes(q) ||
        r.mealPeriod.toLowerCase().includes(q) ||
        r.foodCategory.toLowerCase().includes(q) ||
        r.recordDate.includes(q)
    );
  }, [historyRecords, historySearch]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#163D2B] via-[#24543B] to-[#163D2B] text-white shadow-xl relative overflow-hidden border border-[#367A50]/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#79A786]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#24543B]/80 border border-[#79A786]/40 text-xs font-semibold text-[#DCE9DE]">
              <Sparkles className="w-3.5 h-3.5 text-[#79A786]" />
              Source Food Waste Prevention Engine
            </div>
            <AnimatedPageHeading
              text="Smart Surplus Prediction & Preparation Advisor"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white"
            />
            <p className="text-lg font-serif italic text-[#DCE9DE]/90 font-medium">
              Act before surplus spoils — Precision demand forecasting.
            </p>
            <p className="text-sm text-[#DCE9DE]/80 max-w-2xl leading-relaxed">
              Prevent food waste before surplus occurs. Forecast meal demand using historical consumption patterns,
              calibrate preparation with a configurable safety buffer, and seamlessly donate any safe leftovers.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#163D2B]/90 p-1.5 rounded-2xl border border-[#367A50]/40 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveView('advisor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === 'advisor'
                  ? 'bg-[#367A50] text-white shadow-md shadow-[#163D2B]/40'
                  : 'text-[#DCE9DE] hover:text-white hover:bg-[#24543B]/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Preparation Advisor
            </button>
            <button
              onClick={() => setActiveView('tracker')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === 'tracker'
                  ? 'bg-[#367A50] text-white shadow-md shadow-[#163D2B]/40'
                  : 'text-[#DCE9DE] hover:text-white hover:bg-[#24543B]/60'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Log Preparation
            </button>
            <button
              onClick={() => setActiveView('history')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === 'history'
                  ? 'bg-[#367A50] text-white shadow-md shadow-[#163D2B]/40'
                  : 'text-[#DCE9DE] hover:text-white hover:bg-[#24543B]/60'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              History & Donations
            </button>
          </div>
        </div>
      </div>

      {/* 2. Global Filter Bar (Present in Advisor and History views) */}
      {activeView !== 'tracker' && (
        <div
          className="bg-white p-4 rounded-2xl border border-[#DCE9DE] shadow-sm flex flex-wrap items-center justify-between gap-4 animate-box-rise"
          style={{ animationDelay: '240ms' }}
        >
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              Filter Scope:
            </div>
            <select
              value={dateRangeDays}
              onChange={(e) => setDateRangeDays(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={7}>Last 7 Days</option>
              <option value={14}>Last 14 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={60}>Last 60 Days</option>
            </select>

            <select
              value={filterMealPeriod}
              onChange={(e) => setFilterMealPeriod(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Meal Periods</option>
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="SNACKS">Snacks</option>
              <option value="DINNER">Dinner</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Categories</option>
              <option value="COOKED_MEALS">Cooked Meals</option>
              <option value="BAKERY_BREAD">Bakery & Bread</option>
              <option value="FRESH_PRODUCE">Fresh Produce</option>
              <option value="DAIRY_PRODUCTS">Dairy Products</option>
            </select>
          </div>

          <button
            onClick={() => {
              fetchDashboard();
              fetchHistory();
              fetchPrediction();
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            Refresh
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 1: SMART PREPARATION ADVISOR DASHBOARD */}
      {/* ======================================================== */}
      {activeView === 'advisor' && (
        <div className="space-y-8">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div
              className="bg-white p-5 rounded-2xl border border-[#DCE9DE] shadow-sm space-y-1 animate-box-rise"
              style={{ animationDelay: '300ms' }}
            >
              <span className="text-[11px] font-semibold text-[#79A786] uppercase tracking-wider block">
                Total Prepared
              </span>
              <p className="text-2xl font-black text-[#20352A]">
                {dashboardSummary?.totalPrepared ?? 0}
              </p>
              <span className="text-[10px] text-slate-500 block">Logged across past {dateRangeDays} days</span>
            </div>

            <div
              className="bg-white p-5 rounded-2xl border border-[#DCE9DE] shadow-sm space-y-1 animate-box-rise"
              style={{ animationDelay: '360ms' }}
            >
              <span className="text-[11px] font-semibold text-[#367A50] uppercase tracking-wider block">
                Total Served / Sold
              </span>
              <p className="text-2xl font-black text-[#163D2B]">
                {dashboardSummary?.totalServed ?? 0}
              </p>
              <span className="text-[10px] text-[#367A50] font-medium block">
                {dashboardSummary?.totalPrepared
                  ? `${Math.round(((dashboardSummary.totalServed / dashboardSummary.totalPrepared) * 100))}% utilization`
                  : '0% utilization'}
              </span>
            </div>

            <div
              className="bg-white p-5 rounded-2xl border border-[#DCE9DE] shadow-sm space-y-1 animate-box-rise"
              style={{ animationDelay: '420ms' }}
            >
              <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
                Leftover Rate
              </span>
              <p className="text-2xl font-black text-amber-800">
                {dashboardSummary?.overallLeftoverRatePct ?? 0}%
              </p>
              <span className="text-[10px] text-slate-500 block">Surplus buffer generated</span>
            </div>

            <div
              className="bg-[#F2F7F1] p-5 rounded-2xl border border-[#79A786]/60 shadow-sm space-y-1 animate-box-rise"
              style={{ animationDelay: '480ms' }}
            >
              <span className="text-[11px] font-semibold text-[#24543B] uppercase tracking-wider block">
                Avoidable Waste
              </span>
              <p className="text-2xl font-black text-[#163D2B]">
                ~{dashboardSummary?.estimatedAvoidableSurplus ?? 0}
              </p>
              <span className="text-[10px] text-[#367A50] font-medium block">Potentially saved at source</span>
            </div>

            <div
              className="bg-white p-5 rounded-2xl border border-[#DCE9DE] shadow-sm space-y-1 animate-box-rise"
              style={{ animationDelay: '540ms' }}
            >
              <span className="text-[11px] font-semibold text-[#367A50] uppercase tracking-wider block">
                Donated Surplus
              </span>
              <p className="text-2xl font-black text-[#163D2B]">
                {dashboardSummary?.totalDonated ?? 0}
              </p>
              <span className="text-[10px] text-[#367A50] font-medium block">Redistributed to NGOs</span>
            </div>

            <div
              className="bg-white p-5 rounded-2xl border border-[#DCE9DE] shadow-sm space-y-1 animate-box-rise"
              style={{ animationDelay: '600ms' }}
            >
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
                Discarded Food
              </span>
              <p className="text-2xl font-black text-rose-800">
                {dashboardSummary?.totalDiscarded ?? 0}
              </p>
              <span className="text-[10px] text-slate-500 block">Spoilage / uncollected</span>
            </div>
          </div>

          {/* Interactive Smart Demand Prediction Card */}
          <div
            className="bg-white rounded-3xl border border-[#DCE9DE] shadow-md p-6 sm:p-8 space-y-6 animate-box-rise"
            style={{ animationDelay: '660ms' }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Smart Demand Prediction & Preparation Advisor
                  </h2>
                  <p className="text-xs text-slate-500">
                    Transparent statistical forecast using historical moving averages and day-of-week consumption patterns.
                  </p>
                </div>
              </div>

              {predictionData && (
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      predictionData.confidenceLevel === 'HIGH'
                        ? 'bg-emerald-100 text-emerald-800'
                        : predictionData.confidenceLevel === 'MODERATE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Confidence: {predictionData.confidenceLevel}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ({predictionData.historicalObservationsCount} records)
                  </span>
                </div>
              )}
            </div>

            {/* Inputs: Food item, Meal Period, Target Date, Safety Margin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Food Item
                </label>
                <input
                  type="text"
                  value={predFoodItem}
                  onChange={(e) => setPredFoodItem(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Veg Biryani & Rice"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Meal Period
                </label>
                <select
                  value={predMealPeriod}
                  onChange={(e) => setPredMealPeriod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="BREAKFAST">Breakfast</option>
                  <option value="LUNCH">Lunch</option>
                  <option value="SNACKS">Snacks</option>
                  <option value="DINNER">Dinner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Preparation Date
                </label>
                <input
                  type="date"
                  value={predTargetDate}
                  onChange={(e) => setPredTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Safety Buffer Margin
                  </label>
                  <span className="text-xs font-bold text-emerald-700 font-mono">
                    +{safetyMargin}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="5"
                  value={safetyMargin}
                  onChange={(e) => setSafetyMargin(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>0% (Tight)</span>
                  <span>10% (Optimal)</span>
                  <span>25% (High Buffer)</span>
                </div>
              </div>
            </div>

            {/* Prediction Output & Recommendations Panel */}
            {loadingPrediction ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="text-xs font-medium">Computing demand recommendation...</span>
              </div>
            ) : predictionData ? (
              <div className="space-y-6 pt-2">
                {/* Result Hero Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1: Predicted Demand */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase">
                        Expected Demand
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {predictionData.dayOfWeek}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900">
                        {predictionData.predictedDemand}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {predictionData.unit}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      80% interval: {predictionData.confidenceMin} – {predictionData.confidenceMax} {predictionData.unit}
                    </p>
                  </div>

                  {/* Card 2: Recommended Preparation */}
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        Recommended Preparation
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900">
                        Advisor Pick
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-emerald-900">
                        {predictionData.recommendedPreparation}
                      </span>
                      <span className="text-xs text-emerald-700 font-semibold">
                        {predictionData.unit}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      Demand ({predictionData.predictedDemand}) + {predictionData.safetyMarginPct}% safety buffer
                    </p>
                  </div>

                  {/* Card 3: Avoidable Surplus */}
                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800 uppercase">
                        Avoidable Surplus Prevented
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                        Prevention
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-amber-900">
                        ~{predictionData.estimatedAvoidableSurplus}
                      </span>
                      <span className="text-xs text-amber-700 font-semibold">
                        {predictionData.unit}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-700">
                      Previously prepared avg: {predictionData.previouslyPreparedAvg} {predictionData.unit}
                    </p>
                  </div>
                </div>

                {/* Plain-English Explanation */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Calculation Explanation</span>
                  </div>
                  <p className="leading-relaxed">{predictionData.explanation}</p>
                </div>

                {/* Waste Prevention Recommendations */}
                {predictionData.wastePreventionRecommendations.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      Targeted Waste Prevention Actions
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {predictionData.wastePreventionRecommendations.map((rec, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Caution Disclaimer */}
                <div className="text-[11px] text-slate-400 italic flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{predictionData.cautionNotice}</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Visual Trends Chart: Prepared vs Served vs Leftover */}
          {dashboardSummary?.dailyTrends && dashboardSummary.dailyTrends.length > 0 && (
            <div
              className="bg-white rounded-3xl border border-[#DCE9DE] shadow-sm p-6 sm:p-8 space-y-4 animate-box-rise"
              style={{ animationDelay: '740ms' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Preparation vs Consumption Trend Over Time
                  </h3>
                  <p className="text-xs text-slate-500">
                    Daily breakdown showing production volume, actual consumption, and leftover margins.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {dashboardSummary.dailyTrends.length} days plotted
                </span>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardSummary.dailyTrends}>
                    <defs>
                      <linearGradient id="prepGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="servedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="leftoverGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(val) => val.slice(5)}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area
                      type="monotone"
                      dataKey="prepared"
                      name="Prepared"
                      stroke="#64748b"
                      fillOpacity={1}
                      fill="url(#prepGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="served"
                      name="Served / Consumed"
                      stroke="#059669"
                      fillOpacity={1}
                      fill="url(#servedGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="leftover"
                      name="Leftover"
                      stroke="#d97706"
                      fillOpacity={1}
                      fill="url(#leftoverGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Recurring Leftovers Analysis & High Waste Items */}
          {dashboardSummary?.recurringLeftoverItems && dashboardSummary.recurringLeftoverItems.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Food Items with Recurring Leftovers
                  </h3>
                  <p className="text-xs text-slate-500">
                    Identifies food preparations with repetitive high waste margins and provides targeted trimming suggestions.
                  </p>
                </div>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full shrink-0">
                  {dashboardSummary.recurringLeftoverItems.length} items analyzed
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Food Item</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Avg Prepared</th>
                      <th className="py-3 px-3">Avg Served</th>
                      <th className="py-3 px-3">Avg Leftover</th>
                      <th className="py-3 px-3">Leftover Rate</th>
                      <th className="py-3 px-3">Recommended Trim</th>
                      <th className="py-3 px-4">Waste Prevention Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {dashboardSummary.recurringLeftoverItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {item.foodItemName}
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {item.foodCategory}
                        </td>
                        <td className="py-3 px-3 font-mono">{item.averagePrepared}</td>
                        <td className="py-3 px-3 font-mono text-emerald-700">{item.averageServed}</td>
                        <td className="py-3 px-3 font-mono text-amber-700">{item.averageLeftover}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              item.severity === 'HIGH'
                                ? 'bg-red-100 text-red-800'
                                : item.severity === 'MEDIUM'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.leftoverRatePct}%
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-800">
                          -{item.suggestedTrimQuantity} portions
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={item.recommendation}>
                          {item.recommendation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Model Accuracy & Evaluation Metrics Panel (Section 10) */}
          {dashboardSummary?.evaluationMetrics && (
            <div
              className="bg-[#163D2B] text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-[#367A50]/40 animate-box-rise"
              style={{ animationDelay: '820ms' }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#24543B]">
                <div>
                  <span className="text-xs font-semibold text-[#79A786] uppercase tracking-wider block">
                    Section 10 • Empirical Model Validation
                  </span>
                  <h3 className="text-lg font-bold mt-0.5">
                    Forecast Accuracy & Evaluation Metrics
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                    {dashboardSummary.evaluationMetrics.evaluatedRecordsCount} Evaluated Meals
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase">
                    Forecast Accuracy
                  </span>
                  <p className="text-3xl font-black text-[#8BE34B]">
                    {dashboardSummary.evaluationMetrics.forecastAccuracyPct}%
                  </p>
                  <span className="text-[11px] text-slate-400 block">Based on 100 - MAPE</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase">
                    Mean Absolute Error (MAE)
                  </span>
                  <p className="text-3xl font-black text-white">
                    {dashboardSummary.evaluationMetrics.meanAbsoluteError}
                  </p>
                  <span className="text-[11px] text-slate-400 block">Avg portion deviation</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase">
                    Mean Abs Percentage Error
                  </span>
                  <p className="text-3xl font-black text-amber-300">
                    {dashboardSummary.evaluationMetrics.meanAbsolutePercentageError}%
                  </p>
                  <span className="text-[11px] text-slate-400 block">Relative variance</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {dashboardSummary.evaluationMetrics.interpretationMessage}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: FOOD PREPARATION TRACKER (DATA ENTRY FORM) */}
      {/* ======================================================== */}
      {activeView === 'tracker' && (
        <div
          className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#DCE9DE] shadow-md p-6 sm:p-8 space-y-6 animate-box-rise"
          style={{ animationDelay: '280ms' }}
        >
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
              Section 3 • Data Entry
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Food Preparation & Outcome Tracker
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Record daily prepared, served, donated, and discarded quantities. Unallocated remaining leftovers
              are computed automatically and validated to prevent errors.
            </p>
          </div>

          {/* Feedback Alerts */}
          {entryError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{entryError}</span>
            </div>
          )}

          {entrySuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{entrySuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleEntrySubmit} className="space-y-6">
            {/* Row 1: Food Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Food Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={entryFoodName}
                  onChange={(e) => setEntryFoodName(e.target.value)}
                  placeholder="e.g. Hyderabad Dum Biryani"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Food Category *
                </label>
                <select
                  value={entryCategory}
                  onChange={(e) => setEntryCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="COOKED_MEALS">Cooked Meals</option>
                  <option value="BAKERY_BREAD">Bakery & Bread</option>
                  <option value="FRESH_PRODUCE">Fresh Produce</option>
                  <option value="PACKAGED_GOODS">Packaged Goods</option>
                  <option value="DAIRY_PRODUCTS">Dairy Products</option>
                </select>
              </div>
            </div>

            {/* Row 2: Date, Meal Period, Measurement Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preparation Date *
                </label>
                <input
                  type="date"
                  required
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Meal Period *
                </label>
                <select
                  value={entryMealPeriod}
                  onChange={(e) => setEntryMealPeriod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="BREAKFAST">Breakfast</option>
                  <option value="LUNCH">Lunch</option>
                  <option value="SNACKS">Snacks</option>
                  <option value="DINNER">Dinner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Unit of Measure *
                </label>
                <select
                  value={entryUnit}
                  onChange={(e) => setEntryUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="PORTIONS">Portions</option>
                  <option value="PLATES">Plates</option>
                  <option value="MEALS">Meals</option>
                  <option value="KG">Kilograms (kg)</option>
                  <option value="GRAMS">Grams (g)</option>
                </select>
              </div>
            </div>

            {/* Row 3: Quantitative Distribution (Prepared, Served, Donated, Discarded) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Quantity Allocation (Conservation of Quantity)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prepared *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={entryPrepared}
                    onChange={(e) => setEntryPrepared(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 100"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1">
                    Served / Sold *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={entryServed}
                    onChange={(e) => setEntryServed(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 80"
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-sm font-semibold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-indigo-800 mb-1">
                    Donated (Past)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={entryDonated}
                    onChange={(e) => setEntryDonated(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-sm font-semibold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-800 mb-1">
                    Discarded
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={entryDiscarded}
                    onChange={(e) => setEntryDiscarded(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 text-sm font-semibold text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Dynamic Remaining Indicator */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                  isEntryOverDistributed
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isEntryOverDistributed ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  <span>
                    {isEntryOverDistributed
                      ? 'Error: Sum of Served + Donated + Discarded exceeds Prepared quantity!'
                      : 'Automatically Computed Unallocated Remaining:'}
                  </span>
                </div>
                <span className="text-base font-black font-mono">
                  {calculatedRemaining} {entryUnit}
                </span>
              </div>
            </div>

            {/* Row 4: Customers & Optional Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customers or People Served (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={entryCustomers}
                  onChange={(e) => setEntryCustomers(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 95"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contextual Notes (Optional)
                </label>
                <input
                  type="text"
                  value={entryNotes}
                  onChange={(e) => setEntryNotes(e.target.value)}
                  placeholder="e.g. Rainy weather, college fest weekend"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveView('advisor')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition"
              >
                Back to Advisor
              </button>
              <button
                type="submit"
                disabled={submittingEntry || isEntryOverDistributed}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition flex items-center gap-2"
              >
                {submittingEntry ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusCircle className="w-4 h-4" />
                )}
                Save Preparation Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: PREPARATION HISTORY & SURPLUS DONATION HANDOFF */}
      {/* ======================================================== */}
      {activeView === 'history' && (
        <div
          className="bg-white rounded-3xl border border-[#DCE9DE] shadow-sm p-6 sm:p-8 space-y-6 animate-box-rise"
          style={{ animationDelay: '280ms' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
                Section 7 • Redistribution Handoff
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Preparation History & Surplus Donation Handoff
              </h2>
              <p className="text-xs text-slate-500">
                Review logged meals. When edible leftover surplus remains, seamlessly pre-fill a donation listing
                for verified NGO redistribution.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search food item, date..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
              />
            </div>
          </div>

          {loadingHistory ? (
            <div className="py-12 flex justify-center text-slate-400 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No preparation records match the current search or filters.</p>
              <button
                onClick={() => setActiveView('tracker')}
                className="text-emerald-700 font-bold hover:underline"
              >
                Log your first meal preparation
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-3">Meal Period</th>
                    <th className="py-3 px-4">Food Item</th>
                    <th className="py-3 px-3">Prepared</th>
                    <th className="py-3 px-3">Served</th>
                    <th className="py-3 px-3">Donated</th>
                    <th className="py-3 px-3">Discarded</th>
                    <th className="py-3 px-3 font-bold text-slate-900">Remaining</th>
                    <th className="py-3 px-4 text-right">Redistribution Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredHistory.map((rec) => {
                    const hasRemaining = rec.quantityRemaining > 0;
                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-900 whitespace-nowrap">
                          {rec.recordDate}
                          <span className="block text-[10px] text-slate-400 font-sans">
                            {rec.dayOfWeek}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {rec.mealPeriod}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {rec.foodItemName}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            {rec.foodCategory}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-mono">{rec.quantityPrepared} {rec.unit}</td>
                        <td className="py-3.5 px-3 font-mono text-emerald-700">{rec.quantityConsumed} {rec.unit}</td>
                        <td className="py-3.5 px-3 font-mono text-indigo-700">{rec.quantityDonated} {rec.unit}</td>
                        <td className="py-3.5 px-3 font-mono text-rose-700">{rec.quantityDiscarded} {rec.unit}</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-1 rounded-lg font-bold font-mono ${
                              hasRemaining
                                ? 'bg-amber-100 text-amber-900 border border-amber-300/60'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {rec.quantityRemaining} {rec.unit}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {hasRemaining ? (
                            <button
                              onClick={() => handleInitiateDonation(rec)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm transition inline-flex items-center gap-1.5"
                            >
                              <HeartHandshake className="w-3.5 h-3.5" />
                              Donate Remaining
                            </button>
                          ) : rec.quantityDonated > 0 ? (
                            <span className="text-[11px] text-indigo-700 font-semibold inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              Donated
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Zero leftover</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
