import React, { useState, useEffect } from 'react';
import { Award, Zap, ArrowUpDown, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ScoreBreakdown {
  distanceScore: number;
  urgencyScore: number;
  quantityScore: number;
  foodTypeScore: number;
  capacityScore: number;
  reliabilityScore: number;
}

interface RankedItem {
  listingId: string;
  foodName: string;
  providerName: string;
  quantity: string;
  minutesRemaining: number;
  urgencyLevel: string;
  mcdaPriorityScore: number;
  baselineNearestScore: number;
  matchedReceiverName: string;
  distanceKm: number;
  scoreBreakdown: ScoreBreakdown;
  priorityRankingTier: string;
}

export const RescuePriorityPage: React.FC = () => {
  const { t } = useLanguage();
  const [rankings, setRankings] = useState<RankedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rescue-priority/rankings');
      const json = await res.json();
      if (json.success && json.data) {
        setRankings(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Intelligence Module • Feature 14
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
              6-Factor Multi-Criteria Decision Analysis (MCDA)
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">
            {t('nav_rescue_priority', 'Food Rescue Priority Scoring & Dispatch Engine')}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Empirical comparison of SurplusFlow 6-factor MCDA vs simplistic nearest-neighbor proximity baseline. Factoring in perishability, quantity fit, dietary compliance, and receiver reliability.
          </p>
        </div>

        <button
          onClick={fetchRankings}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-semibold transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Recalculate Priorities
        </button>
      </div>

      {/* MCDA Weights Explanation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Proximity Distance', weight: '25%', desc: 'Haversine km to hub' },
          { label: 'Time Urgency', weight: '25%', desc: 'Safe thermal window' },
          { label: 'Quantity Match', weight: '20%', desc: 'Batch vs capacity fit' },
          { label: 'Dietary Compatibility', weight: '10%', desc: 'Veg / Non-veg match' },
          { label: 'Receiver Capacity', weight: '10%', desc: 'Available storage room' },
          { label: 'Historical Trust', weight: '10%', desc: 'Verified track record' },
        ].map((w, idx) => (
          <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-sm">
            <div className="text-emerald-700 font-extrabold text-lg">{w.weight}</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">{w.label}</div>
            <div className="text-[10px] text-slate-400 mt-1">{w.desc}</div>
          </div>
        ))}
      </div>

      {/* Rankings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            Ranked Rescue Queue ({rankings.length} Active Surplus Batches)
          </h2>
          <span className="text-xs text-slate-400">Higher MCDA score = dispatched first</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Rank / Tier</th>
                <th className="py-3 px-4">Food Item</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Best Matched Receiver</th>
                <th className="py-3 px-4">Distance</th>
                <th className="py-3 px-4">Remaining Safe Window</th>
                <th className="py-3 px-4">SurplusFlow MCDA</th>
                <th className="py-3 px-4">Nearest-Neighbor Baseline</th>
                <th className="py-3 px-4">Priority Differential</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {rankings.map((r, index) => {
                const diff = Math.round((r.mcdaPriorityScore - r.baselineNearestScore) * 10) / 10;
                return (
                  <tr key={r.listingId} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">
                          #{index + 1}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.priorityRankingTier === 'TIER_1_IMMEDIATE'
                            ? 'bg-rose-100 text-rose-800'
                            : r.priorityRankingTier === 'TIER_2_HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {r.priorityRankingTier.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{r.foodName}</td>
                    <td className="py-3 px-4">{r.providerName}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-800">{r.matchedReceiverName}</td>
                    <td className="py-3 px-4">{r.distanceKm} km</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.minutesRemaining <= 60 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {r.minutesRemaining} mins left
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-700 font-extrabold text-sm">{r.mcdaPriorityScore}</span> / 100
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {r.baselineNearestScore} / 100
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        diff >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {diff >= 0 ? `+${diff}` : diff} pts
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
