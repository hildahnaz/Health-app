import React from 'react';
import { HealthData } from '../utils/dataGenerator';

interface HealthChartProps {
  data: HealthData[];
  metric: 'heartRate' | 'bloodOxygen';
  title: string;
  color: string;
  unit: string;
}

export function HealthChart({ data, metric, title, color, unit }: HealthChartProps) {
  const maxValue = Math.max(...data.map(d => d[metric]));
  const minValue = Math.min(...data.map(d => d[metric]));
  const range = maxValue - minValue;
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item[metric] - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="text-right">
          <div className={`text-2xl font-bold ${color}`}>
            {data[data.length - 1]?.[metric]}{unit}
          </div>
          <div className="text-sm text-gray-500">Current</div>
        </div>
      </div>
      
      <div className="relative h-32 bg-gray-50 rounded-lg overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={color.includes('blue') ? '#3B82F6' : '#EF4444'}
            strokeWidth="2"
            points={points}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        
        <div className="absolute top-2 left-2 text-xs text-gray-500">
          {maxValue}{unit}
        </div>
        <div className="absolute bottom-2 left-2 text-xs text-gray-500">
          {minValue}{unit}
        </div>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>1 hour ago</span>
        <span>Now</span>
      </div>
    </div>
  );
}