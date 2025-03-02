import React, { useState } from 'react';
import ProcessInputForm from './components/ProcessInputForm';
import AlgorithmSelector from './components/AlgorithmSelector';
import GanttChart from './components/GanttChart';
import MetricsDisplay from './components/MetricsDisplay';
import { calculateScheduling } from './utils/schedulingAlgorithms';

function App() {
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [timeQuantum, setTimeQuantum] = useState(1);
  const [ganttData, setGanttData] = useState([]);
  const [metrics, setMetrics] = useState({ averageWaitingTime: 0, averageTurnaroundTime: 0 });
  const [algorithmstate, setAlgorithmstate] = useState(false);

  const handleSimulate = () => {
    const { schedule, avgWaitingTime, avgTurnaroundTime } = calculateScheduling(processes, algorithm, timeQuantum);
    setGanttData(schedule);
    setMetrics({ averageWaitingTime: avgWaitingTime, averageTurnaroundTime: avgTurnaroundTime });
  };

  const handleAlgorithmChange = (newAlgorithm) => {
    setAlgorithm(newAlgorithm);
    setAlgorithmstate(newAlgorithm === 'MultilevelQueue');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-800 to-gray-900 overflow-hidden">
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 shadow-xl">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center">
            CPU Scheduler Simulator
          </h1>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 mb-8">
          <AlgorithmSelector 
            algorithm={algorithm} 
            setAlgorithm={handleAlgorithmChange} 
            timeQuantum={timeQuantum} 
            setTimeQuantum={setTimeQuantum} 
          />
          
          <ProcessInputForm 
            processes={processes} 
            setProcesses={setProcesses} 
            timeQuantum={timeQuantum} 
            setTimeQuantum={setTimeQuantum} 
            algorithmstate={algorithmstate} 
            setAlgorithmstate={setAlgorithmstate} 
          />

          <div className="flex justify-center mt-8">
            <button 
              onClick={handleSimulate} 
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-lg 
                        transform transition-all duration-300 hover:scale-105 hover:shadow-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Simulate
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-6">
            <MetricsDisplay metrics={metrics} />
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 h-[400px]">
            <GanttChart data={ganttData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;