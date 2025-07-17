import React from 'react';
import { Heart, Droplets, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

interface HealthData {
  heartRate: number;
  bloodOxygen: number;
  status: 'Normal' | 'Warning' | 'Critical';
}

interface HealthStatusProps {
  data: HealthData;
}

export function HealthStatus({ data }: HealthStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'Warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Normal': return <CheckCircle className="w-6 h-6" />;
      case 'Warning': 
      case 'Critical': return <AlertTriangle className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
  };

  const getHeartRateStatus = (hr: number) => {
    if (hr < 60 || hr > 100) return 'Warning';
    if (hr < 50 || hr > 120) return 'Critical';
    return 'Normal';
  };

  const getBloodOxygenStatus = (o2: number) => {
    if (o2 < 95) return 'Warning';
    if (o2 < 90) return 'Critical';
    return 'Normal';
  };

  const heartRateStatus = getHeartRateStatus(data.heartRate);
  const bloodOxygenStatus = getBloodOxygenStatus(data.bloodOxygen);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Monitoring Dashboard</h1>
        <p className="text-gray-600">Real-time health status monitoring</p>
      </div>

      {/* Overall Status Card */}
      <div className={`p-6 rounded-lg border-2 ${getStatusColor(data.status)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(data.status)}
            <div>
              <h2 className="text-xl font-semibold">Overall Status</h2>
              <p className="text-sm opacity-75">Current health assessment</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{data.status}</div>
            <div className="text-sm opacity-75">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Heart Rate Card */}
        <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
          heartRateStatus === 'Normal' ? 'border-green-500' : 
          heartRateStatus === 'Warning' ? 'border-yellow-500' : 'border-red-500'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Heart Rate</h3>
                <p className="text-sm text-gray-600">Beats per minute</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(heartRateStatus)}`}>
              {heartRateStatus}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {data.heartRate} <span className="text-lg font-normal text-gray-600">bpm</span>
          </div>
          <div className="text-sm text-gray-600">
            Normal range: 60-100 bpm
          </div>
        </div>

        {/* Blood Oxygen Card */}
        <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
          bloodOxygenStatus === 'Normal' ? 'border-green-500' : 
          bloodOxygenStatus === 'Warning' ? 'border-yellow-500' : 'border-red-500'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Droplets className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Blood Oxygen</h3>
                <p className="text-sm text-gray-600">Oxygen saturation</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bloodOxygenStatus)}`}>
              {bloodOxygenStatus}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {data.bloodOxygen}<span className="text-lg font-normal text-gray-600">%</span>
          </div>
          <div className="text-sm text-gray-600">
            Normal range: 95-100%
          </div>
        </div>
      </div>

      {/* Health Recommendations */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Recommendations</h3>
        <div className="space-y-3">
          {data.status === 'Normal' && (
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">All vitals are within normal range</p>
                <p className="text-sm text-green-700">Continue maintaining your healthy lifestyle</p>
              </div>
            </div>
          )}
          
          {heartRateStatus !== 'Normal' && (
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Heart rate outside normal range</p>
                <p className="text-sm text-yellow-700">Consider consulting with a healthcare provider</p>
              </div>
            </div>
          )}
          
          {bloodOxygenStatus !== 'Normal' && (
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Blood oxygen levels need attention</p>
                <p className="text-sm text-red-700">Seek immediate medical attention if symptoms persist</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}