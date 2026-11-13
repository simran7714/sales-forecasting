import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Store, 
  TrendingUp, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
  BarChart3,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

export default function OverviewTab({ edaData, forecastData, isSample, onNavigateTab }) {
  if (!edaData || !edaData.kpis) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-brand-purple flex items-center justify-center animate-bounce">
          <TrendingUp className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          No Sales Dataset Loaded Yet
        </h3>
        <p className="text-sm text-slate-500 max-w-md">
          Please upload your sales dataset or load the pre-configured 3-year sample historical data to view the dashboard metrics and visualizations.
        </p>
        <button
          onClick={() => onNavigateTab('upload')}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-brand-purple hover:bg-purple-700 shadow"
        >
          Go to Dataset Upload &rarr;
        </button>
      </div>
    );
  }

  const { kpis, monthly_analysis, top_products, store_performance, daily_trend } = edaData;
  
  // Calculate predicted future revenue from forecastData if available
  const predictedFutureRev = forecastData?.forecast?.reduce((acc, curr) => acc + (curr.predicted || 0), 0) || (kpis.total_revenue * 0.12);
  const forecastHorizonDays = forecastData?.forecast?.length || 30;

  // Pie chart data for store share
  const storePieData = store_performance?.map(s => ({
    name: s.store_id,
    value: s.total_revenue
  })) || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner / Dataset Context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Executive Sales Performance Dashboard
            </h2>
            {isSample && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                Sample Dataset (3 Years)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Analyzing historical sales period from <span className="font-semibold text-slate-700 dark:text-slate-200">{kpis.date_start}</span> to <span className="font-semibold text-slate-700 dark:text-slate-200">{kpis.date_end}</span> ({kpis.total_records.toLocaleString()} transactions).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('forecasting')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-purple to-brand-accent hover:from-purple-700 hover:to-indigo-600 shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tune Forecasting Model</span>
          </button>
        </div>
      </div>

      {/* 6 TOP STAT CARDS (Part 5 Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* 1. Total Revenue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            ${kpis.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> Historical Cumulative
          </span>
        </div>

        {/* 2. Total Units Sold */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Units Sold</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {kpis.total_units.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Items dispatched
          </span>
        </div>

        {/* 3. Total Products */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-brand-purple flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {kpis.total_products}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Active Catalog SKUs
          </span>
        </div>

        {/* 4. Total Stores */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Stores</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {kpis.total_stores}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Retail Outlets
          </span>
        </div>

        {/* 5. Average Sales */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Average Sales</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            ${kpis.avg_order_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Avg ticket revenue
          </span>
        </div>

        {/* 6. Predicted Future Revenue */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800/60 shadow-sm">
          <div className="flex items-center justify-between text-purple-700 dark:text-purple-300 mb-2">
            <span className="text-xs font-semibold">Predicted Future Rev</span>
            <div className="w-8 h-8 rounded-lg bg-brand-purple text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-brand-purple dark:text-purple-300">
            ${predictedFutureRev.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-purple-700 dark:text-purple-300 font-medium flex items-center gap-1 mt-1">
            Next {forecastHorizonDays} Periods
          </span>
        </div>

      </div>

      {/* VISUALIZATION SECTION 1: Sales Overview & Historical vs Predicted */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Historical vs Predicted Sales Chart (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Historical vs Predicted Sales Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Continuous historical sales trend with 7-day and 30-day moving averages
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-blue-500 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Daily Sales
              </span>
              <span className="inline-flex items-center gap-1 text-purple-500 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> 7-Day MA
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily_trend} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDailyRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorDailyRev)" name="Daily Sales" />
                <Area type="monotone" dataKey="ma7" stroke="#8b5cf6" strokeWidth={2} fillOpacity={0} name="7-Day Moving Avg" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Store-wise Market Share (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Store-Wise Sales Share
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Revenue distribution across retail store outlets
            </p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={storePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {storePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {store_performance?.map((s, idx) => (
              <div key={s.store_id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{s.store_id}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">{s.revenue_share}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* VISUALIZATION SECTION 2: Monthly Revenue & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Revenue & Growth (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Revenue Growth Analysis
              </h3>
              <p className="text-xs text-slate-500">
                Monthly financial aggregation with month-over-month (MoM) progression
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly_analysis} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Monthly Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top-Selling Products (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Top-Selling Products by Revenue
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Catalog high-earners and volume contributors
          </p>

          <div className="space-y-3">
            {top_products?.map((p, idx) => (
              <div key={p.product_id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-950 text-brand-purple text-xs font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {p.product_id}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    ${p.total_revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{p.total_units.toLocaleString()} units sold</span>
                  <span className="font-semibold text-brand-purple">{p.revenue_share}% revenue share</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
