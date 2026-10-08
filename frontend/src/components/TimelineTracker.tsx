import React from 'react';
import { FoodStatus } from '../types';
import { CheckCircle2, Circle, Clock, PackageCheck } from 'lucide-react';

interface TimelineTrackerProps {
  currentStatus: FoodStatus;
  compact?: boolean;
}

const STAGES: { key: FoodStatus; label: string; desc: string }[] = [
  { key: 'AVAILABLE', label: '1. Listed', desc: 'Surplus registered' },
  { key: 'RESERVED', label: '2. Matched', desc: 'Ranked receivers scored' },
  { key: 'ACCEPTED', label: '3. Accepted', desc: 'Receiver accepted' },
  { key: 'PICKUP_ASSIGNED', label: '4. Transit Assigned', desc: 'Volunteer assigned' },
  { key: 'COLLECTED', label: '5. Collected', desc: 'Picked up from donor' },
  { key: 'REDISTRIBUTED', label: '6. Redistributed', desc: 'Nourishment delivered' },
];

export const TimelineTracker: React.FC<TimelineTrackerProps> = ({ currentStatus, compact = false }) => {
  const getStageIndex = (status: FoodStatus): number => {
    switch (status) {
      case 'AVAILABLE': return 0;
      case 'RESERVED': return 1;
      case 'ACCEPTED': return 2;
      case 'PICKUP_ASSIGNED': return 3;
      case 'COLLECTED': return 4;
      case 'REDISTRIBUTED': return 5;
      case 'EXPIRED':
      case 'CANCELLED': return -1;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);
  const isFailedOrExpired = currentStatus === 'EXPIRED' || currentStatus === 'CANCELLED';

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <span className={`px-2.5 py-1 rounded-full text-[11px] ${
          currentStatus === 'REDISTRIBUTED'
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            : currentStatus === 'EXPIRED'
            ? 'bg-red-100 text-red-800 border border-red-300'
            : currentStatus === 'COLLECTED'
            ? 'bg-teal-100 text-teal-800 border border-teal-300'
            : 'bg-amber-100 text-amber-800 border border-amber-300'
        }`}>
          {currentStatus}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 transition-all duration-500 z-0"
          style={{
            width: isFailedOrExpired ? '0%' : `${Math.max(0, (currentIndex / (STAGES.length - 1)) * 90)}%`,
          }}
        />

        {STAGES.map((stage, idx) => {
          const isCompleted = !isFailedOrExpired && idx < currentIndex;
          const isCurrent = !isFailedOrExpired && idx === currentIndex;

          return (
            <div key={stage.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-emerald-800 text-white ring-4 ring-emerald-200 scale-110 shadow-md'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4 text-lime-300 animate-spin" style={{ animationDuration: '6s' }} />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-semibold ${isCurrent ? 'text-emerald-950 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                  {stage.label}
                </p>
                <p className="text-[10px] text-slate-400 hidden sm:block">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
