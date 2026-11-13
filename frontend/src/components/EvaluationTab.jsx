import React, { useState, useEffect } from 'react';
import { 
  Award, 
  BarChart3, 
  RefreshCw, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { api } from '../api';

export default function EvaluationTab({ onNavigateTab }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comparison, setComparison] = useState(null);

  const fetchComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.compareAllModels({
        model_name: "ALL",
        frequency: "D",
        horizon_periods: 30,
        target_metric: "Revenue",
        test_size: 0.2
      });
      setComparison(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to run model evaluation comparison.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, []);

  const table = comparison?.comparison_table || [];
  const bestModel = comparison?.best_model || "Random Forest Regressor";

  // Chart data formatted for side-by-side comparison
  const chartData = table.map(item => ({
    name: item.model_name.replace(" Regressor", "").replace(" (MA-7)", "").replace("(1,1,1)", ""),
    MAE: item.mae,
    RMSE: item.rmse,
    isBest: item.is_best
  }));

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Title */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Model Evaluation & Benchmarking
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Chronological Split Validation
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare all 4 implemented forecasting algorithms on the exact same test dataset partition to scientifically determine the champion model.
          </p>
        </div>

        <button
          onClick={fetchComparison}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 transition-all"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Re-Evaluate All Models</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* CHAMPION MODEL ANNOUNCEMENT BANNER */}
      {comparison && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Optimal Performance Champion</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              {bestModel}
            </h3>
            <p className="text-xs text-purple-200 max-w-xl leading-relaxed">
              Achieved the lowest out-of-sample Root Mean Squared Error (RMSE) on chronological evaluation, proving superior generalization to non-linear demand shocks and promotional surges.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-right min-w-[180px]">
            <span className="text-[11px] text-purple-200 block">Champion RMSE</span>
            <div className="text-2xl font-black text-amber-300 font-mono">
              ${table.find(t => t.is_best)?.rmse?.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-300 font-semibold">&bull; Lowest Error Variance</span>
          </div>
        </div>
      )}

      {/* COMPARISON METRICS TABLE */}
      {table.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Comparative Performance Metrics Table
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Unbiased errors calculated strictly on unseen chronological test samples (No synthetic scores)
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-sans">
                  <th className="py-3 px-4">Algorithm Model</th>
                  <th className="py-3 px-4">MAE (Mean Absolute Error)</th>
                  <th className="py-3 px-4">MSE (Mean Squared Error)</th>
                  <th className="py-3 px-4">RMSE (Root Mean Squared Error)</th>
                  <th className="py-3 px-4 font-sans">Rank / Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {table.map((row, idx) => (
                  <tr key={row.model_name} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 ${row.is_best ? "bg-purple-50/50 dark:bg-purple-950/20" : ""}`}>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                      {row.is_best && <Award className="w-4 h-4 text-amber-500" />}
                      <span>{row.model_name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-bold">
                      ${row.mae.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {row.mse.toExponential(3)}
                    </td>
                    <td className="py-3 px-4 text-brand-purple font-black">
                      ${row.rmse.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      {row.is_best ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          Rank #1 (Best Generalizer)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Rank #{idx + 1}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMPARATIVE BAR CHART (MAE & RMSE) */}
      {chartData.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Error Metric Comparison (Lower is Better)
              </h3>
              <p className="text-xs text-slate-500">
                Visual comparison of MAE and RMSE across all models
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="MAE" fill="#6366f1" radius={[4, 4, 0, 0]} name="MAE (Mean Absolute Error)" />
                <Bar dataKey="RMSE" fill="#ec4899" radius={[4, 4, 0, 0]} name="RMSE (Root Mean Squared Error)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* METRIC DEFINITIONS FOR ACADEMIC VIVA / EVALUATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
            Mean Absolute Error (MAE)
          </span>
          <p className="text-xs text-slate-500 leading-relaxed">
            Measures the average magnitude of forecasting errors in dollars without considering their direction. Less sensitive to extreme outliers than squared error.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
            Mean Squared Error (MSE)
          </span>
          <p className="text-xs text-slate-500 leading-relaxed">
            Calculates the average of the squared prediction deviations. Severely penalizes large forecasting misses, making it a critical optimization loss function.
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
            Root Mean Squared Error (RMSE)
          </span>
          <p className="text-xs text-slate-500 leading-relaxed">
            Square root of the MSE, restoring error magnitude to the original monetary scale ($). Primary industry standard metric for comparing time series models.
          </p>
        </div>
      </div>

      {/* Navigation CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onNavigateTab('insights')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-brand-purple hover:bg-purple-700 shadow-lg shadow-purple-500/25 transition-all"
        >
          <span>Proceed to Business Insights</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
