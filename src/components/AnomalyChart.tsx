import React from 'react';
import { HealthDataWithAnomaly } from '../utils/anomalyDetection';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface AnomalyChartProps {
  data: HealthDataWithAnomaly[];
}

export function AnomalyChart({ data }: AnomalyChartProps) {
  const anomalies = data.filter(item => item.anomaly === 'Anomaly');
  const normal = data.filter(item => item.anomaly === 'Normal');
  
  const anomalyRate = data.length > 0 ? (anomalies.length / data.length) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Anomaly Detection</h3>
        <div className="text-right">
          <div className={`text-2xl font-bold ${anomalyRate > 15 ? 'text-red-600' : anomalyRate > 5 ? 'text-yellow-600' : 'text-green-600'}`}>
            {anomalyRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500">Anomaly Rate</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800">Anomalies Detected</span>
          </div>
          <span className="text-red-600 font-bold">{anomalies.length}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">Normal Readings</span>
          </div>
          <span className="text-green-600 font-bold">{normal.length}</span>
        </div>
      </div>

      {anomalies.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Recent Anomalies:</h4>
          <div className="space-y-1 text-sm">
            {anomalies.slice(-3).map((item, index) => (
              <div key={index} className="text-yellow-700">
                {item.timestamp.toLocaleTimeString()}: HR {item.heartRate}bpm, O₂ {item.bloodOxygen}%
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}