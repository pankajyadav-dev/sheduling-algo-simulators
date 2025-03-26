import React, { useState } from 'react';
import ProcessInputForm from './components/ProcessInputForm';
import AlgorithmSelector from './components/AlgorithmSelector';
import GanttChart from './components/GanttChart';
import MetricsDisplay from './components/MetricsDisplay';
import { calculateScheduling } from './utils/schedulingAlgorithms';
import { calculatebestSchedulingalgo } from './utils/bestshedulingalgorithm';

function App() {
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [timeQuantum, setTimeQuantum] = useState(1);
  const [ganttData, setGanttData] = useState([]);
  const [metrics, setMetrics] = useState({ averageWaitingTime: 0, averageTurnaroundTime: 0, bestAlgorithm: null , avgResponseTime: 0, throughput: 0});
  const [weights, setWeights] = useState({ tat: 0.3, wt: 0.3, rt: 0.2, tp: 0.2 });
  const [algorithmstate, setAlgorithmstate] = useState(false);

  const handleSimulate = () => {
    const { schedule, avgWaitingTime, avgTurnaroundTime, avgResponseTime, throughput } = calculateScheduling(processes, algorithm, timeQuantum);
    setGanttData(schedule);
    const bestAlgorithm = calculatebestSchedulingalgo(processes, timeQuantum, weights);
    setMetrics({ averageWaitingTime: avgWaitingTime, averageTurnaroundTime: avgTurnaroundTime, bestAlgorithm: bestAlgorithm, avgResponseTime: avgResponseTime, throughput: throughput });
  };

  const handleAlgorithmChange = (newAlgorithm) => {
    setAlgorithm(newAlgorithm);
    setAlgorithmstate(newAlgorithm === 'MultilevelQueue');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden">
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-500 shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <h1 className="pb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            Intelligent CPU Scheduler Simulator
          </h1>
          <p className="text-center text-blue-100 mt-2 max-w-2xl mx-auto ">
            Visualize and analyze different CPU scheduling algorithms
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6 h-full">
              <AlgorithmSelector 
                algorithm={algorithm} 
                setAlgorithm={handleAlgorithmChange} 
                timeQuantum={timeQuantum} 
                setTimeQuantum={setTimeQuantum} 
              />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6 h-full">
              <ProcessInputForm 
                processes={processes} 
                setProcesses={setProcesses} 
                timeQuantum={timeQuantum} 
                setTimeQuantum={setTimeQuantum} 
                algorithmstate={algorithmstate} 
                setAlgorithmstate={setAlgorithmstate} 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <button 
            onClick={handleSimulate} 
            disabled={processes.length === 0}
            className={`px-8 py-3 text-lg font-bold rounded-full shadow-lg 
                      ${processes.length === 0 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 '} 
                      transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            Simulate
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6">
            <MetricsDisplay metrics={metrics} />
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6 min-h-[300px] lg:min-h-[400px]">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Process Timeline</h2>
            <GanttChart data={ganttData} />
          </div>
        </div>
      </div>
      <footer className="mt-12 py-6 bg-gray-900/80 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p></p>
        </div>
      </footer>
    </div>
  );
}

export default App;