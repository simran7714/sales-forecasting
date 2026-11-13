import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Cpu, 
  LineChart, 
  Eye, 
  Lightbulb, 
  UploadCloud, 
  Sliders, 
  PieChart, 
  BrainCircuit, 
  FileSpreadsheet, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const previewChartData = [
  { name: 'Jan', actual: 4200, forecast: 4200 },
  { name: 'Feb', actual: 4600, forecast: 4600 },
  { name: 'Mar', actual: 5100, forecast: 5100 },
  { name: 'Apr', actual: 4900, forecast: 4900 },
  { name: 'May', actual: 5800, forecast: 5800 },
  { name: 'Jun', actual: 6400, forecast: 6400 },
  { name: 'Jul', actual: null, forecast: 7100 },
  { name: 'Aug', actual: null, forecast: 7800 },
  { name: 'Sep', actual: null, forecast: 8350 },
  { name: 'Oct', actual: null, forecast: 9100 },
];

export default function LandingPage({ onNavigateToDashboard, onNavigateToSection }) {
  
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      
      {/* 4.2 HERO SECTION */}
      <section id="home" className="relative pt-8 pb-20 lg:pt-16 lg:pb-32 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-navy-950 dark:via-slate-900 dark:to-navy-950">
        
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs font-semibold text-brand-purple dark:text-purple-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Machine Learning & Time Series Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Predict Tomorrow's Sales with{' '}
                <span className="bg-gradient-to-r from-brand-purple via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                  Data-Driven Intelligence.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Transform historical sales data into meaningful insights. Analyze sales trends, understand demand patterns and forecast future sales using Machine Learning and Time Series Analysis.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onNavigateToDashboard}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-brand-purple to-brand-accent hover:from-purple-700 hover:to-indigo-600 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollTo('features')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                >
                  <span>Explore Features</span>
                </button>
              </div>

              {/* Key Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 dark:border-slate-800 max-w-lg mx-auto lg:mx-0">
                <div className="text-left">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">4 Models</div>
                  <div className="text-xs text-slate-500">RF, ARIMA, Reg, MA</div>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">0% Mock</div>
                  <div className="text-xs text-slate-500">Real Python Calculations</div>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">Instant</div>
                  <div className="text-xs text-slate-500">Reports & Insights</div>
                </div>
              </div>

            </div>

            {/* Right Hero Visual: Dashboard Preview Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-2xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    <span className="ml-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Predictive Intelligence Terminal
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    Live Model
                  </span>
                </div>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[11px] text-slate-500">Target Revenue</span>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">$171.4M</div>
                    <span className="text-[10px] text-emerald-500 font-semibold">&uarr; +14.2% MoM</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                    <span className="text-[11px] text-slate-500">Optimal Algorithm</span>
                    <div className="text-lg font-bold text-brand-purple">Random Forest</div>
                    <span className="text-[10px] text-purple-500 font-semibold">Lowest Test RMSE</span>
                  </div>
                </div>

                {/* Simulated Chart Container */}
                <div className="h-44 w-full">
                  <span className="text-[11px] font-medium text-slate-500 block mb-1">
                    Historical vs Projected Demand Horizon
                  </span>
                  <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={previewChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="heroActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="heroForecast" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }} />
                      <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#heroActual)" name="Historical" />
                      <Area type="monotone" dataKey="forecast" stroke="#8b5cf6" strokeWidth={2.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#heroForecast)" name="Predicted" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Sub-badge alert */}
                <div className="mt-3 flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40">
                  <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span className="font-medium">Confidence Band: 95% Interval</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">MAE: 11.3K</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4.3 KEY FEATURES SECTION */}
      <section id="features" className="py-20 bg-white dark:bg-navy-950 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              End-to-End Predictive Analytics Architecture
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Designed as a comprehensive academic mini-project demonstrating genuine data science workflows from raw transaction intake to strategic business intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="group p-7 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-brand-purple flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                1. Sales Forecasting
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Predict future sales and revenue accurately across 7-day, 30-day, 3-month and 6-month horizons with confidence intervals.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-7 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                2. Data Analytics
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Analyze daily, weekly, monthly and yearly retail performance, identifying top-performing stores and best-selling SKUs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-7 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                3. Machine Learning
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Train multiple supervised ML algorithms (Random Forest, Linear Regression) with calendar, lag, and rolling window features.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-7 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                4. Time Series Analysis
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Decompose sales into Trend, Seasonality, and Residual components via Statsmodels, verified with Augmented Dickey-Fuller stationarity tests.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-7 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                5. Interactive Visualization
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Explore dynamic Recharts dashboards with interactive tooltips, responsive multi-series lines, bars, and seasonal distribution plots.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-7 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                6. Business Insights
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatically generate data-driven executive takeaways on promotional uplift, holiday surges, and optimal inventory reordering times.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4.4 HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
              Project Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How the Forecasting Pipeline Operates
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              A disciplined, step-by-step scientific process adhering to standard data mining and time series forecasting methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-brand-purple">01</span>
                <UploadCloud className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Upload Sales Dataset
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Upload historical sales records via CSV or Excel (.xlsx/.xls) or load our realistic 3-year sample dataset with one click.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-brand-purple">02</span>
                <Sliders className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Clean and Preprocess Data
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Handle missing entries, remove duplicates, sort chronologically, and cap outlier anomalies via Pandas IQR Winsorization.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-brand-purple">03</span>
                <PieChart className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Perform Exploratory Analysis (EDA)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Investigate seasonal spikes, day-of-week trends, store performance rankings, and quantifiable marketing promotion lifts.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-brand-purple">04</span>
                <BrainCircuit className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Apply Machine Learning Models
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Train Linear Regression, ARIMA, Moving Average, and Random Forest Regressors using leak-free chronological 80/20 train-test splits.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-brand-purple">05</span>
                <TrendingUp className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Generate Future Predictions
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Forecast revenue and units across selected horizons (7d to 6mo), displaying prediction bands alongside historical trajectories.
              </p>
            </div>

            {/* Step 6 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-brand-purple">06</span>
                <FileSpreadsheet className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                View Reports & Business Insights
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Review dynamic inventory replenishment advisories and export publication-ready PDF, Excel, and CSV prediction reports.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4.5 TECHNOLOGIES SECTION */}
      <section id="technologies" className="py-20 bg-white dark:bg-navy-950 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
              Modern Tech Stack
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Built on High-Performance Industry Standards
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Combining Python's scientific computing ecosystem with modern React interfaces for seamless interactive intelligence.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 hover:border-purple-500/40 transition-colors">
              <div className="text-2xl font-black text-blue-600">Python 3.11</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Backend Core</div>
              <p className="text-[11px] text-slate-500">Robust data engineering & computation</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 hover:border-purple-500/40 transition-colors">
              <div className="text-2xl font-black text-cyan-500">React.js</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Frontend UI</div>
              <p className="text-[11px] text-slate-500">Component-driven reactive state</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 hover:border-purple-500/40 transition-colors">
              <div className="text-2xl font-black text-emerald-500">FastAPI</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Async Web API</div>
              <p className="text-[11px] text-slate-500">High-speed REST API endpoints</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 hover:border-purple-500/40 transition-colors">
              <div className="text-2xl font-black text-indigo-500">Pandas & NumPy</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Data Analytics</div>
              <p className="text-[11px] text-slate-500">Vectorized dataset manipulation</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 hover:border-purple-500/40 transition-colors">
              <div className="text-2xl font-black text-amber-500">Scikit-learn</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Machine Learning</div>
              <p className="text-[11px] text-slate-500">Regression, trees & model metrics</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 hover:border-purple-500/40 transition-colors">
              <div className="text-2xl font-black text-purple-500">Statsmodels</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Time Series</div>
              <p className="text-[11px] text-slate-500">ARIMA & seasonal decomposition</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 hover:border-purple-500/40 transition-colors">
              <div className="text-2xl font-black text-pink-500">Recharts</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Data Visuals</div>
              <p className="text-[11px] text-slate-500">Responsive SVG time series charts</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 hover:border-purple-500/40 transition-colors">
              <div className="text-2xl font-black text-sky-500">Tailwind CSS</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Design System</div>
              <p className="text-[11px] text-slate-500">Modern navy & purple styling</p>
            </div>

          </div>

        </div>
      </section>

      {/* 4.6 ABOUT PROJECT SECTION */}
      <section id="about" className="py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                Academic Context & Scope
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                About the Sales Forecasting System
              </h2>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                This project is developed as a comprehensive <b>Bachelor of Engineering Computer Science</b> academic mini project in Data Analytics and Applied Machine Learning. Its primary motivation is to bridge theoretical statistical modeling with pragmatic business operational decision-making.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <b>Historical Sales Performance:</b> Deep multi-dimensional auditing of commercial revenue streams.
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <b>Trend & Seasonal Dynamics:</b> Statistical decomposition isolating cycles and holiday spikes.
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <b>Future Revenue Projections:</b> Quantitative forecasting minimizing stockouts and overstock.
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    <b>Inventory Optimization:</b> Data-driven safety stock buffer sizing and replenishment alerts.
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-300">
                <b>Academic Rigor Notice:</b> Unlike synthetic UI demonstrators, all model evaluation metrics (MAE, MSE, RMSE) and future predictions displayed across this portal are computed in real time on the Python server using rigorous chronological train-test splits.
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4.7 CALL-TO-ACTION SECTION */}
      <section className="py-20 bg-gradient-to-r from-navy-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Turn Your Sales Data into Future Insights.
          </h2>
          
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Start analyzing historical sales data and discover what the future may hold. Test with your custom dataset or explore immediately using our pre-loaded 3-year enterprise sample dataset.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-brand-purple to-brand-accent hover:from-purple-600 hover:to-indigo-500 shadow-xl shadow-purple-500/30 hover:scale-105 transition-all"
            >
              <span>Launch Forecasting Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
