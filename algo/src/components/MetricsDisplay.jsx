import React from 'react';

function MetricsDisplay({ metrics }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
      <p>Average Waiting Time: {metrics.averageWaitingTime}</p>
      <p>Average Turnaround Time: {metrics.averageTurnaroundTime}</p>
    </div>
  );
}

export default MetricsDisplay;