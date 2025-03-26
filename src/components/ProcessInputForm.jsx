import React, { useState } from 'react';
import { MdEdit, MdDelete, MdAdd, MdRefresh, MdOutlineInput, MdList, MdOutlineWarning, MdInfoOutline, MdQueue } from "react-icons/md";

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
      <div className="flex items-center mb-6">
        <MdOutlineInput className="text-blue-400 text-2xl md:text-3xl mr-2" />
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
          {editMode ? 'Edit Process' : 'Process Input'}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 rounded-xl p-5 border border-gray-700/30 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
              <MdInfoOutline className="text-blue-400 text-xl" />
            </div>
            <h3 className="text-blue-300 font-medium">{editMode ? 'Update Process Details' : 'New Process Details'}</h3>
          </div>
          
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1.5">Arrival Time</label>
                <input
                  type="number"
                  value={process.arrivalTime}
                  onChange={(e) => setProcess({ ...process, arrivalTime: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-800/90 text-white border border-gray-600/80 p-3 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            transition-all duration-200 shadow-inner hover:border-blue-500/50"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1.5">Burst Time</label>
                <input
                  type="number"
                  value={process.burstTime}
                  onChange={(e) => setProcess({ ...process, burstTime: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-800/90 text-white border border-gray-600/80 p-3 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            transition-all duration-200 shadow-inner hover:border-blue-500/50"
                  min="1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-1.5">Priority</label>
                <input
                  type="number"
                  value={process.priority}
                  onChange={(e) => setProcess({ ...process, priority: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-800/90 text-white border border-gray-600/80 p-3 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                            transition-all duration-200 shadow-inner hover:border-blue-500/50"
                  min="0"
                />
              </div>
              
              {algorithmstate && (
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-1.5">Queue ID</label>
                  <input
                    type="number"
                    value={process.queueId}
                    onChange={(e) => setProcess({ ...process, queueId: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-800/90 text-white border border-gray-600/80 p-3 rounded-lg 
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                              transition-all duration-200 shadow-inner hover:border-blue-500/50"
                    min="0"
                  />
                </div>
              )}
            </div>
            
            {error && (
              <div className="bg-red-900/30 border border-red-800/50 rounded-lg p-3.5 flex items-center">
                <MdOutlineWarning className="text-red-400 text-lg mr-2.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            
            <div className="flex space-x-3 mt-3">
              <button
                onClick={handleAddProcess}
                className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 
                          text-white py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md"
              >
                <MdAdd className="text-xl" />
                <span className="font-medium">{editMode ? 'Update' : 'Add'} Process</span>
              </button>
              
              <button
                onClick={handleResetQueue}
                className="flex items-center justify-center gap-1.5 bg-gray-700 hover:bg-gray-600 
                          text-white py-2.5 px-4 rounded-lg transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-md"
                disabled={processes.length === 0 && !editMode}
              >
                <MdRefresh className="text-xl" />
                <span className="font-medium">Reset</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 rounded-xl p-5 border border-gray-700/30 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
              <MdQueue className="text-blue-400 text-xl" />
            </div>
            <h3 className="text-blue-300 font-medium">Process Queue</h3>
          </div>
          
          {processes.length === 0 ? (
            <div className="bg-gray-800/70 rounded-lg p-6 text-center shadow-inner">
              <MdList className="text-gray-400 text-3xl mx-auto mb-2" />
              <p className="text-gray-300 font-medium">No processes added yet</p>
              <p className="text-sm text-gray-400 mt-1">Use the form to add processes to the queue</p>
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-lg shadow-inner overflow-hidden">
              <div className="overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <table className="w-full">
                  <thead className="bg-gray-700/50 text-gray-300 text-xs uppercase">
                    <tr>
                      <th className="px-3 py-2.5 text-left rounded-tl-lg">ID</th>
                      <th className="px-3 py-2.5 text-left">Arrival</th>
                      <th className="px-3 py-2.5 text-left">Burst</th>
                      <th className="px-3 py-2.5 text-left">Priority</th>
                      {algorithmstate && <th className="px-3 py-2.5 text-left">Queue</th>}
                      <th className="px-3 py-2.5 text-right rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/30">
                    {processes.map((proc) => (
                      <tr key={proc.id} className="text-gray-300 hover:bg-gray-700/30 transition-colors duration-150">
                        <td className="px-3 py-3 font-medium text-blue-400">{proc.id}</td>
                        <td className="px-3 py-3">{proc.arrivalTime}</td>
                        <td className="px-3 py-3">{proc.burstTime}</td>
                        <td className="px-3 py-3">{proc.priority}</td>
                        {algorithmstate && <td className="px-3 py-3">{proc.queueId}</td>}
                        <td className="px-3 py-3 text-right">
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
              
              <div className="bg-gray-700/20 px-4 py-3 border-t border-gray-700/30 flex justify-between items-center">
                <span className="text-sm text-gray-300 font-medium">Total: <span className="text-blue-400">{processes.length}</span> processes</span>
                <button
                  onClick={handleResetQueue}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 py-1.5 px-3 hover:bg-red-900/20 rounded-lg transition-colors duration-150 border border-red-900/30"
                >
                  <MdDelete className="text-sm" />
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProcessInputForm;