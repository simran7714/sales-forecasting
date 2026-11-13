import React, { useState, useEffect } from 'react';
import { 
  LineChart as LineChartIcon, 
  Activity, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  Info,
  Sliders
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { api } from '../api';

export default function TimeSeriesTab({ onNavigateTab }) {
  const [frequency, setFrequency] = useState('D');
  const [modelType, setModelType] = useState('additive');
  const [targetMetric, setTargetMetric] = useState('Revenue');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchDecomposition = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.decomposeTimeSeries(frequency, targetMetric, modelType);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Time series decomposition failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecomposition();
  }, [frequency, modelType, targetMetric]);

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Title & Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Time Series Decomposition (Statsmodels)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Isolate underlying macroeconomic Trend, cyclical Seasonality, and stochastic Residual noise from the sales time series.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="D">Daily (7-Day Cycle)</option>
              <option value="W">Weekly (52-Week Cycle)</option>
              <option value="M">Monthly (12-Month Cycle)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Type</label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="additive">Additive (Y = T + S + R)</option>
              <option value="multiplicative">Multiplicative (Y = T * S * R)</option>
            </select>
          </div>

          <div className="self-end">
            <button
              onClick={fetchDecomposition}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              title="Refresh Decomposition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* ADF Stationarity Test Summary & Seasonal Metrics */}
      {data && data.adf_test && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Augmented Dickey-Fuller Stationarity Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm md:col-span-2 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-purple" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Augmented Dickey-Fuller (ADF) Stationarity Hypothesis Test
                </h4>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                data.adf_test.is_stationary 
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              }`}>
                {data.adf_test.is_stationary ? "Stationary (p < 0.05)" : "Non-Stationary (p >= 0.05)"}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              {data.adf_test.interpretation}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-sans block">ADF Statistic</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{data.adf_test.test_statistic}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-sans block">p-value</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{data.adf_test.p_value}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-sans block">Critical 5%</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{data.adf_test.critical_values?.['5%']}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-[10px] text-slate-400 font-sans block">Observations</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{data.adf_test.num_observations}</span>
              </div>
            </div>
          </div>

          {/* Seasonal Strength Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800/60 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                Decomposition Metrics
              </span>
              <div className="mt-3 space-y-2">
                <div>
                  <span className="text-xs text-slate-500">Overall Trend Direction:</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">
                    {data.summary.trend_direction} Trend
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Seasonal Strength Score:</span>
                  <div className="text-xl font-bold text-brand-purple">
                    {data.summary.seasonal_strength_score} / 1.00
                  </div>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-purple-200/60 dark:border-purple-800/60">
              Periodicity window: {data.period} observations ({data.model_type} formula)
            </div>
          </div>

        </div>
      )}

      {/* 4 INTERACTIVE CHARTS FOR THE COMPONENTS */}
      {data && data.decomposition_data && (
        <div className="space-y-6">
          
          {/* 1. Observed / Original Series */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1">
              1. Observed Historical Sales Series
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Raw aggregated sales revenue before statistical separation
            </p>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.decomposition_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="observed" stroke="#3b82f6" dot={false} strokeWidth={1.5} name="Observed" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. Trend Component */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h4 className="text-sm font-bold text-brand-purple dark:text-purple-400 mb-1">
              2. Isolated Trend Component
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Underlying long-term trajectory showing secular expansion or contraction
            </p>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.decomposition_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="trend" stroke="#8b5cf6" dot={false} strokeWidth={2.5} name="Trend" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Seasonal Component */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h4 className="text-sm font-bold text-pink-600 dark:text-pink-400 mb-1">
              3. Periodic Seasonal Component
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Cyclical repeating wave patterns recurring every period
            </p>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.decomposition_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="seasonal" stroke="#ec4899" dot={false} strokeWidth={2} name="Seasonality" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Residual / Noise Component */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">
              4. Residual / Stochastic Noise
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Unexplained random variation after removing trend and seasonality
            </p>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.decomposition_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="residual" stroke="#f59e0b" dot={false} strokeWidth={1} name="Residual" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Navigation CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onNavigateTab('forecasting')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-brand-purple hover:bg-purple-700 shadow-lg shadow-purple-500/25 transition-all"
        >
          <span>Proceed to Machine Learning & Forecasting</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
