import { HealthData } from './dataGenerator';

export interface AnomalyResult {
  isAnomaly: boolean;
  score: number;
  reason?: string;
}

export interface HealthDataWithAnomaly extends HealthData {
  anomaly: 'Normal' | 'Anomaly';
  anomalyScore: number;
}

// Simple Isolation Forest implementation for anomaly detection
export class IsolationForest {
  private trees: IsolationTree[] = [];
  private numTrees: number;
  private subsampleSize: number;
  private contamination: number;
  private threshold: number = 0;

  constructor(numTrees: number = 100, subsampleSize: number = 256, contamination: number = 0.1) {
    this.numTrees = numTrees;
    this.subsampleSize = subsampleSize;
    this.contamination = contamination;
  }

  fit(data: number[][]): void {
    this.trees = [];
    
    for (let i = 0; i < this.numTrees; i++) {
      const sample = this.subsample(data);
      const tree = new IsolationTree();
      tree.fit(sample, 0, Math.ceil(Math.log2(this.subsampleSize)));
      this.trees.push(tree);
    }

    // Calculate threshold based on contamination rate
    const scores = data.map(point => this.anomalyScore(point));
    scores.sort((a, b) => a - b);
    const thresholdIndex = Math.floor((1 - this.contamination) * scores.length);
    this.threshold = scores[thresholdIndex];
  }

  predict(data: number[][]): number[] {
    return data.map(point => {
      const score = this.anomalyScore(point);
      return score < this.threshold ? -1 : 1; // -1 for anomaly, 1 for normal
    });
  }

  anomalyScore(point: number[]): number {
    const pathLengths = this.trees.map(tree => tree.pathLength(point, 0));
    const avgPathLength = pathLengths.reduce((sum, length) => sum + length, 0) / pathLengths.length;
    
    // Normalize score (higher score = more normal)
    const c = this.cFactor(this.subsampleSize);
    return Math.pow(2, -avgPathLength / c);
  }

  private subsample(data: number[][]): number[][] {
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(this.subsampleSize, data.length));
  }

  private cFactor(n: number): number {
    if (n <= 1) return 0;
    return 2 * (Math.log(n - 1) + 0.5772156649) - (2 * (n - 1) / n);
  }
}

class IsolationTree {
  private splitAttribute?: number;
  private splitValue?: number;
  private left?: IsolationTree;
  private right?: IsolationTree;
  private size: number = 0;

  fit(data: number[][], currentDepth: number, maxDepth: number): void {
    this.size = data.length;

    if (currentDepth >= maxDepth || data.length <= 1) {
      return; // Leaf node
    }

    // Randomly select attribute and split value
    this.splitAttribute = Math.floor(Math.random() * data[0].length);
    const attributeValues = data.map(point => point[this.splitAttribute!]);
    const minVal = Math.min(...attributeValues);
    const maxVal = Math.max(...attributeValues);
    
    if (minVal === maxVal) return; // Cannot split
    
    this.splitValue = Math.random() * (maxVal - minVal) + minVal;

    // Split data
    const leftData = data.filter(point => point[this.splitAttribute!] < this.splitValue!);
    const rightData = data.filter(point => point[this.splitAttribute!] >= this.splitValue!);

    if (leftData.length > 0) {
      this.left = new IsolationTree();
      this.left.fit(leftData, currentDepth + 1, maxDepth);
    }

    if (rightData.length > 0) {
      this.right = new IsolationTree();
      this.right.fit(rightData, currentDepth + 1, maxDepth);
    }
  }

  pathLength(point: number[], currentDepth: number): number {
    if (this.splitAttribute === undefined || this.splitValue === undefined) {
      // Leaf node - add average path length for remaining points
      return currentDepth + this.cFactor(this.size);
    }

    if (point[this.splitAttribute] < this.splitValue) {
      return this.left ? this.left.pathLength(point, currentDepth + 1) : currentDepth + 1;
    } else {
      return this.right ? this.right.pathLength(point, currentDepth + 1) : currentDepth + 1;
    }
  }

  private cFactor(n: number): number {
    if (n <= 1) return 0;
    return 2 * (Math.log(n - 1) + 0.5772156649) - (2 * (n - 1) / n);
  }
}

export function detectAnomalies(healthData: HealthData[]): HealthDataWithAnomaly[] {
  if (healthData.length === 0) return [];

  // Prepare data for anomaly detection (heart rate and blood oxygen)
  const features = healthData.map(item => [item.heartRate, item.bloodOxygen]);
  
  // Train Isolation Forest model
  const model = new IsolationForest(100, Math.min(256, healthData.length), 0.1);
  model.fit(features);
  
  // Predict anomalies
  const predictions = model.predict(features);
  
  // Add anomaly information to health data
  return healthData.map((item, index) => ({
    ...item,
    anomaly: predictions[index] === -1 ? 'Anomaly' : 'Normal',
    anomalyScore: model.anomalyScore(features[index])
  }));
}

export function getAnomalyStats(data: HealthDataWithAnomaly[]) {
  const totalCount = data.length;
  const anomalyCount = data.filter(item => item.anomaly === 'Anomaly').length;
  const normalCount = totalCount - anomalyCount;
  
  return {
    total: totalCount,
    anomalies: anomalyCount,
    normal: normalCount,
    anomalyRate: totalCount > 0 ? (anomalyCount / totalCount) * 100 : 0
  };
}