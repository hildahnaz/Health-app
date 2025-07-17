// Anomaly Detection Model - Equivalent to anomaly_detection.py
import { HealthData } from '../services/healthService';

export interface AnomalyResult {
  isAnomaly: boolean;
  score: number;
  confidence: number;
  reason?: string;
}

export interface HealthDataWithAnomaly extends HealthData {
  anomaly: AnomalyResult;
}

export class AnomalyDetectionModel {
  private threshold: number = 0.1;
  private trainingData: number[][] = [];

  constructor(contamination: number = 0.1) {
    this.threshold = contamination;
  }

  // Train the model (equivalent to model.fit_predict)
  train(data: HealthData[]): void {
    this.trainingData = data.map(item => [item.heart_rate, item.blood_oxygen]);
  }

  // Detect anomalies (equivalent to model.predict)
  detectAnomalies(data: HealthData[]): HealthDataWithAnomaly[] {
    return data.map(item => {
      const anomaly = this.isAnomaly(item);
      return {
        ...item,
        anomaly
      };
    });
  }

  // Simple anomaly detection logic
  private isAnomaly(data: HealthData): AnomalyResult {
    const { heart_rate, blood_oxygen } = data;
    
    // Define normal ranges
    const normalHeartRate = { min: 60, max: 100 };
    const normalBloodOxygen = { min: 95, max: 100 };
    
    let score = 0;
    let reasons: string[] = [];
    
    // Check heart rate
    if (heart_rate < normalHeartRate.min) {
      score += 0.3;
      reasons.push('Low heart rate');
    } else if (heart_rate > normalHeartRate.max) {
      score += 0.3;
      reasons.push('High heart rate');
    }
    
    // Check blood oxygen
    if (blood_oxygen < normalBloodOxygen.min) {
      score += 0.4;
      reasons.push('Low blood oxygen');
    }
    
    // Extreme values
    if (heart_rate < 50 || heart_rate > 120) {
      score += 0.5;
      reasons.push('Extreme heart rate');
    }
    
    if (blood_oxygen < 90) {
      score += 0.6;
      reasons.push('Critical blood oxygen');
    }
    
    const isAnomaly = score > this.threshold;
    
    return {
      isAnomaly,
      score,
      confidence: Math.min(score * 100, 100),
      reason: reasons.length > 0 ? reasons.join(', ') : undefined
    };
  }

  // Evaluate model performance (equivalent to evaluate_model.py)
  evaluate(testData: HealthData[]): {
    accuracy: number;
    precision: number;
    recall: number;
    anomalyCount: number;
    totalCount: number;
  } {
    const results = this.detectAnomalies(testData);
    const anomalies = results.filter(r => r.anomaly.isAnomaly);
    const trueAnomalies = results.filter(r => r.status === 'Critical' || r.status === 'Warning');
    
    const anomalyCount = anomalies.length;
    const totalCount = results.length;
    const truePositives = anomalies.filter(a => 
      trueAnomalies.some(t => t.timestamp.getTime() === a.timestamp.getTime())
    ).length;
    
    const precision = anomalyCount > 0 ? truePositives / anomalyCount : 0;
    const recall = trueAnomalies.length > 0 ? truePositives / trueAnomalies.length : 0;
    const accuracy = (totalCount - anomalyCount + truePositives) / totalCount;
    
    return {
      accuracy: Math.round(accuracy * 100),
      precision: Math.round(precision * 100),
      recall: Math.round(recall * 100),
      anomalyCount,
      totalCount
    };
  }
}