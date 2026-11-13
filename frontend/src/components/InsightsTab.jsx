import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  PackageCheck, 
  Store, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api';

const ICON_MAP = {
  PackageCheck: PackageCheck,
  AlertTriangle: AlertTriangle,
  Store: Store,
  TrendingUp: TrendingUp,
  Calendar: Calendar,
  Clock: Clock,
  Sparkles: Sparkles
};

export default function InsightsTab({ onNavigateTab }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [insightsData, setInsightsData] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getInsights();
      setInsightsData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load business insights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const insightsList = insightsData?.insights_list || [];
  const inventoryActions = insightsData?.inventory_actions || [];

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Title */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Dynamic Business Insights & Supply Chain Intelligence
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Live Data Synthesis
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Actionable executive takeaways synthesized in real time from exploratory findings and future machine learning trajectories.
          </p>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 transition-all"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Refresh Insights</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* EXECUTIVE SYNTHESIS SUMMARY */}
      {insightsData?.executive_summary && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-950 via-slate-900 to-purple-950 text-white shadow-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
            <Lightbulb className="w-4 h-4" />
            <span>Executive Business Assessment</span>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-slate-200">
            {insightsData.executive_summary}
          </p>
        </div>
      )}

      {/* DYNAMIC INSIGHTS CARDS (Part 14) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insightsList.map((ins, idx) => {
          const IconComponent = ICON_MAP[ins.icon] || Lightbulb;
          const isWarning = ins.level === 'warning';
          const isPositive = ins.level === 'positive';

          return (
            <div 
              key={idx}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 hover:shadow-lg ${
                isWarning 
                  ? "border-amber-200 dark:border-amber-900/60" 
                  : isPositive 
                  ? "border-emerald-200 dark:border-emerald-900/60" 
                  : "border-slate-200/80 dark:border-slate-800"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isWarning 
                      ? "bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400" 
                      : isPositive 
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400" 
                      : "bg-purple-100 text-brand-purple dark:bg-purple-950/80 dark:text-purple-400"
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {ins.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {ins.title}
                    </h4>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {ins.summary}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] font-bold text-brand-purple dark:text-purple-300 block mb-0.5">
                  Strategic Recommendation:
                </span>
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {ins.recommendation}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SMART INVENTORY REPLENISHMENT ACTION GUIDE */}
      {inventoryActions.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                When Should Businesses Increase Inventory? (Supply Chain Guide)
              </h3>
              <p className="text-xs text-slate-500">
                Data-driven restocking protocols based on seasonal cycles and promotional lead times
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inventoryActions.map((act, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                    {act.action}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {act.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onNavigateTab('reports')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-brand-purple hover:bg-purple-700 shadow-lg shadow-purple-500/25 transition-all"
        >
          <span>Proceed to Report Generation Hub</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
