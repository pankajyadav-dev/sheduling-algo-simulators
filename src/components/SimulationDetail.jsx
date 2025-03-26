import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdDownload, MdOutlineWarning } from 'react-icons/md';
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
      const dataUrl = await toPng(reportRef.current, { quality: 0.95 });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${simulation.name.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !simulation) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6">
        <div className="flex items-center mb-4">
          <MdOutlineWarning className="text-red-400 text-2xl mr-2" />
          <h2 className="text-2xl font-bold text-red-400">Error</h2>
        </div>
        <p className="text-gray-300 mb-4">{error || 'Simulation not found'}</p>
        <button
          onClick={() => navigate('/simulations')}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-all duration-200"
        >
          <MdArrowBack />
          <span>Back to Simulations</span>
        </button>
      </div>
    );
  }

  return (
    <div ref={reportRef} className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          {simulation.name}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/simulations')}
            className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <MdArrowBack />
            <span>Back</span>
          </button>
          <button
            onClick={downloadAsImage}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-500 px-3 py-2 rounded-lg transition-all duration-200"
          >
            <MdDownload />
            <span>Download as Image</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 shadow-lg">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Simulation Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Algorithm:</span>
              <span className="text-white font-medium">{simulation.algorithm}</span>
            </div>
            {simulation.timeQuantum > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Time Quantum:</span>
                <span className="text-white font-medium">{simulation.timeQuantum}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Process Count:</span>
              <span className="text-white font-medium">{simulation.processes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Created:</span>
              <span className="text-white font-medium">{new Date(simulation.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 shadow-lg">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Process Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50 text-gray-300 text-xs uppercase">
                <tr>
                  <th className="px-3 py-2 text-left rounded-tl-lg">ID</th>
                  <th className="px-3 py-2 text-left">Arrival</th>
                  <th className="px-3 py-2 text-left">Burst</th>
                  <th className="px-3 py-2 text-left">Priority</th>
                  {simulation.algorithm === 'MultilevelQueue' && <th className="px-3 py-2 text-left">Queue</th>}
                  <th className="px-3 py-2 text-left rounded-tr-lg"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {simulation.processes.map((process) => (
                  <tr key={process.id} className="text-gray-300 hover:bg-gray-700/30 transition-colors duration-150">
                    <td className="px-3 py-2.5 font-medium text-blue-400">{process.id}</td>
                    <td className="px-3 py-2.5">{process.arrivalTime}</td>
                    <td className="px-3 py-2.5">{process.burstTime}</td>
                    <td className="px-3 py-2.5">{process.priority}</td>
                    {simulation.algorithm === 'MultilevelQueue' && <td className="px-3 py-2.5">{process.queueId}</td>}
                    <td className="px-3 py-2.5"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 shadow-lg">
          <MetricsDisplay metrics={simulation.metrics} />
        </div>
        <div className="bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 shadow-lg min-h-[300px]">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Process Timeline</h3>
          <GanttChart data={simulation.ganttData} />
        </div>
      </div>
    </div>
  );
}

export default SimulationDetail; 