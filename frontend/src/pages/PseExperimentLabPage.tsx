import React, { useState, useEffect } from 'react';
import { Beaker, Play, Download, CheckCircle, RefreshCw, Layers, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PseExperiment {
  id: string;
  experimentName: string;
  hypothesis: string;
  baselineName: string;
  interventionName: string;
  sampleSizeBatches: number;
  baselineMetricValue: number;
  interventionMetricValue: number;
  metricUnit: string;
  relativeImprovementPct: number;
  pvalue: number;
  statisticallySignificant: boolean;
  conclusionNotes: string;
  executedAt: string;
}

export const PseExperimentLabPage: React.FC = () => {
  const { t } = useLanguage();
  const [experiments, setExperiments] = useState<PseExperiment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);

  const fetchExperiments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/experiments');
      const json = await res.json();
      if (json.success && json.data) {
        setExperiments(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  const handleEvaluate = async (id: string) => {
    setEvaluatingId(id);
    try {
      const res = await fetch(`/api/experiments/${id}/evaluate`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        fetchExperiments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluatingId(null);
    }
  };

  const handleExportCsv = () => {
    window.open('/api/experiments/export-csv', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Administration Module • Feature 15
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
              Empirical A/B Benchmarking
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">
            {t('nav_experiment_lab', 'PSE Experiment & Validation Lab')}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Validate operational hypotheses by benchmarking SurplusFlow algorithmic interventions against conventional baselines across Hyderabad rescue scenarios.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition"
        >
          <Download className="w-4 h-4" />
          Export Experiment Report CSV
        </button>
      </div>

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experiments.map((exp) => (
          <div key={exp.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                  Sample: {exp.sampleSizeBatches} batches • p-val: {exp.pvalue}
                </span>
                <h3 className="font-bold text-slate-800 text-base mt-1">{exp.experimentName}</h3>
              </div>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                exp.statisticallySignificant ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {exp.statisticallySignificant ? 'Significant (p < 0.05)' : 'Inconclusive'}
              </span>
            </div>

            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-semibold text-slate-700">Hypothesis: </span>
              {exp.hypothesis}
            </p>

            {/* Baseline vs Intervention Comparison */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Baseline ({exp.baselineName})</span>
                <div className="text-xl font-extrabold text-slate-700 mt-1">
                  {exp.baselineMetricValue} <span className="text-xs font-normal text-slate-500">{exp.metricUnit}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-600 block uppercase">SurplusFlow ({exp.interventionName})</span>
                <div className="text-xl font-extrabold text-emerald-700 mt-1">
                  {exp.interventionMetricValue} <span className="text-xs font-normal text-emerald-600">{exp.metricUnit}</span>
                </div>
              </div>
            </div>

            {/* Improvement Banner */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">Relative Algorithmic Gain:</span>
              <span className="font-extrabold text-emerald-700 text-sm">
                +{exp.relativeImprovementPct}% Improvement
              </span>
            </div>

            <p className="text-[11px] text-slate-600 border-t border-slate-100 pt-3">
              {exp.conclusionNotes}
            </p>

            <button
              onClick={() => handleEvaluate(exp.id)}
              disabled={evaluatingId === exp.id}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${evaluatingId === exp.id ? 'animate-spin' : ''}`} />
              Re-run Simulation Evaluation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
