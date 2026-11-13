import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/DashboardLayout';

import OverviewTab from './components/OverviewTab';
import UploadTab from './components/UploadTab';
import PreprocessingTab from './components/PreprocessingTab';
import EDATab from './components/EDATab';
import TimeSeriesTab from './components/TimeSeriesTab';
import ForecastingTab from './components/ForecastingTab';
import EvaluationTab from './components/EvaluationTab';
import InsightsTab from './components/InsightsTab';
import ReportsTab from './components/ReportsTab';

import { api } from './api';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' or 'dashboard'
  const [currentTab, setCurrentTab] = useState('overview');
  
  const [inspectionData, setInspectionData] = useState(null);
  const [cleanSummary, setCleanSummary] = useState(null);
  const [edaData, setEdaData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isSample, setIsSample] = useState(false);
  const [hasData, setHasData] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const initData = async () => {
      try {
        const health = await api.checkHealth();
        if (health.data.has_clean_data) {
          const edaRes = await api.getEDA();
          setEdaData(edaRes.data);
          setHasData(true);
          setIsSample(health.data.is_sample_data);
        } else {
          // Pre-load sample dataset so user has an immediate full experience
          const sampleRes = await api.loadSampleData();
          setInspectionData(sampleRes.data.inspection);
          setCleanSummary(sampleRes.data.preprocessing_summary);
          const edaRes = await api.getEDA();
          setEdaData(edaRes.data);
          setHasData(true);
          setIsSample(true);
        }
      } catch (err) {
        console.warn("Backend not reached or initializing:", err.message);
      }
    };
    initData();
  }, []);

  const handleDatasetLoaded = (inspection, isSampleFlag) => {
    setInspectionData(inspection);
    setIsSample(isSampleFlag);
    setHasData(true);
    // Refresh EDA
    api.getEDA().then(res => setEdaData(res.data)).catch(console.error);
    setCurrentTab('preprocessing');
  };

  const handlePreprocessingDone = (cleaningReport) => {
    setCleanSummary(cleaningReport);
    api.getEDA().then(res => setEdaData(res.data)).catch(console.error);
    setCurrentTab('eda');
  };

  const handleForecastCompleted = (result, modelName) => {
    setForecastData({ result, model_name: modelName });
  };

  const handleNavigateToSection = (sectionId) => {
    if (view !== 'landing') {
      setView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 transition-colors">
        <Navbar 
          onNavigateToDashboard={() => setView('dashboard')}
          onNavigateToSection={handleNavigateToSection}
          currentView={view}
        />
        <LandingPage 
          onNavigateToDashboard={() => setView('dashboard')}
          onNavigateToSection={handleNavigateToSection}
        />
        <Footer 
          onNavigateToSection={handleNavigateToSection}
          onNavigateToDashboard={() => setView('dashboard')}
        />
      </div>
    );
  }

  // Dashboard View
  return (
    <DashboardLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      onReturnHome={() => setView('landing')}
      hasData={hasData}
      isSample={isSample}
    >
      {currentTab === 'overview' && (
        <OverviewTab 
          edaData={edaData} 
          forecastData={forecastData?.result} 
          isSample={isSample}
          onNavigateTab={setCurrentTab}
        />
      )}

      {currentTab === 'upload' && (
        <UploadTab
          onDatasetLoaded={handleDatasetLoaded}
          onNavigateTab={setCurrentTab}
          inspectionData={inspectionData}
          isSample={isSample}
        />
      )}

      {currentTab === 'preprocessing' && (
        <PreprocessingTab
          onPreprocessingDone={handlePreprocessingDone}
          onNavigateTab={setCurrentTab}
          cleanSummary={cleanSummary}
          inspectionData={inspectionData}
        />
      )}

      {currentTab === 'eda' && (
        <EDATab
          edaData={edaData}
          onNavigateTab={setCurrentTab}
        />
      )}

      {currentTab === 'timeseries' && (
        <TimeSeriesTab
          onNavigateTab={setCurrentTab}
        />
      )}

      {currentTab === 'forecasting' && (
        <ForecastingTab
          edaData={edaData}
          onForecastCompleted={handleForecastCompleted}
          onNavigateTab={setCurrentTab}
          existingForecast={forecastData}
        />
      )}

      {currentTab === 'evaluation' && (
        <EvaluationTab
          onNavigateTab={setCurrentTab}
        />
      )}

      {currentTab === 'insights' && (
        <InsightsTab
          onNavigateTab={setCurrentTab}
        />
      )}

      {currentTab === 'reports' && (
        <ReportsTab
          edaData={edaData}
          forecastData={forecastData?.result}
        />
      )}
    </DashboardLayout>
  );
}
