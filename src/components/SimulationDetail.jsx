import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdDownload, MdOutlineWarning, MdInfo, MdSchedule, MdTimeline, MdQueryStats, MdGrid4X4 } from 'react-icons/md';
import { getSimulationById } from '../utils/api';
import GanttChart from './GanttChart';
import MetricsDisplay from './MetricsDisplay';
import { toPng } from 'html-to-image';

function SimulationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState('');
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchSimulation = async () => {
      try {
        setLoading(true);
        const data = await getSimulationById(id);
        setSimulation(data);
        setError(null);
      } catch (err) {
        setError('Failed to load simulation. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimulation();
  }, [id]);

  const downloadAsImage = async () => {
    if (reportRef.current === null) {
      return;
    }

    try {
      setDownloadStatus('downloading');
      const dataUrl = await toPng(reportRef.current, { quality: 0.95 });

      const link = document.createElement('a');
      link.download = `${simulation.name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus(''), 3000);
    } catch (err) {
      console.error('Error generating image:', err);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-blue-400 text-lg">Loading simulation data...</p>
        </div>
      </div>
    );
  }

  if (error || !simulation) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex justify-center items-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-8 max-w-lg w-full">
          <div className="flex items-center mb-6">
            <MdOutlineWarning className="text-red-400 text-3xl mr-3" />
            <h2 className="text-2xl font-bold text-red-400">Error</h2>
          </div>
          <p className="text-gray-300 mb-6 text-lg">{error || 'Simulation not found'}</p>
          <button
            onClick={() => navigate('/simulations')}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-lg transition-all duration-200 text-lg font-medium"
          >
            <MdArrowBack size={20} />
            <span>Back to Simulations</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden">
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-500 shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <h1 className="pb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            Simulation Details
          </h1>
          <p className="text-center text-blue-100 mt-2 max-w-2xl mx-auto">
            {simulation.name}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between mb-6">
          <button
            onClick={() => navigate('/simulations')}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-all duration-200"
          >
            <MdArrowBack className="text-lg" />
            <span>Back to Simulations</span>
          </button>
          <button
            onClick={downloadAsImage}
            disabled={downloadStatus === 'downloading'}
            className="relative flex items-center gap-1 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg transition-all duration-200"
          >
            {downloadStatus === 'downloading' ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <MdDownload />
                <span>Export as Image</span>
              </>
            )}
            {downloadStatus === 'success' && (
              <div className="absolute -top-10 right-0 bg-green-900/80 text-white text-center py-1.5 px-3 rounded-lg text-sm whitespace-nowrap">
                Downloaded successfully!
              </div>
            )}
            {downloadStatus === 'error' && (
              <div className="absolute -top-10 right-0 bg-red-900/80 text-white text-center py-1.5 px-3 rounded-lg text-sm whitespace-nowrap">
                Error downloading image
              </div>
            )}
          </button>
        </div>

        <div ref={reportRef} className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6">
            <div className="flex items-center mb-4">
              <MdInfo className="text-blue-400 text-2xl mr-2" />
              <h2 className="text-xl font-bold text-blue-400">
                Simulation Information
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/30">
                <div className="flex items-center mb-2">
                  <MdSchedule className="text-blue-400 mr-2" />
                  <span className="text-gray-300 font-medium">Algorithm</span>
                </div>
                <p className="text-xl font-semibold text-white">{simulation.algorithm}</p>
              </div>
              
              {simulation.timeQuantum > 0 && (
                <div className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/30">
                  <div className="flex items-center mb-2">
                    <MdTimeline className="text-blue-400 mr-2" />
                    <span className="text-gray-300 font-medium">Time Quantum</span>
                  </div>
                  <p className="text-xl font-semibold text-white">{simulation.timeQuantum}</p>
                </div>
              )}
              
              <div className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/30">
                <div className="flex items-center mb-2">
                  <MdGrid4X4 className="text-blue-400 mr-2" />
                  <span className="text-gray-300 font-medium">Processes</span>
                </div>
                <p className="text-xl font-semibold text-white">{simulation.processes.length}</p>
              </div>
              
              <div className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/30">
                <div className="flex items-center mb-2">
                  <MdQueryStats className="text-blue-400 mr-2" />
                  <span className="text-gray-300 font-medium">Created</span>
                </div>
                <p className="text-lg font-semibold text-white">{new Date(simulation.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6">
              <MetricsDisplay metrics={simulation.metrics} />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
              <MdGrid4X4 className="mr-2" />
              Process Details
            </h3>
            
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
              <table className="w-full">
                <thead className="bg-gray-700/50 text-gray-300 text-xs uppercase">
                  <tr>
                    <th className="px-3 py-3 text-left rounded-tl-lg">ID</th>
                    <th className="px-3 py-3 text-left">Arrival Time</th>
                    <th className="px-3 py-3 text-left">Burst Time</th>
                    <th className="px-3 py-3 text-left">Priority</th>
                    {simulation.algorithm === 'MultilevelQueue' && <th className="px-3 py-3 text-left">Queue ID</th>}
                    <th className="px-3 py-3 text-right rounded-tr-lg">Wait Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {simulation.processes.map((process) => {
                    const processGanttEntries = simulation.ganttData.filter(item => item.process === process.id);
                    const firstExecution = processGanttEntries.length > 0 ? processGanttEntries[0].start : 0;
                    const waitTime = Math.max(0, firstExecution - process.arrivalTime);
                    
                    return (
                      <tr key={process.id} className="text-gray-300 hover:bg-gray-700/30 transition-colors duration-150">
                        <td className="px-3 py-3 font-medium text-blue-400">{process.id}</td>
                        <td className="px-3 py-3">{process.arrivalTime}</td>
                        <td className="px-3 py-3">{process.burstTime}</td>
                        <td className="px-3 py-3">{process.priority}</td>
                        {simulation.algorithm === 'MultilevelQueue' && <td className="px-3 py-3">{process.queueId}</td>}
                        <td className="px-3 py-3 text-right">
                          <span className={`px-2 py-1 rounded-full text-xs ${waitTime > 5 ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}`}>
                            {waitTime}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6 min-h-[400px]">
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
              <MdTimeline className="mr-2" />
              Process Timeline
            </h3>
            
            <div className="p-2 bg-gray-700/20 rounded-lg border border-gray-700/40">
              <GanttChart data={simulation.ganttData} />
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(new Set(simulation.ganttData.map(d => d.process))).map(processId => {
                const processGanttEntries = simulation.ganttData.filter(item => item.process === processId);
                const totalExecutionTime = processGanttEntries.reduce((sum, entry) => sum + (entry.end - entry.start), 0);
                const firstExecution = processGanttEntries.length > 0 ? processGanttEntries[0].start : 0;
                const lastExecution = processGanttEntries.length > 0 ? processGanttEntries[processGanttEntries.length - 1].end : 0;
                
                return (
                  <div key={processId} className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-blue-400">{processId}</span>
                      <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded-full">
                        {totalExecutionTime} time units
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span>First Execution:</span>
                        <span className="text-gray-300">t = {firstExecution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completion:</span>
                        <span className="text-gray-300">t = {lastExecution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Execution Count:</span>
                        <span className="text-gray-300">{processGanttEntries.length}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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

export default SimulationDetail; 