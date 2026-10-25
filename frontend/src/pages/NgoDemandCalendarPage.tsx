import React, { useState, useEffect } from 'react';
import { Calendar, Plus, CheckCircle, Clock, HeartHandshake, Filter, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AnimatedPageHeading } from '../components/AnimatedPageHeading';

interface NgoDemand {
  id: string;
  receiverId: string;
  receiverName: string;
  mealDate: string;
  mealPeriod: string;
  servingsRequired: number;
  dietaryPreference: string;
  foodCategory: string;
  fulfilledServings: number;
  status: string;
  specialInstructions: string;
}

export const NgoDemandCalendarPage: React.FC = () => {
  const { t } = useLanguage();
  const [demands, setDemands] = useState<NgoDemand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDemand, setSelectedDemand] = useState<NgoDemand | null>(null);
  const [compatibleListings, setCompatibleListings] = useState<any[]>([]);
  const [matchLoading, setMatchLoading] = useState<boolean>(false);

  // New Request Form Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    receiverName: 'Robin Hood Army - Jubilee Center',
    mealDate: new Date().toISOString().split('T')[0],
    mealPeriod: 'DINNER',
    servingsRequired: 40,
    dietaryPreference: 'VEGETARIAN',
    foodCategory: 'COOKED_MEALS',
    specialInstructions: 'Urgent need for children shelter distribution.'
  });

  const fetchDemands = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/demand/calendar');
      const json = await res.json();
      if (json.success && json.data) {
        setDemands(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemands();
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchDemands();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMatchSurplus = async (demand: NgoDemand) => {
    setSelectedDemand(demand);
    setMatchLoading(true);
    try {
      const res = await fetch(`/api/demand/${demand.id}/match-surplus`, { method: 'POST' });
      const json = await res.json();
      if (json.success && json.data) {
        setCompatibleListings(json.data.compatibleListings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMatchLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-[#DCE9DE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-[#F2F7F1] text-[#24543B] border border-[#DCE9DE] rounded-full">
              Operations Module • Feature 6
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-[#DCE9DE] text-[#163D2B] rounded-full">
              Community Pull Demand
            </span>
          </div>
          <AnimatedPageHeading
            text={t('nav_ngo_demand', 'NGO & Shelter Demand Calendar')}
            className="text-2xl font-bold text-[#20352A] mt-2"
          />
          <p className="text-slate-500 text-sm mt-1">
            Registered Hyderabad NGOs declare required meal counts in advance. System automatically matches incoming donor surplus to scheduled community meal slots.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#367A50] hover:bg-[#24543B] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#163D2B]/20 transition"
        >
          <Plus className="w-4 h-4" />
          Post Demand Request
        </button>
      </div>

      {/* Main Grid: Demands List + Compatibility Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demands List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[#20352A] text-base">Scheduled Demand Windows ({demands.length})</h2>
            <span className="text-xs text-slate-400">All registered Hyderabad centers</span>
          </div>

          <div className="space-y-3">
            {demands.map((d, idx) => {
              const remaining = d.servingsRequired - (d.fulfilledServings || 0);
              const isFulfilled = d.status === 'FULFILLED' || remaining <= 0;
              return (
                <div
                  key={d.id}
                  className={`bg-white p-5 rounded-2xl border transition shadow-sm animate-box-rise ${
                    selectedDemand?.id === d.id ? 'border-[#367A50] ring-2 ring-[#DCE9DE]' : 'border-[#DCE9DE] hover:border-[#79A786]'
                  }`}
                  style={{ animationDelay: `${260 + idx * 80}ms` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 text-base">{d.receiverName}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isFulfilled ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {d.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {d.mealDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {d.mealPeriod}
                        </span>
                        <span className="font-medium text-slate-700">
                          {d.dietaryPreference}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleMatchSurplus(d)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs rounded-lg transition shrink-0"
                    >
                      Find Compatible Surplus
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="text-slate-600">
                      Required: <span className="font-bold text-slate-900">{d.servingsRequired} servings</span> • Fulfilled: <span className="font-bold text-emerald-600">{d.fulfilledServings || 0}</span> • Remaining: <span className="font-bold text-rose-600">{remaining}</span>
                    </div>
                    {d.specialInstructions && (
                      <span className="text-slate-400 truncate max-w-[200px]" title={d.specialInstructions}>
                        {d.specialInstructions}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compatibility Match Drawer */}
        <div
          className="bg-white p-6 rounded-3xl border border-[#DCE9DE] shadow-sm space-y-4 animate-box-rise"
          style={{ animationDelay: '420ms' }}
        >
          <div className="flex items-center gap-2 text-[#20352A] font-bold text-base border-b border-[#DCE9DE] pb-3">
            <HeartHandshake className="w-5 h-5 text-emerald-600" />
            Surplus Compatibility
          </div>

          {!selectedDemand ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select an NGO demand card on the left to evaluate matching available surplus in Hyderabad.
            </div>
          ) : matchLoading ? (
            <div className="text-center py-12 text-slate-400 text-xs animate-pulse">
              Matching active surplus donations...
            </div>
          ) : compatibleListings.length === 0 ? (
            <div className="p-4 bg-amber-50 rounded-lg text-amber-800 text-xs space-y-2">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                No matching surplus available right now
              </div>
              <p className="text-[11px] text-amber-700">
                Incoming donations will be notified immediately when a provider lists compatible {selectedDemand.dietaryPreference} food.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 font-medium">
                Found {compatibleListings.length} compatible surplus batches:
              </div>
              {compatibleListings.map((c, idx) => (
                <div key={idx} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">{c.foodName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {c.compatibleServings} Meals Compatible
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Donor: <span className="font-semibold text-slate-700">{c.providerName}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {c.address}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Demand Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Post NGO Meal Demand Request</h3>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Organization / Shelter</label>
                <input
                  type="text"
                  value={formData.receiverName}
                  onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Meal Date</label>
                  <input
                    type="date"
                    value={formData.mealDate}
                    onChange={(e) => setFormData({ ...formData, mealDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Meal Period</label>
                  <select
                    value={formData.mealPeriod}
                    onChange={(e) => setFormData({ ...formData, mealPeriod: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="BREAKFAST">BREAKFAST</option>
                    <option value="LUNCH">LUNCH</option>
                    <option value="DINNER">DINNER</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Servings Required</label>
                  <input
                    type="number"
                    min="5"
                    value={formData.servingsRequired}
                    onChange={(e) => setFormData({ ...formData, servingsRequired: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Dietary Preference</label>
                  <select
                    value={formData.dietaryPreference}
                    onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="ANY">ANY</option>
                    <option value="VEGETARIAN">VEGETARIAN</option>
                    <option value="NON_VEG">NON_VEG</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Special Instructions</label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Submit Scheduled Demand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
