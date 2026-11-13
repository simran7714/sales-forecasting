import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  RefreshCw, 
  ArrowRight, 
  TrendingUp, 
  Sliders, 
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { api } from '../api';

export default function ForecastingTab({ 
  edaData, 
  onForecastCompleted, 
  onNavigateTab, 
  existingForecast 
}) {
  const [modelName, setModelName] = useState('Random Forest Regressor');
  const [frequency, setFrequency] = useState('D');
  const [horizon, setHorizon] = useState(30);
  const [targetMetric, setTargetMetric] = useState('Revenue');
  const [productFilter, setProductFilter] = useState('ALL');
  const [storeFilter, setStoreFilter] = useState('ALL');
  const [testSize, setTestSize] = useState(0.2);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecastResult, setForecastResult] = useState(existingForecast?.result || null);

  const handleTrainAndPredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.trainAndForecast({
        model_name: modelName,
        frequency: frequency,
        horizon_periods: Number(horizon),
        target_metric: targetMetric,
        product_filter: productFilter,
        store_filter: storeFilter,
        test_size: Number(testSize)
      });
      setForecastResult(res.data.result);
      onForecastCompleted(res.data.result, modelName);
    } catch (err) {
      setError(err.response?.data?.detail || "Training and forecasting failed. Check dataset length.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!forecastResult && edaData) {
      handleTrainAndPredict();
    }
  }, []);

  // Filter lists from EDA
  const products = ['ALL', ...(edaData?.product_performance?.map(p => p.product_id) || [])];
  const stores = ['ALL', ...(edaData?.store_performance?.map(s => s.store_id) || [])];

  // Combined chart data: test actual vs test predicted + future forecast
  const testComparisonData = forecastResult?.test_comparison?.slice(-60) || [];
  const futureForecastData = forecastResult?.forecast || [];

  // Summary projected total
  const projectedCumulative = futureForecastData.reduce((acc, curr) => acc + (curr.predicted || 0), 0);
  const projectedAvgDaily = projectedCumulative / Math.max(1, futureForecastData.length);

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Title */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Machine Learning & Time Series Forecasting
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Zero-Leakage 80/20 Split
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Train supervised regressions and statistical autoregressive algorithms to project demand into the future.
          </p>
        </div>

        <button
          onClick={handleTrainAndPredict}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 transition-all"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{loading ? "Training Model..." : "Train & Generate Forecast"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* MODEL CONTROLS PANEL */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Forecasting Parameters & Filters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 text-xs">
          
          {/* 1. Algorithm Selection */}
          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
              Algorithm Model
            </label>
            <select
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-brand-purple"
            >
              <option value="Random Forest Regressor">Random Forest Regressor</option>
              <option value="Linear Regression">Linear Regression (Ridge)</option>
              <option value="ARIMA">ARIMA(1,1,1)</option>
              <option value="Moving Average">Moving Average (MA-7)</option>
            </select>
          </div>

          {/* 2. Frequency */}
          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="D">Daily Forecasting</option>
              <option value="W">Weekly Forecasting</option>
              <option value="M">Monthly Forecasting</option>
            </select>
          </div>

          {/* 3. Prediction Horizon */}
          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
              Prediction Horizon
            </label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value={7}>Next 7 Periods</option>
              <option value={30}>Next 30 Periods (1 Mo)</option>
              <option value={90}>Next 3 Months (90 d)</option>
              <option value={180}>Next 6 Months (180 d)</option>
            </select>
          </div>

          {/* 4. Target Metric */}
          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
              Target Variable
            </label>
            <select
              value={targetMetric}
              onChange={(e) => setTargetMetric(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="Revenue">Sales Revenue ($)</option>
              <option value="Units_Sold">Units Sold (Quantity)</option>
            </select>
          </div>

          {/* 5. Product Filter */}
          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
              Product Filter
            </label>
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              {products.map(p => (
                <option key={p} value={p}>{p === 'ALL' ? 'All Products' : p}</option>
              ))}
            </select>
          </div>

          {/* 6. Store Filter */}
          <div>
            <label className="font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
              Store Filter
            </label>
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              {stores.map(s => (
                <option key={s} value={s}>{s === 'ALL' ? 'All Stores' : s}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* METRICS & PROJECTION BANNER */}
      {forecastResult && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-500 block mb-1">Active Champion Model</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {forecastResult.model_name}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">80/20 Chronological Split</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-500 block mb-1">Test MAE (Mean Absolute Error)</span>
            <div className="text-lg font-bold text-brand-purple font-mono">
              ${forecastResult.metrics?.mae?.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">Target scale error</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-500 block mb-1">Test RMSE (Root Mean Squared Error)</span>
            <div className="text-lg font-bold text-brand-purple font-mono">
              ${forecastResult.metrics?.rmse?.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">Residual standard deviation</span>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800/60">
            <span className="text-xs text-purple-700 dark:text-purple-300 block mb-1">
              Projected Total ({futureForecastData.length} Periods)
            </span>
            <div className="text-xl font-bold text-brand-purple dark:text-purple-300">
              ${projectedCumulative.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
              Daily Avg: ${projectedAvgDaily.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>

        </div>
      )}

      {/* FORECAST VISUALIZATION CHART */}
      {forecastResult && futureForecastData.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Future Forecast Projection & 95% Confidence Interval
              </h3>
              <p className="text-xs text-slate-500">
                Model predictions spanning {futureForecastData.length} periods forward with upper and lower probability bounds
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 font-semibold text-purple-600">
                <span className="w-3 h-0.5 bg-purple-600"></span> Expected Forecast
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-purple-300 dark:text-purple-700">
                <span className="w-3 h-2 bg-purple-200 dark:bg-purple-900/60"></span> 95% Confidence Band
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={futureForecastData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="upper_bound" stroke="none" fill="#8b5cf6" fillOpacity={0.15} name="Upper Bound" />
                <Area type="monotone" dataKey="predicted" stroke="#7c3aed" strokeWidth={2.5} fillOpacity={1} fill="url(#forecastFill)" name="Forecasted Revenue" />
                <Area type="monotone" dataKey="lower_bound" stroke="none" fill="#ffffff" fillOpacity={0} name="Lower Bound" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ACTUAL VS PREDICTED ON UNSEEN TEST SET */}
      {testComparisonData.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Validation: Actual vs Predicted on Out-of-Sample Test Set
              </h3>
              <p className="text-xs text-slate-500">
                Verifying that the trained model accurately tracked historical sales swings without data leakage
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={testComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={false} name="Actual Test Sales" />
                <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Model Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* FEATURE IMPORTANCES OR MODEL COEFFICIENTS */}
      {forecastResult?.feature_importances && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Machine Learning Feature Importance Breakdown
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Factors and lags driving the model's predictive decisions
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {forecastResult.feature_importances.slice(0, 9).map((f) => (
              <div key={f.feature} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{f.feature}</span>
                  <span className="font-mono text-brand-purple font-bold">{(f.importance * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-purple h-full rounded-full" 
                    style={{ width: `${Math.min(100, Math.max(5, f.importance * 100))}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onNavigateTab('evaluation')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-brand-purple hover:bg-purple-700 shadow-lg shadow-purple-500/25 transition-all"
        >
          <span>Compare All Models in Evaluation Module</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
