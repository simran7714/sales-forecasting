import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { api } from '../api';

export default function UploadTab({ 
  onDatasetLoaded, 
  onNavigateTab, 
  inspectionData, 
  isSample 
}) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const fileInputRef = useRef(null);

  // Column mapping state
  const [mapping, setMapping] = useState({
    date_col: 'Date',
    product_col: 'Product_ID',
    store_col: 'Store_ID',
    units_col: 'Units_Sold',
    revenue_col: 'Revenue',
    promo_col: 'Promotion',
    holiday_col: 'Holiday'
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!hasValidExt) {
      setError("Please select a valid CSV or Excel (.xlsx, .xls) file.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await api.uploadDataset(file);
      setSuccessMsg(`File "${file.name}" uploaded successfully! Inspecting structure...`);
      
      // Auto populate mapping if detected
      if (res.data.inspection?.detected_mapping) {
        const det = res.data.inspection.detected_mapping;
        setMapping(prev => ({
          date_col: det.Date || prev.date_col,
          product_col: det.Product_ID || prev.product_col,
          store_col: det.Store_ID || prev.store_col,
          units_col: det.Units_Sold || prev.units_col,
          revenue_col: det.Revenue || prev.revenue_col,
          promo_col: det.Promotion || prev.promo_col,
          holiday_col: det.Holiday || prev.holiday_col
        }));
      }

      onDatasetLoaded(res.data.inspection, false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to upload and parse dataset. Check file structure.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.loadSampleData();
      setSuccessMsg("Pre-configured 3-Year Historical Sales Dataset loaded successfully!");
      onDatasetLoaded(res.data.inspection, true);
    } catch (err) {
      setError("Failed to load sample dataset: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const availableCols = inspectionData?.column_info?.map(c => c.name) || [
    'Date', 'Product_ID', 'Store_ID', 'Units_Sold', 'Revenue', 'Promotion', 'Holiday'
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Header Info */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dataset Upload & Configuration
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload your historical transaction records in CSV or Excel format, or load the built-in 3-year sample benchmark.
          </p>
        </div>

        {/* Sample Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={api.downloadSampleUrl}
            download="sample_historical_sales_dataset.csv"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-brand-purple" />
            <span>Download Sample CSV</span>
          </a>
          <button
            onClick={handleLoadSample}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow shadow-purple-500/20 transition-all"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Load 3-Year Sample Dataset</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-10 rounded-3xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 ${
          dragActive 
            ? "border-brand-purple bg-purple-50/50 dark:bg-purple-950/20" 
            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-purple-400 hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
        }`}
      >
        <input 
          ref={fileInputRef} 
          type="file" 
          accept=".csv, .xlsx, .xls" 
          onChange={handleFileChange} 
          className="hidden" 
        />
        <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-brand-purple flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
          Drag and drop your sales dataset here, or <span className="text-brand-purple">Browse</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-3">
          Supported file formats: CSV (.csv), Excel (.xlsx, .xls). Recommended columns: Date, Product_ID, Store_ID, Units_Sold, Revenue, Promotion, Holiday.
        </p>
        <span className="inline-block text-[11px] text-slate-400 dark:text-slate-500">
          Maximum file size: 50MB
        </span>
      </div>

      {/* INSPECTION RESULTS (When a dataset is loaded) */}
      {inspectionData && (
        <div className="space-y-6">
          
          {/* Summary Row Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block">Total Rows</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {inspectionData.total_rows.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block">Columns Detected</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                {inspectionData.total_columns}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block">Missing Values</span>
              <span className={`text-xl font-bold ${inspectionData.total_missing_values > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                {inspectionData.total_missing_values.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 block">Duplicate Rows</span>
              <span className={`text-xl font-bold ${inspectionData.duplicate_rows > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                {inspectionData.duplicate_rows.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Column Details Table */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Column Architecture & Data Types
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Structural verification of data fields in the active dataset
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Column Name</th>
                    <th className="py-2.5 px-3">Data Type</th>
                    <th className="py-2.5 px-3">Unique Values</th>
                    <th className="py-2.5 px-3">Missing (%)</th>
                    <th className="py-2.5 px-3">Sample Values</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {inspectionData.column_info.map((col) => (
                    <tr key={col.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {col.name}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-purple-600 dark:text-purple-400">
                        {col.type}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        {col.unique_count.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          col.missing_count === 0 
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}>
                          {col.missing_pct}% ({col.missing_count})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono">
                        {col.samples.slice(0, 3).join(", ") || "None"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dataset Preview (Head & Tail) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Raw Dataset Records Preview (Head 5 Rows)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real sample records parsed from the historical file
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    {inspectionData.column_info.map(c => (
                      <th key={c.name} className="py-2 px-3">{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  {inspectionData.preview_head.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      {inspectionData.column_info.map(c => (
                        <td key={c.name} className="py-2 px-3 text-slate-700 dark:text-slate-300">
                          {row[c.name] !== null && row[c.name] !== undefined ? String(row[c.name]) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Next Step CTA */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => onNavigateTab('preprocessing')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-brand-purple hover:bg-purple-700 shadow-lg shadow-purple-500/25 transition-all"
            >
              <span>Proceed to Data Preprocessing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
