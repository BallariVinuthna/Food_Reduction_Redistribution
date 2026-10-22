import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, AlertCircle } from 'lucide-react';

interface DonorScorecard {
  providerId: string;
  providerName: string;
  totalTransactionsCount: number;
  completedFulfillments: number;
  hasMinimumSampleSize: boolean;
  fulfillmentRatePct: number;
  quantityAccuracyPct: number;
  cancellationRatePct: number;
  compositeTrustScore: number | null;
  trustTierBadge: 'PLATINUM_TRUST' | 'GOLD_VERIFIED' | 'STANDARD_ACTIVE' | 'NEW_PARTNER';
  operationalSafetyCertified: boolean;
}

interface DonorReliabilityBadgeProps {
  providerId: string;
}

export const DonorReliabilityBadge: React.FC<DonorReliabilityBadgeProps> = ({ providerId }) => {
  const [scorecard, setScorecard] = useState<DonorScorecard | null>(null);

  useEffect(() => {
    fetch(`/api/donors/${providerId}/reliability`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setScorecard(json.data);
      })
      .catch((err) => console.error(err));
  }, [providerId]);

  if (!scorecard) return null;

  if (!scorecard.hasMinimumSampleSize) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200" title="New Partner: needs at least 3 completed physical handovers for trust score calculation">
        <AlertCircle className="w-3 h-3 text-slate-400" />
        New Partner (Building Track Record)
      </span>
    );
  }

  const isPlatinum = scorecard.trustTierBadge === 'PLATINUM_TRUST';
  const isGold = scorecard.trustTierBadge === 'GOLD_VERIFIED';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
        isPlatinum
          ? 'bg-purple-50 text-purple-800 border-purple-200'
          : isGold
          ? 'bg-amber-50 text-amber-800 border-amber-200'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
      }`}
      title={`Trust Score: ${scorecard.compositeTrustScore}% • Fulfillment: ${scorecard.fulfillmentRatePct}% • Quantity Accuracy: ${scorecard.quantityAccuracyPct}%`}
    >
      <ShieldCheck className="w-3 h-3 text-emerald-600" />
      {scorecard.trustTierBadge.replace(/_/g, ' ')} ({scorecard.compositeTrustScore}%)
    </span>
  );
};
