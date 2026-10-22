import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Zap, MapPin, CheckCircle, ChevronRight, X } from 'lucide-react';

interface UrgencyAlert {
  listingId: string;
  foodName: string;
  providerName: string;
  quantity: string;
  address: string;
  minutesRemaining: number;
  urgencyCategory: string;
  priorityRank: number;
  actionRecommendation: string;
  availableUntil: string;
}

export const SmartUrgencyAlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<UrgencyAlert[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/urgency/active-alerts');
      const json = await res.json();
      if (json.success && json.data) {
        setAlerts(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const criticalCount = alerts.filter(a => a.minutesRemaining <= 60).length;

  return (
    <div className="relative">
      {/* Floating Trigger Button if critical alerts exist */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
          criticalCount > 0
            ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
            : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
        }`}
      >
        <AlertTriangle className="w-4 h-4" />
        <span>Urgency Radar ({alerts.length})</span>
      </button>

      {/* Drawer / Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-10 w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              Smart Urgency Alerts
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {alerts.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No active perishable urgency alerts right now. All batches within comfortable pickup windows.
              </div>
            ) : (
              alerts.map((a) => {
                const isCritical = a.minutesRemaining <= 60;
                return (
                  <div
                    key={a.listingId}
                    className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                      isCritical
                        ? 'bg-rose-50/50 border-rose-200 text-rose-950'
                        : 'bg-amber-50/50 border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{a.foodName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        isCritical ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                      }`}>
                        {a.minutesRemaining} mins left
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-center justify-between">
                      <span>Donor: {a.providerName}</span>
                      <span className="font-bold text-emerald-700">{a.quantity}</span>
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {a.address}
                    </div>

                    <div className="pt-1 border-t border-slate-200/60 font-medium text-[11px] text-rose-700 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-rose-500 shrink-0" />
                      {a.actionRecommendation}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
