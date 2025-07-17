import React from 'react';

interface HealthData {
  timestamp: Date;
  heart_rate: number;
  blood_oxygen: number;
}

interface HealthChartProps {
  data: HealthData[];
  metric: 'heart_rate' | 'blood_oxygen';
  title: string;
  color: string;
  unit: string;
}

export function HealthChart({ data, metric, title, color, unit }: HealthChartProps) {
  if (data.length === 0) return null;

  const values = data.map(d => d[metric]);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;
  
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
            stroke={color.includes('red') ? '#EF4444' : '#3B82F6'}
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