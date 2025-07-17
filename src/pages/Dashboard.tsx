// Main Dashboard Page - Equivalent to index.html template
import React, { useState, useEffect } from 'react';
import { HealthService, HealthData } from '../services/healthService';
import { AnomalyDetectionModel, HealthDataWithAnomaly } from '../models/anomalyDetection';
import { HealthChart } from '../components/charts/HealthChart';
import { AnomalyChart } from '../components/charts/AnomalyChart';
import { DataTable } from '../components/ui/DataTable';
import { RefreshCw, Activity, Heart, Droplets } from 'lucide-react';

export function Dashboard() {
  const [currentHealth, setCurrentHealth] = useState<HealthData | null>(null);
  const [historicalData, setHistoricalData] = useState<HealthDataWithAnomaly[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model] = useState(new AnomalyDetectionModel(0.1));

  const loadData = async () => {
    setIsLoading(true);
    
    // Simulate data loading
    setTimeout(() => {
      const current = HealthService.getCurrentHealth();
      const historical = HealthService.generateHealthData(60);
      
      // Train model and detect anomalies
      model.train(historical);
      const dataWithAnomalies = model.detectAnomalies(historical);
      
      setCurrentHealth(current);
      setHistoricalData(dataWithAnomalies);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'Warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!currentHealth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">AI Health Monitor</h1>
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center space-x-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Current Health Status */}
        <div className={`mb-8 p-6 rounded-lg border-2 ${getStatusColor(currentHealth.status)}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm opacity-75">Heart Rate</p>
                <p className="text-2xl font-bold">{currentHealth.heart_rate} bpm</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Droplets className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm opacity-75">Blood Oxygen</p>
                <p className="text-2xl font-bold">{currentHealth.blood_oxygen}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-75">Status</p>
                <p className="text-2xl font-bold">{currentHealth.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <HealthChart 
            data={historicalData} 
            metric="heart_rate" 
            title="Heart Rate Trend" 
            color="text-red-600" 
            unit=" bpm" 
          />
          <HealthChart 
            data={historicalData} 
            metric="blood_oxygen" 
            title="Blood Oxygen Trend" 
            color="text-blue-600" 
            unit="%" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <AnomalyChart data={historicalData} />
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Model Performance</h3>
            {(() => {
              const evaluation = model.evaluate(historicalData);
              return (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="font-bold">{evaluation.accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precision:</span>
                    <span className="font-bold">{evaluation.precision}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recall:</span>
                    <span className="font-bold">{evaluation.recall}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Anomalies Detected:</span>
                    <span className="font-bold">{evaluation.anomalyCount}/{evaluation.totalCount}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Data Table */}
        <DataTable data={historicalData} />
      </div>
    </div>
  );
}