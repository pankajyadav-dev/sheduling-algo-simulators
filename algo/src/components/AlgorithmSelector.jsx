import React from 'react';

function AlgorithmSelector({ algorithm, setAlgorithm, timeQuantum, setTimeQuantum, algorithmstate }) {
  return (
    <div className="w-full max-w-xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-blue-400 mb-6">Select Algorithm</h2>
      <select
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
        className="w-full bg-gray-700 text-white border border-gray-600 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200"
      >
        <optgroup label="Basic Algorithms" className="bg-gray-700">
          <option value="FCFS">First-Come, First-Served (FCFS)</option>
          <option value="SJF">Shortest Job First (SJF)</option>
          <option value="RoundRobin">Round Robin</option>
          <option value="Priority">Priority Scheduling</option>
          <option value="MultilevelQueue">Multilevel Queue</option>
        </optgroup>

        <optgroup label="Advanced Algorithms" className="bg-gray-700">
          <option value="SRTF">Shortest Remaining Time First (SRTF)</option>
          <option value="HRRN">Highest Response Ratio Next (HRRN)</option>
          <option value="LJF">Longest Job First (LJF)</option>
          <option value="LRTF">Longest Remaining Time First (LRTF)</option>
          <option value="SJN">Shortest Job Next (SJN)</option>
        </optgroup>
      </select>

      {(algorithm === 'RoundRobin' || algorithm === 'MultilevelQueue') && (
        <div className="mt-6 bg-gray-700 p-4 rounded-lg border border-gray-600">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Time Quantum
          </label>
          <input
            type="number"
            onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
            className="w-full bg-gray-800 text-white border border-gray-600 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter time quantum"
            min="1"
          />
        </div>
      )}
    </div>
  );
}

export default AlgorithmSelector;