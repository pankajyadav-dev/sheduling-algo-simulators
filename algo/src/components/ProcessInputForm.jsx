import React, { useState } from 'react';
import { MdEdit, MdDelete, MdAdd, MdRefresh, MdOutlineInput, MdList, MdOutlineWarning } from "react-icons/md";

function ProcessInputForm({ processes, setProcesses, timeQuantum, setTimeQuantum, algorithmstate }) {
  const [process, setProcess] = useState({ id: '', arrivalTime: 0, burstTime: 0, priority: 0, queueId: 0 });
  const [nextProcessId, setNextProcessId] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const handleAddProcess = () => {
    if (process.burstTime <= 0) {
      setError('Burst time must be greater than 0');
      return;
    }
    
    setError('');
    
    if (editMode) {
      setProcesses(
        processes.map((proc) => (proc.id === editId ? { ...process, id: editId } : proc))
      );
      setEditMode(false);
      setEditId(null);
    } else {
      setProcesses([...processes, { ...process, id: `P${nextProcessId}` }]);
      setNextProcessId(nextProcessId + 1);
    }
    setProcess({ id: '', arrivalTime: 0, burstTime: 0, priority: 0, queueId: 0 });
  };

  const handleResetQueue = () => {
    setProcesses([]);
    setNextProcessId(1);
    setProcess({ id: '', arrivalTime: 0, burstTime: 0, priority: 0, queueId: 0 });
    setEditMode(false);
    setEditId(null);
    setError('');
  };

  const handleEditProcess = (proc) => {
    setProcess(proc);
    setEditMode(true);
    setEditId(proc.id);
    setError('');
  };

  const handleDeleteProcess = (id) => {
    setProcesses(processes.filter((proc) => proc.id !== id));
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <MdOutlineInput className="text-blue-400 text-2xl mr-2" />
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          {editMode ? 'Edit Process' : 'Process Input'}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Process Input Form */}
        <div className="bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 shadow-lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1">Arrival Time</label>
                <input
                  type="number"
                  value={process.arrivalTime}
                  onChange={(e) => setProcess({ ...process, arrivalTime: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-700/70 text-white border border-gray-600 p-2.5 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            transition-colors duration-200 shadow-inner"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1">Burst Time</label>
                <input
                  type="number"
                  value={process.burstTime}
                  onChange={(e) => setProcess({ ...process, burstTime: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-700/70 text-white border border-gray-600 p-2.5 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            transition-colors duration-200 shadow-inner"
                  min="1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1">Priority</label>
                <input
                  type="number"
                  value={process.priority}
                  onChange={(e) => setProcess({ ...process, priority: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-700/70 text-white border border-gray-600 p-2.5 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            transition-colors duration-200 shadow-inner"
                  min="0"
                />
              </div>
              
              {algorithmstate && (
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1">Queue ID</label>
                  <input
                    type="number"
                    value={process.queueId}
                    onChange={(e) => setProcess({ ...process, queueId: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-700/70 text-white border border-gray-600 p-2.5 rounded-lg 
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                              transition-colors duration-200 shadow-inner"
                    min="0"
                  />
                </div>
              )}
            </div>
            
            {error && (
              <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-3 flex items-center">
                <MdOutlineWarning className="text-red-400 mr-2" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            
            <div className="flex space-x-3 mt-2">
              <button
                onClick={handleAddProcess}
                className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 
                          text-white py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <MdAdd className="text-lg" />
                <span>{editMode ? 'Update' : 'Add'} Process</span>
              </button>
              
              <button
                onClick={handleResetQueue}
                className="flex items-center justify-center gap-1 bg-gray-700 hover:bg-gray-600 
                          text-white py-2 px-4 rounded-lg transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                disabled={processes.length === 0 && !editMode}
              >
                <MdRefresh className="text-lg" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Process List */}
        <div className="bg-gray-800/70 rounded-xl p-5 border border-gray-700/50 shadow-lg">
          <div className="flex items-center mb-3">
            <MdList className="text-blue-400 text-xl mr-2" />
            <h3 className="text-lg font-semibold text-blue-300">Process Queue</h3>
          </div>
          
          {processes.length === 0 ? (
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-gray-400">No processes added yet</p>
              <p className="text-xs text-gray-500 mt-1">Add processes using the form</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[300px] pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <table className="w-full">
                <thead className="bg-gray-700/50 text-gray-300 text-xs uppercase">
                  <tr>
                    <th className="px-3 py-2 text-left rounded-tl-lg">ID</th>
                    <th className="px-3 py-2 text-left">Arrival</th>
                    <th className="px-3 py-2 text-left">Burst</th>
                    <th className="px-3 py-2 text-left">Priority</th>
                    {algorithmstate && <th className="px-3 py-2 text-left">Queue</th>}
                    <th className="px-3 py-2 text-right rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {processes.map((proc) => (
                    <tr key={proc.id} className="text-gray-300 hover:bg-gray-700/30 transition-colors duration-150">
                      <td className="px-3 py-2.5 font-medium text-blue-400">{proc.id}</td>
                      <td className="px-3 py-2.5">{proc.arrivalTime}</td>
                      <td className="px-3 py-2.5">{proc.burstTime}</td>
                      <td className="px-3 py-2.5">{proc.priority}</td>
                      {algorithmstate && <td className="px-3 py-2.5">{proc.queueId}</td>}
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex justify-end space-x-1">
                          <button
                            onClick={() => handleEditProcess(proc)}
                            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-md transition-colors duration-150"
                            title="Edit process"
                          >
                            <MdEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteProcess(proc.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-md transition-colors duration-150"
                            title="Delete process"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {processes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700/30 flex justify-between items-center">
              <span className="text-sm text-gray-400">Total: {processes.length} processes</span>
              <button
                onClick={handleResetQueue}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 py-1 px-2 hover:bg-red-900/20 rounded transition-colors duration-150"
              >
                <MdDelete className="text-sm" />
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProcessInputForm;