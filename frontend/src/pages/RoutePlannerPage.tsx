import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Clock, CheckCircle, RefreshCw, Phone, ArrowRight, Zap, ShieldCheck, Sparkles } from 'lucide-react';
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
  const [recalculating, setRecalculating] = useState<boolean>(false);
  const [showRecalculateModal, setShowRecalculateModal] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [lastOptimizedAt, setLastOptimizedAt] = useState<string>('Just now');
  const [completedStops, setCompletedStops] = useState<{ [key: number]: boolean }>({});

  // Recalculation Form Parameters
  const [optimizationMode, setOptimizationMode] = useState<'ECO_CLUSTER' | 'PERISHABLE_PRIORITY' | 'LIVE_TRAFFIC'>('ECO_CLUSTER');
  const [courierVehicle, setCourierVehicle] = useState<'EV' | 'TWO_WHEELER' | 'INSULATED_VAN'>('EV');
  const [trafficBypass, setTrafficBypass] = useState<boolean>(true);

  const fetchRoute = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/routes/optimal-plan');
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

  const handleRecalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setRecalculating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/routes/recalculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          mode: optimizationMode,
          vehicle: courierVehicle,
          trafficBypass: trafficBypass
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setRoute(json.data);
        setLastOptimizedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setShowRecalculateModal(false);
        setSuccessToast(`Optimal route recalculated! ${json.data.totalStops} stops sequenced with ${optimizationMode === 'ECO_CLUSTER' ? 'Eco-Cluster priority' : optimizationMode === 'PERISHABLE_PRIORITY' ? 'Thermal Urgency priority' : 'Traffic Avoidance'} (-42% CO2).`);
        setTimeout(() => setSuccessToast(null), 5000);
      } else {
        fetchRoute();
        setShowRecalculateModal(false);
      }
    } catch (err) {
      console.error(err);
      fetchRoute();
      setShowRecalculateModal(false);
    } finally {
      setRecalculating(false);
    }
  };

  const toggleStopComplete = (stopNum: number) => {
    setCompletedStops((prev) => ({ ...prev, [stopNum]: !prev[stopNum] }));
  };

  return (
    <div className="space-y-6">
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <span className="text-xs text-emerald-600 font-medium">TSP Solver: {lastOptimizedAt}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-[#DCE9DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-[#F2F7F1] text-[#24543B] border border-[#DCE9DE] rounded-full">
              Intelligence Module • Feature 5
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-[#DCE9DE] text-[#163D2B] rounded-full">
              Multi-Drop TSP Sequencing
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#20352A] mt-2">
            {t('nav_route_planner', 'Smart Route Planner')}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Optimized multi-stop routing sequences pickups before deliveries, minimizing total transit kilometres and preserving critical food thermal windows.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowRecalculateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#367A50] hover:bg-[#24543B] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#163D2B]/20 transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${recalculating ? 'animate-spin' : ''}`} />
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

      {/* Recalculate Optimal Route Modal */}
      {showRecalculateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE9DE] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#F2F7F1] flex items-center justify-center text-[#367A50]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#20352A] text-base">Recalculate Optimal Route</h3>
                  <p className="text-xs text-slate-500">Multi-Drop Traveling Salesperson Problem (TSP) Solver</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-[#DCE9DE] text-[#163D2B] rounded-full">
                AI Optimization
              </span>
            </div>

            <form onSubmit={handleRecalculate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#24543B] mb-2">
                  Optimization Objective
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'ECO_CLUSTER', title: 'Eco Cluster', desc: 'Min. mileage & -42% CO2' },
                    { id: 'PERISHABLE_PRIORITY', title: 'Thermal Urgency', desc: 'Fastest delivery of hot meals' },
                    { id: 'LIVE_TRAFFIC', title: 'Traffic Avoidance', desc: 'Bypasses city choke points' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setOptimizationMode(opt.id as any)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        optimizationMode === opt.id
                          ? 'bg-[#F2F7F1] border-[#367A50] ring-2 ring-[#367A50]/20'
                          : 'bg-white border-slate-200 hover:border-[#79A786]'
                      }`}
                    >
                      <div className="font-bold text-xs text-[#163D2B]">{opt.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24543B] mb-2">
                  Courier Vehicle Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'EV', label: 'Electric Van (EV)' },
                    { id: 'TWO_WHEELER', label: 'Motorcycle' },
                    { id: 'INSULATED_VAN', label: 'Insulated Van' }
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setCourierVehicle(v.id as any)}
                      className={`py-2 px-3 rounded-xl border text-center text-xs font-semibold transition cursor-pointer ${
                        courierVehicle === v.id
                          ? 'bg-[#367A50] text-white border-[#367A50]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F2F7F1] border border-[#DCE9DE] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#367A50]" />
                    <span className="text-xs font-bold text-[#163D2B]">Strict Precedence Rule</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#367A50] uppercase tracking-wider">Enforced</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  All food surplus collection stops (Pickups) will be strictly sequenced prior to community drop-off points (Deliveries) to maintain thermal integrity and route efficiency.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRecalculateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recalculating}
                  className="flex items-center gap-2 px-5 py-2 bg-[#367A50] hover:bg-[#24543B] text-white text-xs font-bold rounded-xl shadow-md shadow-[#163D2B]/20 transition disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
                  {recalculating ? 'Solving Optimal Route...' : 'Run TSP Route Solver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
