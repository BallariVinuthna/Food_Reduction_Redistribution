import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, Award, CheckCircle2, TrendingUp, FileText, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LedgerEntry {
  transactionId: string;
  foodName: string;
  donor: string;
  receiver: string;
  volunteer: string;
  quantityDelivered: number;
  unit: string;
  deliveredAt: string;
  otpVerified: boolean;
  wasteAvoidedKg: number;
  emissionsAvoidedKgCo2e: number;
  economicValueSavedInr: number;
}

interface LedgerSummary {
  totalMealsOffered: number;
  totalMealsReserved: number;
  totalMealsDelivered: number;
  totalMealsDiscarded: number;
  completedDeliveryMissions: number;
  foodWasteAvoidedKg: number;
  co2eEmissionsAvoidedKg: number;
  economicValueSavedInr: number;
  redistributionSuccessRatePct: number;
  dataCompletenessPct: number;
  counterfactualMethodology: string;
  entries: LedgerEntry[];
}

export const VerifiedImpactLedgerPage: React.FC = () => {
  const { t } = useLanguage();
  const [summary, setSummary] = useState<LedgerSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLedger = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ledger/summary');
      const json = await res.json();
      if (json.success && json.data) {
        setSummary(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleExportCsv = () => {
    window.open('/api/ledger/export-csv', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Administration Module • Feature 12
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
              UNEP Counterfactual Audit Ledger
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">
            {t('nav_impact_ledger', 'Verified Impact & ESG Audit Ledger')}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Immutable physical handover records with dual OTP verification. Counterfactual baseline prevents carbon credit inflation or double counting.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
        >
          <Download className="w-4 h-4" />
          Download ESG Audit CSV
        </button>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Verified Meals Delivered</div>
            <div className="text-3xl font-extrabold text-emerald-700 mt-2">
              {summary.totalMealsDelivered} <span className="text-sm font-normal text-slate-500">meals</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">OTP cryptographic sign-off</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Edible Waste Prevented</div>
            <div className="text-3xl font-extrabold text-blue-700 mt-2">
              {summary.foodWasteAvoidedKg} <span className="text-sm font-normal text-slate-500">kg</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">0.40 kg baseline standard per meal</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">CO2e Emissions Reduced</div>
            <div className="text-3xl font-extrabold text-purple-700 mt-2">
              {summary.co2eEmissionsAvoidedKg} <span className="text-sm font-normal text-slate-500">kg CO2e</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">2.5 kg CO2e / kg food waste avoided</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Economic Value Salvaged</div>
            <div className="text-3xl font-extrabold text-amber-700 mt-2">
              ₹{summary.economicValueSavedInr?.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">₹60 standard meal value</p>
          </div>
        </div>
      )}

      {/* Methodology Notice */}
      {summary && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">Counterfactual Verification Standard</div>
            <p>{summary.counterfactualMethodology}</p>
          </div>
        </div>
      )}

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Immutable Transaction Ledger
          </h2>
          <span className="text-xs text-slate-400">{summary?.entries?.length || 0} Verified Missions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Delivered At</th>
                <th className="py-3 px-4">Donor</th>
                <th className="py-3 px-4">Receiver</th>
                <th className="py-3 px-4">Volunteer</th>
                <th className="py-3 px-4">Delivered Qty</th>
                <th className="py-3 px-4">CO2e Saved</th>
                <th className="py-3 px-4">Value (INR)</th>
                <th className="py-3 px-4">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {summary?.entries?.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No completed delivery missions recorded yet. As volunteers confirm OTP handovers, verified entries appear here.
                  </td>
                </tr>
              ) : (
                summary?.entries?.map((e) => (
                  <tr key={e.transactionId} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-500">{e.transactionId.substring(0, 8)}...</td>
                    <td className="py-3 px-4">{e.deliveredAt?.split('T')[0]}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{e.donor}</td>
                    <td className="py-3 px-4">{e.receiver}</td>
                    <td className="py-3 px-4">{e.volunteer}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{e.quantityDelivered} {e.unit}</td>
                    <td className="py-3 px-4 text-purple-700 font-semibold">{e.emissionsAvoidedKgCo2e} kg</td>
                    <td className="py-3 px-4">₹{e.economicValueSavedInr}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        OTP VERIFIED
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
