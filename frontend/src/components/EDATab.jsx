import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Store, 
  Sparkles, 
  Calendar, 
  Percent, 
  ArrowRight,
  Clock,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export default function EDATab({ edaData, onNavigateTab }) {
  const [activeSubTab, setActiveSubTab] = useState('sales'); // 'sales', 'trends', 'products', 'stores', 'promos'

  if (!edaData || !edaData.kpis) {
    return (
      <div className="p-12 text-center text-slate-500">
        Please preprocess a dataset first to examine Exploratory Data Analysis.
      </div>
    );
  }

  const {
    kpis,
    daily_trend,
    weekly_series,
    monthly_analysis,
    yearly_analysis,
    day_of_week_pattern,
    monthly_seasonality,
    peak_periods,
    low_periods,
    product_performance,
    top_products,
    lowest_products,
    store_performance,
    best_store,
    lowest_store,
    promotion_analysis,
    holiday_analysis
  } = edaData;

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Module Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Exploratory Data Analysis (EDA)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Multivariate statistical discovery: dissect temporal frequencies, cyclical seasonality, catalog rankings, and promotional lift.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('sales')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'sales' 
                ? "bg-white dark:bg-slate-700 text-brand-purple shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Sales Overview
          </button>
          <button
            onClick={() => setActiveSubTab('trends')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'trends' 
                ? "bg-white dark:bg-slate-700 text-brand-purple shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Trends & Seasonality
          </button>
          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'products' 
                ? "bg-white dark:bg-slate-700 text-brand-purple shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Product Analysis
          </button>
          <button
            onClick={() => setActiveSubTab('stores')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'stores' 
                ? "bg-white dark:bg-slate-700 text-brand-purple shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Store Comparison
          </button>
          <button
            onClick={() => setActiveSubTab('promos')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'promos' 
                ? "bg-white dark:bg-slate-700 text-brand-purple shadow-sm" 
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Promo & Holiday Impact
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: SALES OVERVIEW */}
      {activeSubTab === 'sales' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Daily & Weekly Trends */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Daily Historical Sales Curve with 7-Day & 30-Day Moving Averages
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Daily fluctuations overlaid with smoothing filters to isolate underlying momentum
            </p>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={daily_trend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Daily Revenue" />
                  <Line type="monotone" dataKey="ma7" stroke="#8b5cf6" strokeWidth={2} dot={false} name="7-Day MA" />
                  <Line type="monotone" dataKey="ma30" stroke="#f59e0b" strokeWidth={2} dot={false} name="30-Day MA" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly and Yearly breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Recent 52-Week Aggregation
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Weekly cumulative sales volume and revenue
              </p>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekly_series.slice(-26)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Weekly Revenue']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Weekly Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Annual Year-Over-Year Progression
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Yearly total revenue comparison
              </p>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearly_analysis} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} />
                    <Tooltip 
                      formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Annual Revenue']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Annual Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TRENDS & SEASONALITY */}
      {activeSubTab === 'trends' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Day of Week Seasonality */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Day-of-Week Seasonality
                </h3>
                <span className="text-xs text-brand-purple font-semibold">Weekend Spike</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Average transaction revenue by day of the week (Mon to Sun)
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={day_of_week_pattern} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      formatter={(val) => [`$${Number(val).toFixed(2)}`, 'Avg Ticket Revenue']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    />
                    <Bar dataKey="avg_revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Avg Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Seasonality */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Month-of-Year Seasonality
                </h3>
                <span className="text-xs text-emerald-500 font-semibold">Q4 Surge</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Average monthly trading revenue pattern across the 12 calendar months
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthly_seasonality} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      formatter={(val) => [`$${Number(val).toFixed(2)}`, 'Avg Revenue']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    />
                    <Line type="monotone" dataKey="avg_revenue" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} name="Avg Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Peak & Low Demand Periods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Peaks */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Top 5 Peak Sales Days
              </h4>
              <div className="space-y-2">
                {peak_periods.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 text-xs">
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{p.date}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">${p.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lows */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" /> 5 Lowest Demand Days
              </h4>
              <div className="space-y-2">
                {low_periods.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs">
                    <span className="font-mono text-slate-600 dark:text-slate-400">{p.date}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">${p.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PRODUCT PERFORMANCE */}
      {activeSubTab === 'products' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Catalog Revenue & Units Sold Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Comprehensive product portfolio analytics
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Product ID</th>
                    <th className="py-2.5 px-3">Total Revenue</th>
                    <th className="py-2.5 px-3">Revenue Share</th>
                    <th className="py-2.5 px-3">Units Sold</th>
                    <th className="py-2.5 px-3">Avg Revenue / Order</th>
                    <th className="py-2.5 px-3">Unit Price Approx</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  {product_performance.map((p, idx) => (
                    <tr key={p.product_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-brand-purple">
                        {p.product_id} {idx === 0 && <span className="ml-1 text-[10px] text-amber-500">🏆 Top</span>}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        ${p.total_revenue.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-bold">
                        {p.revenue_share}%
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        {p.total_units.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        ${p.avg_revenue.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        ${p.implied_unit_price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: STORE ANALYSIS */}
      {activeSubTab === 'stores' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Store-Wise Total Revenue Comparison
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Absolute sales generated across store outlets
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={store_performance} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="store_id" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} tickFormatter={(v) => `$${(v/1000000).toFixed(1)}M`} />
                    <Tooltip 
                      formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Total Revenue']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    />
                    <Bar dataKey="total_revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Total Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                  Store Benchmarks & Extremes
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">
                      Highest-Performing Branch
                    </span>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {best_store?.store_id}
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Generated ${best_store?.total_revenue?.toLocaleString()} ({best_store?.revenue_share}% market share).
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Lowest-Performing Branch
                    </span>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {lowest_store?.store_id}
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Generated ${lowest_store?.total_revenue?.toLocaleString()} ({lowest_store?.revenue_share}% market share).
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-4">
                Data-backed retail expansion recommendation: Allocate premium marketing budget to store {best_store?.store_id}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: PROMOTIONS & HOLIDAY IMPACT */}
      {activeSubTab === 'promos' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Promotions */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Marketing Promotion Impact
                </h3>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  +{promotion_analysis?.promotional_uplift_pct}% Lift
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Comparing average transaction revenue during active promotional discount campaigns vs regular trading periods.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 block">Baseline (Non-Promo)</span>
                  <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                    ${promotion_analysis?.regular_sales_avg_revenue?.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-400">Avg units: {promotion_analysis?.non_promo_avg_units}</span>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                  <span className="text-[11px] text-purple-700 dark:text-purple-300 block">Promotional Campaign</span>
                  <div className="text-lg font-bold text-brand-purple dark:text-purple-300 font-mono">
                    ${promotion_analysis?.promotional_sales_avg_revenue?.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400">Avg units: {promotion_analysis?.promo_avg_units}</span>
                </div>
              </div>
            </div>

            {/* Holidays */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  National Holiday Sales Surge
                </h3>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  +{holiday_analysis?.holiday_uplift_pct}% Surge
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Comparing trading volume on designated public holidays vs standard non-holiday calendar dates.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 block">Non-Holiday Baseline</span>
                  <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                    ${holiday_analysis?.non_holiday_avg_revenue?.toFixed(2)}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <span className="text-[11px] text-amber-700 dark:text-amber-300 block">Holiday Demand Surge</span>
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">
                    ${holiday_analysis?.holiday_avg_revenue?.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Navigation CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onNavigateTab('timeseries')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-brand-purple hover:bg-purple-700 shadow-lg shadow-purple-500/25 transition-all"
        >
          <span>Proceed to Time Series Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
