import React, { useState} from 'react';
import ProcessInputForm from './components/ProcessInputForm';
import AlgorithmSelector from './components/AlgorithmSelector';
import GanttChart from './components/GanttChart';
import MetricsDisplay from './components/MetricsDisplay';
import { calculateScheduling } from './utils/schedulingAlgorithms';

function App() {
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [timeQuantum, setTimeQuantum] = useState(0);
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
    <div className=" min-h-screen w-full bg-gray-500  overflow-hidden">
      <div className="text-center bg-blue-500 text-white pb-4 center flex justify-center  ">
      <div className=" text-3xl font-bold mb-4">CPU Scheduler Simulator</div>
      </div>
      <AlgorithmSelector algorithm={algorithm} setAlgorithm={handleAlgorithmChange} timeQuantum={timeQuantum} setTimeQuantum={setTimeQuantum} />
        <ProcessInputForm processes={processes} setProcesses={setProcesses} timeQuantum={timeQuantum} setTimeQuantum={setTimeQuantum} algorithmstate={algorithmstate} setAlgorithmstate={setAlgorithmstate} />
        <div className='flex flex-wrap justify-center items-center'>
      </div>
      <div className='flex justify-center items-center'>
      <button onClick={handleSimulate} className="bg-blue-500 text-white px-4 py-2 rounded  ml-8 mt-4">
        Simulate
      </button>
      </div>
      <div className='ml-8 mt-4'>
      <MetricsDisplay metrics={metrics} />
      </div>
      <div className=" m-10 flex justify-center w-fit-content bg-white rounded-lg">
      <GanttChart data={ganttData} />
      </div>
    </div>
  );
}

export default App;