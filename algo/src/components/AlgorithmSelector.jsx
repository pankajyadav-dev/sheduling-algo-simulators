import React from 'react';
import { MdOutlineSpeed, MdTimer } from 'react-icons/md';

function AlgorithmSelector({ algorithm, setAlgorithm, timeQuantum, setTimeQuantum }) {
  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <MdOutlineSpeed className="text-blue-400 text-2xl mr-2" />
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Scheduling Algorithm
        </h2>
      </div>
      
      <div className="relative">
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="w-full bg-gray-700/70 text-white border border-gray-600 p-3 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-all duration-200 appearance-none shadow-inner"
        >
          <optgroup label="Basic Algorithms" className="bg-gray-700 font-medium text-blue-300">
            <option value="FCFS" className="py-2 text-white">First-Come, First-Served (FCFS)</option>
            <option value="SJF" className="py-2 text-white">Shortest Job First (SJF)</option>
            <option value="RoundRobin" className="py-2 text-white">Round Robin</option>
            <option value="Priority" className="py-2 text-white">Priority Scheduling</option>
            <option value="MultilevelQueue" className="py-2 text-white">Multilevel Queue</option>
          </optgroup>

          <optgroup label="Advanced Algorithms" className="bg-gray-700 font-medium text-blue-300">
            <option value="SRTF" className="py-2 text-white">Shortest Remaining Time First (SRTF)</option>
            <option value="HRRN" className="py-2 text-white">Highest Response Ratio Next (HRRN)</option>
            <option value="LJF" className="py-2 text-white">Longest Job First (LJF)</option>
            <option value="LRTF" className="py-2 text-white">Longest Remaining Time First (LRTF)</option>
            <option value="SJN" className="py-2 text-white">Shortest Job Next (SJN)</option>
          </optgroup>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      {(algorithm === 'RoundRobin' || algorithm === 'MultilevelQueue') && (
        <div className="mt-6 bg-gray-700/70 p-5 rounded-lg border border-gray-600/50 shadow-inner">
          <div className="flex items-center mb-3">
            <MdTimer className="text-blue-400 text-xl mr-2" />
            <label className="text-sm font-medium text-blue-300">
              Time Quantum
            </label>
          </div>
          <div className="relative">
            <input
              type="number"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
              className="w-full bg-gray-800/80 text-white border border-gray-600 p-3 pl-4 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        transition-colors duration-200 shadow-inner"
              placeholder="Enter time quantum"
              min="1"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-400 text-sm">ms</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            The time quantum determines how long each process runs before being preempted.
          </p>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
        <p className="text-sm text-blue-200">
          <span className="font-semibold">Selected:</span> {algorithm === 'FCFS' ? 'First-Come, First-Served' : 
                                                          algorithm === 'SJF' ? 'Shortest Job First' :
                                                          algorithm === 'RoundRobin' ? 'Round Robin' :
                                                          algorithm === 'Priority' ? 'Priority Scheduling' :
                                                          algorithm === 'MultilevelQueue' ? 'Multilevel Queue' :
                                                          algorithm === 'SRTF' ? 'Shortest Remaining Time First' :
                                                          algorithm === 'HRRN' ? 'Highest Response Ratio Next' :
                                                          algorithm === 'LJF' ? 'Longest Job First' :
                                                          algorithm === 'LRTF' ? 'Longest Remaining Time First' :
                                                          'Shortest Job Next'}
        </p>
      </div>
    </div>
  );
}

export default AlgorithmSelector;