import React from 'react';
import { MdOutlineSpeed, MdTimer, MdInfo, MdCheck } from 'react-icons/md';

function AlgorithmSelector({ algorithm, setAlgorithm, timeQuantum, setTimeQuantum }) {
  const getAlgorithmDescription = () => {
    switch(algorithm) {
      case 'FCFS': 
        return 'Processes are executed in the order they arrive, without preemption.';
      case 'SJF': 
        return 'Processes with shortest burst time are executed first, non-preemptive.';
      case 'RoundRobin': 
        return 'Processes are executed in turns for a fixed time quantum.';
      case 'Priority': 
        return 'Processes are executed based on priority level assigned to them.';
      case 'MultilevelQueue': 
        return 'Processes are grouped into different queues based on properties.';
      case 'SRTF': 
        return 'Preemptive version of SJF, shortest remaining time is scheduled first.';
      case 'HRRN': 
        return 'Prioritizes processes with highest response ratio to prevent starvation.';
      case 'LJF': 
        return 'Processes with longest burst time are executed first, non-preemptive.';
      case 'LRTF': 
        return 'Preemptive version of LJF where longest remaining time is prioritized.';
      case 'SJN': 
        return 'Similar to SJF, but considers only processes that have arrived.';
      default: 
        return 'Select an algorithm to see its description.';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-6">
        <MdOutlineSpeed className="text-blue-400 text-2xl md:text-3xl mr-2" />
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          Scheduling Algorithm
        </h2>
      </div>
      
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 rounded-xl border border-gray-700/30 shadow-lg p-5 mb-6">
        <p className="text-gray-300 text-sm mb-4">
          Select the CPU scheduling algorithm to simulate:
        </p>
        
        <div className="relative mb-5">
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full bg-gray-800/90 text-white border border-gray-600/80 p-3.5 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                      transition-all duration-200 appearance-none shadow-md hover:border-blue-500/50"
          >
            <optgroup label="Basic Algorithms" className="bg-gray-800 font-medium text-blue-300">
              <option value="FCFS" className="py-2 text-white">First-Come, First-Served (FCFS)</option>
              <option value="SJF" className="py-2 text-white">Shortest Job First (SJF)</option>
              <option value="RoundRobin" className="py-2 text-white">Round Robin</option>
              <option value="Priority" className="py-2 text-white">Priority Scheduling</option>
              <option value="MultilevelQueue" className="py-2 text-white">Multilevel Queue</option>
            </optgroup>

            <optgroup label="Advanced Algorithms" className="bg-gray-800 font-medium text-blue-300">
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

        <div className="flex items-center mb-3">
          <div className="p-1.5 bg-blue-500/20 rounded-lg mr-2">
            <MdInfo className="text-blue-400 text-lg" />
          </div>
          <h3 className="text-blue-300 font-medium">Algorithm Description</h3>
        </div>
        <p className="text-gray-300 text-sm mb-5 pl-2 border-l-2 border-blue-500/30 ml-1.5">
          {getAlgorithmDescription()}
        </p>

        {(algorithm === 'RoundRobin' || algorithm === 'MultilevelQueue') && (
          <div className="mt-6 bg-gray-800/80 p-5 rounded-lg border border-gray-600/50 shadow-inner">
            <div className="flex items-center mb-3">
              <div className="p-1.5 bg-amber-500/20 rounded-lg mr-2">
                <MdTimer className="text-amber-400 text-lg" />
              </div>
              <h3 className="text-amber-300 font-medium">Time Quantum</h3>
            </div>
            <div className="relative">
              <input
                type="number"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
                className="w-full bg-gray-900/90 text-white border border-gray-600/80 p-3.5 pl-4 rounded-lg 
                          focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                          transition-colors duration-200 shadow-md hover:border-amber-500/50"
                placeholder="Enter time quantum"
                min="1"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-400 text-sm">time units</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 pl-2 border-l-2 border-amber-500/30 ml-1.5">
              The time quantum determines how long each process runs before being preempted in Round Robin or Multilevel Queue scheduling.
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-4 border border-blue-700/30 shadow-lg">
        <div className="flex items-center">
          <div className="p-2 bg-blue-500/20 rounded-full mr-3 flex-shrink-0">
            <MdCheck className="text-blue-400 text-xl" />
          </div>
          <div>
            <h3 className="text-blue-300 font-medium mb-1">Selected Algorithm</h3>
            <p className="text-white font-semibold">
              {algorithm === 'FCFS' ? 'First-Come, First-Served' : 
              algorithm === 'SJF' ? 'Shortest Job First' :
              algorithm === 'RoundRobin' ? 'Round Robin' :
              algorithm === 'Priority' ? 'Priority Scheduling' :
              algorithm === 'MultilevelQueue' ? 'Multilevel Queue' :
              algorithm === 'SRTF' ? 'Shortest Remaining Time First' :
              algorithm === 'HRRN' ? 'Highest Response Ratio Next' :
              algorithm === 'LJF' ? 'Longest Job First' :
              algorithm === 'LRTF' ? 'Longest Remaining Time First' :
              'Shortest Job Next'}
              {(algorithm === 'RoundRobin' || algorithm === 'MultilevelQueue') && 
                <span className="ml-2 text-sm text-blue-300">(Time Quantum: {timeQuantum})</span>
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlgorithmSelector;