import React, { useState } from 'react';
import { Match } from '../types';
import { Info, Sparkles, MapPin, Scale, Zap, UtensilsCrossed, Building2, ShieldCheck } from 'lucide-react';

interface MatchScoreBadgeProps {
  match: Match;
  size?: 'sm' | 'md' | 'lg';
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({ match, size = 'md' }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (score >= 70) return 'bg-teal-100 text-teal-900 border-teal-300';
    if (score >= 55) return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-red-100 text-red-900 border-red-300';
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className={`inline-flex items-center gap-1.5 font-bold rounded-xl border transition-transform hover:scale-105 shadow-2xs ${getScoreColor(
          match.matchScore
        )} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-4 py-2 text-base' : 'px-3 py-1 text-sm'}`}
      >
        <Sparkles className="w-4 h-4 text-emerald-600" />
        <span>{match.matchScore}% Match</span>
        <Info className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
      </button>

      {/* Multicriteria Score Breakdown Modal / Tooltip */}
      {showBreakdown && (
        <div className="absolute right-0 top-full mt-2 w-80 p-4 rounded-2xl bg-white shadow-2xl border border-slate-200 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h5 className="font-bold text-xs text-slate-900">Multi-Criteria Score Breakdown</h5>
              <p className="text-[10px] text-slate-500">MCDA Algorithmic Evaluation</p>
            </div>
            <span className="font-extrabold text-emerald-700 text-sm">{match.matchScore}%</span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            {/* Distance */}
            <div>
              <div className="flex items-center justify-between text-slate-700 mb-0.5">
                <span className="flex items-center gap-1 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> Location (30% wt): {match.distanceKm} km
                </span>
                <span className="font-semibold text-slate-900">{match.locationScore} / 100</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${match.locationScore}%` }} />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <div className="flex items-center justify-between text-slate-700 mb-0.5">
                <span className="flex items-center gap-1 text-[11px]">
                  <Scale className="w-3.5 h-3.5 text-teal-600" /> Quantity Fit (20% wt): {match.quantity} {match.unit}
                </span>
                <span className="font-semibold text-slate-900">{match.quantityScore} / 100</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${match.quantityScore}%` }} />
              </div>
            </div>

            {/* Urgency */}
            <div>
              <div className="flex items-center justify-between text-slate-700 mb-0.5">
                <span className="flex items-center gap-1 text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Urgency Weight (20% wt)
                </span>
                <span className="font-semibold text-slate-900">{match.urgencyScore} / 100</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${match.urgencyScore}%` }} />
              </div>
            </div>

            {/* Food Type */}
            <div>
              <div className="flex items-center justify-between text-slate-700 mb-0.5">
                <span className="flex items-center gap-1 text-[11px]">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" /> Dietary Compatibility (15% wt)
                </span>
                <span className="font-semibold text-slate-900">{match.foodTypeScore} / 100</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${match.foodTypeScore}%` }} />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <div className="flex items-center justify-between text-slate-700 mb-0.5">
                <span className="flex items-center gap-1 text-[11px]">
                  <Building2 className="w-3.5 h-3.5 text-purple-600" /> Receiver Capacity (10% wt)
                </span>
                <span className="font-semibold text-slate-900">{match.capacityScore} / 100</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${match.capacityScore}%` }} />
              </div>
            </div>

            {/* Reliability */}
            <div>
              <div className="flex items-center justify-between text-slate-700 mb-0.5">
                <span className="flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Reliability Record (5% wt)
                </span>
                <span className="font-semibold text-slate-900">{match.reliabilityScore} / 100</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-700 h-1.5 rounded-full" style={{ width: `${match.reliabilityScore}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Estimated Pickup Transit:</span>
            <span className="font-bold text-slate-800">~{match.estimatedPickupMinutes} mins</span>
          </div>

          <button
            onClick={() => setShowBreakdown(false)}
            className="w-full mt-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
