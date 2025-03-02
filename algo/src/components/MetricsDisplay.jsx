import React from 'react';

function MetricsDisplay({ metrics }) {
  return (
    <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Performance Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Average Waiting Time</p>
          <p className="text-2xl font-semibold text-blue-700">
            {metrics.averageWaitingTime.toFixed(2)} ms
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Average Turnaround Time</p>
          <p className="text-2xl font-semibold text-blue-700">
            {metrics.averageTurnaroundTime.toFixed(2)} ms
          </p>
        </div>
      </div>
    </div>
  );
}

export default MetricsDisplay;