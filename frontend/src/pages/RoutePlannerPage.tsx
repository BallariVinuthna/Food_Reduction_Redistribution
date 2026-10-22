import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Clock, CheckCircle, RefreshCw, Phone, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Stop {
  stopNumber: number;
  type: 'PICKUP' | 'DELIVERY';
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  foodName: string;
  quantity: string;
  distanceFromPreviousKm: number;
  estimatedArrivalMinutes: number;
  contactPhone: string;
}

interface RoutePlan {
  volunteerId: string;
  routeSummary: string;
  totalStops: number;
  totalDistanceKm: number;
  totalEstimatedDurationMinutes: number;
  stops: Stop[];
}

export const RoutePlannerPage: React.FC = () => {
  const { t } = useLanguage();
  const [route, setRoute] = useState<RoutePlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [completedStops, setCompletedStops] = useState<{ [key: number]: boolean }>({});

  const fetchRoute = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/routes/optimal-plan?volunteerId=vol-vikram');
      const json = await res.json();
      if (json.success && json.data) {
        setRoute(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, []);

  const toggleStopComplete = (stopNum: number) => {
    setCompletedStops((prev) => ({ ...prev, [stopNum]: !prev[stopNum] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Intelligence Module • Feature 5
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
              Multi-Drop TSP Sequencing
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">
            {t('nav_route_planner', 'Smart Volunteer Route Planner')}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Optimized multi-stop routing sequences pickups before deliveries, minimizing total transit kilometres and preserving critical food thermal windows.
          </p>
        </div>

        <button
          onClick={fetchRoute}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-semibold transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Recalculate Optimal Route
        </button>
      </div>

      {/* KPI Stats */}
      {route && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Total Mission Stops</div>
            <div className="text-3xl font-extrabold text-slate-800 mt-2">
              {route.totalStops} <span className="text-sm font-normal text-slate-500">stops</span>
            </div>
            <p className="text-xs text-emerald-600 mt-1">Pickups sequenced first</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Total Route Distance</div>
            <div className="text-3xl font-extrabold text-blue-700 mt-2">
              {route.totalDistanceKm} <span className="text-sm font-normal text-slate-500">km</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Haversine metric optimized</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 font-medium">Est. Completion Duration</div>
            <div className="text-3xl font-extrabold text-purple-700 mt-2">
              {route.totalEstimatedDurationMinutes} <span className="text-sm font-normal text-slate-500">mins</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Including 10m thermal verification time</p>
          </div>
        </div>
      )}

      {/* Step by Step Timeline Route */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-bold text-slate-800 text-base mb-6 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-emerald-600" />
          Multi-Stop Route Navigation Sequence
        </h2>

        <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {route?.stops?.map((stop) => {
            const isCompleted = completedStops[stop.stopNumber];
            const isPickup = stop.type === 'PICKUP';

            return (
              <div key={stop.stopNumber} className="relative group">
                {/* Node circle */}
                <div
                  className={`absolute -left-6 top-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white transition ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isPickup
                      ? 'bg-amber-500 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : stop.stopNumber}
                </div>

                {/* Card Content */}
                <div
                  className={`p-4 rounded-xl border transition ${
                    isCompleted
                      ? 'bg-emerald-50/50 border-emerald-200 opacity-70'
                      : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            isPickup ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          STOP {stop.stopNumber} • {stop.type}
                        </span>
                        <h3 className="font-bold text-slate-800 text-base">{stop.locationName}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {stop.address}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${stop.latitude},${stop.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition flex items-center gap-1"
                      >
                        Navigate
                        <ArrowRight className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => toggleStopComplete(stop.stopNumber)}
                        className={`px-3 py-1.5 font-semibold text-xs rounded-lg transition ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {isCompleted ? 'Marked Completed' : 'Complete Step'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">CARGO / FOOD</span>
                      <span className="font-semibold text-slate-700">{stop.foodName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">QUANTITY</span>
                      <span className="font-bold text-emerald-700">{stop.quantity}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">DISTANCE FROM PREV</span>
                      <span className="font-semibold text-slate-700">+{stop.distanceFromPreviousKm} km</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">EST. ETA</span>
                      <span className="font-semibold text-purple-700">+{stop.estimatedArrivalMinutes} mins</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
