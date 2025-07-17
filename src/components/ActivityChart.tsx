import React from 'react';
import { HealthData, getActivityColor } from '../utils/dataGenerator';

interface ActivityChartProps {
  data: HealthData[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const activityCounts = data.reduce((acc, item) => {
    acc[item.activityLevel] = (acc[item.activityLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = data.length;
  const activities = [
    { level: 'low', count: activityCounts.low || 0, color: 'bg-green-500' },
    { level: 'moderate', count: activityCounts.moderate || 0, color: 'bg-yellow-500' },
    { level: 'high', count: activityCounts.high || 0, color: 'bg-red-500' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Distribution</h3>
      
      <div className="space-y-4">
        {activities.map(({ level, count, color }) => {
          const percentage = (count / total) * 100;
          return (
            <div key={level} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(level)}`}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </span>
                <span className="text-sm text-gray-600">
                  {count} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}