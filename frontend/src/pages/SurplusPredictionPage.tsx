import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, BarChart2, Calendar, RefreshCw, Layers } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HistoricalPoint {
  id: string;
  foodItem: string;
  actualDemandMeals: number;
  preparedMeals: number;
  surplusMeals: number;
  productionDate: string;
  mealPeriod: string;
}

interface ForecastData {
  mealPeriod: string;
  foodItem: string;
  expectedDemand: number;
  suggestedPreparation: number;
  bufferSafetyPercentage: number;
  confidenceMin: number;
  confidenceMax: number;
  expectedSurplusWithoutIntervention: number;
  expectedSurplusWithIntervention: number;
  reductionPercentage: number;
  forecastAccuracyPct: number;
  historicalObservationsCount: number;
  actionableRecommendation: string;
  historicalSeries: HistoricalPoint[];
}

export const SurplusPredictionPage: React.FC = () => {
  const { t } = useLanguage();
  const [mealPeriod, setMealPeriod] = useState<string>('LUNCH');
  const [foodItem, setFoodItem] = useState<string>('Veg Biryani & Rice');
  const [loading, setLoading] = useState<boolean>(true);
  const [forecast, setForecast] = useState<ForecastData | null>(null);

  // New production log state
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [logPrepared, setLogPrepared] = useState<number>(75);
  const [logDemand, setLogDemand] = useState<number>(55);
  const [logSuccessMsg, setLogSuccessMsg] = useState<string>('');

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/prediction/forecast?foodItem=${encodeURIComponent(foodItem)}&mealPeriod=${mealPeriod}`);
      const json = await res.json();
      if (json.success && json.data) {
        setForecast(json.data);
      }
    } catch (err) {
      console.error('Failed to load forecast', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [mealPeriod, foodItem]);

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const surplus = Math.max(0, logPrepared - logDemand);
      const res = await fetch('/api/prediction/log-production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodItem,
          mealPeriod,
          preparedMeals: logPrepared,
          actualDemandMeals: logDemand,
          surplusMeals: surplus,
          productionDate: logDate,
          providerId: 'provider-kitchen-hyd'
        })
      });
      const data = await res.json();
      if (data.success) {
        setLogSuccessMsg('Production record saved and moving-average updated!');
        setTimeout(() => setLogSuccessMsg(''), 4000);
        fetchForecast();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Intelligence Module • Feature 2
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
              Moving-Average + Margin Forecast
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">
            {t('nav_surplus_prediction', 'Surplus Prediction & Prep Optimizer')}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Prevent kitchen over-preparation at the source using empirical multi-day moving average demand forecasts with safety buffer boundaries.
          </p>
        </div>

        <button
          onClick={fetchForecast}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-medium transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Recalculate Model
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Select Food Item</label>
          <select
            value={foodItem}
            onChange={(e) => setFoodItem(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Veg Biryani & Rice">Veg Biryani & Rice</option>
            <option value="Dinner Rolls & Breads">Dinner Rolls & Breads</option>
            <option value="Chicken Curry & Naan">Chicken Curry & Naan</option>
            <option value="Steamed Basmati Rice & Dal">Steamed Basmati Rice & Dal</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Meal Period Window</label>
          <div className="grid grid-cols-3 gap-2">
            {['BREAKFAST', 'LUNCH', 'DINNER'].map((p) => (
              <button
                key={p}
                onClick={() => setMealPeriod(p)}
                className={`py-2 text-xs font-semibold rounded-lg transition ${
                  mealPeriod === p
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {forecast && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Expected Demand</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-800 mt-2">
              {forecast.expectedDemand} <span className="text-sm font-normal text-slate-500">meals</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">7-day weighted moving average</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-emerald-300 bg-emerald-50/30 shadow-sm">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
              <span>Optimized Preparation</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-700 mt-2">
              {forecast.suggestedPreparation} <span className="text-sm font-normal text-slate-500">meals</span>
            </div>
            <p className="text-xs text-emerald-600 mt-1">Includes +{forecast.bufferSafetyPercentage}% safety cushion</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Waste Prevention Gain</span>
              <Layers className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-extrabold text-purple-700 mt-2">
              -{forecast.reductionPercentage}%
            </div>
            <p className="text-xs text-slate-400 mt-1">Surplus cut from {forecast.expectedSurplusWithoutIntervention} to {forecast.expectedSurplusWithIntervention} meals</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Forecast Confidence</span>
              <BarChart2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-blue-700 mt-2">
              {forecast.forecastAccuracyPct}%
            </div>
            <p className="text-xs text-slate-400 mt-1">Confidence interval: {forecast.confidenceMin}–{forecast.confidenceMax} meals</p>
          </div>
        </div>
      )}

      {/* Actionable Recommendation Card */}
      {forecast && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-xl shadow-sm flex items-start gap-4">
          <div className="p-2 bg-white/20 rounded-lg shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Chef & Kitchen Manager Recommendation</h3>
            <p className="text-emerald-50 text-sm mt-1">{forecast.actionableRecommendation}</p>
          </div>
        </div>
      )}

      {/* History and Logging Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical Demand Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-sm">7-Day Empirical Observations</h2>
            <span className="text-xs text-slate-400">Sample: {forecast?.historicalObservationsCount || 0} batches</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Prepared</th>
                  <th className="py-3 px-4">Actual Consumed</th>
                  <th className="py-3 px-4">Surplus Discarded</th>
                  <th className="py-3 px-4">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {forecast?.historicalSeries?.map((row) => {
                  const eff = Math.round((row.actualDemandMeals / row.preparedMeals) * 100);
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{row.productionDate}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {row.mealPeriod}
                        </span>
                      </td>
                      <td className="py-3 px-4">{row.preparedMeals}</td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold">{row.actualDemandMeals}</td>
                      <td className="py-3 px-4 text-rose-600">{row.surplusMeals}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          eff >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {eff}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log Today's Kitchen Production */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Log Kitchen Shift Actuals
          </h2>

          {logSuccessMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {logSuccessMsg}
            </div>
          )}

          <form onSubmit={handleLogSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Shift Date</label>
              <input
                type="date"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Prepared Quantity (Meals)</label>
              <input
                type="number"
                min="1"
                value={logPrepared}
                onChange={(e) => setLogPrepared(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Actual Consumed (Meals)</label>
              <input
                type="number"
                min="0"
                value={logDemand}
                onChange={(e) => setLogDemand(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                required
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
              Computed Shift Surplus: <span className="font-bold text-rose-600">{Math.max(0, logPrepared - logDemand)} meals</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
            >
              Save Production Shift & Refine Model
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
