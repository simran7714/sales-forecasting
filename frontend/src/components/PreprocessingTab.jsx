import React, { useState } from 'react';
import { 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Database
} from 'lucide-react';
import { api } from '../api';

export default function PreprocessingTab({ 
  onPreprocessingDone, 
  onNavigateTab, 
  cleanSummary, 
  inspectionData 
}) {
  const [options, setOptions] = useState({
    handle_missing: 'impute_forward',
    remove_duplicates: true,
    handle_outliers: true,
    sort_by_date: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(cleanSummary || null);

  const handleRunPreprocessing = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.preprocessDataset({}, options);
      setResult(res.data.cleaning_report);
      onPreprocessingDone(res.data.cleaning_report);
    } catch (err) {
      setError(err.response?.data?.detail || "Preprocessing failed.");
    } finally {
      setLoading(false);
    }
  };

  const before = result?.stats_before || {
    rows: inspectionData?.total_rows || 0,
    missing_values: inspectionData?.total_missing_values || 0,
    duplicates: inspectionData?.duplicate_rows || 0
  };

  const after = result?.stats_after || null;
  const summary = result?.cleaning_summary || null;

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Title */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Data Cleaning & Preprocessing Pipeline
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Apply production-grade Pandas transformations to resolve null entries, normalize dates, eliminate duplicate transactions, and cap distribution outliers.
          </p>
        </div>

        <button
          onClick={handleRunPreprocessing}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 transition-all"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{result ? "Re-Run Preprocessing" : "Execute Preprocessing"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preprocessing Options Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Missing Values Strategy */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            1. Missing Values Imputation
          </span>
          <select
            value={options.handle_missing}
            onChange={(e) => setOptions({ ...options, handle_missing: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <option value="impute_forward">Forward Fill (Recommended for Time Series)</option>
            <option value="impute_mean">Mean / Median Imputation</option>
            <option value="drop">Drop Rows with Nulls</option>
          </select>
          <span className="text-[11px] text-slate-400 block mt-2">
            Preserves temporal continuity for lag calculations.
          </span>
        </div>

        {/* Duplicate Removal */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              2. Duplicate Records
            </span>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={options.remove_duplicates}
                onChange={(e) => setOptions({ ...options, remove_duplicates: e.target.checked })}
                className="w-4 h-4 rounded text-brand-purple focus:ring-brand-purple cursor-pointer"
              />
              <span>Remove exact duplicate rows</span>
            </label>
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">
            Eliminates repeated transaction logs.
          </span>
        </div>

        {/* Outlier Detection */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              3. Outlier Handling (IQR)
            </span>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={options.handle_outliers}
                onChange={(e) => setOptions({ ...options, handle_outliers: e.target.checked })}
                className="w-4 h-4 rounded text-brand-purple focus:ring-brand-purple cursor-pointer"
              />
              <span>Cap outliers using IQR Winsorization</span>
            </label>
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">
            Prevents extreme sales anomalies from distorting weights.
          </span>
        </div>

        {/* Date Sorting */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              4. Chronological Sorting
            </span>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={options.sort_by_date}
                onChange={(e) => setOptions({ ...options, sort_by_date: e.target.checked })}
                className="w-4 h-4 rounded text-brand-purple focus:ring-brand-purple cursor-pointer"
              />
              <span>Order strictly by Date ascending</span>
            </label>
          </div>
          <span className="text-[11px] text-slate-400 block mt-2">
            Guarantees proper time series sequencing.
          </span>
        </div>

      </div>

      {/* BEFORE VS AFTER DATA QUALITY AUDIT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Raw Dataset State */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Original Dataset
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Pre-Cleaned
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Observations:</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">{before.rows.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Missing Null Values:</span>
              <span className="font-semibold text-amber-500 font-mono">{before.missing_values.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Duplicate Rows:</span>
              <span className="font-semibold text-amber-500 font-mono">{before.duplicates.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Cleaned Dataset State */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Cleaned Dataset
            </h4>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              Validated
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Processed Observations:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                {after ? after.rows.toLocaleString() : "Pending"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Residual Missing Values:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                {after ? after.missing_values : "0"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Residual Duplicates:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                {after ? after.duplicates : "0"}
              </span>
            </div>
          </div>
        </div>

        {/* Data Quality Health Index */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                Data Quality Index
              </span>
              <ShieldCheck className="w-5 h-5 text-brand-purple" />
            </div>
            <div className="text-3xl font-black text-brand-purple dark:text-purple-300">
              {summary ? `${summary.data_quality_score}%` : "100%"}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Composite score calculated based on integrity, duplicate absence, outlier management, and chronological continuity.
            </p>
          </div>

          <div className="pt-3 border-t border-purple-200/60 dark:border-purple-800/60 text-[11px] text-purple-700 dark:text-purple-300">
            {summary ? (
              <span>&bull; {summary.outliers_capped} outliers capped via IQR &bull; {summary.duplicate_records_removed} duplicates purged</span>
            ) : (
              <span>Ready for Exploratory Analysis</span>
            )}
          </div>
        </div>

      </div>

      {/* Cleaned Dataset Sample Preview */}
      {result && result.preview_cleaned && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Cleaned & Standardized Dataset (First 10 Rows)
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Normalized columns ready for feature engineering and statistical modeling
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Product_ID</th>
                  <th className="py-2.5 px-3">Store_ID</th>
                  <th className="py-2.5 px-3">Units_Sold</th>
                  <th className="py-2.5 px-3">Revenue ($)</th>
                  <th className="py-2.5 px-3">Promotion</th>
                  <th className="py-2.5 px-3">Holiday</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {result.preview_cleaned.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-brand-purple font-semibold">{row.Date}</td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{row.Product_ID}</td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{row.Store_ID}</td>
                    <td className="py-2 px-3 text-slate-900 dark:text-white font-bold">{row.Units_Sold}</td>
                    <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-bold">${Number(row.Revenue).toFixed(2)}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.Promotion ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>
                        {row.Promotion ? "YES (1)" : "NO (0)"}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.Holiday ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>
                        {row.Holiday ? "YES (1)" : "NO (0)"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Navigation CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onNavigateTab('eda')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-brand-purple hover:bg-purple-700 shadow-lg shadow-purple-500/25 transition-all"
        >
          <span>Proceed to Exploratory Data Analysis (EDA)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
