import React, { useState } from 'react';
import { TrendingUp, Menu, X, ArrowRight } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onNavigateToDashboard, onNavigateToSection, currentView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (onNavigateToSection) {
      onNavigateToSection(sectionId);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 dark:bg-navy-950/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleLinkClick('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-accent flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                Sales<span className="text-brand-purple">Forecast</span>
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Machine Learning & Time Series
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => handleLinkClick('home')} 
              className="hover:text-brand-purple dark:hover:text-brand-accent transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => handleLinkClick('features')} 
              className="hover:text-brand-purple dark:hover:text-brand-accent transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => handleLinkClick('how-it-works')} 
              className="hover:text-brand-purple dark:hover:text-brand-accent transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => handleLinkClick('technologies')} 
              className="hover:text-brand-purple dark:hover:text-brand-accent transition-colors"
            >
              Technologies
            </button>
            <button 
              onClick={() => handleLinkClick('about')} 
              className="hover:text-brand-purple dark:hover:text-brand-accent transition-colors"
            >
              About Project
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-brand-purple to-brand-accent hover:from-purple-700 hover:to-indigo-600 shadow-sm shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-navy-950/95 px-4 pt-3 pb-6 space-y-3">
          <button 
            onClick={() => handleLinkClick('home')} 
            className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-200"
          >
            Home
          </button>
          <button 
            onClick={() => handleLinkClick('features')} 
            className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-200"
          >
            Features
          </button>
          <button 
            onClick={() => handleLinkClick('how-it-works')} 
            className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-200"
          >
            How It Works
          </button>
          <button 
            onClick={() => handleLinkClick('technologies')} 
            className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-200"
          >
            Technologies
          </button>
          <button 
            onClick={() => handleLinkClick('about')} 
            className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-200"
          >
            About Project
          </button>
          <div className="pt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigateToDashboard(); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm text-white bg-brand-purple hover:bg-purple-700 shadow"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
