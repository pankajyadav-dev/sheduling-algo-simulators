import React from 'react';
import { MdQueryStats, MdAccessTime, MdLoop } from 'react-icons/md';
function calculateEfficiencyRating(waitTime, turnaroundTime) {
  let ratio = waitTime / turnaroundTime;

  if (ratio < 0.5) return 'Excellent';
  if (ratio < 0.7) return 'Good';
  if (ratio < 0.9) return 'Average';
  return 'Poor';
}

function determineColorClass(waitTime, turnaroundTime) {
  let ratio = waitTime / turnaroundTime;

  if (ratio < 0.5) return 'bg-green-500';
  if (ratio < 0.7) return 'bg-blue-500';
  if (ratio < 0.9) return 'bg-yellow-500';
  return 'bg-red-500';
}

function calculateEfficiencyPercentage(waitTime, turnaroundTime) {
  let ratio = waitTime / turnaroundTime;  
  return Math.min(100, Math.max(0, 100 - (ratio * 100)) + 30);
}

function MetricsDisplay({ metrics }) {
  return (
    <div>
      <div className="flex items-center mb-4">
        <MdQueryStats className="text-blue-400 text-2xl mr-2" />
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          Performance Metrics
        </h2>
      </div>
      {metrics.averageWaitingTime > 0 && (
        <div className="my-6 p-4 bg-gray-800/70 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Scheduling Efficiency</span>
            <span className="text-sm text-gray-300">
              {calculateEfficiencyRating(metrics.averageWaitingTime, metrics.averageTurnaroundTime)}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                determineColorClass(metrics.averageWaitingTime, metrics.averageTurnaroundTime)
              }`}
              style={{ width: `${calculateEfficiencyPercentage(metrics.averageWaitingTime, metrics.averageTurnaroundTime)}%` }}
            ></div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-5 border border-blue-700/30 shadow-lg transform transition-transform hover:scale-[1.02] duration-300">
          <div className="flex items-center mb-2">
            <MdAccessTime className="text-blue-400 text-xl mr-2" />
            <h3 className="text-blue-300 font-medium">Average Waiting Time</h3>
          </div>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-white">
              {metrics.averageWaitingTime.toFixed(2)}
            </p>
            <span className="ml-1 text-blue-300 text-lg">ms</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            The average time processes spend waiting in the ready queue
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-5 border border-purple-700/30 shadow-lg transform transition-transform hover:scale-[1.02] duration-300">
          <div className="flex items-center mb-2">
            <MdLoop className="text-purple-400 text-xl mr-2" />
            <h3 className="text-purple-300 font-medium">Average Turnaround Time</h3>
          </div>
          <div className="flex items-baseline">
            <p className="text-3xl font-bold text-white">
              {metrics.averageTurnaroundTime.toFixed(2)}
            </p>
            <span className="ml-1 text-purple-300 text-lg">ms</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            The average time taken to complete a process from arrival to completion
          </p>
        </div>
      </div>
    </div>
  );
}

export default MetricsDisplay;