import { calculateScheduling } from './schedulingAlgorithms.js';

export const calculatebestSchedulingalgo = (processes, timeQuantum, weights) => {
  const algorithms = ['FCFS', 'SJF', 'Priority', 'RoundRobin', 'SRTF', 'HRRN', 'LJF', 'LRTF', 'MultilevelQueue', 'SJN'];
  const results = {};
  
  for (const algorithm of algorithms) {
    try {
      const { avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput } = 
        calculateScheduling(processes, algorithm, timeQuantum);

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
  
  const scores = {};
  
  Object.entries(results).forEach(([algorithm, result]) => {
    const normalizedWT = normalizeInverted(result.avgWaitingTime, minMaxValues.avgWaitingTime.min, minMaxValues.avgWaitingTime.max);
    const normalizedTAT = normalizeInverted(result.avgTurnaroundTime, minMaxValues.avgTurnaroundTime.min, minMaxValues.avgTurnaroundTime.max);
    const normalizedRT = normalizeInverted(result.avgResponseTime, minMaxValues.avgResponseTime.min, minMaxValues.avgResponseTime.max);
    const normalizedTP = normalize(result.throughput, minMaxValues.throughput.min, minMaxValues.throughput.max);
    scores[algorithm] = (
      weights.wt * normalizedWT +
      weights.tat * normalizedTAT +
      weights.rt * normalizedRT +
      weights.tp * normalizedTP
    );
  });
  let bestAlgorithm = null;
  let highestScore = -Infinity;
  
  Object.entries(scores).forEach(([algorithm, score]) => {
    if (score > highestScore) {
      highestScore = score;
      bestAlgorithm = algorithm;
    }
  });
  const algo = {
    FCFS: 'FirstComeFirstServed',
    SJF: 'ShortestJobFirst',
    Priority: 'PriorityScheduling',
    RoundRobin: 'RoundRobin',
    SRTF: 'ShortestRemainingTimeFirst',
    HRRN: 'HighestResponseRatioNext',
    LJF: 'LongestJobFirst',
    LRTF: 'LongestRemainingTimeFirst',
    MultilevelQueue: 'MultilevelQueueScheduling',
    SJN: 'ShortestJobNext'
  };
  bestAlgorithm = algo[bestAlgorithm];


  return bestAlgorithm;
};

function normalize(value, min, max) {
  if (max === min) return 1; 
  return (value - min) / (max - min);
}

function normalizeInverted(value, min, max) {
  if (max === min) return 1; 
  return 1 - ((value - min) / (max - min));
} 