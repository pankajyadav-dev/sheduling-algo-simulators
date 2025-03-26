import { calculateScheduling } from './schedulingAlgorithms.js';

// This function calculates the best scheduling algorithm based on user-defined weights
export const calculatebestSchedulingalgo = (processes, timeQuantum, weights) => {
  const algorithms = ['FCFS', 'SJF', 'Priority', 'RoundRobin', 'SRTF', 'HRRN', 'LJF', 'LRTF'];
  const results = {};
  
  // Calculate metrics for each algorithm
  for (const algorithm of algorithms) {
    try {
      const { avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput } = 
        calculateScheduling(processes, algorithm, timeQuantum);
      
      // Normalize metrics (lower is better for waiting time, turnaround time, and response time, higher is better for throughput)
      results[algorithm] = {
        algorithm,
        avgWaitingTime,
        avgTurnaroundTime,
        avgResponseTime,
        throughput,
      };
    } catch (error) {
      console.error(`Error calculating ${algorithm}:`, error);
    }
  }
  
  // Find min and max values for normalization
  const minMaxValues = {
    avgWaitingTime: { min: Infinity, max: -Infinity },
    avgTurnaroundTime: { min: Infinity, max: -Infinity },
    avgResponseTime: { min: Infinity, max: -Infinity },
    throughput: { min: Infinity, max: -Infinity },
  };
  
  Object.values(results).forEach((result) => {
    for (const metric in minMaxValues) {
      if (result[metric] < minMaxValues[metric].min) {
        minMaxValues[metric].min = result[metric];
      }
      if (result[metric] > minMaxValues[metric].max) {
        minMaxValues[metric].max = result[metric];
      }
    }
  });
  
  // Calculate weighted scores (normalized between 0 and 1)
  const scores = {};
  
  Object.entries(results).forEach(([algorithm, result]) => {
    // For waiting time, turnaround time, and response time - lower is better, so we invert the normalization
    const normalizedWT = normalizeInverted(result.avgWaitingTime, minMaxValues.avgWaitingTime.min, minMaxValues.avgWaitingTime.max);
    const normalizedTAT = normalizeInverted(result.avgTurnaroundTime, minMaxValues.avgTurnaroundTime.min, minMaxValues.avgTurnaroundTime.max);
    const normalizedRT = normalizeInverted(result.avgResponseTime, minMaxValues.avgResponseTime.min, minMaxValues.avgResponseTime.max);
    
    // For throughput - higher is better
    const normalizedTP = normalize(result.throughput, minMaxValues.throughput.min, minMaxValues.throughput.max);
    
    // Calculate weighted score (higher is better)
    scores[algorithm] = (
      weights.wt * normalizedWT +
      weights.tat * normalizedTAT +
      weights.rt * normalizedRT +
      weights.tp * normalizedTP
    );
  });
  
  // Find algorithm with highest score
  let bestAlgorithm = null;
  let highestScore = -Infinity;
  
  Object.entries(scores).forEach(([algorithm, score]) => {
    if (score > highestScore) {
      highestScore = score;
      bestAlgorithm = algorithm;
    }
  });
  
  return bestAlgorithm;
};

// Helper function to normalize a value (higher is better)
function normalize(value, min, max) {
  if (max === min) return 1; // Handle edge case
  return (value - min) / (max - min);
}

// Helper function to normalize a value where lower is better
function normalizeInverted(value, min, max) {
  if (max === min) return 1; // Handle edge case
  return 1 - ((value - min) / (max - min));
} 