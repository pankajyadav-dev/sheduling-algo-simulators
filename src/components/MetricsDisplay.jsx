import React from 'react';
import { MdQueryStats, MdAccessTime, MdLoop, MdStar, MdSpeed, MdTimer, MdAssessment, MdVerified } from 'react-icons/md';

function calculateEfficiencyRating(avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput) {
  if (avgTurnaroundTime === 0) return 'Poor';
  
  let waitTurnaroundRatio = avgWaitingTime / (avgTurnaroundTime + 1);
  let responseTurnaroundRatio = avgResponseTime / (avgTurnaroundTime + 1);
  let throughputFactor = throughput / (avgTurnaroundTime + avgWaitingTime + 1);
  
  let efficiencyScore = (1 - waitTurnaroundRatio) * 35 + (1 - responseTurnaroundRatio) * 35 + throughputFactor * 30;
  
  if (efficiencyScore >= 60) return 'Excellent';
  if (efficiencyScore >= 45) return 'Very Good';
  if (efficiencyScore >= 35) return 'Good';
  if (efficiencyScore >= 15) return 'Average';
  return 'Poor';
}

function determineColorClass(avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput) {
  let rating = calculateEfficiencyRating(avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput);
  switch (rating) {
    case 'Excellent': return 'from-green-500 to-green-400';
    case 'Very Good': return 'from-teal-500 to-teal-400';
    case 'Good': return 'from-blue-500 to-blue-400';
    case 'Average': return 'from-yellow-500 to-yellow-400';
    default: return 'from-red-500 to-red-400';
  }
}

function determineColorClassBg(avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput) {
  let rating = calculateEfficiencyRating(avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput);
  switch (rating) {
    case 'Excellent': return 'bg-green-500';
    case 'Very Good': return 'bg-teal-500';
    case 'Good': return 'bg-blue-500';
    case 'Average': return 'bg-yellow-500';
    default: return 'bg-red-500';
  }
}

function calculateEfficiencyPercentage(avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput) {
  if (avgTurnaroundTime === 0) return 0;
  
  let waitTurnaroundRatio = avgWaitingTime / (avgTurnaroundTime + 1);
  let responseTurnaroundRatio = avgResponseTime / (avgTurnaroundTime + 1);
  let throughputFactor = throughput / (avgTurnaroundTime + avgWaitingTime + 1);
  
  let efficiency = (1 - (waitTurnaroundRatio + responseTurnaroundRatio) / 2) * 70 + throughputFactor * 30;
  return Math.min(100, Math.max(0, efficiency + 20));
}

function MetricsDisplay({ metrics }) {
  const rating = calculateEfficiencyRating(
    metrics.averageWaitingTime, 
    metrics.averageTurnaroundTime, 
    metrics.avgResponseTime, 
    metrics.throughput
  );
  
  const efficiencyPercentage = calculateEfficiencyPercentage(
    metrics.averageWaitingTime, 
    metrics.averageTurnaroundTime, 
    metrics.avgResponseTime, 
    metrics.throughput
  );
  
  const colorGradient = determineColorClass(
    metrics.averageWaitingTime, 
    metrics.averageTurnaroundTime, 
    metrics.avgResponseTime, 
    metrics.throughput
  );
  
  const bgColor = determineColorClassBg(
    metrics.averageWaitingTime, 
    metrics.averageTurnaroundTime, 
    metrics.avgResponseTime, 
    metrics.throughput
  );

  return (
    <div>
      <div className="flex items-center mb-6">
        <MdAssessment className="text-blue-400 text-2xl md:text-3xl mr-2" />
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          Performance Metrics
        </h2>
      </div>
      
      {metrics.averageWaitingTime > 0 && (
        <div className="mb-8">
          <div className="relative overflow-hidden bg-gray-800/70 rounded-xl border border-gray-700/50 shadow-lg">
            <div 
              className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${colorGradient}`}
              style={{ width: `${efficiencyPercentage}%` }}
            ></div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Algorithm Efficiency</h3>
                  <p className="text-gray-400 text-sm">Overall performance score based on all metrics</p>
                </div>
                <div className="flex items-center">
                  <div className={`flex items-center bg-opacity-15 rounded-full px-4 py-1.5 ${bgColor.replace('bg', 'bg-opacity-20 text')}`}>
                    <MdVerified className="mr-1" />
                    <span className="font-medium">{rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full ${bgColor}`}
                  style={{ width: `${efficiencyPercentage}%`, transition: 'width 1s ease-in-out' }}
                ></div>
              </div>
              
              <div className="text-right">
                <span className="text-sm text-gray-400">Efficiency score: </span>
                <span className="text-lg font-semibold text-white">{Math.round(efficiencyPercentage)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-5 border border-blue-700/30 shadow-lg transform transition-all hover:shadow-blue-900/10 hover:border-blue-600/40 duration-300">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
              <MdAccessTime className="text-blue-400 text-xl" />
            </div>
            <h3 className="text-blue-300 font-medium">Average Waiting Time</h3>
          </div>
          <div className="flex items-baseline mt-2">
            <p className="text-3xl sm:text-2xl md:text-3xl font-bold text-white">
              {metrics.averageWaitingTime.toFixed(2)}
            </p>
            <span className="ml-1 text-blue-300 text-lg">time units</span>
          </div>
          <div className="h-1 w-24 bg-blue-700/30 my-3 rounded-full"></div>
          <p className="text-xs text-gray-400 mt-1">
            The average time processes spend waiting in the ready queue
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-5 border border-purple-700/30 shadow-lg transform transition-all hover:shadow-purple-900/10 hover:border-purple-600/40 duration-300">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
              <MdLoop className="text-purple-400 text-xl" />
            </div>
            <h3 className="text-purple-300 font-medium">Average Turnaround Time</h3>
          </div>
          <div className="flex items-baseline mt-2">
            <p className="text-3xl sm:text-2xl md:text-3xl font-bold text-white">
              {metrics.averageTurnaroundTime.toFixed(2)}
            </p>
            <span className="ml-1 text-purple-300 text-lg">time units</span>
          </div>
          <div className="h-1 w-24 bg-purple-700/30 my-3 rounded-full"></div>
          <p className="text-xs text-gray-400 mt-1">
            The average time taken to complete a process from arrival to completion
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-5 border border-green-700/30 shadow-lg transform transition-all hover:shadow-green-900/10 hover:border-green-600/40 duration-300">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-green-500/20 rounded-lg mr-3">
              <MdTimer className="text-green-400 text-xl" />
            </div>
            <h3 className="text-green-300 font-medium">Average Response Time</h3>
          </div>
          <div className="flex items-baseline mt-2">
            <p className="text-3xl sm:text-2xl md:text-3xl font-bold text-white">
              {metrics.avgResponseTime.toFixed(2)}
            </p>
            <span className="ml-1 text-green-300 text-lg">time units</span>
          </div>
          <div className="h-1 w-24 bg-green-700/30 my-3 rounded-full"></div>
          <p className="text-xs text-gray-400 mt-1">
            The time from process arrival to its first execution
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 rounded-xl p-5 border border-cyan-700/30 shadow-lg transform transition-all hover:shadow-cyan-900/10 hover:border-cyan-600/40 duration-300">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg mr-3">
              <MdSpeed className="text-cyan-400 text-xl" />
            </div>
            <h3 className="text-cyan-300 font-medium">Throughput</h3>
          </div>
          <div className="flex items-baseline mt-2">
            <p className="text-3xl sm:text-2xl md:text-3xl font-bold text-white">
              {metrics.throughput.toFixed(2)}
            </p>
            <span className="ml-1 text-cyan-300 text-lg">proc/unit</span>
          </div>
          <div className="h-1 w-24 bg-cyan-700/30 my-3 rounded-full"></div>
          <p className="text-xs text-gray-400 mt-1">
            The number of processes completed per unit time
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 rounded-xl p-5 border border-amber-700/30 shadow-lg transform transition-all hover:shadow-amber-900/10 hover:border-amber-600/40 duration-300 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-amber-500/20 rounded-lg mr-3">
              <MdStar className="text-amber-400 text-xl" />
            </div>
            <h3 className="text-amber-300 font-medium">Recommended Algorithm</h3>
          </div>
          <div className="flex items-baseline mt-2">
            <p className="text-3xl sm:text-2xl md:text-3xl font-bold text-white truncate overflow-hidden whitespace-nowrap">
              {metrics.bestAlgorithm || 'N/A'}
            </p>
          </div>
          <div className="h-1 w-24 bg-amber-700/30 my-3 rounded-full"></div>
          <p className="text-xs text-gray-400 mt-1">
            The recommended algorithm based on the performance metrics and weights
          </p>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4 text-center text-xs text-gray-400">
        <div className="bg-gray-800/30 rounded-lg py-2 px-4 border border-gray-700/20">
          <div className="font-medium mb-1">Wait Time/Turnaround Ratio</div>
          <div className="text-white text-sm">{((metrics.averageWaitingTime / (metrics.averageTurnaroundTime || 1)) * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-gray-800/30 rounded-lg py-2 px-4 border border-gray-700/20">
          <div className="font-medium mb-1">CPU Utilization</div>
          <div className="text-white text-sm">{Math.min(100, Math.max(0, 100 - (metrics.averageWaitingTime / (metrics.averageTurnaroundTime || 1) * 100))).toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}

export default MetricsDisplay;