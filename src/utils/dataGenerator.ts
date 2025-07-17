export interface HealthData {
  timestamp: Date;
  heartRate: number;
  bloodOxygen: number;
  activityLevel: 'low' | 'moderate' | 'high';
}

export function generateHealthData(minutes: number = 60): HealthData[] {
  const data: HealthData[] = [];
  const startTime = new Date('2023-10-01T00:00:00');
  const activityLevels: ('low' | 'moderate' | 'high')[] = ['low', 'moderate', 'high'];
  
  for (let i = 0; i < minutes; i++) {
    const timestamp = new Date(startTime.getTime() + i * 60 * 1000); // Add minutes
    
    data.push({
      timestamp,
      heartRate: Math.floor(Math.random() * (110 - 55) + 55), // 55-109
      bloodOxygen: Math.floor(Math.random() * (100 - 88) + 88), // 88-99
      activityLevel: activityLevels[Math.floor(Math.random() * activityLevels.length)]
    });
  }
  
  return data;
}

export function getActivityColor(level: string): string {
  switch (level) {
    case 'low': return 'bg-green-100 text-green-800';
    case 'moderate': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}