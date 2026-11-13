import React, { useState } from 'react';
import { 
  TrendingUp, 
  LayoutDashboard, 
  UploadCloud, 
  Sliders, 
  PieChart, 
  LineChart, 
  BrainCircuit, 
  Award, 
  Lightbulb, 
  FileSpreadsheet, 
  Home, 
  Menu, 
  X, 
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function DashboardLayout({ 
  currentTab, 
  onSelectTab, 
  onReturnHome, 
  hasData, 
  isSample, 
  children 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: '1. Dashboard Overview', icon: LayoutDashboard },
    { id: 'upload', label: '2. Dataset Upload', icon: UploadCloud },
    { id: 'preprocessing', label: '3. Data Preprocessing', icon: Sliders },
    { id: 'eda', label: '4. Exploratory EDA', icon: PieChart },
    { id: 'timeseries', label: '5. Time Series Analysis', icon: LineChart },
    { id: 'forecasting', label: '6. ML & Forecasting', icon: BrainCircuit },
    { id: 'evaluation', label: '7. Model Evaluation', icon: Award },
    { id: 'insights', label: '8. Business Insights', icon: Lightbulb },
    { id: 'reports', label: '9. Report Generation', icon: FileSpreadsheet },
  ];

  const handleTabClick = (tabId) => {
    onSelectTab(tabId);
    setSidebarOpen(false);
  };

  const currentNav = navItems.find(item => item.id === currentTab) || navItems[0];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-navy-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Brand Header */}
        <div>
          <div className="h-16 sm:h-20 px-6 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
            <div 
              onClick={onReturnHome}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-accent flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  Sales<span className="text-brand-purple">Forecast</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 block -mt-0.5">
                  ML Analytics Engine
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              System Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive 
                      ? "bg-purple-50 dark:bg-purple-950/60 text-brand-purple dark:text-purple-300 shadow-sm border border-purple-200/60 dark:border-purple-800/60" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-brand-purple dark:text-purple-300" : "text-slate-400"}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Sidebar Status & Home Link */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
          
          {/* Dataset Status Pill */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-400">Active Dataset</span>
              {hasData ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <AlertCircle className="w-3 h-3" /> None
                </span>
              )}
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {isSample ? "3-Year Benchmark Data" : hasData ? "Custom Uploaded File" : "No Dataset Active"}
            </div>
          </div>

          {/* Return Home Button */}
          <button
            onClick={onReturnHome}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Landing Page</span>
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white/80 dark:bg-navy-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">
                Sales Forecasting System &bull; Workspace
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{currentNav.label}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSample && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-brand-purple dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <Database className="w-3 h-3" />
                <span>Sample Mode</span>
              </span>
            )}

            <ThemeToggle />

            <button
              onClick={onReturnHome}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>
          </div>

        </header>

        {/* Tab Body */}
        <main className="flex-1 p-4 sm:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}
