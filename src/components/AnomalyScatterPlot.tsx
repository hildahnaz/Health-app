import React from 'react';
import { HealthDataWithAnomaly } from '../utils/anomalyDetection';

interface AnomalyScatterPlotProps {
  data: HealthDataWithAnomaly[];
}

export function AnomalyScatterPlot({ data }: AnomalyScatterPlotProps) {
  if (data.length === 0) return null;

  const heartRates = data.map(d => d.heartRate);
  const bloodOxygens = data.map(d => d.bloodOxygen);
  
  const minHR = Math.min(...heartRates);
  const maxHR = Math.max(...heartRates);
  const minO2 = Math.min(...bloodOxygens);
  const maxO2 = Math.max(...bloodOxygens);
  
  const hrRange = maxHR - minHR;
  const o2Range = maxO2 - minO2;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Heart Rate vs Blood Oxygen</h3>
      
      <div className="relative h-64 bg-gray-50 rounded-lg overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 400 300">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#grid)" />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = ((item.heartRate - minHR) / hrRange) * 360 + 20;
            const y = 280 - ((item.bloodOxygen - minO2) / o2Range) * 260;
            const isAnomaly = item.anomaly === 'Anomaly';
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={isAnomaly ? 4 : 2}
                fill={isAnomaly ? '#EF4444' : '#3B82F6'}
                stroke={isAnomaly ? '#DC2626' : '#2563EB'}
                strokeWidth={isAnomaly ? 2 : 1}
                opacity={0.7}
              />
            );
          })}
        </svg>
        
        {/* Axis labels */}
        <div className="absolute bottom-2 left-2 text-xs text-gray-500">
          HR: {minHR}
        </div>
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {maxHR}
        </div>
        <div className="absolute top-2 left-2 text-xs text-gray-500">
          O₂: {maxO2}%
        </div>
        <div className="absolute bottom-16 left-2 text-xs text-gray-500">
          {minO2}%
        </div>
      </div>
      
      <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">Normal</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Anomaly</span>
        </div>
      </div>
    </div>
  );
}