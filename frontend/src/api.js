import axios from 'axios';

const API_BASE = '/api';

export const api = {
  checkHealth: () => axios.get(`${API_BASE}/health`),
  loadSampleData: () => axios.get(`${API_BASE}/sample/generate`),
  downloadSampleUrl: `${API_BASE}/sample/download`,
  
  uploadDataset: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE}/dataset/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  preprocessDataset: (mapping = {}, options = {}) => {
    return axios.post(`${API_BASE}/dataset/preprocess`, { mapping, options });
  },
  
  getEDA: () => axios.get(`${API_BASE}/dataset/eda`),
  
  decomposeTimeSeries: (frequency = 'D', targetMetric = 'Revenue', modelType = 'additive') => {
    return axios.post(`${API_BASE}/timeseries/decompose`, {
      frequency,
      target_metric: targetMetric,
      model_type: modelType
    });
  },
  
  trainAndForecast: (params) => {
    return axios.post(`${API_BASE}/forecasting/train-predict`, params);
  },
  
  compareAllModels: (params) => {
    return axios.post(`${API_BASE}/forecasting/compare-all`, params);
  },
  
  getInsights: () => axios.get(`${API_BASE}/insights`),
  
  downloadCsvUrl: `${API_BASE}/reports/download-csv`,
  downloadExcelUrl: `${API_BASE}/reports/download-excel`,
  downloadPdfUrl: `${API_BASE}/reports/download-pdf`,
};
