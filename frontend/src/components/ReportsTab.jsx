import React from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  FileDown, 
  Layers,
  Award,
  ShieldCheck
} from 'lucide-react';
import { api } from '../api';

export default function ReportsTab({ edaData, forecastData }) {
  const kpis = edaData?.kpis || {};
  const forecastCount = forecastData?.forecast?.length || 0;
  const modelName = forecastData?.model_name || "Random Forest Regressor";

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Title */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Analytical Report Generation & Export Hub
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Export academic deliverables and corporate intelligence in publication-ready PDF, structured multi-sheet Excel (.xlsx), and CSV data formats.
        </p>
      </div>

      {/* 3 DOWNLOAD CARDS (Part 13) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. PDF Report */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-purple-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-brand-purple flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block mb-1">
                Executive & Academic Format
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Comprehensive PDF Report
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Complete multi-page analytical document formatted with executive summaries, KPI tables, ML model validation metrics (MAE/RMSE), future forecasts, and strategic business takeaways.
            </p>

            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Executive Summary & KPIs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Model Evaluation Comparison</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Future Projections & Insights</span>
              </li>
            </ul>
          </div>

          <a
            href={api.downloadPdfUrl}
            download="Sales_Forecasting_Academic_Report.pdf"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs text-white bg-brand-purple hover:bg-purple-700 shadow-md shadow-purple-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </a>
        </div>

        {/* 2. Excel Full Report (.xlsx) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                Corporate Multi-Sheet Workbook
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Multi-Tab Excel Workbook
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Spreadsheet (.xlsx) structured with distinct worksheets for Executive Summary, Cleaned Historical Sales, Product Breakdown, Store Breakdown, and Machine Learning Predictions.
            </p>

            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sheet 1: Executive KPIs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sheet 2: Future Sales Forecast</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sheet 3-5: Cleaned Data & Products</span>
              </li>
            </ul>
          </div>

          <a
            href={api.downloadExcelUrl}
            download="Sales_Forecasting_Report.xlsx"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Excel Report (.xlsx)</span>
          </a>
        </div>

        {/* 3. CSV Forecast Export */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center">
              <FileDown className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Data Interoperability
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Forecast Predictions (CSV)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Lightweight standard CSV containing precise projected dates, expected revenue/units, model parameters, and 95% confidence intervals for downstream ERP/BI ingestion.
            </p>

            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Date & Predicted Revenue</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Lower & Upper Bound Values</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Model Identification Stamp</span>
              </li>
            </ul>
          </div>

          <a
            href={api.downloadCsvUrl}
            download="sales_forecast_predictions.csv"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Predictions</span>
          </a>
        </div>

      </div>

      {/* AUDIT SUMMARY CARD */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-purple" />
          <span>Report Data Integrity Verification</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 font-sans block">Audited Transactions</span>
            <span className="font-bold text-slate-900 dark:text-white">{kpis.total_records?.toLocaleString() || "N/A"}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 font-sans block">Audited Total Revenue</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">${kpis.total_revenue?.toLocaleString() || "N/A"}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 font-sans block">Trained Model</span>
            <span className="font-bold text-brand-purple font-sans">{modelName}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 font-sans block">Forecast Horizons</span>
            <span className="font-bold text-slate-900 dark:text-white">{forecastCount} Periods Projected</span>
          </div>
        </div>
      </div>

    </div>
  );
}
