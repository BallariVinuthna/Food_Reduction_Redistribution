import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DashboardAnalytics, FieldWasteRecord } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  Sliders,
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  IndianRupee,
  Download,
  Filter,
  Info,
  Calendar,
  AlertCircle,
  ClipboardList,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';

export const AdminAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [fieldRecords, setFieldRecords] = useState<FieldWasteRecord[]>([]);

  // Filter States
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [locality, setLocality] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  // Admin Weights State
  const [wDist, setWDist] = useState(0.30);
  const [wQty, setWQty] = useState(0.20);
  const [wUrg, setWUrg] = useState(0.20);
  const [wType, setWType] = useState(0.15);
  const [wCap, setWCap] = useState(0.10);
  const [wAvail, setWAvail] = useState(0.05);
  const [radiusKm, setRadiusKm] = useState(25.0);
  const [savedConfigMessage, setSavedConfigMessage] = useState<string | null>(null);

  // Field Record Modal State
  const [showLogModal, setShowLogModal] = useState(false);
  const [newVenueName, setNewVenueName] = useState('');
  const [newVenueType, setNewVenueType] = useState('RESTAURANT');
  const [newLocality, setNewLocality] = useState('Banjara Hills');
  const [newCategory, setNewCategory] = useState('COOKED_MEALS');
  const [newQuantity, setNewQuantity] = useState(15.0);
  const [newAuditorName, setNewAuditorName] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const fetchAnalytics = () => {
    setLoading(true);
    api.getAnalytics({
      startDate: startDate ? `${startDate}T00:00:00` : undefined,
      endDate: endDate ? `${endDate}T23:59:59` : undefined,
      locality: locality || undefined,
      category: category || undefined,
    })
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchFieldRecords = () => {
    api.getFieldWasteRecords(false)
      .then(res => setFieldRecords(res.content || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchAnalytics();
    fetchFieldRecords();
  }, [startDate, endDate, locality, category]);

  const handleExportSummaryCsv = async () => {
    try {
      const blob = await api.exportAnalyticsSummaryCsv(
        startDate ? `${startDate}T00:00:00` : undefined,
        endDate ? `${endDate}T23:59:59` : undefined
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-summary-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    } catch (e: any) {
      alert('Failed to export summary CSV: ' + e.message);
    }
  };

  const handleExportTransactionsCsv = async () => {
    try {
      const blob = await api.exportTransactionsCsv(
        startDate ? `${startDate}T00:00:00` : undefined,
        endDate ? `${endDate}T23:59:59` : undefined
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `donation-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    } catch (e: any) {
      alert('Failed to export transactions CSV: ' + e.message);
    }
  };

  const handleExportFieldWasteCsv = async () => {
    try {
      const blob = await api.exportFieldWasteCsv(false);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `empirical-field-waste-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    } catch (e: any) {
      alert('Failed to export field waste CSV: ' + e.message);
    }
  };

  const handleCreateFieldRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.logFieldWasteRecord({
        venueName: newVenueName,
        venueType: newVenueType,
        locality: newLocality,
        foodCategory: newCategory,
        quantity: newQuantity,
        unit: 'KG',
        observationShift: 'DINNER_AUDIT',
        dataSource: 'AUDITOR_PHYSICAL_SCALE',
        auditorName: newAuditorName || 'Field Auditor',
        notes: newNotes,
        demo: false,
      });
      setShowLogModal(false);
      fetchFieldRecords();
      fetchAnalytics();
      alert('Empirical field waste observation logged successfully.');
    } catch (err: any) {
      alert('Failed to log audit record: ' + err.message);
    }
  };

  const handleSaveWeights = async () => {
    try {
      const sum = wDist + wQty + wUrg + wType + wCap + wAvail;
      if (Math.abs(sum - 1.0) > 0.05) {
        alert(`Warning: Current weights sum to ${Math.round(sum * 100)}%. Recommended total is 100%.`);
      }
      await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weightDistance: wDist,
          weightQuantity: wQty,
          weightUrgency: wUrg,
          weightFoodType: wType,
          weightCapacity: wCap,
          weightAvailability: wAvail,
          maxSearchRadiusKm: radiusKm,
        }),
      });
      setSavedConfigMessage('Matching weights and system parameters updated successfully!');
      setTimeout(() => setSavedConfigMessage(null), 4000);
    } catch (err: any) {
      alert('Failed to save configuration: ' + err.message);
    }
  };

  const hasData = analytics && analytics.totalListings > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-lime-300 uppercase tracking-wider">
            Operational Intelligence & Impact Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">System Impact Analytics</h1>
          <p className="text-xs text-emerald-200 mt-1 max-w-2xl">
            Real-world persistent operational records, verified OTP handovers, database-backed calculations, and empirical field audits across Hyderabad.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportSummaryCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-semibold border border-emerald-600/40 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Summary CSV</span>
          </button>
          <button
            onClick={handleExportTransactionsCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-800/80 hover:bg-teal-700 text-white text-xs font-semibold border border-teal-600/40 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Transactions CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filter Operational Records:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-emerald-500"
              placeholder="Start Date"
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-emerald-500"
              placeholder="End Date"
            />
          </div>

          <select
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-emerald-500"
          >
            <option value="">All Hyderabad Localities</option>
            <option value="Banjara Hills">Banjara Hills</option>
            <option value="Hitec City">Hitec City</option>
            <option value="Secunderabad">Secunderabad</option>
            <option value="Gachibowli">Gachibowli</option>
            <option value="Jubilee Hills">Jubilee Hills</option>
            <option value="Kukatpally">Kukatpally</option>
            <option value="Ameerpet">Ameerpet</option>
            <option value="Begumpet">Begumpet</option>
            <option value="Charminar">Charminar</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-emerald-500"
          >
            <option value="">All Categories</option>
            <option value="COOKED_MEALS">Cooked Meals</option>
            <option value="RAW_INGREDIENTS">Raw Ingredients</option>
            <option value="PACKAGED_GROCERIES">Packaged Groceries</option>
            <option value="BAKERY_BREAD">Bakery & Bread</option>
            <option value="FRUITS_VEGETABLES">Fruits & Vegetables</option>
            <option value="DAIRY">Dairy</option>
          </select>

          {(startDate || endDate || locality || category) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setLocality('');
                setCategory('');
              }}
              className="text-xs text-emerald-700 hover:text-emerald-900 underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Empty State Banner when no real data exists */}
      {!loading && !hasData && (
        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-4 shadow-xs">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm">No data yet</h3>
            <p className="text-xs text-amber-800 mt-1">
              There are no recorded food surplus batches or completed redistribution transactions matching the selected filters.
              The system calculates all indicators directly from operational database records without inventing fallback numbers.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Verified Delivered Meals */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="font-semibold text-slate-700">Verified Delivered Meals</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {hasData ? (analytics?.actualVerifiedDeliveredMeals ?? 0) : '0'} <span className="text-sm font-normal text-slate-500">meals</span>
          </p>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>OTP Verified Handover Audit</span>
          </div>
        </div>

        {/* Card 2: Food Waste Avoided (Estimated Index) */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="font-semibold text-slate-700">Estimated Waste Avoided</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {hasData ? (analytics?.estimatedFoodWasteAvoidedKg ?? 0).toFixed(1) : '0.0'} <span className="text-sm font-normal text-slate-500">kg</span>
          </p>
          <div className="mt-2 text-[10px] text-slate-500 flex items-start gap-1">
            <Info className="w-3 h-3 text-teal-600 shrink-0 mt-0.5" />
            <span>Formula: 0.4 kg/meal standard EPA diversion model</span>
          </div>
        </div>

        {/* Card 3: Estimated Economic Value (Estimated Index) */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="font-semibold text-slate-700">Estimated Economic Value</span>
            <IndianRupee className="w-4 h-4 text-lime-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            ₹{hasData ? (analytics?.estimatedValueSavedInr?.toLocaleString() ?? '0') : '0'}
          </p>
          <div className="mt-2 text-[10px] text-slate-500 flex items-start gap-1">
            <Info className="w-3 h-3 text-lime-600 shrink-0 mt-0.5" />
            <span>Formula: ₹60 / meal commercial baseline value</span>
          </div>
        </div>

        {/* Card 4: Empirical Field Waste Logged */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="font-semibold text-slate-700">Field-Observed Waste</span>
            <ClipboardList className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {(analytics?.fieldObservedWasteKg ?? 0).toFixed(1)} <span className="text-sm font-normal text-slate-500">kg</span>
          </p>
          <div className="mt-2 text-[11px] text-purple-700 font-medium">
            Empirical Physical Audits
          </div>
        </div>
      </div>

      {/* Operational Latencies Ribbon (No hardcoded values: displays "No data yet" when empty) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500">Avg Matching Latency</span>
          <p className="text-lg font-bold text-slate-900 mt-1">
            {analytics?.averageMatchingTimeSeconds != null
              ? `${analytics.averageMatchingTimeSeconds}s`
              : 'No data yet'}
          </p>
          <span className="text-[10px] text-slate-400">Database match algorithm execution</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500">Avg Listing to Accept</span>
          <p className="text-lg font-bold text-slate-900 mt-1">
            {analytics?.averageListingToAcceptanceMinutes != null
              ? `${analytics.averageListingToAcceptanceMinutes} mins`
              : 'No data yet'}
          </p>
          <span className="text-[10px] text-slate-400">Recipient response interval</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500">Avg Pickup Transit</span>
          <p className="text-lg font-bold text-slate-900 mt-1">
            {analytics?.averagePickupTimeMinutes != null
              ? `${analytics.averagePickupTimeMinutes} mins`
              : 'No data yet'}
          </p>
          <span className="text-[10px] text-slate-400">Assigned to kitchen collection</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500">Avg Delivery Transit</span>
          <p className="text-lg font-bold text-slate-900 mt-1">
            {analytics?.averageDeliveryTimeMinutes != null
              ? `${analytics.averageDeliveryTimeMinutes} mins`
              : 'No data yet'}
          </p>
          <span className="text-[10px] text-slate-400">Collection to receiver handover</span>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Listed vs Redistributed Trends */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Food Surplus Listed vs. Redistributed (Meals)</h3>
            <p className="text-xs text-slate-500">Database-backed operational daily totals</p>
          </div>
          <div className="h-64">
            {analytics?.trendData && analytics.trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="listed" stroke="#94a3b8" fill="#e2e8f0" name="Surplus Listed" />
                  <Area type="monotone" dataKey="redistributed" stroke="#059669" fill="#d1fae5" name="Redistributed" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No trend activity recorded for the active filters.
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Location-wise Redistribution in Hyderabad */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Regional Distribution by Hyderabad Hub</h3>
            <p className="text-xs text-slate-500">Deliveries grouped by donor kitchen locality</p>
          </div>
          <div className="h-64">
            {analytics?.locationBreakdown && analytics.locationBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.locationBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="area" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="meals" fill="#0d9488" radius={[8, 8, 0, 0]} name="Meals Redistributed" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No regional redistribution data recorded.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Empirical Field Waste Audits Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-purple-700" />
              <h3 className="font-bold text-base text-slate-900">
                Empirical Field Waste Audit Log (Real-World Evidence)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Physical scale weigh-ins and kitchen observations kept strictly separate from prototype simulations and demo data.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportFieldWasteCsv}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audits CSV</span>
            </button>
            <button
              onClick={() => setShowLogModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Field Audit</span>
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Venue / Facility</th>
                <th className="py-2.5 px-3">Locality</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Measured Waste</th>
                <th className="py-2.5 px-3">Method / Scale</th>
                <th className="py-2.5 px-3">Auditor</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fieldRecords.length > 0 ? (
                fieldRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{r.venueName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.locality}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.foodCategory}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{r.quantity} {r.unit}</td>
                    <td className="py-2.5 px-3 text-slate-500">{r.dataSource}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.auditorName}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.verificationStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-slate-400">
                    No empirical field waste audit entries recorded yet. Click "Log Field Audit" to record live measurements.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Field Audit Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Log Empirical Field Waste Observation</h3>
            <p className="text-xs text-slate-500">
              Record physical measurements from kitchen scales or plate waste audits. This will be persisted with is_demo = false.
            </p>

            <form onSubmit={handleCreateFieldRecord} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Venue Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad Marriott Kitchen"
                  value={newVenueName}
                  onChange={(e) => setNewVenueName(e.target.value)}
                  className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Locality</label>
                  <input
                    type="text"
                    required
                    value={newLocality}
                    onChange={(e) => setNewLocality(e.target.value)}
                    className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full mt-1 border border-slate-200 rounded-xl px-2 py-2 text-xs"
                  >
                    <option value="COOKED_MEALS">Cooked Meals</option>
                    <option value="RAW_INGREDIENTS">Raw Ingredients</option>
                    <option value="BAKERY_BREAD">Bakery & Bread</option>
                    <option value="BUFFET_SURPLUS">Buffet Surplus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Measured Quantity (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Auditor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Auditor initials/name"
                    value={newAuditorName}
                    onChange={(e) => setNewAuditorName(e.target.value)}
                    className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Audit Notes</label>
                <textarea
                  rows={2}
                  placeholder="Observation methodology, physical scale tare notes..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-1.5 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold cursor-pointer"
                >
                  Save Field Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Matching Weights Configuration Tuning Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-base text-slate-900">
                MCDA Smart Matching Engine Weights Configuration
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Administrators can tune multi-criteria weights to balance geographic proximity, urgency, and recipient capacity.
            </p>
          </div>

          <button
            onClick={handleSaveWeights}
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
          >
            Save Weight Parameters
          </button>
        </div>

        {savedConfigMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{savedConfigMessage}</span>
          </div>
        )}

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>Location Proximity Weight</span>
              <span className="text-emerald-800">{Math.round(wDist * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.60}
              step={0.05}
              value={wDist}
              onChange={(e) => setWDist(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Favors receivers closest to donor via Haversine</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>Quantity Fit Weight</span>
              <span className="text-emerald-800">{Math.round(wQty * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.50}
              step={0.05}
              value={wQty}
              onChange={(e) => setWQty(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Evaluates meal quantity matching shelter capacity</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>Urgency Level Weight</span>
              <span className="text-emerald-800">{Math.round(wUrg * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.50}
              step={0.05}
              value={wUrg}
              onChange={(e) => setWUrg(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Boosts priority for food with &lt; 60 mins remaining</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>Dietary Suitability Weight</span>
              <span className="text-emerald-800">{Math.round(wType * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.40}
              step={0.05}
              value={wType}
              onChange={(e) => setWType(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Matches vegetarian/non-vegetarian preferences</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>Receiver Capacity Headroom</span>
              <span className="text-emerald-800">{Math.round(wCap * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.30}
              step={0.05}
              value={wCap}
              onChange={(e) => setWCap(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Prevents assigning small lots to giant centers</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-800">
              <span>Max Search Radius</span>
              <span className="text-emerald-800">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Max geographic boundary in Hyderabad</p>
          </div>
        </div>
      </div>
    </div>
  );
};
