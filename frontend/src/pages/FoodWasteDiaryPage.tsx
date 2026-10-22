import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Plus, Trash2, PieChart, AlertCircle, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface WasteSummary {
  totalWasteRecordedKg: number;
  totalEconomicLossInr: number;
  entryCount: number;
  wasteByReason: { [key: string]: number };
  wasteByCategory: { [key: string]: number };
}

interface WasteEntry {
  id: string;
  providerId: string;
  date: string;
  foodName: string;
  foodCategory: string;
  wasteReason: string;
  quantityLostKg: number;
  estimatedCostInr: number;
  notes: string;
}

export const FoodWasteDiaryPage: React.FC = () => {
  const { t } = useLanguage();
  const [summary, setSummary] = useState<WasteSummary | null>(null);
  const [entries, setEntries] = useState<WasteEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New Entry Form State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    foodName: 'Rice & Curry Residuals',
    foodCategory: 'COOKED_MEALS',
    wasteReason: 'OVER_PREPARATION',
    quantityLostKg: 12.5,
    estimatedCostInr: 650,
    notes: 'Late cancellation of banquet table.'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const sumRes = await fetch('/api/waste-diary/summary');
      const sumJson = await sumRes.json();
      if (sumJson.success && sumJson.data) {
        setSummary(sumJson.data);
      }

      const listRes = await fetch('/api/waste-diary/entries');
      const listJson = await listRes.json();
      if (listJson.success && listJson.data) {
        setEntries(listJson.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/waste-diary/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/waste-diary/export-csv', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Operations Module • Feature 10
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
              Mass-Balance Quantity Accounting
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">
            {t('nav_waste_diary', 'Donor Food Waste Diary')}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track daily kitchen discards, root cause reasons (Over-prep, Cold-chain breakdown, Buffet leftover), and download audit-ready CSV reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Record Discard
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Total Food Lost (Month-to-Date)</div>
            <div className="text-3xl font-extrabold text-rose-600 mt-2">
              {summary.totalWasteRecordedKg} <span className="text-sm font-normal text-slate-500">kg</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{summary.entryCount} recorded incidents</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Estimated Financial Value Lost</div>
            <div className="text-3xl font-extrabold text-amber-700 mt-2">
              ₹{summary.totalEconomicLossInr?.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">Based on commercial prep cost</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Primary Loss Cause</div>
            <div className="text-2xl font-extrabold text-slate-800 mt-2">
              Over-Preparation (45%)
            </div>
            <p className="text-xs text-emerald-600 mt-1">Addressable with Surplus Prediction</p>
          </div>
        </div>
      )}

      {/* Diary Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Kitchen Discard Log Entries
          </h2>
          <span className="text-xs text-slate-400">{entries.length} Entries Logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Food Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Root Cause Reason</th>
                <th className="py-3 px-4">Quantity Lost</th>
                <th className="py-3 px-4">Est. Loss (INR)</th>
                <th className="py-3 px-4">Kitchen Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold text-slate-900">{e.date}</td>
                  <td className="py-3 px-4">{e.foodName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {e.foodCategory}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {e.wasteReason}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-rose-600">{e.quantityLostKg} kg</td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">₹{e.estimatedCostInr}</td>
                  <td className="py-3 px-4 text-slate-400 max-w-[200px] truncate" title={e.notes}>
                    {e.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Waste Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Record Kitchen Food Discard</h3>

            <form onSubmit={handleCreateEntry} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Quantity Lost (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={formData.quantityLostKg}
                    onChange={(e) => setFormData({ ...formData, quantityLostKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Food Item Name</label>
                <input
                  type="text"
                  value={formData.foodName}
                  onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Waste Reason</label>
                  <select
                    value={formData.wasteReason}
                    onChange={(e) => setFormData({ ...formData, wasteReason: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="OVER_PREPARATION">OVER_PREPARATION</option>
                    <option value="BUFFET_RESIDUAL">BUFFET_RESIDUAL</option>
                    <option value="SPOILAGE">SPOILAGE</option>
                    <option value="COLD_CHAIN_FAILURE">COLD_CHAIN_FAILURE</option>
                    <option value="EXPIRED_DATE">EXPIRED_DATE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Est. Loss (INR)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estimatedCostInr}
                    onChange={(e) => setFormData({ ...formData, estimatedCostInr: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Notes / Context</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Save Discard Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
