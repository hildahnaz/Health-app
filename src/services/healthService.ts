// Health Service - Equivalent to app.py backend logic
export interface HealthData {
  timestamp: Date;
  heart_rate: number;
  blood_oxygen: number;
  activity_level: 'low' | 'moderate' | 'high';
  status: 'Normal' | 'Warning' | 'Critical';
}

export class HealthService {
  // Simulate data generation (equivalent to simulate_data.py)
  static generateHealthData(minutes: number = 60): HealthData[] {
    const data: HealthData[] = [];
    const startTime = new Date();
    const activityLevels: ('low' | 'moderate' | 'high')[] = ['low', 'moderate', 'high'];
    
    for (let i = 0; i < minutes; i++) {
      const timestamp = new Date(startTime.getTime() - (minutes - i) * 60 * 1000);
      const heart_rate = Math.floor(Math.random() * (110 - 55) + 55); // 55-109
      const blood_oxygen = Math.floor(Math.random() * (100 - 88) + 88); // 88-99
      const activity_level = activityLevels[Math.floor(Math.random() * activityLevels.length)];
      
      // Determine status based on vitals
      let status: 'Normal' | 'Warning' | 'Critical' = 'Normal';
      if (heart_rate < 60 || heart_rate > 100 || blood_oxygen < 95) {
        status = 'Warning';
      }
      if (heart_rate < 50 || heart_rate > 120 || blood_oxygen < 90) {
        status = 'Critical';
      }
      
      data.push({
        timestamp,
        heart_rate,
        blood_oxygen,
        activity_level,
        status
      });
    }
    
    return data;
  }

  // Get current health status (equivalent to Flask route)
  static getCurrentHealth(): HealthData {
    const data = this.generateHealthData(1);
    return data[0];
  }

  // Health data streaming simulation
  static createHealthStream(callback: (data: HealthData) => void, interval: number = 5000) {
    const streamInterval = setInterval(() => {
      const currentHealth = this.getCurrentHealth();
      callback(currentHealth);
    }, interval);

    return () => clearInterval(streamInterval);
  }
}