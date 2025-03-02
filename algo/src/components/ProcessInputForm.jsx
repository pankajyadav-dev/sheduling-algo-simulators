import React, { useState } from 'react';
import { MdEdit, MdDelete, MdAdd, MdRefresh } from "react-icons/md";

function ProcessInputForm({ processes, setProcesses, timeQuantum, setTimeQuantum, algorithmstate }) {
  const [process, setProcess] = useState({ id: '', arrivalTime: 0, burstTime: 0, priority: 0, queueId: 0 });
  const [nextProcessId, setNextProcessId] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleAddProcess = () => {
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
  };

  const handleEditProcess = (proc) => {
    setProcess(proc);
    setEditMode(true);
    setEditId(proc.id);
  };

  const handleDeleteProcess = (id) => {
    setProcesses(processes.filter((proc) => proc.id !== id));
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4 p-2">
      <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg p-4">
        <h2 className="text-xl font-bold text-blue-400 mb-4">
          {editMode ? 'Edit Process' : 'Add New Process'}
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <label className="text-gray-300 font-medium w-24 text-sm">Arrival Time</label>
            <input
              type="number"
              placeholder="Enter arrival time"
              value={process.arrivalTime}
              onChange={(e) => setProcess({ ...process, arrivalTime: parseInt(e.target.value) })}
              className="bg-gray-700 text-white border border-gray-600 p-2 rounded focus:outline-none focus:border-blue-500 w-full text-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <label className="text-gray-300 font-medium w-24 text-sm">Burst Time</label>
            <input
              type="number"
              placeholder="Enter burst time"
              value={process.burstTime}
              onChange={(e) => setProcess({ ...process, burstTime: parseInt(e.target.value) })}
              className="bg-gray-700 text-white border border-gray-600 p-2 rounded focus:outline-none focus:border-blue-500 w-full text-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <label className="text-gray-300 font-medium w-24 text-sm">Priority</label>
            <input
              type="number"
              placeholder="Enter priority"
              value={process.priority}
              onChange={(e) => setProcess({ ...process, priority: parseInt(e.target.value) })}
              className="bg-gray-700 text-white border border-gray-600 p-2 rounded focus:outline-none focus:border-blue-500 w-full text-sm"
            />
          </div>
          {algorithmstate && (
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <label className="text-gray-300 font-medium w-24 text-sm">Queue ID</label>
              <input
                type="number"
                placeholder="Enter queue ID"
                value={process.queueId}
                onChange={(e) => setProcess({ ...process, queueId: parseInt(e.target.value) })}
                className="bg-gray-700 text-white border border-gray-600 p-2 rounded focus:outline-none focus:border-blue-500 w-full text-sm"
              />
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <button 
              onClick={handleAddProcess} 
              className="flex items-center justify-center gap-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded text-sm flex-1"
            >
              <MdAdd size={16} />
              {editMode ? 'Update' : 'Add'}
            </button>
            <button 
              onClick={handleResetQueue} 
              className="flex items-center justify-center gap-1 bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded text-sm flex-1"
            >
              <MdRefresh size={16} />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2">
        {processes.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-2 sm:p-4 h-full">
            <h2 className="text-xl font-bold text-blue-400 mb-4">Process Queue</h2>
            <div className="rounded border border-gray-700">
              <div className="bg-gray-700 flex gap-2 p-2 text-[10px] sm:text-sm text-gray-200">
                <div className="flex-1">Process</div>
                <div className="flex-1">Arrival</div>
                <div className="flex-1">Burst</div>
                <div className="flex-1">Priority</div>
                {algorithmstate && <div className="flex-1">Queue</div>}
                <div className="w-16">Actions</div>
              </div>
              <div className="divide-y divide-gray-700">
                {processes.map((proc) => (
                  <div className="flex items-center gap-2 p-2 hover:bg-gray-700/50 text-[10px] sm:text-sm" key={proc.id}>
                    <div className="flex-1 text-blue-400">{proc.id}</div>
                    <div className="flex-1 text-gray-300">{proc.arrivalTime}</div>
                    <div className="flex-1 text-gray-300">{proc.burstTime}</div>
                    <div className="flex-1 text-gray-300">{proc.priority}</div>
                    {algorithmstate && <div className="flex-1 text-gray-300">{proc.queueId}</div>}
                    <div className="w-16 flex gap-2">
                      <button 
                        onClick={() => handleEditProcess(proc)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <MdEdit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProcess(proc.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProcessInputForm;