import React, { useState, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ProcessInputForm from './components/ProcessInputForm';
import AlgorithmSelector from './components/AlgorithmSelector';
import GanttChart from './components/GanttChart';
import MetricsDisplay from './components/MetricsDisplay';
import SavedSimulations from './components/SavedSimulations';
import SimulationDetail from './components/SimulationDetail';
import { calculateScheduling, calculateBestAlgorithm, saveSimulation } from './utils/api';
import { MdSave, MdHistory, MdDownload } from 'react-icons/md';
import { toPng } from 'html-to-image';

function Simulator() {
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [timeQuantum, setTimeQuantum] = useState(1);
  const [ganttData, setGanttData] = useState([]);
  const [metrics, setMetrics] = useState({ 
    averageWaitingTime: 0, 
    averageTurnaroundTime: 0, 
    bestAlgorithm: null, 
    avgResponseTime: 0, 
    throughput: 0 
  });
  const [weights, setWeights] = useState({ tat: 0.3, wt: 0.3, rt: 0.2, tp: 0.2 });
  const [algorithmstate, setAlgorithmstate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const resultRef = useRef(null);
  const navigate = useNavigate();

  const handleSimulate = async () => {
    if (processes.length === 0) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Make API call to calculate scheduling
      const result = await calculateScheduling(processes, algorithm, timeQuantum);
      setGanttData(result.schedule);
      
      // Make API call to calculate best algorithm
      const bestAlgorithm = await calculateBestAlgorithm(processes, timeQuantum, weights);
      
      setMetrics({
        averageWaitingTime: result.avgWaitingTime,
        averageTurnaroundTime: result.avgTurnaroundTime,
        avgResponseTime: result.avgResponseTime,
        throughput: result.throughput,
        bestAlgorithm: bestAlgorithm
      });
      
      // Set default save name
      setSaveName(`${algorithm} Simulation ${new Date().toLocaleString()}`);
      setSaveSuccess(false);
    } catch (error) {
      setError('Error simulating algorithm: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAlgorithmChange = (newAlgorithm) => {
    setAlgorithm(newAlgorithm);
    setAlgorithmstate(newAlgorithm === 'MultilevelQueue');
  };

  const handleSaveSimulation = async () => {
    if (ganttData.length === 0) return;
    
    try {
      setSaveLoading(true);
      
      const simulationData = {
        name: saveName || `${algorithm} Simulation ${new Date().toLocaleString()}`,
        algorithm,
        timeQuantum,
        processes,
        ganttData,
        metrics
      };
      
      await saveSimulation(simulationData);
      setSaveSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      setError('Error saving simulation: ' + error.message);
      console.error(error);
    } finally {
      setSaveLoading(false);
    }
  };

  const downloadAsImage = async () => {
    if (resultRef.current === null || ganttData.length === 0) {
      return;
    }

    try {
      const dataUrl = await toPng(resultRef.current, { quality: 0.95 });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${algorithm}_simulation.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to download image');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden">
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-500 shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <h1 className="pb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            Intelligent CPU Scheduler Simulator
          </h1>
          <p className="text-center text-blue-100 mt-2 max-w-2xl mx-auto">
            Visualize and analyze different CPU scheduling algorithms
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <Link 
            to="/simulations" 
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-all duration-200"
          >
            <MdHistory className="text-lg" />
            <span>Saved Simulations</span>
          </Link>
        </div>
        
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
            disabled={processes.length === 0 || loading}
            className={`px-8 py-3 text-lg font-bold rounded-full shadow-lg 
                      ${processes.length === 0 || loading
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 '} 
                      transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Simulate'
            )}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-4 mb-6 text-center">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {ganttData.length > 0 && (
          <div ref={resultRef} className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6">
              <div className="flex justify-between items-center mb-4">
                <MetricsDisplay metrics={metrics} />
                <div className="flex space-x-2">
                  <button
                    onClick={downloadAsImage}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-500 px-3 py-2 rounded-lg transition-all duration-200"
                    title="Download as image"
                  >
                    <MdDownload className="text-lg" />
                    <span>Download</span>
                  </button>
                  <div className="relative">
                    {saveSuccess && (
                      <div className="absolute -top-10 left-0 right-0 bg-green-900/70 text-white text-center py-1 px-2 rounded-md text-sm">
                        Saved successfully!
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={saveName}
                        onChange={(e) => setSaveName(e.target.value)}
                        placeholder="Simulation name"
                        className="bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSaveSimulation}
                        disabled={saveLoading}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg transition-all duration-200"
                      >
                        {saveLoading ? (
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <MdSave className="text-lg" />
                        )}
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6 min-h-[300px] lg:min-h-[400px]">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">Process Timeline</h2>
              <GanttChart data={ganttData} />
            </div>
          </div>
        )}
      </div>
      <footer className="mt-12 py-6 bg-gray-900/80 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p></p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Simulator />} />
      <Route path="/simulations" element={<SavedSimulations />} />
      <Route path="/simulation/:id" element={<SimulationDetail />} />
    </Routes>
  );
}

export default App;