import React from 'react';
import { TrendingUp, Github, Heart, Layers, Database, Cpu, BarChart3 } from 'lucide-react';

export default function Footer({ onNavigateToSection, onNavigateToDashboard }) {
  return (
    <footer className="bg-slate-900 dark:bg-navy-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-accent flex items-center justify-center text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Sales Forecasting System
              </span>
            </div>
            <p className="text-sm text-purple-300 font-medium italic">
              "Analyze Past Sales. Predict Future Growth."
            </p>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              An enterprise-grade academic data analytics and machine learning platform engineered to transform historical retail transaction datasets into high-fidelity demand forecasts and actionable business intelligence.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/60">
                BE Computer Science Mini Project
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60">
                ML & Time Series
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigateToSection('home')} 
                  className="hover:text-purple-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSection('features')} 
                  className="hover:text-purple-400 transition-colors"
                >
                  Key Features
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSection('how-it-works')} 
                  className="hover:text-purple-400 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSection('technologies')} 
                  className="hover:text-purple-400 transition-colors"
                >
                  Technologies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateToSection('about')} 
                  className="hover:text-purple-400 transition-colors"
                >
                  About Project
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateToDashboard} 
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Launch Dashboard &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Technologies Stack */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Technology Stack
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                <span>Python & FastAPI Backend</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>React.js & Tailwind CSS</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Pandas & NumPy Analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Scikit-learn & Statsmodels</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>ARIMA & Random Forest ML</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                <span>Interactive Recharts Visuals</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Sales Forecasting System. All rights reserved. Academic mini project.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with precision for Data Analytics & Machine Learning</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
